"use strict";
/**
 * Middleware for adding tracing to HTTP requests
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressTracingMiddleware = expressTracingMiddleware;
exports.koaTracingMiddleware = koaTracingMiddleware;
exports.TraceController = TraceController;
var api_1 = require("@opentelemetry/api");
var uuid_1 = require("uuid");
/**
 * Express middleware for distributed tracing
 */
function expressTracingMiddleware(options) {
    if (options === void 0) { options = {}; }
    var _a = options.serviceName, serviceName = _a === void 0 ? 'express-app' : _a, logger = options.logger, _b = options.extractTraceHeaders, extractTraceHeaders = _b === void 0 ? true : _b, _c = options.injectTraceHeaders, injectTraceHeaders = _c === void 0 ? true : _c, _d = options.captureRequestBody, captureRequestBody = _d === void 0 ? false : _d, _e = options.captureResponseBody, captureResponseBody = _e === void 0 ? false : _e, _f = options.sensitiveHeaders, sensitiveHeaders = _f === void 0 ? ['authorization', 'cookie', 'x-api-key'] : _f;
    return function (req, res, next) {
        // Extract trace headers
        var traceId = req.headers['x-trace-id'] || (0, uuid_1.v4)();
        var parentSpanId = req.headers['x-span-id'];
        var tracer = api_1.trace.getTracer(serviceName);
        var span = tracer.startSpan("".concat(req.method, " ").concat(req.path), {
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
        var ctx = api_1.trace.setSpan(api_1.context.active(), span);
        // Add request body if enabled
        if (captureRequestBody && req.body) {
            span.setAttribute('http.request.body', JSON.stringify(req.body));
        }
        // Inject trace headers
        if (injectTraceHeaders) {
            var spanContext = span.spanContext();
            res.setHeader('X-Trace-Id', spanContext.traceId);
            res.setHeader('X-Span-Id', spanContext.spanId);
        }
        // Attach span to request for access in route handlers
        req.__span = span;
        req.__traceId = traceId;
        // Log request
        logger === null || logger === void 0 ? void 0 : logger.info('HTTP request received', {
            traceId: traceId,
            spanId: span.spanContext().spanId,
            http: {
                method: req.method,
                url: req.url,
                userAgent: req.headers['user-agent'],
                ip: req.ip,
            },
        });
        // Capture response
        var originalSend = res.send;
        var originalJson = res.json;
        var startTime = Date.now();
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
            logger === null || logger === void 0 ? void 0 : logger.info('HTTP request completed', {
                traceId: traceId,
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
            logger === null || logger === void 0 ? void 0 : logger.info('HTTP request completed', {
                traceId: traceId,
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
        api_1.context.with(ctx, function () {
            next();
        });
    };
}
/**
 * Koa middleware for distributed tracing
 */
function koaTracingMiddleware(options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var _a = options.serviceName, serviceName = _a === void 0 ? 'koa-app' : _a, logger = options.logger, _b = options.extractTraceHeaders, extractTraceHeaders = _b === void 0 ? true : _b, _c = options.injectTraceHeaders, injectTraceHeaders = _c === void 0 ? true : _c, _d = options.captureRequestBody, captureRequestBody = _d === void 0 ? false : _d, _e = options.captureResponseBody, captureResponseBody = _e === void 0 ? false : _e, _f = options.sensitiveHeaders, sensitiveHeaders = _f === void 0 ? ['authorization', 'cookie', 'x-api-key'] : _f;
    return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var traceId, parentSpanId, tracer, span, tracingContext, spanContext, startTime, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    traceId = ctx.headers['x-trace-id'] || (0, uuid_1.v4)();
                    parentSpanId = ctx.headers['x-span-id'];
                    tracer = api_1.trace.getTracer(serviceName);
                    span = tracer.startSpan("".concat(ctx.method, " ").concat(ctx.path), {
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
                    tracingContext = api_1.trace.setSpan(api_1.context.active(), span);
                    // Add request body if enabled
                    if (captureRequestBody && ctx.request.body) {
                        span.setAttribute('http.request.body', JSON.stringify(ctx.request.body));
                    }
                    // Inject trace headers
                    if (injectTraceHeaders) {
                        spanContext = span.spanContext();
                        ctx.set('X-Trace-Id', spanContext.traceId);
                        ctx.set('X-Span-Id', spanContext.spanId);
                    }
                    // Attach span to context for access in route handlers
                    ctx.state.span = span;
                    ctx.state.traceId = traceId;
                    // Log request
                    logger === null || logger === void 0 ? void 0 : logger.info('HTTP request received', {
                        traceId: traceId,
                        spanId: span.spanContext().spanId,
                        http: {
                            method: ctx.method,
                            url: ctx.url,
                            userAgent: ctx.headers['user-agent'],
                            ip: ctx.ip,
                        },
                    });
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // Continue with context
                    return [4 /*yield*/, api_1.context.with(tracingContext, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, next()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    // Continue with context
                    _a.sent();
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
                    logger === null || logger === void 0 ? void 0 : logger.info('HTTP request completed', {
                        traceId: traceId,
                        spanId: span.spanContext().spanId,
                        http: {
                            method: ctx.method,
                            url: ctx.url,
                            statusCode: ctx.status,
                            duration: Date.now() - startTime,
                        },
                    });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    span.recordException(error_1);
                    span.setStatus({
                        code: api_1.SpanStatusCode.ERROR,
                        message: error_1 instanceof Error ? error_1.message : String(error_1),
                    });
                    // Log error
                    logger === null || logger === void 0 ? void 0 : logger.error('HTTP request failed', error_1, {
                        traceId: traceId,
                        spanId: span.spanContext().spanId,
                        http: {
                            method: ctx.method,
                            url: ctx.url,
                            duration: Date.now() - startTime,
                        },
                    });
                    throw error_1;
                case 4:
                    span.end();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
}
/**
 * Decorator for controller methods to add span
 */
function TraceController(options) {
    return function (target, propertyKey, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var req, parentSpan, tracer, spanName, span, result, error_2;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            req = args[0];
                            parentSpan = req.__span || ((_a = req.state) === null || _a === void 0 ? void 0 : _a.span);
                            if (!parentSpan) {
                                return [2 /*return*/, originalMethod.apply(this, args)];
                            }
                            tracer = api_1.trace.getTracer('controller');
                            spanName = (options === null || options === void 0 ? void 0 : options.name) || "".concat(target.constructor.name, ".").concat(propertyKey);
                            span = tracer.startSpan(spanName, {
                                kind: api_1.SpanKind.INTERNAL,
                                attributes: {
                                    'controller.name': target.constructor.name,
                                    'controller.method': propertyKey,
                                },
                            });
                            if (options === null || options === void 0 ? void 0 : options.captureArgs) {
                                span.setAttribute('controller.args', JSON.stringify(args.slice(1)));
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, originalMethod.apply(this, args)];
                        case 2:
                            result = _b.sent();
                            if (options === null || options === void 0 ? void 0 : options.captureResult) {
                                span.setAttribute('controller.result', JSON.stringify(result));
                            }
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            return [2 /*return*/, result];
                        case 3:
                            error_2 = _b.sent();
                            span.recordException(error_2);
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: error_2 instanceof Error ? error_2.message : String(error_2),
                            });
                            throw error_2;
                        case 4:
                            span.end();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return descriptor;
    };
}
