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
exports.pino = void 0;
exports.createLogger = createLogger;
exports.initializeLogger = initializeLogger;
exports.getLogger = getLogger;
exports.createChildLogger = createChildLogger;
exports.createHttpLogger = createHttpLogger;
var pino_1 = require("pino");
exports.pino = pino_1.default;
var uuid_1 = require("uuid");
var api_1 = require("@opentelemetry/api");
// Global logger instance
var globalLogger = null;
// Custom serializers for common objects
var defaultSerializers = {
    req: function (req) {
        var _a, _b, _c;
        return ({
            id: req.id,
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            headers: {
                'user-agent': (_a = req.headers) === null || _a === void 0 ? void 0 : _a['user-agent'],
                'x-trace-id': (_b = req.headers) === null || _b === void 0 ? void 0 : _b['x-trace-id'],
                'x-correlation-id': (_c = req.headers) === null || _c === void 0 ? void 0 : _c['x-correlation-id'],
            },
        });
    },
    res: function (res) {
        var _a;
        return ({
            statusCode: res.statusCode,
            headers: (_a = res.getHeaders) === null || _a === void 0 ? void 0 : _a.call(res),
        });
    },
    err: pino_1.default.stdSerializers.err,
    error: pino_1.default.stdSerializers.err,
    ddd: function (metadata) { return ({
        aggregate: metadata.aggregateName ? {
            id: metadata.aggregateId,
            name: metadata.aggregateName,
        } : undefined,
        command: metadata.commandName,
        event: metadata.eventName ? {
            name: metadata.eventName,
            version: metadata.eventVersion,
        } : undefined,
        correlationId: metadata.correlationId,
        causationId: metadata.causationId,
    }); },
};
// Create enhanced logger with context support
function createEnhancedLogger(baseLogger) {
    var enhancedLogger = Object.create(baseLogger);
    enhancedLogger.withContext = function (ctx) {
        return createEnhancedLogger(baseLogger.child(ctx));
    };
    enhancedLogger.withDDD = function (metadata) {
        return createEnhancedLogger(baseLogger.child({ ddd: metadata }));
    };
    enhancedLogger.startSpan = function (name, attributes) {
        var tracer = api_1.trace.getTracer('@a4co/observability');
        var span = tracer.startSpan(name, { attributes: attributes });
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
    var options = {
        name: config.serviceName,
        level: config.level || 'info',
        serializers: __assign(__assign({}, defaultSerializers), config.serializers),
        base: {
            service: config.serviceName,
            version: config.serviceVersion,
            env: config.environment,
            pid: process.pid,
            hostname: process.env.HOSTNAME || require('os').hostname(),
        },
        timestamp: pino_1.default.stdTimeFunctions.isoTime,
        formatters: {
            level: function (label) { return ({ level: label }); },
            log: function (object) {
                // Add OpenTelemetry context if available
                var span = api_1.trace.getActiveSpan();
                if (span) {
                    var spanContext = span.spanContext();
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
    var baseLogger = (0, pino_1.default)(options);
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
    var log = logger || getLogger();
    return function (req, res, next) {
        var requestId = req.headers['x-request-id'] || (0, uuid_1.v4)();
        var traceId = req.headers['x-trace-id'] || (0, uuid_1.v4)();
        var correlationId = req.headers['x-correlation-id'] || requestId;
        // Add to request object
        req.id = requestId;
        req.traceId = traceId;
        req.correlationId = correlationId;
        // Create child logger with request context
        req.log = log.withContext({
            requestId: requestId,
            traceId: traceId,
            correlationId: correlationId,
            method: req.method,
            url: req.url,
        });
        // Log request
        req.log.info({ req: req }, 'Request received');
        // Log response
        var startTime = Date.now();
        res.on('finish', function () {
            var _a;
            var duration = Date.now() - startTime;
            var level = res.statusCode >= 400 ? 'error' : 'info';
            req.log[level]({
                res: res,
                duration: duration,
                responseSize: (_a = res.get) === null || _a === void 0 ? void 0 : _a.call(res, 'content-length'),
            }, 'Request completed');
        });
        next();
    };
}
