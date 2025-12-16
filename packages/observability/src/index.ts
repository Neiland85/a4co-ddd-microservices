import type {
  Attributes,
  Context,
  Span,
  SpanOptions,
  TextMapGetter,
  TextMapSetter,
  Tracer,
} from '@opentelemetry/api';
import { context, SpanStatusCode, trace } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  W3CTraceContextPropagator
} from '@opentelemetry/core';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { getLogger } from './logger';
import type {
  DDDMetadata,
  ObservabilityContext,
  ObservabilityTracer,
  TracingConfig,
} from './types';

// Global tracer provider
const globalTracerProvider: NodeTracerProvider | null = null;
let globalSDK: NodeSDK | null = null;

// Custom propagator for NATS and other messaging systems
class CustomMessagePropagator {
  private propagator = new W3CTraceContextPropagator();

  inject(context: Context, carrier: any): void {
    const setter: TextMapSetter = {
      set(carrier: any, key: string, value: string) {
        if (!carrier.headers) carrier.headers = {};
        carrier.headers[key] = value;
      },
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
      },
    };
    return this.propagator.extract(context, carrier, getter);
  }
}

const messagePropagator = new CustomMessagePropagator();

// Enhanced tracer with context support
function createEnhancedTracer(
  baseTracer: Tracer,
  defaultContext?: ObservabilityContext,
): ObservabilityTracer {
  const enhancedTracer = Object.create(baseTracer) as ObservabilityTracer;

  enhancedTracer.withContext = function (ctx: ObservabilityContext): ObservabilityTracer {
    return createEnhancedTracer(baseTracer, { ...defaultContext, ...ctx });
  };

  enhancedTracer.withDDD = function (metadata: DDDMetadata): ObservabilityTracer {
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
  enhancedTracer.startSpan = function (
    name: string,
    options?: SpanOptions,
    context?: Context,
  ): Span {
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

    return originalStartSpan(name, { ...options, attributes: attributes as Attributes }, context);
  };

  // Override startActiveSpan to include default context
  const originalStartActiveSpan = (baseTracer as any).startActiveSpan?.bind(baseTracer);
  if (originalStartActiveSpan) {
    enhancedTracer.startActiveSpan = function (
      name: string,
      options?: SpanOptions,
      fn?: (span: Span) => any,
    ): any {
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

      return originalStartActiveSpan(name, { ...options, attributes }, fn);
    };
  }

  // Ensure all original methods are available
  Object.setPrototypeOf(enhancedTracer, baseTracer);

  return enhancedTracer;
}

// Initialize tracing
export function initializeTracing(
  config: TracingConfig & { serviceName: string; serviceVersion?: string; environment?: string },
): NodeSDK {
  const logger = getLogger();

  // Determine OTLP endpoint (prefer config, fallback to env var)
  const otlpEndpoint =
    config.otlpEndpoint ||
    process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] ||
    'http://localhost:4318';

  // Create exporter based on configuration
  let traceExporter;
  const exporters: string[] = [];

  if (otlpEndpoint) {
    try {
      // Use OTLP HTTP exporter as primary
      const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
      traceExporter = new OTLPTraceExporter({
        url: `${otlpEndpoint}/v1/traces`,
        headers: {},
        compression: 'gzip',
      });
      exporters.push('otlp-http');
    } catch (error) {
      logger.warn('OTLP exporter not available, falling back to Jaeger');
    }
  }

  // Fallback to Jaeger if OTLP not configured
  if (!traceExporter && config.jaegerEndpoint) {
    traceExporter = new JaegerExporter({
      endpoint: config.jaegerEndpoint,
    });
    exporters.push('jaeger');
  }

  // Console exporter for development
  if (config.enableConsoleExporter) {
    exporters.push('console');
  }

  // Create SDK with auto-instrumentation
  const sdk = new NodeSDK({
    serviceName: config.serviceName,
    traceExporter,
    instrumentations: config.enableAutoInstrumentation !== false ? [getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        requestHook: (span: Span, request: any) => {
          span.setAttributes({
            'http.request.body.size': request.headers?.['content-length'],
            'http.user_agent': request.headers?.['user-agent'],
          });
        },
        responseHook: (span: Span, response: any) => {
          span.setAttributes({
            'http.response.body.size': response.headers?.['content-length'],
          });
        },
      },
      '@opentelemetry/instrumentation-express': {
        requestHook: (span: Span, info: any) => {
          span.setAttributes({
            'express.route': info.route,
            'express.layer_type': info.layerType,
          });
        },
      },
    })] : [],
  });

  // Initialize SDK
  try {
    sdk.start();
    logger.info(`OpenTelemetry tracing initialized`, {
      serviceName: config.serviceName,
      serviceVersion: config.serviceVersion || '1.0.0',
      environment: config.environment || 'development',
      exporters: exporters.join(', '),
      otlpEndpoint,
    });
  } catch (error: unknown) {
    logger.error(
      `Error initializing tracing: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

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
export function startActiveSpan<T>(name: string, fn: (span: Span) => T, options?: SpanOptions): T {
  const tracer = getTracer();
  return tracer.startActiveSpan(name, options as SpanOptions & Record<string, unknown>, fn);
}

export function withSpan<T>(
  name: string,
  fn: () => T | Promise<T>,
  options?: SpanOptions,
): Promise<T> {
  return startActiveSpan(
    name,
    async (span) => {
      try {
        const result = await fn();
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
      } finally {
        span.end();
      }
    },
    options,
  );
}

// Context propagation utilities
export function injectContext(carrier: Record<string, unknown>): void {
  const activeContext = context.active();
  messagePropagator.inject(activeContext, carrier);
}

export function extractContext(carrier: Record<string, unknown>): Context {
  return messagePropagator.extract(context.active(), carrier);
}

// DDD span helpers
export function createDDDSpan(name: string, metadata: DDDMetadata, options?: SpanOptions): Span {
  const attributes: Attributes = {
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

// Export logger utilities
export { createHttpLogger, createLogger, getLogger, initializeLogger } from './logger';
export type { ObservabilityLogger } from './ObservabilityLogger';

// Export new trace context utilities and types
export * from './utils/async-context';
export * from './utils/trace-id.generator';
// Re-export specific items from trace-context.types to avoid conflicts
export * from './types/log-payload.types';
export { TRACE_CONTEXT_HEADERS, TracedRequest, type TraceContextOptions } from './types/trace-context.types';

// Export NestJS middleware
export { createTraceContextMiddleware, TraceContextMiddleware } from './middleware/trace-context.middleware';

// Export simple logger
export { createSimpleLogger, SimpleLogger } from './logger/simple-logger';

// Export decorators
export { Log, LogDDD, TraceDDD, Tracing } from './decorators';
export type { LogOptions, TracingOptions } from './decorators';

