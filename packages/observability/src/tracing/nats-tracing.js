"use strict";
/**
 * NATS integration for distributed tracing
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracedNatsClient = void 0;
exports.createTracedPublisher = createTracedPublisher;
exports.createTracedSubscriber = createTracedSubscriber;
exports.createTracedRequest = createTracedRequest;
var api_1 = require("@opentelemetry/api");
var uuid_1 = require("uuid");
/**
 * Wrap NATS publish with tracing
 */
function createTracedPublisher(config) {
    var serviceName = config.serviceName, logger = config.logger;
    var tracer = api_1.trace.getTracer(serviceName);
    return function publishWithTracing(subject, data, options) {
        return __awaiter(this, void 0, void 0, function () {
            var span, spanContext, tracedMessage;
            return __generator(this, function (_a) {
                span = tracer.startSpan("NATS Publish: ".concat(subject), {
                    kind: api_1.SpanKind.PRODUCER,
                    attributes: {
                        'messaging.system': 'nats',
                        'messaging.destination': subject,
                        'messaging.operation': 'publish',
                        'messaging.message.payload_size_bytes': JSON.stringify(data).length,
                    },
                });
                spanContext = span.spanContext();
                tracedMessage = {
                    data: data,
                    headers: __assign({ traceId: spanContext.traceId, spanId: spanContext.spanId, timestamp: new Date().toISOString() }, options === null || options === void 0 ? void 0 : options.headers),
                };
                if (options === null || options === void 0 ? void 0 : options.replyTo) {
                    span.setAttribute('messaging.nats.reply_to', options.replyTo);
                }
                try {
                    // Here you would call the actual NATS publish method
                    // For example: await nc.publish(subject, JSON.stringify(tracedMessage))
                    logger === null || logger === void 0 ? void 0 : logger.info('NATS message published', {
                        traceId: spanContext.traceId,
                        spanId: spanContext.spanId,
                        custom: {
                            subject: subject,
                            payloadSize: JSON.stringify(data).length,
                            replyTo: options === null || options === void 0 ? void 0 : options.replyTo,
                        },
                    });
                    span.setStatus({ code: api_1.SpanStatusCode.OK });
                }
                catch (error) {
                    span.recordException(error);
                    span.setStatus({
                        code: api_1.SpanStatusCode.ERROR,
                        message: error instanceof Error ? error.message : String(error),
                    });
                    logger === null || logger === void 0 ? void 0 : logger.error('NATS publish failed', error, {
                        traceId: spanContext.traceId,
                        spanId: spanContext.spanId,
                        custom: {
                            subject: subject,
                        },
                    });
                    throw error;
                }
                finally {
                    span.end();
                }
                return [2 /*return*/];
            });
        });
    };
}
/**
 * Wrap NATS subscribe with tracing
 */
function createTracedSubscriber(config) {
    var serviceName = config.serviceName, logger = config.logger;
    var tracer = api_1.trace.getTracer(serviceName);
    return function subscribeWithTracing(subject, handler) {
        var _this = this;
        return function (msg) { return __awaiter(_this, void 0, void 0, function () {
            var tracedMessage, span, ctx, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                            // Parse the message if it's a string
                            tracedMessage = typeof msg.data === 'string'
                                ? JSON.parse(msg.data)
                                : msg.data;
                        }
                        catch (e) {
                            // If parsing fails, treat as plain message
                            tracedMessage = {
                                data: msg.data,
                                headers: {
                                    traceId: (0, uuid_1.v4)(),
                                    spanId: (0, uuid_1.v4)(),
                                    timestamp: new Date().toISOString(),
                                },
                            };
                        }
                        span = tracer.startSpan("NATS Consume: ".concat(subject), {
                            kind: api_1.SpanKind.CONSUMER,
                            attributes: {
                                'messaging.system': 'nats',
                                'messaging.destination': subject,
                                'messaging.operation': 'consume',
                                'messaging.message.id': msg.sid || (0, uuid_1.v4)(),
                                'messaging.message.payload_size_bytes': JSON.stringify(tracedMessage.data).length,
                                'trace.parent.id': tracedMessage.headers.traceId,
                                'span.parent.id': tracedMessage.headers.spanId,
                            },
                        });
                        ctx = api_1.trace.setSpan(api_1.context.active(), span);
                        logger === null || logger === void 0 ? void 0 : logger.info('NATS message received', {
                            traceId: tracedMessage.headers.traceId,
                            spanId: span.spanContext().spanId,
                            parentSpanId: tracedMessage.headers.spanId,
                            custom: {
                                subject: subject,
                                messageId: msg.sid,
                                payloadSize: JSON.stringify(tracedMessage.data).length,
                            },
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, api_1.context.with(ctx, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, handler(tracedMessage.data, span)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        span.setStatus({ code: api_1.SpanStatusCode.OK });
                        logger === null || logger === void 0 ? void 0 : logger.info('NATS message processed', {
                            traceId: tracedMessage.headers.traceId,
                            spanId: span.spanContext().spanId,
                            custom: {
                                subject: subject,
                                messageId: msg.sid,
                            },
                        });
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        span.recordException(error_1);
                        span.setStatus({
                            code: api_1.SpanStatusCode.ERROR,
                            message: error_1 instanceof Error ? error_1.message : String(error_1),
                        });
                        logger === null || logger === void 0 ? void 0 : logger.error('NATS message processing failed', error_1, {
                            traceId: tracedMessage.headers.traceId,
                            spanId: span.spanContext().spanId,
                            custom: {
                                subject: subject,
                                messageId: msg.sid,
                            },
                        });
                        throw error_1;
                    case 4:
                        span.end();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
    };
}
/**
 * Wrap NATS request-reply with tracing
 */
function createTracedRequest(config) {
    var serviceName = config.serviceName, logger = config.logger;
    var tracer = api_1.trace.getTracer(serviceName);
    return function requestWithTracing(subject, data, options) {
        return __awaiter(this, void 0, void 0, function () {
            var span, spanContext, tracedMessage, startTime, duration, duration;
            return __generator(this, function (_a) {
                span = tracer.startSpan("NATS Request: ".concat(subject), {
                    kind: api_1.SpanKind.CLIENT,
                    attributes: {
                        'messaging.system': 'nats',
                        'messaging.destination': subject,
                        'messaging.operation': 'request',
                        'messaging.message.payload_size_bytes': JSON.stringify(data).length,
                    },
                });
                spanContext = span.spanContext();
                tracedMessage = {
                    data: data,
                    headers: __assign({ traceId: spanContext.traceId, spanId: spanContext.spanId, timestamp: new Date().toISOString() }, options === null || options === void 0 ? void 0 : options.headers),
                };
                if (options === null || options === void 0 ? void 0 : options.timeout) {
                    span.setAttribute('messaging.nats.timeout_ms', options.timeout);
                }
                startTime = Date.now();
                try {
                    duration = Date.now() - startTime;
                    span.setAttribute('messaging.duration_ms', duration);
                    logger === null || logger === void 0 ? void 0 : logger.info('NATS request completed', {
                        traceId: spanContext.traceId,
                        spanId: spanContext.spanId,
                        custom: {
                            subject: subject,
                            duration: duration,
                            payloadSize: JSON.stringify(data).length,
                        },
                    });
                    span.setStatus({ code: api_1.SpanStatusCode.OK });
                    // Return the response data
                    // return response.data;
                }
                catch (error) {
                    duration = Date.now() - startTime;
                    span.setAttribute('messaging.duration_ms', duration);
                    span.recordException(error);
                    span.setStatus({
                        code: api_1.SpanStatusCode.ERROR,
                        message: error instanceof Error ? error.message : String(error),
                    });
                    logger === null || logger === void 0 ? void 0 : logger.error('NATS request failed', error, {
                        traceId: spanContext.traceId,
                        spanId: spanContext.spanId,
                        custom: {
                            subject: subject,
                            duration: duration,
                        },
                    });
                    throw error;
                }
                finally {
                    span.end();
                }
                return [2 /*return*/];
            });
        });
    };
}
/**
 * Create a traced NATS client wrapper
 */
var TracedNatsClient = /** @class */ (function () {
    function TracedNatsClient(config) {
        this.config = config;
        this.publish = createTracedPublisher(config);
        this.subscribe = createTracedSubscriber(config);
        this.request = createTracedRequest(config);
    }
    TracedNatsClient.prototype.publishEvent = function (subject, event) {
        return __awaiter(this, void 0, void 0, function () {
            var span, parentContext;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        span = api_1.trace.getActiveSpan();
                        parentContext = span === null || span === void 0 ? void 0 : span.spanContext();
                        return [4 /*yield*/, this.publish(subject, event, {
                                headers: __assign({ 'event.type': event.type, 'event.aggregate_id': event.aggregateId, 'event.timestamp': new Date().toISOString() }, (parentContext ? {
                                    'trace.parent_trace_id': parentContext.traceId,
                                    'trace.parent_span_id': parentContext.spanId,
                                } : {})),
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TracedNatsClient.prototype.subscribeToEvents = function (subject, handler) {
        var _this = this;
        this.subscribe(subject, function (event, span) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Add event-specific attributes to span
                        if (event.type) {
                            span.setAttribute('event.type', event.type);
                        }
                        if (event.aggregateId) {
                            span.setAttribute('event.aggregate_id', event.aggregateId);
                        }
                        return [4 /*yield*/, handler(event, span)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    TracedNatsClient.prototype.sendCommand = function (subject, command, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var span, parentContext;
            return __generator(this, function (_a) {
                span = api_1.trace.getActiveSpan();
                parentContext = span === null || span === void 0 ? void 0 : span.spanContext();
                return [2 /*return*/, this.request(subject, command, {
                        timeout: timeout,
                        headers: __assign({ 'command.type': command.type, 'command.aggregate_id': command.aggregateId, 'command.timestamp': new Date().toISOString() }, (parentContext ? {
                            'trace.parent_trace_id': parentContext.traceId,
                            'trace.parent_span_id': parentContext.spanId,
                        } : {})),
                    })];
            });
        });
    };
    return TracedNatsClient;
}());
exports.TracedNatsClient = TracedNatsClient;
