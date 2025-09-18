import { context, Context, trace } from '@opentelemetry/api';
import { AsyncLocalStorage } from 'async_hooks';
import { ObservabilityContext } from '../types';

// AsyncLocalStorage for context propagation
const asyncLocalStorage = new AsyncLocalStorage<ObservabilityContext>();

// Set observability context
export function setContext(ctx: ObservabilityContext): void {
  asyncLocalStorage.enterWith(ctx);
}

// Get current observability context
export function getContext(): ObservabilityContext | undefined {
  return asyncLocalStorage.getStore();
}

// Run function with context
export function runWithContext<T>(ctx: ObservabilityContext, fn: () => T): T {
  return asyncLocalStorage.run(ctx, fn);
}

// Create context from OpenTelemetry span
export function createContextFromSpan(span?: any): ObservabilityContext {
  const activeSpan = span || trace.getActiveSpan();
  
  if (!activeSpan) {
    return {};
  }

  const spanContext = activeSpan.spanContext();
  
  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
  };
}

// Merge contexts
export function mergeContext(base: ObservabilityContext, ...contexts: Partial<ObservabilityContext>[]): ObservabilityContext {
  return contexts.reduce((acc, ctx) => ({
    ...acc,
    ...ctx,
    metadata: {
      ...acc.metadata,
      ...ctx.metadata,
    },
  }), base);
}

// Context middleware for async operations
export function withObservabilityContext<T extends (...args: any[]) => any>(
  fn: T,
  ctx?: ObservabilityContext
): T {
  return ((...args: any[]) => {
    const currentContext = getContext();
    const mergedContext = ctx ? mergeContext(currentContext || {}, ctx) : currentContext;
    
    if (mergedContext) {
      return runWithContext(mergedContext, () => fn(...args));
    }
    
    return fn(...args);
  }) as T;
}

// Extract context from HTTP headers
export function extractContextFromHeaders(headers: Record<string, string | string[] | undefined>): ObservabilityContext {
  const ctx: ObservabilityContext = {};

  // Standard trace headers
  const traceId = headers['x-trace-id'] || headers['traceparent'];
  if (traceId && typeof traceId === 'string') {
    ctx.traceId = traceId.includes('-') ? traceId.split('-')[1] : traceId;
  }

  // Custom headers
  if (headers['x-correlation-id']) {
    ctx.correlationId = Array.isArray(headers['x-correlation-id']) 
      ? headers['x-correlation-id'][0] 
      : headers['x-correlation-id'];
  }

  if (headers['x-causation-id']) {
    ctx.causationId = Array.isArray(headers['x-causation-id'])
      ? headers['x-causation-id'][0]
      : headers['x-causation-id'];
  }

  if (headers['x-user-id']) {
    ctx.userId = Array.isArray(headers['x-user-id'])
      ? headers['x-user-id'][0]
      : headers['x-user-id'];
  }

  if (headers['x-tenant-id']) {
    ctx.tenantId = Array.isArray(headers['x-tenant-id'])
      ? headers['x-tenant-id'][0]
      : headers['x-tenant-id'];
  }

  return ctx;
}

// Inject context into HTTP headers
export function injectContextToHeaders(
  ctx: ObservabilityContext,
  headers: Record<string, string> = {}
): Record<string, string> {
  const updatedHeaders = { ...headers };

  if (ctx.traceId) {
    updatedHeaders['x-trace-id'] = ctx.traceId;
  }

  if (ctx.correlationId) {
    updatedHeaders['x-correlation-id'] = ctx.correlationId;
  }

  if (ctx.causationId) {
    updatedHeaders['x-causation-id'] = ctx.causationId;
  }

  if (ctx.userId) {
    updatedHeaders['x-user-id'] = ctx.userId;
  }

  if (ctx.tenantId) {
    updatedHeaders['x-tenant-id'] = ctx.tenantId;
  }

  return updatedHeaders;
}

// Context for NATS messages
export function createNatsContext(message: any): ObservabilityContext {
  const headers = message.headers || {};
  return extractContextFromHeaders(headers);
}

export function injectNatsContext(ctx: ObservabilityContext, message: any): void {
  if (!message.headers) {
    message.headers = {};
  }
  
  Object.assign(message.headers, injectContextToHeaders(ctx));
}