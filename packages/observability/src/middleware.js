"use strict";
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
exports.TracedHttpClient = exports.TRACE_HEADERS = void 0;
exports.observabilityMiddleware = observabilityMiddleware;
exports.extractTraceId = extractTraceId;
exports.logCorrelationMiddleware = logCorrelationMiddleware;
exports.withPropagatedContext = withPropagatedContext;
exports.createTracingHeaders = createTracingHeaders;
exports.errorHandlingMiddleware = errorHandlingMiddleware;
var api_1 = require("@opentelemetry/api");
var axios_1 = require("axios");
// Headers estándar para propagación de contexto
exports.TRACE_HEADERS = {
    TRACE_ID: 'x-trace-id',
    SPAN_ID: 'x-span-id',
    PARENT_SPAN_ID: 'x-parent-span-id',
    TRACE_PARENT: 'traceparent',
    TRACE_STATE: 'tracestate',
    BAGGAGE: 'baggage',
    B3_TRACE_ID: 'x-b3-traceid',
    B3_SPAN_ID: 'x-b3-spanid',
    B3_PARENT_SPAN_ID: 'x-b3-parentspanid',
    B3_SAMPLED: 'x-b3-sampled',
    B3_FLAGS: 'x-b3-flags',
};
// Middleware principal para Express
function observabilityMiddleware() {
    return function (req, res, next) {
        // Extraer contexto de los headers entrantes
        var extractedContext = api_1.propagation.extract(api_1.context.active(), req.headers);
        // Ejecutar el resto del request en el contexto extraído
        api_1.context.with(extractedContext, function () {
            var _a, _b;
            var span = api_1.trace.getActiveSpan();
            if (span) {
                var spanContext = span.spanContext();
                // Asignar IDs al request para fácil acceso
                req.traceId = spanContext.traceId;
                req.spanId = spanContext.spanId;
                // Agregar trace ID a los headers de respuesta
                res.setHeader(exports.TRACE_HEADERS.TRACE_ID, spanContext.traceId);
                res.setHeader(exports.TRACE_HEADERS.SPAN_ID, spanContext.spanId);
                // Agregar atributos adicionales al span
                span.setAttributes({
                    'http.request_id': req.headers['x-request-id'] || req.id,
                    'http.user_agent': req.headers['user-agent'],
                    'http.referer': req.headers['referer'],
                    'http.forwarded_for': req.headers['x-forwarded-for'],
                    'http.real_ip': req.headers['x-real-ip'],
                    'user.id': (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                    'user.role': (_b = req.user) === null || _b === void 0 ? void 0 : _b.role,
                });
                // Log del inicio del request
                if (req.log) {
                    req.log.info({
                        msg: 'Request started',
                        traceId: spanContext.traceId,
                        spanId: spanContext.spanId,
                        method: req.method,
                        path: req.path,
                        query: req.query,
                    });
                }
            }
            // Interceptar el método end de response para logging
            var originalEnd = res.end;
            res.end = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // Log del fin del request
                if (req.log) {
                    req.log.info({
                        msg: 'Request completed',
                        traceId: req.traceId,
                        spanId: req.spanId,
                        statusCode: res.statusCode,
                        duration: Date.now() - req.startTime,
                    });
                }
                // Llamar al método original
                return originalEnd.apply(res, args);
            };
            next();
        });
    };
}
// Cliente HTTP con propagación automática de contexto
var TracedHttpClient = /** @class */ (function () {
    function TracedHttpClient(baseConfig) {
        this.axiosInstance = axios_1.default.create(baseConfig);
        // Interceptor para agregar headers de tracing
        this.axiosInstance.interceptors.request.use(function (config) {
            // Inyectar contexto actual en los headers
            var headers = config.headers || {};
            api_1.propagation.inject(api_1.context.active(), headers);
            // Agregar trace ID explícito si está disponible
            var span = api_1.trace.getActiveSpan();
            if (span) {
                var spanContext = span.spanContext();
                headers[exports.TRACE_HEADERS.TRACE_ID] = spanContext.traceId;
                headers[exports.TRACE_HEADERS.SPAN_ID] = spanContext.spanId;
            }
            config.headers = headers;
            return config;
        }, function (error) { return Promise.reject(error); });
        // Interceptor para logging de respuestas
        this.axiosInstance.interceptors.response.use(function (response) {
            var span = api_1.trace.getActiveSpan();
            if (span) {
                span.setAttributes({
                    'http.response.status_code': response.status,
                    'http.response.size': response.headers['content-length'] || 0,
                });
            }
            return response;
        }, function (error) {
            var span = api_1.trace.getActiveSpan();
            if (span && error.response) {
                span.setAttributes({
                    'http.response.status_code': error.response.status,
                    'http.response.error': error.message,
                });
            }
            return Promise.reject(error);
        });
    }
    TracedHttpClient.prototype.get = function (url, config) {
        return this.axiosInstance.get(url, config);
    };
    TracedHttpClient.prototype.post = function (url, data, config) {
        return this.axiosInstance.post(url, data, config);
    };
    TracedHttpClient.prototype.put = function (url, data, config) {
        return this.axiosInstance.put(url, data, config);
    };
    TracedHttpClient.prototype.delete = function (url, config) {
        return this.axiosInstance.delete(url, config);
    };
    TracedHttpClient.prototype.patch = function (url, data, config) {
        return this.axiosInstance.patch(url, data, config);
    };
    return TracedHttpClient;
}());
exports.TracedHttpClient = TracedHttpClient;
// Función helper para extraer trace ID de diferentes formatos de headers
function extractTraceId(headers) {
    // Intentar diferentes formatos de trace ID
    return headers[exports.TRACE_HEADERS.TRACE_ID] ||
        headers[exports.TRACE_HEADERS.B3_TRACE_ID] ||
        extractTraceIdFromTraceparent(headers[exports.TRACE_HEADERS.TRACE_PARENT]);
}
// Extraer trace ID del header traceparent (W3C format)
function extractTraceIdFromTraceparent(traceparent) {
    if (!traceparent)
        return undefined;
    // Format: version-trace-id-parent-id-trace-flags
    var parts = traceparent.split('-');
    return parts.length >= 3 ? parts[1] : undefined;
}
// Middleware para correlación de logs
function logCorrelationMiddleware(logger) {
    return function (req, res, next) {
        // Crear un logger child con contexto de tracing
        var childLogger = logger.child({
            traceId: req.traceId || extractTraceId(req.headers),
            spanId: req.spanId,
            requestId: req.headers['x-request-id'] || req.id,
            method: req.method,
            path: req.path,
            userAgent: req.headers['user-agent'],
        });
        // Adjuntar el logger al request
        req.log = childLogger;
        req.startTime = Date.now();
        next();
    };
}
// Función para propagar contexto en operaciones asíncronas
function withPropagatedContext(fn, parentContext) {
    return __awaiter(this, void 0, void 0, function () {
        var contextToUse;
        var _this = this;
        return __generator(this, function (_a) {
            contextToUse = parentContext || api_1.context.active();
            return [2 /*return*/, api_1.context.with(contextToUse, function () { return __awaiter(_this, void 0, void 0, function () {
                    var error_1, span;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, fn()];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2:
                                error_1 = _a.sent();
                                span = api_1.trace.getActiveSpan();
                                if (span && error_1 instanceof Error) {
                                    span.recordException(error_1);
                                }
                                throw error_1;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
// Utilidad para crear headers con contexto de tracing
function createTracingHeaders() {
    var headers = {};
    // Inyectar contexto actual
    api_1.propagation.inject(api_1.context.active(), headers);
    // Agregar trace ID explícito
    var span = api_1.trace.getActiveSpan();
    if (span) {
        var spanContext = span.spanContext();
        headers[exports.TRACE_HEADERS.TRACE_ID] = spanContext.traceId;
        headers[exports.TRACE_HEADERS.SPAN_ID] = spanContext.spanId;
    }
    return headers;
}
// Middleware para manejar errores con contexto de tracing
function errorHandlingMiddleware(logger) {
    return function (err, req, res, next) {
        var span = api_1.trace.getActiveSpan();
        // Registrar el error en el span
        if (span) {
            span.recordException(err);
            span.setStatus({
                code: api_1.trace.SpanStatusCode.ERROR,
                message: err.message,
            });
        }
        // Log estructurado del error
        var errorLogger = req.log || logger;
        errorLogger.error({
            msg: 'Request error',
            error: {
                message: err.message,
                stack: err.stack,
                name: err.name,
            },
            traceId: req.traceId,
            spanId: req.spanId,
            method: req.method,
            path: req.path,
            statusCode: err.statusCode || 500,
        });
        // Enviar respuesta de error con trace ID
        var statusCode = err.statusCode || 500;
        res.status(statusCode).json({
            error: {
                message: err.message,
                code: err.code || 'INTERNAL_ERROR',
                traceId: req.traceId,
            },
        });
    };
}
