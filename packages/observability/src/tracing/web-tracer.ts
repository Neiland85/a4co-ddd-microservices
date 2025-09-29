/**
 * OpenTelemetry tracer for web/frontend applications
 */

import { context, Span, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { Resource } from '@opentelemetry/resources';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Logger } from '../logging/types';

export interface WebTracerConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  collectorUrl?: string;
  logger?: Logger;
}

/**
 * Initialize OpenTelemetry for web applications
 */
export function initializeWebTracer(config: WebTracerConfig): WebTracerProvider {
  const {
    serviceName,
    serviceVersion,
    environment,
    collectorUrl = 'http://localhost:4318/v1/traces',
    logger,
  } = config;

  // Create resource
  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
  });

  // Create provider
  const provider = new WebTracerProvider({
    resource,
  });

  // Create OTLP exporter
  const exporter = new OTLPTraceExporter({
    url: collectorUrl,
    headers: {},
  });

  // Add span processor
  provider.addSpanProcessor(new BatchSpanProcessor(exporter));

  // Set global provider
  provider.register({
    contextManager: new ZoneContextManager(),
  });

  // Register instrumentations
  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: /.*/,
        clearTimingResources: true,
        applyCustomAttributesOnSpan: (span, request, response) => {
          if (request.method) span.setAttribute('http.request.method', request.method);
          if ('url' in request && request.url) span.setAttribute('http.url', request.url);
          if (response && response.status) {
            span.setAttribute('http.status_code', response.status);
          }
        },
      }),
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: /.*/,
        clearTimingResources: true,
      }),
    ],
  });

  logger?.info('Web tracer initialized', {
    custom: {
      serviceName,
      serviceVersion,
      environment,
      collectorUrl,
    },
  });

  return provider;
}

/**
 * Get web tracer instance
 */
export function getWebTracer(name: string, version?: string) {
  return trace.getTracer(name, version);
}

/**
 * Start a span for web operations
 */
export function startWebSpan(
  name: string,
  options?: {
    kind?: SpanKind;
    attributes?: Record<string, any>;
  }
): Span {
  const tracer = getWebTracer('web');
  return tracer.startSpan(name, {
    kind: options?.kind || SpanKind.CLIENT,
    attributes: options?.attributes,
  });
}

/**
 * Trace a web operation
 */
export async function traceWebOperation<T>(
  name: string,
  operation: (span: Span) => Promise<T>,
  options?: {
    kind?: SpanKind;
    attributes?: Record<string, any>;
  }
): Promise<T> {
  const span = startWebSpan(name, options);
  const ctx = trace.setSpan(context.active(), span);

  try {
    const result = await context.with(ctx, () => operation(span));
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
 * Trace React component render
 */
export function traceComponentRender(componentName: string, props?: Record<string, any>): Span {
  const span = startWebSpan(`Component: ${componentName}`, {
    kind: SpanKind.INTERNAL,
    attributes: {
      'component.name': componentName,
      'component.props': props ? Object.keys(props).join(',') : '',
    },
  });

  return span;
}

/**
 * Trace route navigation
 */
export function traceRouteNavigation(fromRoute: string, toRoute: string): Span {
  const span = startWebSpan('Route Navigation', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'navigation.from': fromRoute,
      'navigation.to': toRoute,
      'navigation.timestamp': new Date().toISOString(),
    },
  });

  return span;
}

/**
 * Trace user interaction
 */
export function traceUserInteraction(
  interactionType: string,
  target: string,
  metadata?: Record<string, any>
): Span {
  const span = startWebSpan(`User Interaction: ${interactionType}`, {
    kind: SpanKind.INTERNAL,
    attributes: {
      'interaction.type': interactionType,
      'interaction.target': target,
      ...metadata,
    },
  });

  return span;
}

/**
 * Performance metrics collection
 */
export interface PerformanceMetrics {
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

export function collectPerformanceMetrics(): PerformanceMetrics {
  const metrics: PerformanceMetrics = {};

  if (typeof window !== 'undefined' && 'performance' in window) {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');

    if (fcpEntry) {
      metrics.firstContentfulPaint = fcpEntry.startTime;
    }

    // Collect Web Vitals if available
    if ('PerformanceObserver' in window) {
      try {
        // LCP
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            metrics.largestContentfulPaint = lastEntry.startTime;
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metrics.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // FID
        const fidObserver = new PerformanceObserver(list => {
          const firstEntry = list.getEntries()[0];
          if (firstEntry) {
            metrics.firstInputDelay = (firstEntry as any).processingStart - firstEntry.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Some browsers might not support all observers
      }
    }
  }

  return metrics;
}

/**
 * Add performance metrics to current span
 */
export function addPerformanceMetricsToSpan(): void {
  const span = trace.getActiveSpan();

  if (span) {
    const metrics = collectPerformanceMetrics();

    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        span.setAttribute(`performance.${key}`, value);
      }
    });
  }
}
