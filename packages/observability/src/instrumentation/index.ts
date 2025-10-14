import { SpanKind, SpanStatusCode, context, trace } from '@opentelemetry/api';
import { createNatsContext } from '../context';
import { getLogger } from '../logger';
// import { recordEvent } from '../metrics';
import { extractContext, injectContext } from '../tracer';

// NATS client instrumentation wrapper
export function instrumentNatsClient(client: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

  // Wrap publish method
<<<<<<< HEAD
  const originalPublish = client.publish.bind(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client.publish = function(subject: string, data: any, options?: any): Promise<void> {
=======
  const originalPublish = natsClient.publish.bind(natsClient);
  natsClient.publish = function (subject: string, data: any, options?: any) {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    const span = tracer.startSpan(`nats.publish ${subject}`, {
      kind: SpanKind.PRODUCER,
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
      injectContext(headers);

      if (options) {
        options.headers = headers;
      } else {
        options = { headers };
      }

      // Log publish
<<<<<<< HEAD
      logger.debug('Publishing NATS message', {
        subject,
        messageSize: JSON.stringify(data).length,
        traceId: span.spanContext().traceId,
      });
=======
      logger.debug(
        {
          subject,
          messageSize: JSON.stringify(data).length,
          traceId: span.spanContext().traceId,
        },
        'Publishing NATS message'
      );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

      const result = originalPublish(subject, data, options);

      span.setStatus({ code: SpanStatusCode.OK });

      // Record metric
<<<<<<< HEAD
      // recordEvent(`nats.${subject}`, 'messaging', 'published');
=======
      recordEvent(`nats.${subject}`, 'messaging', 'published');
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message,
      });

<<<<<<< HEAD
      logger.error('Failed to publish NATS message', { error, subject });
=======
      logger.error({ error, subject }, 'Failed to publish NATS message');
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      throw error;
    } finally {
      span.end();
    }
  };

  // Wrap subscribe method
<<<<<<< HEAD
  const originalSubscribe = client.subscribe.bind(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client.subscribe = function(subject: string, options?: any, callback?: any): unknown {
=======
  const originalSubscribe = natsClient.subscribe.bind(natsClient);
  natsClient.subscribe = function (subject: string, options?: any, callback?: any) {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    // Handle different parameter combinations
    const cb = typeof options === 'function' ? options : callback;
    const opts = typeof options === 'function' ? {} : options || {};

<<<<<<< HEAD
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrappedCallback = function(msg: any): Promise<unknown> {
=======
    const wrappedCallback = function (msg: any) {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      const parentContext = extractContext(msg.headers || {});
      const span = tracer.startSpan(
        `nats.process ${subject}`,
        {
          kind: SpanKind.CONSUMER,
          attributes: {
            'messaging.system': 'nats',
            'messaging.destination': subject,
            'messaging.destination_kind': 'topic',
            'messaging.operation': 'process',
          },
        },
<<<<<<< HEAD
        parentContext,
=======
        parentContext
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      );

      return context.with(trace.setSpan(context.active(), span), async() => {
        try {
          // Create context from message
          const natsContext = createNatsContext(msg);

<<<<<<< HEAD
          logger.debug('Processing NATS message', {
            subject,
            traceId: span.spanContext().traceId,
            correlationId: natsContext.correlationId,
          });
=======
          logger.debug(
            {
              subject,
              traceId: span.spanContext().traceId,
              correlationId: natsContext.correlationId,
            },
            'Processing NATS message'
          );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

          // Call original callback
          const result = await cb(msg);

          span.setStatus({ code: SpanStatusCode.OK });

          // Record metric
<<<<<<< HEAD
          // recordEvent(`nats.${subject}`, 'messaging', 'processed');
=======
          recordEvent(`nats.${subject}`, 'messaging', 'processed');
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

          return result;
        } catch (error) {
          span.recordException(error as Error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: (error as Error).message,
          });

<<<<<<< HEAD
          logger.error('Failed to process NATS message', { error, subject });
=======
          logger.error({ error, subject }, 'Failed to process NATS message');
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
          throw error;
        } finally {
          span.end();
        }
      });
    };

    return originalSubscribe(subject, opts, wrappedCallback);
  };

  return client;
}

// Redis client instrumentation wrapper
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function instrumentRedisClient(client: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

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
<<<<<<< HEAD
    if (typeof client[command] === 'function') {
      const original = client[command].bind(client);

      client[command] = function(...args: any[]): Promise<unknown> {
=======
    if (typeof redisClient[command] === 'function') {
      const original = redisClient[command].bind(redisClient);

      redisClient[command] = function (...args: any[]) {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
        const span = tracer.startSpan(`redis.${command}`, {
          kind: SpanKind.CLIENT,
          attributes: {
            'db.system': 'redis',
            'db.operation': command,
            'db.statement': `${command} ${args[0]}`,
          },
        });

        const startTime = Date.now();

        return new Promise((resolve, reject) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const callback = (err: any, result: any): void => {
            const duration = Date.now() - startTime;

            if (err) {
              span.recordException(err);
              span.setStatus({
                code: SpanStatusCode.ERROR,
                message: err.message,
              });

<<<<<<< HEAD
              logger.error('Redis command failed', {
                error: err,
                command,
                key: args[0],
                duration,
              });
=======
              logger.error(
                {
                  error: err,
                  command,
                  key: args[0],
                  duration,
                },
                'Redis command failed'
              );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

              reject(err);
            } else {
              span.setStatus({ code: SpanStatusCode.OK });

<<<<<<< HEAD
              logger.debug('Redis command completed', {
                command,
                key: args[0],
                duration,
              });
=======
              logger.debug(
                {
                  command,
                  key: args[0],
                  duration,
                },
                'Redis command completed'
              );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

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

  return client;
}

// MongoDB collection instrumentation wrapper
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function instrumentMongoCollection(collection: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

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

<<<<<<< HEAD
      collection[method] = function(...args: any[]): Promise<unknown> {
=======
      collection[method] = function (...args: any[]) {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
        const span = tracer.startSpan(`mongodb.${method}`, {
          kind: SpanKind.CLIENT,
          attributes: {
            'db.system': 'mongodb',
            'db.operation': method,
            'db.collection': collection.collectionName,
          },
        });

<<<<<<< HEAD
        logger.debug('MongoDB operation started', {
          method,
          collection: collection.collectionName,
          query: args[0],
        });
=======
        logger.debug(
          {
            method,
            collection: collection.collectionName,
            query: args[0],
          },
          'MongoDB operation started'
        );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

        const startTime = Date.now();

        try {
          const result = original(...args);

          // Handle cursor operations
          if (result && typeof result.toArray === 'function') {
            const originalToArray = result.toArray.bind(result);
<<<<<<< HEAD
            result.toArray = async function(): Promise<unknown[]> {
=======
            result.toArray = async function () {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
              try {
                const docs = await originalToArray();
                const duration = Date.now() - startTime;

                span.setAttributes({
                  'db.count': docs.length,
                  'db.duration': duration,
                });
                span.setStatus({ code: SpanStatusCode.OK });

<<<<<<< HEAD
                logger.debug('MongoDB operation completed', {
                  method,
                  collection: collection.collectionName,
                  count: docs.length,
                  duration,
                });
=======
                logger.debug(
                  {
                    method,
                    collection: collection.collectionName,
                    count: docs.length,
                    duration,
                  },
                  'MongoDB operation completed'
                );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

                return docs;
              } catch (error) {
                span.recordException(error as Error);
                span.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: (error as Error).message,
                });
                throw error;
              } finally {
                span.end();
              }
            };

            return result;
          }

          // Handle promise results
          if (result && typeof result.then === 'function') {
<<<<<<< HEAD
            return (
              result
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((data: any) => {
                  const duration = Date.now() - startTime;

                  span.setAttributes({
                    'db.duration': duration,
                  });
                  span.setStatus({ code: SpanStatusCode.OK });

                  logger.debug('MongoDB operation completed', {
                    method,
                    collection: collection.collectionName,
                    duration,
                  });

                  span.end();
                  return data;
                })
                .catch((error: Error) => {
                  span.recordException(error);
                  span.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: error.message,
                  });
                  span.end();
                  throw error;
                })
            );
=======
            return result
              .then((data: any) => {
                const duration = Date.now() - startTime;

                span.setAttributes({
                  'db.duration': duration,
                });
                span.setStatus({ code: SpanStatusCode.OK });

                logger.debug(
                  {
                    method,
                    collection: collection.collectionName,
                    duration,
                  },
                  'MongoDB operation completed'
                );

                span.end();
                return data;
              })
              .catch((error: Error) => {
                span.recordException(error);
                span.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: error.message,
                });
                span.end();
                throw error;
              });
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
          }

          return result;
        } catch (error) {
          span.recordException(error as Error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: (error as Error).message,
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function instrumentGraphQLResolvers(resolvers: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instrumentResolver = (resolver: any, typeName: string, fieldName: string) => {
<<<<<<< HEAD
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function(parent: any, args: any, context: any, info: any): Promise<unknown> {
=======
    return async function (parent: any, args: any, context: any, info: any) {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      const span = tracer.startSpan(`graphql.${typeName}.${fieldName}`, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'graphql.type': typeName,
          'graphql.field': fieldName,
          'graphql.operation': info.operation.operation,
          'graphql.operation.name': info.operation.name?.value,
        },
      });

<<<<<<< HEAD
      logger.debug('GraphQL resolver started', {
        type: typeName,
        field: fieldName,
        args,
      });
=======
      logger.debug(
        {
          type: typeName,
          field: fieldName,
          args,
        },
        'GraphQL resolver started'
      );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

      try {
        const result = await resolver(parent, args, context, info);

        span.setStatus({ code: SpanStatusCode.OK });

<<<<<<< HEAD
        logger.debug('GraphQL resolver completed', {
          type: typeName,
          field: fieldName,
        });
=======
        logger.debug(
          {
            type: typeName,
            field: fieldName,
          },
          'GraphQL resolver completed'
        );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

        return result;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: (error as Error).message,
        });

<<<<<<< HEAD
        logger.error('GraphQL resolver failed', {
          error,
          type: typeName,
          field: fieldName,
        });
=======
        logger.error(
          {
            error,
            type: typeName,
            field: fieldName,
          },
          'GraphQL resolver failed'
        );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

        throw error;
      } finally {
        span.end();
      }
    };
  };

  // Recursively instrument all resolvers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instrumentedResolvers: any = {};

  Object.keys(resolvers).forEach(typeName => {
    instrumentedResolvers[typeName] = {};

    Object.keys(resolvers[typeName]).forEach(fieldName => {
      const resolver = resolvers[typeName][fieldName];

      if (typeof resolver === 'function') {
        instrumentedResolvers[typeName][fieldName] = instrumentResolver(
          resolver,
          typeName,
<<<<<<< HEAD
          fieldName,
=======
          fieldName
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
        );
      } else if (typeof resolver === 'object' && resolver.resolve) {
        instrumentedResolvers[typeName][fieldName] = {
          ...resolver,
          resolve: instrumentResolver(resolver.resolve, typeName, fieldName),
        };
      } else {
        instrumentedResolvers[typeName][fieldName] = resolver;
      }
    });
  });

  return instrumentedResolvers;
}

// Kafka producer instrumentation wrapper
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function instrumentKafkaProducer(producer: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

  const originalSend = producer.send.bind(producer);

<<<<<<< HEAD
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  producer.send = async function(record: any): Promise<unknown> {
=======
  producer.send = async function (record: any) {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    const span = tracer.startSpan(`kafka.send ${record.topic}`, {
      kind: SpanKind.PRODUCER,
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

<<<<<<< HEAD
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
=======
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      record.messages = record.messages.map((message: any) => {
        const headers = message.headers || {};
        injectContext(headers);
        return { ...message, headers };
      });

<<<<<<< HEAD
      logger.debug('Sending Kafka messages', {
        topic: record.topic,
        messageCount: record.messages.length,
      });
=======
      logger.debug(
        {
          topic: record.topic,
          messageCount: record.messages.length,
        },
        'Sending Kafka messages'
      );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

      const result = await originalSend(record);

      span.setStatus({ code: SpanStatusCode.OK });

      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message,
      });

<<<<<<< HEAD
      logger.error('Failed to send Kafka messages', { error, topic: record.topic });
=======
      logger.error({ error, topic: record.topic }, 'Failed to send Kafka messages');
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      throw error;
    } finally {
      span.end();
    }
  };

  return producer;
}

// Kafka consumer instrumentation wrapper
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function instrumentKafkaConsumer(consumer: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

  const originalRun = consumer.run.bind(consumer);

<<<<<<< HEAD
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  consumer.run = async function(config: any): Promise<void> {
    const originalEachMessage = config.eachMessage;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config.eachMessage = async function(payload: any): Promise<void> {
=======
  consumer.run = async function (config: any) {
    const originalEachMessage = config.eachMessage;

    config.eachMessage = async function (payload: any) {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      const { topic, partition, message } = payload;

      // Extract trace context from headers
      const parentContext = extractContext(message.headers || {});
<<<<<<< HEAD
=======

      const span = tracer.startSpan(
        `kafka.process ${topic}`,
        {
          kind: SpanKind.CONSUMER,
          attributes: {
            'messaging.system': 'kafka',
            'messaging.destination': topic,
            'messaging.destination_kind': 'topic',
            'messaging.kafka.partition': partition,
            'messaging.kafka.offset': message.offset,
          },
        },
        parentContext
      );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

      const span = tracer.startSpan(
        `kafka.process ${topic}`,
        {
          kind: SpanKind.CONSUMER,
          attributes: {
            'messaging.system': 'kafka',
            'messaging.destination': topic,
            'messaging.destination_kind': 'topic',
            'messaging.kafka.partition': partition,
            'messaging.kafka.offset': message.offset,
          },
        },
        parentContext,
      );

      return context.with(trace.setSpan(context.active(), span), async() => {
        try {
<<<<<<< HEAD
          logger.debug('Processing Kafka message', {
            topic,
            partition,
            offset: message.offset,
          });
=======
          logger.debug(
            {
              topic,
              partition,
              offset: message.offset,
            },
            'Processing Kafka message'
          );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

          const result = await originalEachMessage(payload);

          span.setStatus({ code: SpanStatusCode.OK });

          return result;
        } catch (error) {
          span.recordException(error as Error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: (error as Error).message,
          });

<<<<<<< HEAD
          logger.error('Failed to process Kafka message', { error, topic, partition });
=======
          logger.error({ error, topic, partition }, 'Failed to process Kafka message');
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
          throw error;
        } finally {
          span.end();
        }
      });
    };

    return originalRun(config);
  };

  return consumer;
}
