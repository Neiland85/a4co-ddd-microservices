"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = createLogger;
exports.createHttpLogger = createHttpLogger;
exports.getGlobalLogger = getGlobalLogger;
exports.initializeLogger = initializeLogger;
const pino_1 = __importDefault(require("pino"));
const pino_http_1 = __importDefault(require("pino-http"));
const api_1 = require("@opentelemetry/api");
// Helper para obtener el trace ID actual
function getCurrentTraceId() {
    const span = api_1.trace.getActiveSpan();
    if (span) {
        const spanContext = span.spanContext();
        return spanContext.traceId;
    }
    return undefined;
}
// Helper para obtener el span ID actual
function getCurrentSpanId() {
    const span = api_1.trace.getActiveSpan();
    if (span) {
        const spanContext = span.spanContext();
        return spanContext.spanId;
    }
    return undefined;
}
// Crear logger base con configuración estructurada
function createLogger(config) {
    const isProduction = config.environment === 'production';
    const isDevelopment = config.environment === 'development' || !config.environment;
    const pinoOptions = {
        name: config.serviceName,
        level: config.level || (isProduction ? 'info' : 'debug'),
        formatters: {
            level: label => ({ level: label }),
            bindings: bindings => ({
                pid: bindings.pid,
                host: bindings.hostname,
                service: config.serviceName,
                version: config.serviceVersion || '1.0.0',
                environment: config.environment || 'development',
            }),
        },
        // Agregar trace context a cada log
        mixin() {
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
        return (0, pino_1.default)({
            ...pinoOptions,
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    singleLine: false,
                },
            },
        });
    }
    return (0, pino_1.default)(pinoOptions);
}
// Crear HTTP logger middleware
function createHttpLogger(logger) {
    return (0, pino_http_1.default)({
        logger,
        genReqId: req => {
            // Usar trace ID si está disponible
            const traceId = getCurrentTraceId();
            return traceId || req.id || req.headers['x-request-id'];
        },
        customLogLevel: (req, res, err) => {
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
        customSuccessMessage: (req, res) => {
            if (res.statusCode === 404) {
                return `${req.method} ${req.url} - Not Found`;
            }
            return `${req.method} ${req.url}`;
        },
        customErrorMessage: (req, res, err) => {
            return `${req.method} ${req.url} - ${err.message}`;
        },
        customAttributeKeys: {
            req: 'request',
            res: 'response',
            err: 'error',
            responseTime: 'duration',
        },
        customProps: (req, res) => ({
            traceId: getCurrentTraceId(),
            spanId: getCurrentSpanId(),
        }),
        // Ignorar rutas de health check y metrics
        autoLogging: {
            ignore: req => {
                return req.url === '/health' || req.url === '/metrics' || req.url === '/ready';
            },
        },
    });
}
// Logger singleton para uso global
let globalLogger = null;
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
//# sourceMappingURL=logging.js.map