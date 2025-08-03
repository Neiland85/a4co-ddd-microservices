"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var api_1 = require("@opentelemetry/api");
var async_hooks_1 = require("async_hooks");
// AsyncLocalStorage for context propagation
var asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
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
    var activeSpan = span || api_1.trace.getActiveSpan();
    if (!activeSpan) {
        return {};
    }
    var spanContext = activeSpan.spanContext();
    return {
        traceId: spanContext.traceId,
        spanId: spanContext.spanId,
    };
}
// Merge contexts
function mergeContext(base) {
    var contexts = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        contexts[_i - 1] = arguments[_i];
    }
    return contexts.reduce(function (acc, ctx) { return (__assign(__assign(__assign({}, acc), ctx), { metadata: __assign(__assign({}, acc.metadata), ctx.metadata) })); }, base);
}
// Context middleware for async operations
function withObservabilityContext(fn, ctx) {
    return (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var currentContext = getContext();
        var mergedContext = ctx ? mergeContext(currentContext || {}, ctx) : currentContext;
        if (mergedContext) {
            return runWithContext(mergedContext, function () { return fn.apply(void 0, args); });
        }
        return fn.apply(void 0, args);
    });
}
// Extract context from HTTP headers
function extractContextFromHeaders(headers) {
    var ctx = {};
    // Standard trace headers
    var traceId = headers['x-trace-id'] || headers['traceparent'];
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
function injectContextToHeaders(ctx, headers) {
    if (headers === void 0) { headers = {}; }
    var updatedHeaders = __assign({}, headers);
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
    var headers = message.headers || {};
    return extractContextFromHeaders(headers);
}
function injectNatsContext(ctx, message) {
    if (!message.headers) {
        message.headers = {};
    }
    Object.assign(message.headers, injectContextToHeaders(ctx));
}
