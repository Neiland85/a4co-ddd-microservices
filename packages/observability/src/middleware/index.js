"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressObservabilityMiddleware = expressObservabilityMiddleware;
exports.koaObservabilityMiddleware = koaObservabilityMiddleware;
exports.expressErrorHandler = expressErrorHandler;
exports.koaErrorHandler = koaErrorHandler;
const api_1 = require("@opentelemetry/api");
const uuid_1 = require("uuid");
const logger_1 = require("../logger");
const metrics_1 = require("../metrics");
const tracer_1 = require("../tracer");
// Express middleware
function expressObservabilityMiddleware(options = {}) {
    const logger = (0, logger_1.getLogger)();
    const { ignorePaths = ['/health', '/metrics', '/favicon.ico'], includeRequestBody = false, includeResponseBody = false, redactHeaders = ['authorization', 'cookie', 'x-api-key'], customAttributes = () => ({}), } = options;
    return (req, res, next) => {
        // Skip ignored paths
        if (ignorePaths.some(path => req.path.startsWith(path))) {
            return next();
        }
        // Extract trace context from headers
        const parentContext = (0, tracer_1.extractContext)(req.headers);
        // Start span
        const tracer = api_1.trace.getTracer('@a4co/observability');
        const span = tracer.startSpan(`${req.method} ${req.route?.path || req.path}`, {
            kind: api_1.SpanKind.SERVER,
            attributes: {
                'http.method': req.method,
                'http.url': req.url,
                'http.target': req.path,
                'http.host': req.hostname,
                'http.scheme': req.protocol,
                'http.user_agent': req.headers['user-agent'],
                'http.remote_addr': req.ip,
                ...customAttributes(req),
            },
        }, parentContext);
        // Set trace context
        const ctx = api_1.trace.setSpan(api_1.context.active(), span);
        // Generate request ID
        const requestId = req.headers['x-request-id'] || (0, uuid_1.v4)();
        const traceId = span.spanContext().traceId;
        const spanId = span.spanContext().spanId;
        // Add to request
        req.id = requestId;
        // Create logger with context
        req.log = logger.withContext({
            requestId,
            traceId,
            spanId,
            method: req.method,
            path: req.path,
            ip: req.ip,
        });
        // Log request
        const requestLog = {
            method: req.method,
            url: req.url,
            headers: filterHeaders(req.headers, redactHeaders),
        };
        if (includeRequestBody && req.body) {
            requestLog.body = req.body;
        }
        req.log.info(requestLog, 'Request received');
        // Track response
        const startTime = Date.now();
        const originalSend = res.send;
        let responseBody;
        res.send = function (data) {
            responseBody = data;
            return originalSend.call(this, data);
        };
        // Handle response completion
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            // Update span
            span.setAttributes({
                'http.status_code': res.statusCode,
                'http.response.size': res.get('content-length'),
            });
            if (res.statusCode >= 400) {
                span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: `HTTP ${res.statusCode}` });
            }
            else {
                span.setStatus({ code: api_1.SpanStatusCode.OK });
            }
            span.end();
            // Log response
            const responseLog = {
                statusCode: res.statusCode,
                duration,
                headers: filterHeaders(res.getHeaders(), redactHeaders),
            };
            if (includeResponseBody && responseBody) {
                responseLog.body = responseBody;
            }
            const level = res.statusCode >= 400 ? 'error' : 'info';
            req.log[level](responseLog, 'Request completed');
            // Record metrics
            (0, metrics_1.recordHttpRequest)(req.method, req.route?.path || req.path, res.statusCode, duration);
        });
        // Handle errors
        res.on('error', error => {
            span.recordException(error);
            span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: error.message });
            req.log.error({ error }, 'Response error');
        });
        // Continue with context
        api_1.context.with(ctx, () => {
            next();
        });
    };
}
// Koa middleware
function koaObservabilityMiddleware(options = {}) {
    const logger = (0, logger_1.getLogger)();
    const { ignorePaths = ['/health', '/metrics', '/favicon.ico'], includeRequestBody = false, includeResponseBody = false, redactHeaders = ['authorization', 'cookie', 'x-api-key'], customAttributes = () => ({}), } = options;
    return async (ctx, next) => {
        // Skip ignored paths
        if (ignorePaths.some(path => ctx.path.startsWith(path))) {
            return next();
        }
        // Extract trace context from headers
        const parentContext = (0, tracer_1.extractContext)(ctx.headers);
        // Start span
        const tracer = api_1.trace.getTracer('@a4co/observability');
        const span = tracer.startSpan(`${ctx.method} ${ctx.path}`, {
            kind: api_1.SpanKind.SERVER,
            attributes: {
                'http.method': ctx.method,
                'http.url': ctx.url,
                'http.target': ctx.path,
                'http.host': ctx.host,
                'http.scheme': ctx.protocol,
                'http.user_agent': ctx.headers['user-agent'],
                'http.remote_addr': ctx.ip,
                ...customAttributes(ctx),
            },
        }, parentContext);
        // Set trace context
        const traceCtx = api_1.trace.setSpan(api_1.context.active(), span);
        // Generate request ID
        const requestId = ctx.headers['x-request-id'] || (0, uuid_1.v4)();
        const traceId = span.spanContext().traceId;
        const spanId = span.spanContext().spanId;
        // Add to context
        ctx.id = requestId;
        ctx.state.traceId = traceId;
        ctx.state.spanId = spanId;
        // Create logger with context
        ctx.log = logger.withContext({
            requestId,
            traceId,
            spanId,
            method: ctx.method,
            path: ctx.path,
            ip: ctx.ip,
        });
        // Set response headers
        ctx.set('X-Request-ID', requestId);
        ctx.set('X-Trace-ID', traceId);
        // Log request
        const requestLog = {
            method: ctx.method,
            url: ctx.url,
            headers: filterHeaders(ctx.headers, redactHeaders),
        };
        if (includeRequestBody && ctx.request.body) {
            requestLog.body = ctx.request.body;
        }
        ctx.log.info(requestLog, 'Request received');
        const startTime = Date.now();
        try {
            // Continue with context
            await api_1.context.with(traceCtx, async () => {
                await next();
            });
            const duration = Date.now() - startTime;
            // Update span
            span.setAttributes({
                'http.status_code': ctx.status,
                'http.response.size': ctx.response.length,
            });
            if (ctx.status >= 400) {
                span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: `HTTP ${ctx.status}` });
            }
            else {
                span.setStatus({ code: api_1.SpanStatusCode.OK });
            }
            // Log response
            const responseLog = {
                statusCode: ctx.status,
                duration,
                headers: filterHeaders(ctx.response.headers, redactHeaders),
            };
            if (includeResponseBody && ctx.body) {
                responseLog.body = ctx.body;
            }
            const level = ctx.status >= 400 ? 'error' : 'info';
            ctx.log[level](responseLog, 'Request completed');
            // Record metrics
            (0, metrics_1.recordHttpRequest)(ctx.method, ctx.path, ctx.status, duration);
        }
        catch (error) {
            const duration = Date.now() - startTime;
            span.recordException(error);
            span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: error.message });
            ctx.log.error({ error, duration }, 'Request failed');
            // Record error metrics
            (0, metrics_1.recordHttpRequest)(ctx.method, ctx.path, 500, duration);
            throw error;
        }
        finally {
            span.end();
        }
    };
}
// Helper to filter sensitive headers
function filterHeaders(headers, redactList) {
    const filtered = { ...headers };
    redactList.forEach(header => {
        const key = header.toLowerCase();
        if (filtered[key]) {
            filtered[key] = '[REDACTED]';
        }
    });
    return filtered;
}
// Error handler middleware for Express
function expressErrorHandler() {
    return (err, req, res, next) => {
        const logger = req.log || (0, logger_1.getLogger)();
        logger.error({
            error: err,
            stack: err.stack,
            url: req.url,
            method: req.method,
        }, 'Unhandled error');
        // Get current span if available
        const span = api_1.trace.getActiveSpan();
        if (span) {
            span.recordException(err);
            span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: err.message });
        }
        res.status(500).json({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'development' ? err.message : undefined,
            requestId: req.id,
        });
    };
}
// Error handler middleware for Koa
function koaErrorHandler() {
    return async (ctx, next) => {
        try {
            await next();
        }
        catch (err) {
            const error = err;
            const logger = ctx.log || (0, logger_1.getLogger)();
            logger.error({
                error,
                stack: error.stack,
                url: ctx.url,
                method: ctx.method,
            }, 'Unhandled error');
            // Get current span if available
            const span = api_1.trace.getActiveSpan();
            if (span) {
                span.recordException(error);
                span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: error.message });
            }
            ctx.status = 500;
            ctx.body = {
                error: 'Internal Server Error',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined,
                requestId: ctx.id,
            };
        }
    };
}
//# sourceMappingURL=index.js.map