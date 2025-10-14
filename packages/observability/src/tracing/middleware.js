"use strict";
/**
 * Middleware for adding tracing to HTTP requests
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressTracingMiddleware = expressTracingMiddleware;
exports.koaTracingMiddleware = koaTracingMiddleware;
exports.TraceController = TraceController;
const api_1 = require("@opentelemetry/api");
const uuid_1 = require("uuid");
/**
 * Express middleware for distributed tracing
 */
function expressTracingMiddleware(options = {}) {
    const { serviceName = 'express-app', logger, extractTraceHeaders = true, injectTraceHeaders = true, captureRequestBody = false, captureResponseBody = false, sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'], } = options;
    return (req, res, next) => {
        // Extract trace headers
        let traceId = req.headers['x-trace-id'] || (0, uuid_1.v4)();
        let parentSpanId = req.headers['x-span-id'];
        const tracer = api_1.trace.getTracer(serviceName);
        const span = tracer.startSpan(`${req.method} ${req.path}`, {
            kind: api_1.SpanKind.SERVER,
            attributes: {
                'http.method': req.method,
                'http.url': req.url,
                'http.target': req.path,
                'http.host': req.hostname,
                'http.scheme': req.protocol,
                'http.user_agent': req.headers['user-agent'],
                'http.request_content_length': req.headers['content-length'],
                'net.peer.ip': req.ip,
                'trace.id': traceId,
                'parent.span.id': parentSpanId,
            },
        });
        // Set trace context
        const ctx = api_1.trace.setSpan(api_1.context.active(), span);
        // Add request body if enabled
        if (captureRequestBody && req.body) {
            span.setAttribute('http.request.body', JSON.stringify(req.body));
        }
        // Inject trace headers
        if (injectTraceHeaders) {
            const spanContext = span.spanContext();
            res.setHeader('X-Trace-Id', spanContext.traceId);
            res.setHeader('X-Span-Id', spanContext.spanId);
        }
        // Attach span to request for access in route handlers
        req.__span = span;
        req.__traceId = traceId;
        // Log request
        logger?.info('HTTP request received', {
            traceId,
            spanId: span.spanContext().spanId,
            http: {
                method: req.method,
                url: req.url,
                userAgent: req.headers['user-agent'],
                ip: req.ip,
            },
        });
        // Capture response
        const originalSend = res.send;
        const originalJson = res.json;
        const startTime = Date.now();
        res.send = function (data) {
            span.setAttribute('http.status_code', res.statusCode);
            span.setAttribute('http.response_content_length', Buffer.byteLength(data));
            span.setAttribute('http.duration', Date.now() - startTime);
            if (captureResponseBody) {
                span.setAttribute('http.response.body', String(data));
            }
            if (res.statusCode >= 400) {
                span.setStatus({ code: api_1.SpanStatusCode.ERROR });
            }
            else {
                span.setStatus({ code: api_1.SpanStatusCode.OK });
            }
            span.end();
            // Log response
            logger?.info('HTTP request completed', {
                traceId,
                spanId: span.spanContext().spanId,
                http: {
                    method: req.method,
                    url: req.url,
                    statusCode: res.statusCode,
                    duration: Date.now() - startTime,
                },
            });
            return originalSend.call(this, data);
        };
        res.json = function (data) {
            span.setAttribute('http.status_code', res.statusCode);
            span.setAttribute('http.response_content_type', 'application/json');
            span.setAttribute('http.duration', Date.now() - startTime);
            if (captureResponseBody) {
                span.setAttribute('http.response.body', JSON.stringify(data));
            }
            if (res.statusCode >= 400) {
                span.setStatus({ code: api_1.SpanStatusCode.ERROR });
            }
            else {
                span.setStatus({ code: api_1.SpanStatusCode.OK });
            }
            span.end();
            // Log response
            logger?.info('HTTP request completed', {
                traceId,
                spanId: span.spanContext().spanId,
                http: {
                    method: req.method,
                    url: req.url,
                    statusCode: res.statusCode,
                    duration: Date.now() - startTime,
                },
            });
            return originalJson.call(this, data);
        };
        // Continue with context
        api_1.context.with(ctx, () => {
            next();
        });
    };
}
/**
 * Koa middleware for distributed tracing
 */
function koaTracingMiddleware(options = {}) {
    const { serviceName = 'koa-app', logger, extractTraceHeaders = true, injectTraceHeaders = true, captureRequestBody = false, captureResponseBody = false, sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'], } = options;
    return async (ctx, next) => {
        // Extract trace headers
        let traceId = ctx.headers['x-trace-id'] || (0, uuid_1.v4)();
        let parentSpanId = ctx.headers['x-span-id'];
        const tracer = api_1.trace.getTracer(serviceName);
        const span = tracer.startSpan(`${ctx.method} ${ctx.path}`, {
            kind: api_1.SpanKind.SERVER,
            attributes: {
                'http.method': ctx.method,
                'http.url': ctx.url,
                'http.target': ctx.path,
                'http.host': ctx.hostname,
                'http.scheme': ctx.protocol,
                'http.user_agent': ctx.headers['user-agent'],
                'http.request_content_length': ctx.headers['content-length'],
                'net.peer.ip': ctx.ip,
                'trace.id': traceId,
                'parent.span.id': parentSpanId,
            },
        });
        // Set trace context
        const tracingContext = api_1.trace.setSpan(api_1.context.active(), span);
        // Add request body if enabled
        if (captureRequestBody && ctx.request.body) {
            span.setAttribute('http.request.body', JSON.stringify(ctx.request.body));
        }
        // Inject trace headers
        if (injectTraceHeaders) {
            const spanContext = span.spanContext();
            ctx.set('X-Trace-Id', spanContext.traceId);
            ctx.set('X-Span-Id', spanContext.spanId);
        }
        // Attach span to context for access in route handlers
        ctx.state.span = span;
        ctx.state.traceId = traceId;
        // Log request
        logger?.info('HTTP request received', {
            traceId,
            spanId: span.spanContext().spanId,
            http: {
                method: ctx.method,
                url: ctx.url,
                userAgent: ctx.headers['user-agent'],
                ip: ctx.ip,
            },
        });
        const startTime = Date.now();
        try {
            // Continue with context
            await api_1.context.with(tracingContext, async () => {
                await next();
            });
            // Set response attributes
            span.setAttribute('http.status_code', ctx.status);
            span.setAttribute('http.response_content_length', ctx.length || 0);
            span.setAttribute('http.duration', Date.now() - startTime);
            if (captureResponseBody && ctx.body) {
                span.setAttribute('http.response.body', typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body));
            }
            if (ctx.status >= 400) {
                span.setStatus({ code: api_1.SpanStatusCode.ERROR });
            }
            else {
                span.setStatus({ code: api_1.SpanStatusCode.OK });
            }
            // Log response
            logger?.info('HTTP request completed', {
                traceId,
                spanId: span.spanContext().spanId,
                http: {
                    method: ctx.method,
                    url: ctx.url,
                    statusCode: ctx.status,
                    duration: Date.now() - startTime,
                },
            });
        }
        catch (error) {
            span.recordException(error);
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: error instanceof Error ? error.message : String(error),
            });
            // Log error
            logger?.error('HTTP request failed', error, {
                traceId,
                spanId: span.spanContext().spanId,
                http: {
                    method: ctx.method,
                    url: ctx.url,
                    duration: Date.now() - startTime,
                },
            });
            throw error;
        }
        finally {
            span.end();
        }
    };
}
/**
 * Decorator for controller methods to add span
 */
function TraceController(options) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            // Get request object (Express or Koa)
            const req = args[0];
            const parentSpan = req.__span || req.state?.span;
            if (!parentSpan) {
                return originalMethod.apply(this, args);
            }
            const tracer = api_1.trace.getTracer('controller');
            const spanName = options?.name || `${target.constructor.name}.${propertyKey}`;
            const span = tracer.startSpan(spanName, {
                kind: api_1.SpanKind.INTERNAL,
                attributes: {
                    'controller.name': target.constructor.name,
                    'controller.method': propertyKey,
                },
            });
            if (options?.captureArgs) {
                span.setAttribute('controller.args', JSON.stringify(args.slice(1)));
            }
            try {
                const result = await originalMethod.apply(this, args);
                if (options?.captureResult) {
                    span.setAttribute('controller.result', JSON.stringify(result));
                }
                span.setStatus({ code: api_1.SpanStatusCode.OK });
                return result;
            }
            catch (error) {
                span.recordException(error);
                span.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: error instanceof Error ? error.message : String(error),
                });
                throw error;
            }
            finally {
                span.end();
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=middleware.js.map