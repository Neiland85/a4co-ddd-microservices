import {
  context,
  propagation,
  trace,
  type Attributes,
  type Span,
  type SpanOptions,
  type Tracer,
} from '@opentelemetry/api';
import type { DDDMetadata, ObservabilityContext, ObservabilityTracer } from '../types';

export function createEnhancedTracer(
  baseTracer: Tracer,
  defaultContext?: ObservabilityContext
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
  enhancedTracer.startSpan = function (name: string, options?: SpanOptions, context?: any): Span {
    const attributes: Attributes = {
      ...((options?.attributes as Attributes) || {}),
      ...((defaultContext?.metadata as Attributes) || {}),
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

    return baseTracer.startSpan(name, { ...options, attributes }, context);
  };

  // Override startActiveSpan to include default context
  const originalStartActiveSpan = (baseTracer as any).startActiveSpan?.bind(baseTracer);
  if (originalStartActiveSpan) {
    enhancedTracer.startActiveSpan = function (
      name: string,
      options?: SpanOptions,
      fn?: (span: Span) => any
    ): any {
      const attributes: Attributes = {
        ...((options?.attributes as Attributes) || {}),
        ...((defaultContext?.metadata as Attributes) || {}),
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

  // Añadir evento a un span
  enhancedTracer.addSpanEvent = function (name: string, attributes?: Attributes): void {
    const span = trace.getActiveSpan();
    if (span) {
      span.addEvent(name, attributes);
    }
  };

  return enhancedTracer;
}

/**
 * Extract tracing context from headers
 */
export function extractContext(headers: Record<string, string>): void {
  const carrier = {
    get: (key: string): string | undefined => headers[key],
    set: (key: string, value: string): void => {
      headers[key] = value;
    },
  };
  const ctx = propagation.extract(context.active(), carrier);
  context.with(ctx, () => {});
}

/**
 * Inject tracing context into headers
 */
export function injectContext(headers: Record<string, string>): void {
  const carrier = {
    get: (key: string): string | undefined => headers[key],
    set: (key: string, value: string): void => {
      headers[key] = value;
    },
  };
  propagation.inject(context.active(), carrier);
}
