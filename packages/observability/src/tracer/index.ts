import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { ConsoleSpanExporter, SimpleSpanProcessor, BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { KoaInstrumentation } from '@opentelemetry/instrumentation-koa';
import { 
  trace, 
  context, 
  SpanStatusCode, 
  SpanKind,
  Tracer,
  Span,
  SpanOptions,
  Context,
  propagation,
  TextMapGetter,
  TextMapSetter
} from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { CompositePropagator, W3CBaggagePropagator } from '@opentelemetry/core';
import { TracingConfig, ObservabilityContext, DDDMetadata, ObservabilityTracer } from '../types';
import { getLogger } from '../logger';

// Global tracer provider
let globalTracerProvider: NodeTracerProvider | null = null;
let globalSDK: NodeSDK | null = null;

// Custom propagator for NATS and other messaging systems
class CustomMessagePropagator {
  private propagator = new W3CTraceContextPropagator();

  inject(context: Context, carrier: any): void {
    const setter: TextMapSetter = {
      set(carrier: any, key: string, value: string) {
        if (!carrier.headers) carrier.headers = {};
        carrier.headers[key] = value;
      }
    };
    this.propagator.inject(context, carrier, setter);
  }

  extract(context: Context, carrier: any): Context {
    const getter: TextMapGetter = {
      keys(carrier: any): string[] {
        return carrier.headers ? Object.keys(carrier.headers) : [];
      },
      get(carrier: any, key: string): string | string[] | undefined {
        return carrier.headers?.[key];
      }
    };
    return this.propagator.extract(context, carrier, getter);
  }
}

const messagePropagator = new CustomMessagePropagator();

// Enhanced tracer with context support
function createEnhancedTracer(baseTracer: Tracer, defaultContext?: ObservabilityContext): ObservabilityTracer {
  const enhancedTracer = Object.create(baseTracer) as ObservabilityTracer;

  enhancedTracer.withContext = function(ctx: ObservabilityContext): ObservabilityTracer {
    return createEnhancedTracer(baseTracer, { ...defaultContext, ...ctx });
  };

  enhancedTracer.withDDD = function(metadata: DDDMetadata): ObservabilityTracer {
    const dddContext: ObservabilityContext = {
      ...defaultContext,
      metadata: {
        ...defaultContext?.metadata,
        ...metadata,
      },
    };
    return createEnhancedTracer(baseTracer, dddContext);
  };

  // Override startSpan to include default context
  const originalStartSpan = baseTracer.startSpan.bind(baseTracer);
  enhancedTracer.startSpan = function(name: string, options?: SpanOptions, context?: Context): Span {
    const attributes = {
      ...options?.attributes,
      ...defaultContext?.metadata,
    };

    if (defaultContext?.correlationId) {
      attributes['correlation.id'] = defaultContext.correlationId;
    }
    if (defaultContext?.causationId) {
      attributes['causation.id'] = defaultContext.causationId;
    }
    if (defaultContext?.userId) {
      attributes['user.id'] = defaultContext.userId;
    }
    if (defaultContext?.tenantId) {
      attributes['tenant.id'] = defaultContext.tenantId;
    }

    return originalStartSpan(name, { ...options, attributes }, context);
  };

  // Ensure all original methods are available
  Object.setPrototypeOf(enhancedTracer, baseTracer);

  return enhancedTracer;
}

// Initialize tracing
export function initializeTracing(config: TracingConfig & { serviceName: string; serviceVersion?: string; environment?: string }): NodeSDK {
  const logger = getLogger();
  
  // Create resource
  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion || '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment || 'development',
    })
  );

  // Create tracer provider
  const provider = new NodeTracerProvider({
    resource,
  });

  // Add exporters
  const exporters = [];

  // Jaeger exporter
  if (config.jaegerEndpoint) {
    const jaegerExporter = new JaegerExporter({
      endpoint: config.jaegerEndpoint,
      // Additional Jaeger configuration can be added here
    });
    provider.addSpanProcessor(new BatchSpanProcessor(jaegerExporter));
    exporters.push('jaeger');
  }

  // Console exporter for development
  if (config.enableConsoleExporter) {
    provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    exporters.push('console');
  }

  // Register the provider
  provider.register({
    propagator: new CompositePropagator({
      propagators: [
        new W3CTraceContextPropagator(),
        new W3CBaggagePropagator(),
      ],
    }),
  });

  globalTracerProvider = provider;

  // Register instrumentations
  if (config.enableAutoInstrumentation) {
    registerInstrumentations({
      instrumentations: [
        new HttpInstrumentation({
          requestHook: (span, request) => {
            span.setAttributes({
              'http.request.body.size': request.headers?.['content-length'],
              'http.user_agent': request.headers?.['user-agent'],
            });
          },
          responseHook: (span, response) => {
            span.setAttributes({
              'http.response.body.size': response.headers?.['content-length'],
            });
          },
        }),
        new ExpressInstrumentation({
          requestHook: (span, info) => {
            span.setAttributes({
              'express.route': info.route,
              'express.layer_type': info.layerType,
            });
          },
        }),
        new KoaInstrumentation(),
        // Add more instrumentations as needed
      ],
    });
  }

  // Create SDK
  const sdk = new NodeSDK({
    resource,
    traceExporter: config.jaegerEndpoint ? new JaegerExporter({
      endpoint: config.jaegerEndpoint,
    }) : undefined,
    instrumentations: config.enableAutoInstrumentation ? [getNodeAutoInstrumentations()] : [],
  });

  // Initialize SDK
  sdk.start()
    .then(() => logger.info({ exporters }, 'Tracing initialized'))
    .catch((error) => logger.error({ error }, 'Error initializing tracing'));

  globalSDK = sdk;

  return sdk;
}

// Get tracer instance
export function getTracer(name?: string, version?: string): ObservabilityTracer {
  const tracerName = name || '@a4co/observability';
  const baseTracer = trace.getTracer(tracerName, version);
  return createEnhancedTracer(baseTracer);
}

// Shutdown tracing
export async function shutdownTracing(): Promise<void> {
  if (globalSDK) {
    await globalSDK.shutdown();
  }
  if (globalTracerProvider) {
    await globalTracerProvider.shutdown();
  }
}

// Span utilities
export function startActiveSpan<T>(
  name: string,
  fn: (span: Span) => T,
  options?: SpanOptions
): T {
  const tracer = getTracer();
  return tracer.startActiveSpan(name, options || {}, fn);
}

export function withSpan<T>(
  name: string,
  fn: () => T | Promise<T>,
  options?: SpanOptions
): Promise<T> {
  return startActiveSpan(name, async (span) => {
    try {
      const result = await fn();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    } finally {
      span.end();
    }
  }, options);
}

// Context propagation utilities
export function injectContext(carrier: any): void {
  const activeContext = context.active();
  messagePropagator.inject(activeContext, carrier);
}

export function extractContext(carrier: any): Context {
  return messagePropagator.extract(context.active(), carrier);
}

// DDD span helpers
export function createDDDSpan(
  name: string,
  metadata: DDDMetadata,
  options?: SpanOptions
): Span {
  const attributes: Record<string, any> = {
    ...options?.attributes,
  };

  if (metadata.aggregateId) attributes['ddd.aggregate.id'] = metadata.aggregateId;
  if (metadata.aggregateName) attributes['ddd.aggregate.name'] = metadata.aggregateName;
  if (metadata.commandName) attributes['ddd.command.name'] = metadata.commandName;
  if (metadata.eventName) attributes['ddd.event.name'] = metadata.eventName;
  if (metadata.eventVersion) attributes['ddd.event.version'] = metadata.eventVersion;
  if (metadata.correlationId) attributes['correlation.id'] = metadata.correlationId;
  if (metadata.causationId) attributes['causation.id'] = metadata.causationId;
  if (metadata.userId) attributes['user.id'] = metadata.userId;
  if (metadata.tenantId) attributes['tenant.id'] = metadata.tenantId;

  const tracer = getTracer();
  return tracer.startSpan(name, { ...options, attributes });
}

// Export OpenTelemetry APIs
export {
  trace,
  context,
  propagation,
  SpanStatusCode,
  SpanKind,
  type Span,
  type SpanOptions,
  type Context,
};