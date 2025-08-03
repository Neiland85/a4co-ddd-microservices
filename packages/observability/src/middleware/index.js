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
exports.expressObservabilityMiddleware = expressObservabilityMiddleware;
exports.koaObservabilityMiddleware = koaObservabilityMiddleware;
exports.expressErrorHandler = expressErrorHandler;
exports.koaErrorHandler = koaErrorHandler;
var api_1 = require("@opentelemetry/api");
var uuid_1 = require("uuid");
var logger_1 = require("../logger");
var metrics_1 = require("../metrics");
var tracer_1 = require("../tracer");
// Express middleware
function expressObservabilityMiddleware(options) {
    if (options === void 0) { options = {}; }
    var logger = (0, logger_1.getLogger)();
    var _a = options.ignorePaths, ignorePaths = _a === void 0 ? ['/health', '/metrics', '/favicon.ico'] : _a, _b = options.includeRequestBody, includeRequestBody = _b === void 0 ? false : _b, _c = options.includeResponseBody, includeResponseBody = _c === void 0 ? false : _c, _d = options.redactHeaders, redactHeaders = _d === void 0 ? ['authorization', 'cookie', 'x-api-key'] : _d, _e = options.customAttributes, customAttributes = _e === void 0 ? function () { return ({}); } : _e;
    return function (req, res, next) {
        var _a;
        // Skip ignored paths
        if (ignorePaths.some(function (path) { return req.path.startsWith(path); })) {
            return next();
        }
        // Extract trace context from headers
        var parentContext = (0, tracer_1.extractContext)(req.headers);
        // Start span
        var tracer = api_1.trace.getTracer('@a4co/observability');
        var span = tracer.startSpan("".concat(req.method, " ").concat(((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || req.path), {
            kind: api_1.SpanKind.SERVER,
            attributes: __assign({ 'http.method': req.method, 'http.url': req.url, 'http.target': req.path, 'http.host': req.hostname, 'http.scheme': req.protocol, 'http.user_agent': req.headers['user-agent'], 'http.remote_addr': req.ip }, customAttributes(req)),
        }, parentContext);
        // Set trace context
        var ctx = api_1.trace.setSpan(api_1.context.active(), span);
        // Generate request ID
        var requestId = req.headers['x-request-id'] || (0, uuid_1.v4)();
        var traceId = span.spanContext().traceId;
        var spanId = span.spanContext().spanId;
        // Add to request
        req.id = requestId;
        // Create logger with context
        req.log = logger.withContext({
            requestId: requestId,
            traceId: traceId,
            spanId: spanId,
            method: req.method,
            path: req.path,
            ip: req.ip,
        });
        // Log request
        var requestLog = {
            method: req.method,
            url: req.url,
            headers: filterHeaders(req.headers, redactHeaders),
        };
        if (includeRequestBody && req.body) {
            requestLog.body = req.body;
        }
        req.log.info(requestLog, 'Request received');
        // Track response
        var startTime = Date.now();
        var originalSend = res.send;
        var responseBody;
        res.send = function (data) {
            responseBody = data;
            return originalSend.call(this, data);
        };
        // Handle response completion
        res.on('finish', function () {
            var _a;
            var duration = Date.now() - startTime;
            // Update span
            span.setAttributes({
                'http.status_code': res.statusCode,
                'http.response.size': res.get('content-length'),
            });
            if (res.statusCode >= 400) {
                span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: "HTTP ".concat(res.statusCode) });
            }
            else {
                span.setStatus({ code: api_1.SpanStatusCode.OK });
            }
            span.end();
            // Log response
            var responseLog = {
                statusCode: res.statusCode,
                duration: duration,
                headers: filterHeaders(res.getHeaders(), redactHeaders),
            };
            if (includeResponseBody && responseBody) {
                responseLog.body = responseBody;
            }
            var level = res.statusCode >= 400 ? 'error' : 'info';
            req.log[level](responseLog, 'Request completed');
            // Record metrics
            (0, metrics_1.recordHttpRequest)(req.method, ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || req.path, res.statusCode, duration);
        });
        // Handle errors
        res.on('error', function (error) {
            span.recordException(error);
            span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: error.message });
            req.log.error({ error: error }, 'Response error');
        });
        // Continue with context
        api_1.context.with(ctx, function () {
            next();
        });
    };
}
// Koa middleware
function koaObservabilityMiddleware(options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var logger = (0, logger_1.getLogger)();
    var _a = options.ignorePaths, ignorePaths = _a === void 0 ? ['/health', '/metrics', '/favicon.ico'] : _a, _b = options.includeRequestBody, includeRequestBody = _b === void 0 ? false : _b, _c = options.includeResponseBody, includeResponseBody = _c === void 0 ? false : _c, _d = options.redactHeaders, redactHeaders = _d === void 0 ? ['authorization', 'cookie', 'x-api-key'] : _d, _e = options.customAttributes, customAttributes = _e === void 0 ? function () { return ({}); } : _e;
    return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var parentContext, tracer, span, traceCtx, requestId, traceId, spanId, requestLog, startTime, duration, responseLog, level, error_1, duration;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Skip ignored paths
                    if (ignorePaths.some(function (path) { return ctx.path.startsWith(path); })) {
                        return [2 /*return*/, next()];
                    }
                    parentContext = (0, tracer_1.extractContext)(ctx.headers);
                    tracer = api_1.trace.getTracer('@a4co/observability');
                    span = tracer.startSpan("".concat(ctx.method, " ").concat(ctx.path), {
                        kind: api_1.SpanKind.SERVER,
                        attributes: __assign({ 'http.method': ctx.method, 'http.url': ctx.url, 'http.target': ctx.path, 'http.host': ctx.host, 'http.scheme': ctx.protocol, 'http.user_agent': ctx.headers['user-agent'], 'http.remote_addr': ctx.ip }, customAttributes(ctx)),
                    }, parentContext);
                    traceCtx = api_1.trace.setSpan(api_1.context.active(), span);
                    requestId = ctx.headers['x-request-id'] || (0, uuid_1.v4)();
                    traceId = span.spanContext().traceId;
                    spanId = span.spanContext().spanId;
                    // Add to context
                    ctx.id = requestId;
                    ctx.state.traceId = traceId;
                    ctx.state.spanId = spanId;
                    // Create logger with context
                    ctx.log = logger.withContext({
                        requestId: requestId,
                        traceId: traceId,
                        spanId: spanId,
                        method: ctx.method,
                        path: ctx.path,
                        ip: ctx.ip,
                    });
                    // Set response headers
                    ctx.set('X-Request-ID', requestId);
                    ctx.set('X-Trace-ID', traceId);
                    requestLog = {
                        method: ctx.method,
                        url: ctx.url,
                        headers: filterHeaders(ctx.headers, redactHeaders),
                    };
                    if (includeRequestBody && ctx.request.body) {
                        requestLog.body = ctx.request.body;
                    }
                    ctx.log.info(requestLog, 'Request received');
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // Continue with context
                    return [4 /*yield*/, api_1.context.with(traceCtx, function () { return __awaiter(_this, void 0, void 0, function () {
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
                    duration = Date.now() - startTime;
                    // Update span
                    span.setAttributes({
                        'http.status_code': ctx.status,
                        'http.response.size': ctx.response.length,
                    });
                    if (ctx.status >= 400) {
                        span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: "HTTP ".concat(ctx.status) });
                    }
                    else {
                        span.setStatus({ code: api_1.SpanStatusCode.OK });
                    }
                    responseLog = {
                        statusCode: ctx.status,
                        duration: duration,
                        headers: filterHeaders(ctx.response.headers, redactHeaders),
                    };
                    if (includeResponseBody && ctx.body) {
                        responseLog.body = ctx.body;
                    }
                    level = ctx.status >= 400 ? 'error' : 'info';
                    ctx.log[level](responseLog, 'Request completed');
                    // Record metrics
                    (0, metrics_1.recordHttpRequest)(ctx.method, ctx.path, ctx.status, duration);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    duration = Date.now() - startTime;
                    span.recordException(error_1);
                    span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: error_1.message });
                    ctx.log.error({ error: error_1, duration: duration }, 'Request failed');
                    // Record error metrics
                    (0, metrics_1.recordHttpRequest)(ctx.method, ctx.path, 500, duration);
                    throw error_1;
                case 4:
                    span.end();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
}
// Helper to filter sensitive headers
function filterHeaders(headers, redactList) {
    var filtered = __assign({}, headers);
    redactList.forEach(function (header) {
        var key = header.toLowerCase();
        if (filtered[key]) {
            filtered[key] = '[REDACTED]';
        }
    });
    return filtered;
}
// Error handler middleware for Express
function expressErrorHandler() {
    return function (err, req, res, next) {
        var logger = req.log || (0, logger_1.getLogger)();
        logger.error({
            error: err,
            stack: err.stack,
            url: req.url,
            method: req.method,
        }, 'Unhandled error');
        // Get current span if available
        var span = api_1.trace.getActiveSpan();
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
    var _this = this;
    return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var err_1, error, logger, span;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, next()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    error = err_1;
                    logger = ctx.log || (0, logger_1.getLogger)();
                    logger.error({
                        error: error,
                        stack: error.stack,
                        url: ctx.url,
                        method: ctx.method,
                    }, 'Unhandled error');
                    span = api_1.trace.getActiveSpan();
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
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
