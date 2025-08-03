/**
 * OpenTelemetry tracer initialization and configuration
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { trace, context, SpanKind, SpanStatusCode, Span } from '@opentelemetry/api';
import { Logger } from '../logging/types';

export interface TracerConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  jaegerEndpoint?: string;
  prometheusPort?: number;
  logger?: Logger;
}

export interface TracingContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
}

/**
 * Initialize OpenTelemetry SDK for Node.js services
 */
export function initializeTracer(config: TracerConfig): NodeSDK {
  const {
    serviceName,
    serviceVersion,
    environment,
    jaegerEndpoint = 'http://localhost:14268/api/traces',
    prometheusPort = 9090,
    logger,
  } = config;

  // Create resource
  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
  });

  // Create Jaeger exporter
  const jaegerExporter = new JaegerExporter({
    endpoint: jaegerEndpoint,
  });

  // Create Prometheus exporter
  const prometheusExporter = new PrometheusExporter({
    port: prometheusPort,
  }, () => {
    logger?.info(`Prometheus metrics server started on port ${prometheusPort}`);
  });

  // Register instrumentations
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation({
        requestHook: (span, request) => {
          span.setAttribute('http.request.body.size', request.headers['content-length'] || 0);
        },
        responseHook: (span, response) => {
          span.setAttribute('http.response.body.size', response.headers['content-length'] || 0);
        },
      }),
      new ExpressInstrumentation(),
      new GrpcInstrumentation(),
    ],
  });

  // Create SDK
  const sdk = new NodeSDK({
    resource,
    spanProcessor: new BatchSpanProcessor(jaegerExporter),
    metricReader: new PeriodicExportingMetricReader({
      exporter: prometheusExporter,
      exportIntervalMillis: 10000,
    }),
  });

  // Initialize SDK
  sdk.start();

  logger?.info('OpenTelemetry tracer initialized', {
    custom: {
      serviceName,
      serviceVersion,
      environment,
      jaegerEndpoint,
      prometheusPort,
    },
  });

  return sdk;
}

/**
 * Get or create a tracer instance
 */
export function getTracer(name: string, version?: string) {
  return trace.getTracer(name, version);
}

/**
 * Start a new span
 */
export function startSpan(
  name: string,
  options?: {
    kind?: SpanKind;
    attributes?: Record<string, any>;
    parent?: Span;
  }
): Span {
  const tracer = getTracer('default');
  
  if (options?.parent) {
    const ctx = trace.setSpan(context.active(), options.parent);
    return tracer.startSpan(name, {
      kind: options.kind,
      attributes: options.attributes,
    }, ctx);
  }
  
  return tracer.startActiveSpan(name, {
    kind: options?.kind,
    attributes: options?.attributes,
  }, (span) => span);
}

/**
 * Decorator for tracing class methods
 */
export function Trace(
  options?: {
    name?: string;
    kind?: SpanKind;
    attributes?: Record<string, any>;
  }
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const spanName = options?.name || `${target.constructor.name}.${propertyKey}`;
      const span = startSpan(spanName, {
        kind: options?.kind || SpanKind.INTERNAL,
        attributes: {
          'code.function': propertyKey,
          'code.namespace': target.constructor.name,
          ...options?.attributes,
        },
      });

      try {
        const result = await originalMethod.apply(this, args);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        
        if (error instanceof Error) {
          span.recordException(error);
        }
        
        throw error;
      } finally {
        span.end();
      }
    };

    return descriptor;
  };
}

/**
 * Wrap a function with tracing
 */
export async function withSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  options?: {
    kind?: SpanKind;
    attributes?: Record<string, any>;
  }
): Promise<T> {
  const span = startSpan(name, options);

  try {
    const result = await fn(span);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : String(error),
    });
    
    if (error instanceof Error) {
      span.recordException(error);
    }
    
    throw error;
  } finally {
    span.end();
  }
}

/**
 * Extract tracing context from current span
 */
export function getTracingContext(): TracingContext | null {
  const span = trace.getActiveSpan();
  
  if (!span) {
    return null;
  }
  
  const spanContext = span.spanContext();
  
  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
  };
}

/**
 * Add event to current span
 */
export function addSpanEvent(
  name: string,
  attributes?: Record<string, any>
): void {
  const span = trace.getActiveSpan();
  
  if (span) {
    span.addEvent(name, attributes);
  }
}

/**
 * Add attributes to current span
 */
export function setSpanAttributes(attributes: Record<string, any>): void {
  const span = trace.getActiveSpan();
  
  if (span) {
    span.setAttributes(attributes);
  }
}