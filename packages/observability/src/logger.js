"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredLogger = void 0;
exports.createLogger = createLogger;
exports.createHttpLogger = createHttpLogger;
exports.initializeLogger = initializeLogger;
exports.getLogger = getLogger;
const api_1 = require("@opentelemetry/api");
const pino_1 = __importDefault(require("pino"));
const pino_http_1 = __importDefault(require("pino-http"));
function getTraceId() {
    const span = api_1.trace.getActiveSpan();
    if (span) {
        const spanContext = span.spanContext();
        return spanContext.traceId;
    }
    return undefined;
}
function getSpanId() {
    const span = api_1.trace.getActiveSpan();
    if (span) {
        const spanContext = span.spanContext();
        return spanContext.spanId;
    }
    return undefined;
}
function createLogger(config) {
    const isProduction = config.environment === 'production';
    const pinoConfig = {
        name: config.serviceName,
        level: config.level || (isProduction ? 'info' : 'debug'),
        formatters: {
            level: (label) => ({ level: label }),
            bindings: (bindings) => ({
                service: bindings['name'] || config.serviceName,
                pid: bindings['pid'],
                hostname: bindings['hostname'],
                environment: config.environment,
            }),
        },
        mixin() {
            const traceId = getTraceId();
            const spanId = getSpanId();
            const contextData = {};
            if (traceId) {
                contextData['traceId'] = traceId;
            }
            if (spanId) {
                contextData['spanId'] = spanId;
            }
            const baggage = api_1.context.active().getValue(Symbol.for('baggage'));
            if (baggage) {
                contextData['baggage'] = baggage;
            }
            return contextData;
        },
        timestamp: pino_1.default.stdTimeFunctions.isoTime,
        serializers: {
            req: pino_1.default.stdSerializers.req,
            res: pino_1.default.stdSerializers.res,
            err: pino_1.default.stdSerializers.err,
            error: (err) => {
                if (!err || typeof err !== 'object' || !('stack' in err)) {
                    return err;
                }
                const error = err;
                const { message, stack, ...errorProps } = error;
                return {
                    type: error.constructor.name,
                    message,
                    stack,
                    code: 'code' in error ? error['code'] : undefined,
                    statusCode: 'statusCode' in error ? error['statusCode'] : undefined,
                    ...errorProps,
                };
            },
        },
    };
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
function createHttpLogger(logger) {
    if (logger) {
        return (0, pino_http_1.default)({
            logger,
            genReqId: (req) => {
                const traceId = getTraceId();
                return traceId || req.id || req.headers?.['x-request-id'];
            },
            customLogLevel: (res, err) => {
                const statusCode = res.statusCode;
                if (statusCode >= 400 && statusCode < 500) {
                    return 'warn';
                }
                else if (statusCode >= 500 || err) {
                    return 'error';
                }
                return 'info';
            },
            customProps: (req, res) => {
                return {
                    traceId: getTraceId(),
                    spanId: getSpanId(),
                    method: req.method,
                    url: req.url,
                    statusCode: res.statusCode,
                    duration: Date.now() - req.startTime,
                    userAgent: req.headers?.['user-agent'],
                    ip: req.ip || req.connection?.remoteAddress,
                };
            },
            autoLogging: {
                ignore: (req) => {
                    return req.url === '/health' || req.url === '/metrics';
                },
            },
        });
    }
    else {
        return (0, pino_http_1.default)();
    }
}
class StructuredLogger {
    constructor(logger) {
        this.defaultContext = {};
        this.logger = logger;
    }
    logWithContext(level, messageOrContext, context) {
        let message;
        let finalContext;
        if (typeof messageOrContext === 'string') {
            message = messageOrContext;
            finalContext = context || {};
        }
        else {
            message = '';
            finalContext = messageOrContext;
        }
        const span = api_1.trace.getActiveSpan();
        if (span) {
            Object.entries(finalContext).forEach(([key, value]) => {
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    span.setAttribute(key, value);
                }
                else {
                    span.setAttribute(key, String(value));
                }
            });
        }
        this.logger[level](finalContext, message || undefined);
    }
    info(message, context) {
        this.logWithContext('info', message, context || {});
    }
    error(message, errorOrContext, context) {
        if (errorOrContext instanceof Error) {
            this.logWithContext('error', message, {
                ...(context || {}),
                error: {
                    message: errorOrContext.message,
                    stack: errorOrContext.stack,
                    name: errorOrContext.name,
                },
            });
        }
        else {
            this.logWithContext('error', message, errorOrContext || {});
        }
    }
    warn(message, context) {
        this.logWithContext('warn', message, context || {});
    }
    debug(message, context) {
        this.logWithContext('debug', message, context || {});
    }
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
    fatal(message, context) {
        this.logWithContext('fatal', message, context || {});
    }
    withContext(context) {
        const enhancedLogger = Object.create(this);
        enhancedLogger.defaultContext = { ...this.defaultContext, ...context };
        return enhancedLogger;
    }
    startSpan(name, attributes) {
        return undefined;
    }
    withDDD(metadata) {
        return this.withContext({
            aggregate: metadata.aggregateName,
            aggregateId: metadata.aggregateId,
            command: metadata.commandName,
            event: metadata.eventName,
        });
    }
}
exports.StructuredLogger = StructuredLogger;
let globalLogger = null;
function initializeLogger(config) {
    const pinoLogger = createLogger(config);
    globalLogger = new StructuredLogger(pinoLogger);
    return globalLogger;
}
function getLogger() {
    if (!globalLogger) {
        const defaultConfig = {
            serviceName: 'default-service',
            environment: process.env['NODE_ENV'] || 'development',
        };
        const pinoLogger = createLogger(defaultConfig);
        globalLogger = new StructuredLogger(pinoLogger);
    }
    return globalLogger;
}
//# sourceMappingURL=logger.js.map