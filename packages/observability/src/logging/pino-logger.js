"use strict";
/**
 * Pino logger implementation for A4CO observability
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinoLoggerAdapter = void 0;
exports.createLogger = createLogger;
const pino_1 = __importDefault(require("pino"));
class PinoLoggerAdapter {
    logger;
    baseContext;
    constructor(config) {
        const { level = 'info', pretty = false, service, environment, version, customSerializers = {}, destination, redact = [], } = config;
        this.baseContext = {
            service,
            environment,
            version,
        };
        const transport = pretty
            ? {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                },
            }
            : undefined;
        this.logger = (0, pino_1.default)({
            level,
            transport,
            base: this.baseContext,
            serializers: {
                ...pino_1.default.stdSerializers,
                ...customSerializers,
                ddd: value => value,
                http: value => value,
                error: pino_1.default.stdSerializers.err,
            },
            redact,
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
            formatters: {
                level: label => ({ level: label }),
            },
        }, destination ? pino_1.default.destination(destination) : undefined);
    }
    mergeContext(context) {
        return {
            ...this.baseContext,
            ...context,
            timestamp: new Date().toISOString(),
        };
    }
    trace(message, context) {
        this.logger.trace(this.mergeContext(context), message);
    }
    debug(message, context) {
        this.logger.debug(this.mergeContext(context), message);
    }
    info(message, context) {
        this.logger.info(this.mergeContext(context), message);
    }
    warn(message, context) {
        this.logger.warn(this.mergeContext(context), message);
    }
    error(message, error, context) {
        const errorContext = error instanceof Error
            ? {
                error: {
                    message: error.message,
                    stackTrace: error.stack,
                    name: error.name,
                },
            }
            : error
                ? { error }
                : {};
        this.logger.error({
            ...this.mergeContext(context),
            ...errorContext,
        }, message);
    }
    fatal(message, error, context) {
        const errorContext = error instanceof Error
            ? {
                error: {
                    message: error.message,
                    stackTrace: error.stack,
                    name: error.name,
                },
            }
            : error
                ? { error }
                : {};
        this.logger.fatal({
            ...this.mergeContext(context),
            ...errorContext,
        }, message);
    }
    child(context) {
        const childLogger = Object.create(this);
        childLogger.logger = this.logger.child(context);
        childLogger.baseContext = { ...this.baseContext, ...context };
        return childLogger;
    }
}
exports.PinoLoggerAdapter = PinoLoggerAdapter;
/**
 * Factory function to create a logger instance
 */
function createLogger(config) {
    return new PinoLoggerAdapter(config);
}
//# sourceMappingURL=pino-logger.js.map