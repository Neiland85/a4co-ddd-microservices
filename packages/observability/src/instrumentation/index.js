"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrumentNatsClient = instrumentNatsClient;
exports.instrumentRedisClient = instrumentRedisClient;
exports.instrumentMongoCollection = instrumentMongoCollection;
exports.instrumentGraphQLResolvers = instrumentGraphQLResolvers;
exports.instrumentKafkaProducer = instrumentKafkaProducer;
exports.instrumentKafkaConsumer = instrumentKafkaConsumer;
const api_1 = require("@opentelemetry/api");
const logger_1 = require("../logger");
const tracer_1 = require("../tracer");
const context_1 = require("../context");
const metrics_1 = require("../metrics");
// NATS instrumentation wrapper
function instrumentNatsClient(natsClient) {
    const logger = (0, logger_1.getLogger)();
    const tracer = api_1.trace.getTracer('@a4co/observability');
    // Wrap publish method
    const originalPublish = natsClient.publish.bind(natsClient);
    natsClient.publish = function (subject, data, options) {
        const span = tracer.startSpan(`nats.publish ${subject}`, {
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
            const headers = options?.headers || {};
            (0, tracer_1.injectContext)(headers);
            if (options) {
                options.headers = headers;
            }
            else {
                options = { headers };
            }
            // Log publish
            logger.debug({
                subject,
                messageSize: JSON.stringify(data).length,
                traceId: span.spanContext().traceId,
            }, 'Publishing NATS message');
            const result = originalPublish(subject, data, options);
            span.setStatus({ code: api_1.SpanStatusCode.OK });
            // Record metric
            (0, metrics_1.recordEvent)(`nats.${subject}`, 'messaging', 'published');
            return result;
        }
        catch (error) {
            span.recordException(error);
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: error.message,
            });
            logger.error({ error, subject }, 'Failed to publish NATS message');
            throw error;
        }
        finally {
            span.end();
        }
    };
    // Wrap subscribe method
    const originalSubscribe = natsClient.subscribe.bind(natsClient);
    natsClient.subscribe = function (subject, options, callback) {
        // Handle different parameter combinations
        const cb = typeof options === 'function' ? options : callback;
        const opts = typeof options === 'function' ? {} : options || {};
        const wrappedCallback = function (msg) {
            const parentContext = (0, tracer_1.extractContext)(msg.headers || {});
            const span = tracer.startSpan(`nats.process ${subject}`, {
                kind: api_1.SpanKind.CONSUMER,
                attributes: {
                    'messaging.system': 'nats',
                    'messaging.destination': subject,
                    'messaging.destination_kind': 'topic',
                    'messaging.operation': 'process',
                },
            }, parentContext);
            api_1.context.with(api_1.trace.setSpan(api_1.context.active(), span), async () => {
                try {
                    // Create context from message
                    const natsContext = (0, context_1.createNatsContext)(msg);
                    logger.debug({
                        subject,
                        traceId: span.spanContext().traceId,
                        correlationId: natsContext.correlationId,
                    }, 'Processing NATS message');
                    // Call original callback
                    const result = await cb(msg);
                    span.setStatus({ code: api_1.SpanStatusCode.OK });
                    // Record metric
                    (0, metrics_1.recordEvent)(`nats.${subject}`, 'messaging', 'processed');
                    return result;
                }
                catch (error) {
                    span.recordException(error);
                    span.setStatus({
                        code: api_1.SpanStatusCode.ERROR,
                        message: error.message,
                    });
                    logger.error({ error, subject }, 'Failed to process NATS message');
                    throw error;
                }
                finally {
                    span.end();
                }
            });
        };
        return originalSubscribe(subject, opts, wrappedCallback);
    };
    return natsClient;
}
// Redis instrumentation wrapper
function instrumentRedisClient(redisClient) {
    const logger = (0, logger_1.getLogger)();
    const tracer = api_1.trace.getTracer('@a4co/observability');
    // List of Redis commands to instrument
    const commands = [
        'get',
        'set',
        'del',
        'hget',
        'hset',
        'hdel',
        'sadd',
        'srem',
        'smembers',
        'zadd',
        'zrem',
        'zrange',
    ];
    commands.forEach(command => {
        if (typeof redisClient[command] === 'function') {
            const original = redisClient[command].bind(redisClient);
            redisClient[command] = function (...args) {
                const span = tracer.startSpan(`redis.${command}`, {
                    kind: api_1.SpanKind.CLIENT,
                    attributes: {
                        'db.system': 'redis',
                        'db.operation': command,
                        'db.statement': `${command} ${args[0]}`,
                    },
                });
                const startTime = Date.now();
                return new Promise((resolve, reject) => {
                    const callback = (err, result) => {
                        const duration = Date.now() - startTime;
                        if (err) {
                            span.recordException(err);
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: err.message,
                            });
                            logger.error({
                                error: err,
                                command,
                                key: args[0],
                                duration,
                            }, 'Redis command failed');
                            reject(err);
                        }
                        else {
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            logger.debug({
                                command,
                                key: args[0],
                                duration,
                            }, 'Redis command completed');
                            resolve(result);
                        }
                        span.end();
                    };
                    // Add callback to args
                    const argsWithCallback = [...args, callback];
                    original(...argsWithCallback);
                });
            };
        }
    });
    return redisClient;
}
// MongoDB instrumentation wrapper
function instrumentMongoCollection(collection) {
    const logger = (0, logger_1.getLogger)();
    const tracer = api_1.trace.getTracer('@a4co/observability');
    // List of MongoDB methods to instrument
    const methods = [
        'find',
        'findOne',
        'insertOne',
        'insertMany',
        'updateOne',
        'updateMany',
        'deleteOne',
        'deleteMany',
        'aggregate',
    ];
    methods.forEach(method => {
        if (typeof collection[method] === 'function') {
            const original = collection[method].bind(collection);
            collection[method] = function (...args) {
                const span = tracer.startSpan(`mongodb.${method}`, {
                    kind: api_1.SpanKind.CLIENT,
                    attributes: {
                        'db.system': 'mongodb',
                        'db.operation': method,
                        'db.collection': collection.collectionName,
                    },
                });
                logger.debug({
                    method,
                    collection: collection.collectionName,
                    query: args[0],
                }, 'MongoDB operation started');
                const startTime = Date.now();
                try {
                    const result = original(...args);
                    // Handle cursor operations
                    if (result && typeof result.toArray === 'function') {
                        const originalToArray = result.toArray.bind(result);
                        result.toArray = async function () {
                            try {
                                const docs = await originalToArray();
                                const duration = Date.now() - startTime;
                                span.setAttributes({
                                    'db.count': docs.length,
                                    'db.duration': duration,
                                });
                                span.setStatus({ code: api_1.SpanStatusCode.OK });
                                logger.debug({
                                    method,
                                    collection: collection.collectionName,
                                    count: docs.length,
                                    duration,
                                }, 'MongoDB operation completed');
                                return docs;
                            }
                            catch (error) {
                                span.recordException(error);
                                span.setStatus({
                                    code: api_1.SpanStatusCode.ERROR,
                                    message: error.message,
                                });
                                throw error;
                            }
                            finally {
                                span.end();
                            }
                        };
                        return result;
                    }
                    // Handle promise results
                    if (result && typeof result.then === 'function') {
                        return result
                            .then((data) => {
                            const duration = Date.now() - startTime;
                            span.setAttributes({
                                'db.duration': duration,
                            });
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            logger.debug({
                                method,
                                collection: collection.collectionName,
                                duration,
                            }, 'MongoDB operation completed');
                            span.end();
                            return data;
                        })
                            .catch((error) => {
                            span.recordException(error);
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: error.message,
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
                        message: error.message,
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
    const logger = (0, logger_1.getLogger)();
    const tracer = api_1.trace.getTracer('@a4co/observability');
    const instrumentResolver = (resolver, typeName, fieldName) => {
        return async function (parent, args, context, info) {
            const span = tracer.startSpan(`graphql.${typeName}.${fieldName}`, {
                kind: api_1.SpanKind.INTERNAL,
                attributes: {
                    'graphql.type': typeName,
                    'graphql.field': fieldName,
                    'graphql.operation': info.operation.operation,
                    'graphql.operation.name': info.operation.name?.value,
                },
            });
            logger.debug({
                type: typeName,
                field: fieldName,
                args,
            }, 'GraphQL resolver started');
            try {
                const result = await resolver(parent, args, context, info);
                span.setStatus({ code: api_1.SpanStatusCode.OK });
                logger.debug({
                    type: typeName,
                    field: fieldName,
                }, 'GraphQL resolver completed');
                return result;
            }
            catch (error) {
                span.recordException(error);
                span.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: error.message,
                });
                logger.error({
                    error,
                    type: typeName,
                    field: fieldName,
                }, 'GraphQL resolver failed');
                throw error;
            }
            finally {
                span.end();
            }
        };
    };
    // Recursively instrument all resolvers
    const instrumentedResolvers = {};
    Object.keys(resolvers).forEach(typeName => {
        instrumentedResolvers[typeName] = {};
        Object.keys(resolvers[typeName]).forEach(fieldName => {
            const resolver = resolvers[typeName][fieldName];
            if (typeof resolver === 'function') {
                instrumentedResolvers[typeName][fieldName] = instrumentResolver(resolver, typeName, fieldName);
            }
            else if (typeof resolver === 'object' && resolver.resolve) {
                instrumentedResolvers[typeName][fieldName] = {
                    ...resolver,
                    resolve: instrumentResolver(resolver.resolve, typeName, fieldName),
                };
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
    const logger = (0, logger_1.getLogger)();
    const tracer = api_1.trace.getTracer('@a4co/observability');
    const originalSend = producer.send.bind(producer);
    producer.send = async function (record) {
        const span = tracer.startSpan(`kafka.send ${record.topic}`, {
            kind: api_1.SpanKind.PRODUCER,
            attributes: {
                'messaging.system': 'kafka',
                'messaging.destination': record.topic,
                'messaging.destination_kind': 'topic',
                'messaging.kafka.partition': record.partition,
            },
        });
        try {
            // Inject trace context into headers
            if (!record.messages) {
                record.messages = [];
            }
            record.messages = record.messages.map((message) => {
                const headers = message.headers || {};
                (0, tracer_1.injectContext)(headers);
                return { ...message, headers };
            });
            logger.debug({
                topic: record.topic,
                messageCount: record.messages.length,
            }, 'Sending Kafka messages');
            const result = await originalSend(record);
            span.setStatus({ code: api_1.SpanStatusCode.OK });
            return result;
        }
        catch (error) {
            span.recordException(error);
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: error.message,
            });
            logger.error({ error, topic: record.topic }, 'Failed to send Kafka messages');
            throw error;
        }
        finally {
            span.end();
        }
    };
    return producer;
}
function instrumentKafkaConsumer(consumer) {
    const logger = (0, logger_1.getLogger)();
    const tracer = api_1.trace.getTracer('@a4co/observability');
    const originalRun = consumer.run.bind(consumer);
    consumer.run = async function (config) {
        const originalEachMessage = config.eachMessage;
        config.eachMessage = async function (payload) {
            const { topic, partition, message } = payload;
            // Extract trace context from headers
            const parentContext = (0, tracer_1.extractContext)(message.headers || {});
            const span = tracer.startSpan(`kafka.process ${topic}`, {
                kind: api_1.SpanKind.CONSUMER,
                attributes: {
                    'messaging.system': 'kafka',
                    'messaging.destination': topic,
                    'messaging.destination_kind': 'topic',
                    'messaging.kafka.partition': partition,
                    'messaging.kafka.offset': message.offset,
                },
            }, parentContext);
            return api_1.context.with(api_1.trace.setSpan(api_1.context.active(), span), async () => {
                try {
                    logger.debug({
                        topic,
                        partition,
                        offset: message.offset,
                    }, 'Processing Kafka message');
                    const result = await originalEachMessage(payload);
                    span.setStatus({ code: api_1.SpanStatusCode.OK });
                    return result;
                }
                catch (error) {
                    span.recordException(error);
                    span.setStatus({
                        code: api_1.SpanStatusCode.ERROR,
                        message: error.message,
                    });
                    logger.error({ error, topic, partition }, 'Failed to process Kafka message');
                    throw error;
                }
                finally {
                    span.end();
                }
            });
        };
        return originalRun(config);
    };
    return consumer;
}
//# sourceMappingURL=index.js.map