"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracedHttpClient = exports.TRACE_HEADERS = void 0;
exports.observabilityMiddleware = observabilityMiddleware;
exports.extractTraceId = extractTraceId;
exports.logCorrelationMiddleware = logCorrelationMiddleware;
exports.withPropagatedContext = withPropagatedContext;
exports.createTracingHeaders = createTracingHeaders;
exports.errorHandlingMiddleware = errorHandlingMiddleware;
const api_1 = require("@opentelemetry/api");
const axios_1 = __importDefault(require("axios"));
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
    return (req, res, next) => {
        // Extraer contexto de los headers entrantes
        const extractedContext = api_1.propagation.extract(api_1.context.active(), req.headers);
        // Ejecutar el resto del request en el contexto extraído
        api_1.context.with(extractedContext, () => {
            const span = api_1.trace.getActiveSpan();
            if (span) {
                const spanContext = span.spanContext();
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
                    'user.id': req.user?.id,
                    'user.role': req.user?.role,
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
            const originalEnd = res.end;
            res.end = function (...args) {
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
class TracedHttpClient {
    axiosInstance;
    constructor(baseConfig) {
        this.axiosInstance = axios_1.default.create(baseConfig);
        // Interceptor para agregar headers de tracing
        this.axiosInstance.interceptors.request.use((config) => {
            // Inyectar contexto actual en los headers
            const headers = config.headers || {};
            api_1.propagation.inject(api_1.context.active(), headers);
            // Agregar trace ID explícito si está disponible
            const span = api_1.trace.getActiveSpan();
            if (span) {
                const spanContext = span.spanContext();
                headers[exports.TRACE_HEADERS.TRACE_ID] = spanContext.traceId;
                headers[exports.TRACE_HEADERS.SPAN_ID] = spanContext.spanId;
            }
            config.headers = headers;
            return config;
        }, (error) => Promise.reject(error));
        // Interceptor para logging de respuestas
        this.axiosInstance.interceptors.response.use((response) => {
            const span = api_1.trace.getActiveSpan();
            if (span) {
                span.setAttributes({
                    'http.response.status_code': response.status,
                    'http.response.size': response.headers['content-length'] || 0,
                });
            }
            return response;
        }, (error) => {
            const span = api_1.trace.getActiveSpan();
            if (span && error.response) {
                span.setAttributes({
                    'http.response.status_code': error.response.status,
                    'http.response.error': error.message,
                });
            }
            return Promise.reject(error);
        });
    }
    get(url, config) {
        return this.axiosInstance.get(url, config);
    }
    post(url, data, config) {
        return this.axiosInstance.post(url, data, config);
    }
    put(url, data, config) {
        return this.axiosInstance.put(url, data, config);
    }
    delete(url, config) {
        return this.axiosInstance.delete(url, config);
    }
    patch(url, data, config) {
        return this.axiosInstance.patch(url, data, config);
    }
}
exports.TracedHttpClient = TracedHttpClient;
// Función helper para extraer trace ID de diferentes formatos de headers
function extractTraceId(headers) {
    // Intentar diferentes formatos de trace ID
    return (headers[exports.TRACE_HEADERS.TRACE_ID] ||
        headers[exports.TRACE_HEADERS.B3_TRACE_ID] ||
        extractTraceIdFromTraceparent(headers[exports.TRACE_HEADERS.TRACE_PARENT]));
}
// Extraer trace ID del header traceparent (W3C format)
function extractTraceIdFromTraceparent(traceparent) {
    if (!traceparent)
        return undefined;
    // Format: version-trace-id-parent-id-trace-flags
    const parts = traceparent.split('-');
    return parts.length >= 3 ? parts[1] : undefined;
}
// Middleware para correlación de logs
function logCorrelationMiddleware(logger) {
    return (req, res, next) => {
        // Crear un logger child con contexto de tracing
        const childLogger = logger.child({
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
async function withPropagatedContext(fn, parentContext) {
    const contextToUse = parentContext || api_1.context.active();
    return api_1.context.with(contextToUse, async () => {
        try {
            return await fn();
        }
        catch (error) {
            // Asegurar que el error se propague con el contexto
            const span = api_1.trace.getActiveSpan();
            if (span && error instanceof Error) {
                span.recordException(error);
            }
            throw error;
        }
    });
}
// Utilidad para crear headers con contexto de tracing
function createTracingHeaders() {
    const headers = {};
    // Inyectar contexto actual
    api_1.propagation.inject(api_1.context.active(), headers);
    // Agregar trace ID explícito
    const span = api_1.trace.getActiveSpan();
    if (span) {
        const spanContext = span.spanContext();
        headers[exports.TRACE_HEADERS.TRACE_ID] = spanContext.traceId;
        headers[exports.TRACE_HEADERS.SPAN_ID] = spanContext.spanId;
    }
    return headers;
}
// Middleware para manejar errores con contexto de tracing
function errorHandlingMiddleware(logger) {
    return (err, req, res, next) => {
        const span = api_1.trace.getActiveSpan();
        // Registrar el error en el span
        if (span) {
            span.recordException(err);
            span.setStatus({
                code: api_1.trace.SpanStatusCode.ERROR,
                message: err.message,
            });
        }
        // Log estructurado del error
        const errorLogger = req.log || logger;
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
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
            error: {
                message: err.message,
                code: err.code || 'INTERNAL_ERROR',
                traceId: req.traceId,
            },
        });
    };
}
//# sourceMappingURL=middleware.js.map