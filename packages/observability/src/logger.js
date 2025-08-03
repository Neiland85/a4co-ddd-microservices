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
exports.StructuredLogger = void 0;
exports.createLogger = createLogger;
exports.createHttpLogger = createHttpLogger;
var pino_1 = require("pino");
var api_1 = require("@opentelemetry/api");
// Función para obtener el trace ID actual
function getTraceId() {
    var span = api_1.trace.getActiveSpan();
    if (span) {
        var spanContext = span.spanContext();
        return spanContext.traceId;
    }
    return undefined;
}
// Función para obtener el span ID actual
function getSpanId() {
    var span = api_1.trace.getActiveSpan();
    if (span) {
        var spanContext = span.spanContext();
        return spanContext.spanId;
    }
    return undefined;
}
// Crear logger con configuración estructurada
function createLogger(config) {
    var isProduction = config.environment === 'production';
    var pinoConfig = {
        name: config.serviceName,
        level: config.level || (isProduction ? 'info' : 'debug'),
        // Formateo estructurado en JSON
        formatters: {
            level: function (label) { return ({ level: label }); },
            bindings: function (bindings) { return ({
                service: bindings.name || config.serviceName,
                pid: bindings.pid,
                hostname: bindings.hostname,
                environment: config.environment,
            }); },
        },
        // Agregar información de contexto a cada log
        mixin: function () {
            var traceId = getTraceId();
            var spanId = getSpanId();
            var contextData = {};
            if (traceId) {
                contextData.traceId = traceId;
            }
            if (spanId) {
                contextData.spanId = spanId;
            }
            // Agregar contexto adicional si está disponible
            var baggage = api_1.context.active().getValue(Symbol.for('baggage'));
            if (baggage) {
                contextData.baggage = baggage;
            }
            return contextData;
        },
        // Timestamp en ISO format
        timestamp: pino_1.default.stdTimeFunctions.isoTime,
        // Serializers personalizados
        serializers: {
            req: pino_1.default.stdSerializers.req,
            res: pino_1.default.stdSerializers.res,
            err: pino_1.default.stdSerializers.err,
            // Serializer personalizado para errores con más detalles
            error: function (err) {
                if (!err || !err.stack) {
                    return err;
                }
                return __assign({ type: err.constructor.name, message: err.message, stack: err.stack, code: err.code, statusCode: err.statusCode }, err);
            },
        },
    };
    // En desarrollo, usar pino-pretty para logs más legibles
    if (!isProduction && config.prettyPrint !== false) {
        return (0, pino_1.default)(__assign(__assign({}, pinoConfig), { transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    singleLine: false,
                    errorProps: 'type,message,stack,code,statusCode',
                },
            } }));
    }
    return (0, pino_1.default)(pinoConfig);
}
// Logger middleware para HTTP requests
function createHttpLogger(logger) {
    var pinoHttp = require('pino-http');
    return pinoHttp({
        logger: logger,
        // Personalizar la generación de request ID
        genReqId: function (req) {
            // Usar trace ID si está disponible
            var traceId = getTraceId();
            return traceId || req.id || req.headers['x-request-id'];
        },
        // Personalizar el log de request
        customLogLevel: function (res, err) {
            if (res.statusCode >= 400 && res.statusCode < 500) {
                return 'warn';
            }
            else if (res.statusCode >= 500 || err) {
                return 'error';
            }
            return 'info';
        },
        // Agregar propiedades adicionales al log
        customProps: function (req, res) {
            return {
                traceId: getTraceId(),
                spanId: getSpanId(),
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                duration: Date.now() - req.startTime,
                userAgent: req.headers['user-agent'],
                ip: req.ip || req.connection.remoteAddress,
            };
        },
        // Configurar qué loguear
        autoLogging: {
            ignore: function (req) {
                // Ignorar health checks
                return req.url === '/health' || req.url === '/metrics';
            },
        },
    });
}
// Utilidades para logging estructurado
var StructuredLogger = /** @class */ (function () {
    function StructuredLogger(logger) {
        this.logger = logger;
    }
    // Log con contexto adicional
    StructuredLogger.prototype.logWithContext = function (level, message, context) {
        var span = api_1.trace.getActiveSpan();
        if (span) {
            // Agregar atributos al span actual
            Object.entries(context).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                span.setAttribute(key, value);
            });
        }
        this.logger[level](__assign(__assign({}, context), { msg: message }));
    };
    // Métodos convenientes
    StructuredLogger.prototype.info = function (message, context) {
        this.logWithContext('info', message, context || {});
    };
    StructuredLogger.prototype.error = function (message, error, context) {
        this.logWithContext('error', message, __assign(__assign({}, (context || {})), { error: error ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
            } : undefined }));
    };
    StructuredLogger.prototype.warn = function (message, context) {
        this.logWithContext('warn', message, context || {});
    };
    StructuredLogger.prototype.debug = function (message, context) {
        this.logWithContext('debug', message, context || {});
    };
    // Log de métricas de negocio
    StructuredLogger.prototype.metric = function (name, value, tags) {
        this.logger.info({
            type: 'metric',
            metric: {
                name: name,
                value: value,
                tags: tags || {},
                timestamp: new Date().toISOString(),
            },
        });
    };
    // Log de eventos de auditoría
    StructuredLogger.prototype.audit = function (action, userId, resource, details) {
        this.logger.info({
            type: 'audit',
            audit: __assign({ action: action, userId: userId, resource: resource, timestamp: new Date().toISOString() }, details),
        });
    };
    return StructuredLogger;
}());
exports.StructuredLogger = StructuredLogger;
