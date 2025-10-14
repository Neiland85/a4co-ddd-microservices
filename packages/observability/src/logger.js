"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredLogger = void 0;
exports.createLogger = createLogger;
exports.createHttpLogger = createHttpLogger;
const pino_1 = __importDefault(require("pino"));
const api_1 = require("@opentelemetry/api");
// Función para obtener el trace ID actual
function getTraceId() {
    const span = api_1.trace.getActiveSpan();
    if (span) {
        const spanContext = span.spanContext();
        return spanContext.traceId;
    }
    return undefined;
}
// Función para obtener el span ID actual
function getSpanId() {
    const span = api_1.trace.getActiveSpan();
    if (span) {
        const spanContext = span.spanContext();
        return spanContext.spanId;
    }
    return undefined;
}
// Crear logger con configuración estructurada
function createLogger(config) {
    const isProduction = config.environment === 'production';
    const pinoConfig = {
        name: config.serviceName,
        level: config.level || (isProduction ? 'info' : 'debug'),
        // Formateo estructurado en JSON
        formatters: {
            level: label => ({ level: label }),
            bindings: bindings => ({
                service: bindings.name || config.serviceName,
                pid: bindings.pid,
                hostname: bindings.hostname,
                environment: config.environment,
            }),
        },
        // Agregar información de contexto a cada log
        mixin() {
            const traceId = getTraceId();
            const spanId = getSpanId();
            const contextData = {};
            if (traceId) {
                contextData.traceId = traceId;
            }
            if (spanId) {
                contextData.spanId = spanId;
            }
            // Agregar contexto adicional si está disponible
            const baggage = api_1.context.active().getValue(Symbol.for('baggage'));
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
            error: (err) => {
                if (!err || !err.stack) {
                    return err;
                }
                return {
                    type: err.constructor.name,
                    message: err.message,
                    stack: err.stack,
                    code: err.code,
                    statusCode: err.statusCode,
                    ...err,
                };
            },
        },
    };
    // En desarrollo, usar pino-pretty para logs más legibles
    if (!isProduction && config.prettyPrint !== false) {
        return (0, pino_1.default)({
            ...pinoConfig,
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    singleLine: false,
                    errorProps: 'type,message,stack,code,statusCode',
                },
            },
        });
    }
    return (0, pino_1.default)(pinoConfig);
}
// Logger middleware para HTTP requests
function createHttpLogger(logger) {
    const pinoHttp = require('pino-http');
    return pinoHttp({
        logger,
        // Personalizar la generación de request ID
        genReqId: (req) => {
            // Usar trace ID si está disponible
            const traceId = getTraceId();
            return traceId || req.id || req.headers['x-request-id'];
        },
        // Personalizar el log de request
        customLogLevel: (res, err) => {
            if (res.statusCode >= 400 && res.statusCode < 500) {
                return 'warn';
            }
            else if (res.statusCode >= 500 || err) {
                return 'error';
            }
            return 'info';
        },
        // Agregar propiedades adicionales al log
        customProps: (req, res) => {
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
            ignore: (req) => {
                // Ignorar health checks
                return req.url === '/health' || req.url === '/metrics';
            },
        },
    });
}
// Utilidades para logging estructurado
class StructuredLogger {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    // Log con contexto adicional
    logWithContext(level, message, context) {
        const span = api_1.trace.getActiveSpan();
        if (span) {
            // Agregar atributos al span actual
            Object.entries(context).forEach(([key, value]) => {
                span.setAttribute(key, value);
            });
        }
        this.logger[level]({
            ...context,
            msg: message,
        });
    }
    // Métodos convenientes
    info(message, context) {
        this.logWithContext('info', message, context || {});
    }
    error(message, error, context) {
        this.logWithContext('error', message, {
            ...(context || {}),
            error: error
                ? {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                }
                : undefined,
        });
    }
    warn(message, context) {
        this.logWithContext('warn', message, context || {});
    }
    debug(message, context) {
        this.logWithContext('debug', message, context || {});
    }
    // Log de métricas de negocio
    metric(name, value, tags) {
        this.logger.info({
            type: 'metric',
            metric: {
                name,
                value,
                tags: tags || {},
                timestamp: new Date().toISOString(),
            },
        });
    }
    // Log de eventos de auditoría
    audit(action, userId, resource, details) {
        this.logger.info({
            type: 'audit',
            audit: {
                action,
                userId,
                resource,
                timestamp: new Date().toISOString(),
                ...details,
            },
        });
    }
}
exports.StructuredLogger = StructuredLogger;
//# sourceMappingURL=logger.js.map