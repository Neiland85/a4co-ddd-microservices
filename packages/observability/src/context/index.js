"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setContext = setContext;
exports.getContext = getContext;
exports.runWithContext = runWithContext;
exports.createContextFromSpan = createContextFromSpan;
exports.mergeContext = mergeContext;
exports.withObservabilityContext = withObservabilityContext;
exports.extractContextFromHeaders = extractContextFromHeaders;
exports.injectContextToHeaders = injectContextToHeaders;
exports.createNatsContext = createNatsContext;
exports.injectNatsContext = injectNatsContext;
const api_1 = require("@opentelemetry/api");
const async_hooks_1 = require("async_hooks");
// AsyncLocalStorage for context propagation
const asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
// Set observability context
function setContext(ctx) {
    asyncLocalStorage.enterWith(ctx);
}
// Get current observability context
function getContext() {
    return asyncLocalStorage.getStore();
}
// Run function with context
function runWithContext(ctx, fn) {
    return asyncLocalStorage.run(ctx, fn);
}
// Create context from OpenTelemetry span
function createContextFromSpan(span) {
    const activeSpan = span || api_1.trace.getActiveSpan();
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
function mergeContext(base, ...contexts) {
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
function withObservabilityContext(fn, ctx) {
    return ((...args) => {
        const currentContext = getContext();
        const mergedContext = ctx ? mergeContext(currentContext || {}, ctx) : currentContext;
        if (mergedContext) {
            return runWithContext(mergedContext, () => fn(...args));
        }
        return fn(...args);
    });
}
// Extract context from HTTP headers
function extractContextFromHeaders(headers) {
    const ctx = {};
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
function injectContextToHeaders(ctx, headers = {}) {
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
function createNatsContext(message) {
    const headers = message.headers || {};
    return extractContextFromHeaders(headers);
}
function injectNatsContext(ctx, message) {
    if (!message.headers) {
        message.headers = {};
    }
    Object.assign(message.headers, injectContextToHeaders(ctx));
}
//# sourceMappingURL=index.js.map