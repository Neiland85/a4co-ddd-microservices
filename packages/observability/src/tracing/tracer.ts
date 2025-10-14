/**
 * OpenTelemetry tracer initialization and configuration
 */

import type { Attributes, Span } from '@opentelemetry/api';
import { context, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { Resource } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import type { Logger } from '../logging/types';

export type TracerConfig = {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  jaegerEndpoint?: string;
  prometheusPort?: number;
  logger?: Logger;
};

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
  const prometheusExporter = new PrometheusExporter(
    {
      port: prometheusPort,
    },
    () => {
      logger?.info(`Prometheus metrics server started on port ${prometheusPort}`);
<<<<<<< HEAD
    },
=======
    }
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Register instrumentations
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation({
        requestHook: (span, request): void => {
          span.setAttribute(
            'http.request.body.size',
            (request as { headers?: Record<string, string | string[] | undefined> }).headers?.[
              'content-length'
            ] || 0,
          );
        },
        responseHook: (span, response): void => {
          span.setAttribute(
            'http.response.body.size',
            (response as { headers?: Record<string, string | string[] | undefined> }).headers?.[
              'content-length'
            ] || 0,
          );
        },
      }),
      new ExpressInstrumentation(),
      new GrpcInstrumentation(),
    ],
  });

  // Create SDK
  const sdk = new NodeSDK({
    resource,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spanProcessor: new BatchSpanProcessor(jaegerExporter) as any,
    metricReader: new PeriodicExportingMetricReader({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      exporter: prometheusExporter as any,
      exportIntervalMillis: 10000,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
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
export function getTracer(name: string, version?: string): ReturnType<typeof trace.getTracer> {
  return trace.getTracer(name, version);
}

/**
 * Start a new span
 */
export function startSpan(
  name: string,
  options?: {
    kind?: SpanKind;
    attributes?: Attributes;
    parent?: Span;
  },
): Span {
  const tracer = getTracer('default');

  if (options?.parent) {
    const ctx = trace.setSpan(context.active(), options.parent);
    return tracer.startSpan(
      name,
      {
        kind: options.kind,
        attributes: options.attributes,
      },
<<<<<<< HEAD
      ctx,
=======
      ctx
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    );
  }

  return tracer.startActiveSpan(
    name,
    {
      kind: options?.kind,
      attributes: options?.attributes,
    },
<<<<<<< HEAD
    span => span,
=======
    span => span
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );
}

/**
 * Decorator for tracing class methods
 */
export function Trace(options?: {
  name?: string;
  kind?: SpanKind;
<<<<<<< HEAD
  attributes?: Attributes;
}): (
  _target: unknown,
  _propertyKey: string,
  _descriptor: PropertyDescriptor
) => PropertyDescriptor {
  return function(
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
=======
  attributes?: Record<string, any>;
}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: unknown[]): Promise<unknown> {
      const constructorName =
        target &&
        typeof target === 'object' &&
        target.constructor &&
        typeof target.constructor.name === 'string'
          ? target.constructor.name
          : 'Unknown';
      const spanName = options?.name || `${constructorName}.${propertyKey}`;
      const span = startSpan(spanName, {
        kind: options?.kind || SpanKind.INTERNAL,
        attributes: {
          'code.function': propertyKey,
          'code.namespace': constructorName,
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
  fn: (_span: Span) => Promise<T>,
  options?: {
    kind?: SpanKind;
    attributes?: Attributes;
  },
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
<<<<<<< HEAD
export function addSpanEvent(name: string, attributes?: Attributes): void {
=======
export function addSpanEvent(name: string, attributes?: Record<string, any>): void {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  const span = trace.getActiveSpan();

  if (span) {
    span.addEvent(name, attributes);
  }
}

/**
 * Add attributes to current span
 */
export function setSpanAttributes(attributes: Attributes): void {
  const span = trace.getActiveSpan();

  if (span) {
    span.setAttributes(attributes);
  }
}
