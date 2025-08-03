"use strict";
/**
 * Pino logger implementation for A4CO observability
 */
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
exports.PinoLoggerAdapter = void 0;
exports.createLogger = createLogger;
var pino_1 = require("pino");
var PinoLoggerAdapter = /** @class */ (function () {
    function PinoLoggerAdapter(config) {
        var _a = config.level, level = _a === void 0 ? 'info' : _a, _b = config.pretty, pretty = _b === void 0 ? false : _b, service = config.service, environment = config.environment, version = config.version, _c = config.customSerializers, customSerializers = _c === void 0 ? {} : _c, destination = config.destination, _d = config.redact, redact = _d === void 0 ? [] : _d;
        this.baseContext = {
            service: service,
            environment: environment,
            version: version,
        };
        var transport = pretty
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
            level: level,
            transport: transport,
            base: this.baseContext,
            serializers: __assign(__assign(__assign({}, pino_1.default.stdSerializers), customSerializers), { ddd: function (value) { return value; }, http: function (value) { return value; }, error: pino_1.default.stdSerializers.err }),
            redact: redact,
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
            formatters: {
                level: function (label) { return ({ level: label }); },
            },
        }, destination ? pino_1.default.destination(destination) : undefined);
    }
    PinoLoggerAdapter.prototype.mergeContext = function (context) {
        return __assign(__assign(__assign({}, this.baseContext), context), { timestamp: new Date().toISOString() });
    };
    PinoLoggerAdapter.prototype.trace = function (message, context) {
        this.logger.trace(this.mergeContext(context), message);
    };
    PinoLoggerAdapter.prototype.debug = function (message, context) {
        this.logger.debug(this.mergeContext(context), message);
    };
    PinoLoggerAdapter.prototype.info = function (message, context) {
        this.logger.info(this.mergeContext(context), message);
    };
    PinoLoggerAdapter.prototype.warn = function (message, context) {
        this.logger.warn(this.mergeContext(context), message);
    };
    PinoLoggerAdapter.prototype.error = function (message, error, context) {
        var errorContext = error instanceof Error
            ? {
                error: {
                    message: error.message,
                    stackTrace: error.stack,
                    name: error.name,
                },
            }
            : error
                ? { error: error }
                : {};
        this.logger.error(__assign(__assign({}, this.mergeContext(context)), errorContext), message);
    };
    PinoLoggerAdapter.prototype.fatal = function (message, error, context) {
        var errorContext = error instanceof Error
            ? {
                error: {
                    message: error.message,
                    stackTrace: error.stack,
                    name: error.name,
                },
            }
            : error
                ? { error: error }
                : {};
        this.logger.fatal(__assign(__assign({}, this.mergeContext(context)), errorContext), message);
    };
    PinoLoggerAdapter.prototype.child = function (context) {
        var childLogger = Object.create(this);
        childLogger.logger = this.logger.child(context);
        childLogger.baseContext = __assign(__assign({}, this.baseContext), context);
        return childLogger;
    };
    return PinoLoggerAdapter;
}());
exports.PinoLoggerAdapter = PinoLoggerAdapter;
/**
 * Factory function to create a logger instance
 */
function createLogger(config) {
    return new PinoLoggerAdapter(config);
}
