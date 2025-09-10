"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pino = void 0;
exports.createLogger = createLogger;
exports.initializeLogger = initializeLogger;
exports.getLogger = getLogger;
exports.createChildLogger = createChildLogger;
exports.createHttpLogger = createHttpLogger;
const pino_1 = __importDefault(require("pino"));
exports.pino = pino_1.default;
const uuid_1 = require("uuid");
const api_1 = require("@opentelemetry/api");
// Global logger instance
let globalLogger = null;
// Custom serializers for common objects
const defaultSerializers = {
    req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        headers: {
            'user-agent': req.headers?.['user-agent'],
            'x-trace-id': req.headers?.['x-trace-id'],
            'x-correlation-id': req.headers?.['x-correlation-id'],
        },
    }),
    res: (res) => ({
        statusCode: res.statusCode,
        headers: res.getHeaders?.(),
    }),
    err: pino_1.default.stdSerializers.err,
    error: pino_1.default.stdSerializers.err,
    ddd: (metadata) => ({
        aggregate: metadata.aggregateName
            ? {
                id: metadata.aggregateId,
                name: metadata.aggregateName,
            }
            : undefined,
        command: metadata.commandName,
        event: metadata.eventName
            ? {
                name: metadata.eventName,
                version: metadata.eventVersion,
            }
            : undefined,
        correlationId: metadata.correlationId,
        causationId: metadata.causationId,
    }),
};
// Create enhanced logger with context support
function createEnhancedLogger(baseLogger) {
    const enhancedLogger = Object.create(baseLogger);
    enhancedLogger.withContext = function (ctx) {
        return createEnhancedLogger(baseLogger.child(ctx));
    };
    enhancedLogger.withDDD = function (metadata) {
        return createEnhancedLogger(baseLogger.child({ ddd: metadata }));
    };
    enhancedLogger.startSpan = function (name, attributes) {
        const tracer = api_1.trace.getTracer('@a4co/observability');
        const span = tracer.startSpan(name, { attributes });
        // Log span start
        this.debug({ spanId: span.spanContext().spanId, spanName: name }, 'Span started');
        return span;
    };
    // Ensure all original methods are available
    Object.setPrototypeOf(enhancedLogger, baseLogger);
    return enhancedLogger;
}
// Create logger with configuration
function createLogger(config) {
    const options = {
        name: config.serviceName,
        level: config.level || 'info',
        serializers: {
            ...defaultSerializers,
            ...config.serializers,
        },
        base: {
            service: config.serviceName,
            version: config.serviceVersion,
            env: config.environment,
            pid: process.pid,
            hostname: process.env.HOSTNAME || require('os').hostname(),
        },
        timestamp: pino_1.default.stdTimeFunctions.isoTime,
        formatters: {
            level: label => ({ level: label }),
            log: object => {
                // Add OpenTelemetry context if available
                const span = api_1.trace.getActiveSpan();
                if (span) {
                    const spanContext = span.spanContext();
                    object.traceId = spanContext.traceId;
                    object.spanId = spanContext.spanId;
                }
                return object;
            },
        },
        redact: config.redact || ['password', 'token', 'apiKey', 'secret'],
    };
    // Add pretty print for development
    if (config.prettyPrint && process.env.NODE_ENV === 'development') {
        options.transport = {
            target: 'pino-pretty',
            options: {
                colorize: true,
                levelFirst: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                ignore: 'pid,hostname',
            },
        };
    }
    const baseLogger = (0, pino_1.default)(options);
    return createEnhancedLogger(baseLogger);
}
// Initialize global logger
function initializeLogger(config) {
    globalLogger = createLogger(config);
    return globalLogger;
}
// Get global logger instance
function getLogger() {
    if (!globalLogger) {
        throw new Error('Logger not initialized. Call initializeLogger() first.');
    }
    return globalLogger;
}
// Create child logger with context
function createChildLogger(context) {
    return getLogger().withContext(context);
}
// Create HTTP logger middleware
function createHttpLogger(logger) {
    const log = logger || getLogger();
    return (req, res, next) => {
        const requestId = req.headers['x-request-id'] || (0, uuid_1.v4)();
        const traceId = req.headers['x-trace-id'] || (0, uuid_1.v4)();
        const correlationId = req.headers['x-correlation-id'] || requestId;
        // Add to request object
        req.id = requestId;
        req.traceId = traceId;
        req.correlationId = correlationId;
        // Create child logger with request context
        req.log = log.withContext({
            requestId,
            traceId,
            correlationId,
            method: req.method,
            url: req.url,
        });
        // Log request
        req.log.info({ req }, 'Request received');
        // Log response
        const startTime = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const level = res.statusCode >= 400 ? 'error' : 'info';
            req.log[level]({
                res,
                duration,
                responseSize: res.get?.('content-length'),
            }, 'Request completed');
        });
        next();
    };
}
//# sourceMappingURL=index.js.map