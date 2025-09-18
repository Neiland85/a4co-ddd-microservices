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
exports.createLogger = createLogger;
exports.createHttpLogger = createHttpLogger;
exports.getGlobalLogger = getGlobalLogger;
exports.initializeLogger = initializeLogger;
var pino_1 = require("pino");
var pino_http_1 = require("pino-http");
var api_1 = require("@opentelemetry/api");
// Helper para obtener el trace ID actual
function getCurrentTraceId() {
    var span = api_1.trace.getActiveSpan();
    if (span) {
        var spanContext = span.spanContext();
        return spanContext.traceId;
    }
    return undefined;
}
// Helper para obtener el span ID actual
function getCurrentSpanId() {
    var span = api_1.trace.getActiveSpan();
    if (span) {
        var spanContext = span.spanContext();
        return spanContext.spanId;
    }
    return undefined;
}
// Crear logger base con configuración estructurada
function createLogger(config) {
    var isProduction = config.environment === 'production';
    var isDevelopment = config.environment === 'development' || !config.environment;
    var pinoOptions = {
        name: config.serviceName,
        level: config.level || (isProduction ? 'info' : 'debug'),
        formatters: {
            level: function (label) { return ({ level: label }); },
            bindings: function (bindings) { return ({
                pid: bindings.pid,
                host: bindings.hostname,
                service: config.serviceName,
                version: config.serviceVersion || '1.0.0',
                environment: config.environment || 'development',
            }); },
        },
        // Agregar trace context a cada log
        mixin: function () {
            return {
                traceId: getCurrentTraceId(),
                spanId: getCurrentSpanId(),
            };
        },
        timestamp: pino_1.default.stdTimeFunctions.isoTime,
        serializers: {
            req: pino_1.default.stdSerializers.req,
            res: pino_1.default.stdSerializers.res,
            err: pino_1.default.stdSerializers.err,
        },
    };
    // En desarrollo, usar pino-pretty para logs más legibles
    if (isDevelopment && config.prettyPrint !== false) {
        return (0, pino_1.default)(__assign(__assign({}, pinoOptions), { transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    singleLine: false,
                },
            } }));
    }
    return (0, pino_1.default)(pinoOptions);
}
// Crear HTTP logger middleware
function createHttpLogger(logger) {
    return (0, pino_http_1.default)({
        logger: logger,
        genReqId: function (req) {
            // Usar trace ID si está disponible
            var traceId = getCurrentTraceId();
            return traceId || req.id || req.headers['x-request-id'];
        },
        customLogLevel: function (req, res, err) {
            if (res.statusCode >= 400 && res.statusCode < 500) {
                return 'warn';
            }
            else if (res.statusCode >= 500 || err) {
                return 'error';
            }
            else if (res.statusCode >= 300 && res.statusCode < 400) {
                return 'silent';
            }
            return 'info';
        },
        customSuccessMessage: function (req, res) {
            if (res.statusCode === 404) {
                return "".concat(req.method, " ").concat(req.url, " - Not Found");
            }
            return "".concat(req.method, " ").concat(req.url);
        },
        customErrorMessage: function (req, res, err) {
            return "".concat(req.method, " ").concat(req.url, " - ").concat(err.message);
        },
        customAttributeKeys: {
            req: 'request',
            res: 'response',
            err: 'error',
            responseTime: 'duration',
        },
        customProps: function (req, res) { return ({
            traceId: getCurrentTraceId(),
            spanId: getCurrentSpanId(),
        }); },
        // Ignorar rutas de health check y metrics
        autoLogging: {
            ignore: function (req) {
                return req.url === '/health' || req.url === '/metrics' || req.url === '/ready';
            },
        },
    });
}
// Logger singleton para uso global
var globalLogger = null;
function getGlobalLogger() {
    if (!globalLogger) {
        throw new Error('Logger not initialized. Call initializeLogger first.');
    }
    return globalLogger;
}
function initializeLogger(config) {
    globalLogger = createLogger(config);
    return globalLogger;
}
