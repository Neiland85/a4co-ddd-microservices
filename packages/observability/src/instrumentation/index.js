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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrumentNatsClient = instrumentNatsClient;
exports.instrumentRedisClient = instrumentRedisClient;
exports.instrumentMongoCollection = instrumentMongoCollection;
exports.instrumentGraphQLResolvers = instrumentGraphQLResolvers;
exports.instrumentKafkaProducer = instrumentKafkaProducer;
exports.instrumentKafkaConsumer = instrumentKafkaConsumer;
var api_1 = require("@opentelemetry/api");
var logger_1 = require("../logger");
var tracer_1 = require("../tracer");
var context_1 = require("../context");
var metrics_1 = require("../metrics");
// NATS instrumentation wrapper
function instrumentNatsClient(natsClient) {
    var logger = (0, logger_1.getLogger)();
    var tracer = api_1.trace.getTracer('@a4co/observability');
    // Wrap publish method
    var originalPublish = natsClient.publish.bind(natsClient);
    natsClient.publish = function (subject, data, options) {
        var span = tracer.startSpan("nats.publish ".concat(subject), {
            kind: api_1.SpanKind.PRODUCER,
            attributes: {
                'messaging.system': 'nats',
                'messaging.destination': subject,
                'messaging.destination_kind': 'topic',
                'messaging.operation': 'publish',
            },
        });
        try {
            // Inject trace context
            var headers = (options === null || options === void 0 ? void 0 : options.headers) || {};
            (0, tracer_1.injectContext)(headers);
            if (options) {
                options.headers = headers;
            }
            else {
                options = { headers: headers };
            }
            // Log publish
            logger.debug({
                subject: subject,
                messageSize: JSON.stringify(data).length,
                traceId: span.spanContext().traceId,
            }, 'Publishing NATS message');
            var result = originalPublish(subject, data, options);
            span.setStatus({ code: api_1.SpanStatusCode.OK });
            // Record metric
            (0, metrics_1.recordEvent)("nats.".concat(subject), 'messaging', 'published');
            return result;
        }
        catch (error) {
            span.recordException(error);
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: error.message
            });
            logger.error({ error: error, subject: subject }, 'Failed to publish NATS message');
            throw error;
        }
        finally {
            span.end();
        }
    };
    // Wrap subscribe method
    var originalSubscribe = natsClient.subscribe.bind(natsClient);
    natsClient.subscribe = function (subject, options, callback) {
        // Handle different parameter combinations
        var cb = typeof options === 'function' ? options : callback;
        var opts = typeof options === 'function' ? {} : options || {};
        var wrappedCallback = function (msg) {
            var _this = this;
            var parentContext = (0, tracer_1.extractContext)(msg.headers || {});
            var span = tracer.startSpan("nats.process ".concat(subject), {
                kind: api_1.SpanKind.CONSUMER,
                attributes: {
                    'messaging.system': 'nats',
                    'messaging.destination': subject,
                    'messaging.destination_kind': 'topic',
                    'messaging.operation': 'process',
                },
            }, parentContext);
            api_1.context.with(api_1.trace.setSpan(api_1.context.active(), span), function () { return __awaiter(_this, void 0, void 0, function () {
                var natsContext, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            natsContext = (0, context_1.createNatsContext)(msg);
                            logger.debug({
                                subject: subject,
                                traceId: span.spanContext().traceId,
                                correlationId: natsContext.correlationId,
                            }, 'Processing NATS message');
                            return [4 /*yield*/, cb(msg)];
                        case 1:
                            result = _a.sent();
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            // Record metric
                            (0, metrics_1.recordEvent)("nats.".concat(subject), 'messaging', 'processed');
                            return [2 /*return*/, result];
                        case 2:
                            error_1 = _a.sent();
                            span.recordException(error_1);
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: error_1.message
                            });
                            logger.error({ error: error_1, subject: subject }, 'Failed to process NATS message');
                            throw error_1;
                        case 3:
                            span.end();
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        };
        return originalSubscribe(subject, opts, wrappedCallback);
    };
    return natsClient;
}
// Redis instrumentation wrapper
function instrumentRedisClient(redisClient) {
    var logger = (0, logger_1.getLogger)();
    var tracer = api_1.trace.getTracer('@a4co/observability');
    // List of Redis commands to instrument
    var commands = ['get', 'set', 'del', 'hget', 'hset', 'hdel', 'sadd', 'srem', 'smembers', 'zadd', 'zrem', 'zrange'];
    commands.forEach(function (command) {
        if (typeof redisClient[command] === 'function') {
            var original_1 = redisClient[command].bind(redisClient);
            redisClient[command] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var span = tracer.startSpan("redis.".concat(command), {
                    kind: api_1.SpanKind.CLIENT,
                    attributes: {
                        'db.system': 'redis',
                        'db.operation': command,
                        'db.statement': "".concat(command, " ").concat(args[0]),
                    },
                });
                var startTime = Date.now();
                return new Promise(function (resolve, reject) {
                    var callback = function (err, result) {
                        var duration = Date.now() - startTime;
                        if (err) {
                            span.recordException(err);
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: err.message
                            });
                            logger.error({
                                error: err,
                                command: command,
                                key: args[0],
                                duration: duration
                            }, 'Redis command failed');
                            reject(err);
                        }
                        else {
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            logger.debug({
                                command: command,
                                key: args[0],
                                duration: duration
                            }, 'Redis command completed');
                            resolve(result);
                        }
                        span.end();
                    };
                    // Add callback to args
                    var argsWithCallback = __spreadArray(__spreadArray([], args, true), [callback], false);
                    original_1.apply(void 0, argsWithCallback);
                });
            };
        }
    });
    return redisClient;
}
// MongoDB instrumentation wrapper
function instrumentMongoCollection(collection) {
    var logger = (0, logger_1.getLogger)();
    var tracer = api_1.trace.getTracer('@a4co/observability');
    // List of MongoDB methods to instrument
    var methods = ['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'aggregate'];
    methods.forEach(function (method) {
        if (typeof collection[method] === 'function') {
            var original_2 = collection[method].bind(collection);
            collection[method] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var span = tracer.startSpan("mongodb.".concat(method), {
                    kind: api_1.SpanKind.CLIENT,
                    attributes: {
                        'db.system': 'mongodb',
                        'db.operation': method,
                        'db.collection': collection.collectionName,
                    },
                });
                logger.debug({
                    method: method,
                    collection: collection.collectionName,
                    query: args[0],
                }, 'MongoDB operation started');
                var startTime = Date.now();
                try {
                    var result = original_2.apply(void 0, args);
                    // Handle cursor operations
                    if (result && typeof result.toArray === 'function') {
                        var originalToArray_1 = result.toArray.bind(result);
                        result.toArray = function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var docs, duration, error_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, 3, 4]);
                                            return [4 /*yield*/, originalToArray_1()];
                                        case 1:
                                            docs = _a.sent();
                                            duration = Date.now() - startTime;
                                            span.setAttributes({
                                                'db.count': docs.length,
                                                'db.duration': duration,
                                            });
                                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                                            logger.debug({
                                                method: method,
                                                collection: collection.collectionName,
                                                count: docs.length,
                                                duration: duration,
                                            }, 'MongoDB operation completed');
                                            return [2 /*return*/, docs];
                                        case 2:
                                            error_2 = _a.sent();
                                            span.recordException(error_2);
                                            span.setStatus({
                                                code: api_1.SpanStatusCode.ERROR,
                                                message: error_2.message
                                            });
                                            throw error_2;
                                        case 3:
                                            span.end();
                                            return [7 /*endfinally*/];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            });
                        };
                        return result;
                    }
                    // Handle promise results
                    if (result && typeof result.then === 'function') {
                        return result
                            .then(function (data) {
                            var duration = Date.now() - startTime;
                            span.setAttributes({
                                'db.duration': duration,
                            });
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            logger.debug({
                                method: method,
                                collection: collection.collectionName,
                                duration: duration,
                            }, 'MongoDB operation completed');
                            span.end();
                            return data;
                        })
                            .catch(function (error) {
                            span.recordException(error);
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: error.message
                            });
                            span.end();
                            throw error;
                        });
                    }
                    return result;
                }
                catch (error) {
                    span.recordException(error);
                    span.setStatus({
                        code: api_1.SpanStatusCode.ERROR,
                        message: error.message
                    });
                    span.end();
                    throw error;
                }
            };
        }
    });
    return collection;
}
// GraphQL instrumentation
function instrumentGraphQLResolvers(resolvers) {
    var logger = (0, logger_1.getLogger)();
    var tracer = api_1.trace.getTracer('@a4co/observability');
    var instrumentResolver = function (resolver, typeName, fieldName) {
        return function (parent, args, context, info) {
            return __awaiter(this, void 0, void 0, function () {
                var span, result, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            span = tracer.startSpan("graphql.".concat(typeName, ".").concat(fieldName), {
                                kind: api_1.SpanKind.INTERNAL,
                                attributes: {
                                    'graphql.type': typeName,
                                    'graphql.field': fieldName,
                                    'graphql.operation': info.operation.operation,
                                    'graphql.operation.name': (_a = info.operation.name) === null || _a === void 0 ? void 0 : _a.value,
                                },
                            });
                            logger.debug({
                                type: typeName,
                                field: fieldName,
                                args: args,
                            }, 'GraphQL resolver started');
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, resolver(parent, args, context, info)];
                        case 2:
                            result = _b.sent();
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            logger.debug({
                                type: typeName,
                                field: fieldName,
                            }, 'GraphQL resolver completed');
                            return [2 /*return*/, result];
                        case 3:
                            error_3 = _b.sent();
                            span.recordException(error_3);
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: error_3.message
                            });
                            logger.error({
                                error: error_3,
                                type: typeName,
                                field: fieldName,
                            }, 'GraphQL resolver failed');
                            throw error_3;
                        case 4:
                            span.end();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
    };
    // Recursively instrument all resolvers
    var instrumentedResolvers = {};
    Object.keys(resolvers).forEach(function (typeName) {
        instrumentedResolvers[typeName] = {};
        Object.keys(resolvers[typeName]).forEach(function (fieldName) {
            var resolver = resolvers[typeName][fieldName];
            if (typeof resolver === 'function') {
                instrumentedResolvers[typeName][fieldName] = instrumentResolver(resolver, typeName, fieldName);
            }
            else if (typeof resolver === 'object' && resolver.resolve) {
                instrumentedResolvers[typeName][fieldName] = __assign(__assign({}, resolver), { resolve: instrumentResolver(resolver.resolve, typeName, fieldName) });
            }
            else {
                instrumentedResolvers[typeName][fieldName] = resolver;
            }
        });
    });
    return instrumentedResolvers;
}
// Kafka instrumentation
function instrumentKafkaProducer(producer) {
    var logger = (0, logger_1.getLogger)();
    var tracer = api_1.trace.getTracer('@a4co/observability');
    var originalSend = producer.send.bind(producer);
    producer.send = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            var span, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        span = tracer.startSpan("kafka.send ".concat(record.topic), {
                            kind: api_1.SpanKind.PRODUCER,
                            attributes: {
                                'messaging.system': 'kafka',
                                'messaging.destination': record.topic,
                                'messaging.destination_kind': 'topic',
                                'messaging.kafka.partition': record.partition,
                            },
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        // Inject trace context into headers
                        if (!record.messages) {
                            record.messages = [];
                        }
                        record.messages = record.messages.map(function (message) {
                            var headers = message.headers || {};
                            (0, tracer_1.injectContext)(headers);
                            return __assign(__assign({}, message), { headers: headers });
                        });
                        logger.debug({
                            topic: record.topic,
                            messageCount: record.messages.length,
                        }, 'Sending Kafka messages');
                        return [4 /*yield*/, originalSend(record)];
                    case 2:
                        result = _a.sent();
                        span.setStatus({ code: api_1.SpanStatusCode.OK });
                        return [2 /*return*/, result];
                    case 3:
                        error_4 = _a.sent();
                        span.recordException(error_4);
                        span.setStatus({
                            code: api_1.SpanStatusCode.ERROR,
                            message: error_4.message
                        });
                        logger.error({ error: error_4, topic: record.topic }, 'Failed to send Kafka messages');
                        throw error_4;
                    case 4:
                        span.end();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return producer;
}
function instrumentKafkaConsumer(consumer) {
    var logger = (0, logger_1.getLogger)();
    var tracer = api_1.trace.getTracer('@a4co/observability');
    var originalRun = consumer.run.bind(consumer);
    consumer.run = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var originalEachMessage;
            return __generator(this, function (_a) {
                originalEachMessage = config.eachMessage;
                config.eachMessage = function (payload) {
                    return __awaiter(this, void 0, void 0, function () {
                        var topic, partition, message, parentContext, span;
                        var _this = this;
                        return __generator(this, function (_a) {
                            topic = payload.topic, partition = payload.partition, message = payload.message;
                            parentContext = (0, tracer_1.extractContext)(message.headers || {});
                            span = tracer.startSpan("kafka.process ".concat(topic), {
                                kind: api_1.SpanKind.CONSUMER,
                                attributes: {
                                    'messaging.system': 'kafka',
                                    'messaging.destination': topic,
                                    'messaging.destination_kind': 'topic',
                                    'messaging.kafka.partition': partition,
                                    'messaging.kafka.offset': message.offset,
                                },
                            }, parentContext);
                            return [2 /*return*/, api_1.context.with(api_1.trace.setSpan(api_1.context.active(), span), function () { return __awaiter(_this, void 0, void 0, function () {
                                    var result, error_5;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, 3, 4]);
                                                logger.debug({
                                                    topic: topic,
                                                    partition: partition,
                                                    offset: message.offset,
                                                }, 'Processing Kafka message');
                                                return [4 /*yield*/, originalEachMessage(payload)];
                                            case 1:
                                                result = _a.sent();
                                                span.setStatus({ code: api_1.SpanStatusCode.OK });
                                                return [2 /*return*/, result];
                                            case 2:
                                                error_5 = _a.sent();
                                                span.recordException(error_5);
                                                span.setStatus({
                                                    code: api_1.SpanStatusCode.ERROR,
                                                    message: error_5.message
                                                });
                                                logger.error({ error: error_5, topic: topic, partition: partition }, 'Failed to process Kafka message');
                                                throw error_5;
                                            case 3:
                                                span.end();
                                                return [7 /*endfinally*/];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        });
                    });
                };
                return [2 /*return*/, originalRun(config)];
            });
        });
    };
    return consumer;
}
