import { trace, SpanKind, SpanStatusCode, context } from '@opentelemetry/api';
import { getLogger } from '../logger';
import { injectContext, extractContext } from '../tracer';
import { createNatsContext, injectNatsContext } from '../context';
import { recordEvent } from '../metrics';

// NATS instrumentation wrapper
export function instrumentNatsClient(natsClient: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

  // Wrap publish method
  const originalPublish = natsClient.publish.bind(natsClient);
  natsClient.publish = function(subject: string, data: any, options?: any) {
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
      logger.debug({
        subject,
        messageSize: JSON.stringify(data).length,
        traceId: span.spanContext().traceId,
      }, 'Publishing NATS message');

      const result = originalPublish(subject, data, options);
      
      span.setStatus({ code: SpanStatusCode.OK });
      
      // Record metric
      recordEvent(`nats.${subject}`, 'messaging', 'published');
      
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: (error as Error).message 
      });
      
      logger.error({ error, subject }, 'Failed to publish NATS message');
      throw error;
    } finally {
      span.end();
    }
  };

  // Wrap subscribe method
  const originalSubscribe = natsClient.subscribe.bind(natsClient);
  natsClient.subscribe = function(subject: string, options?: any, callback?: any) {
    // Handle different parameter combinations
    const cb = typeof options === 'function' ? options : callback;
    const opts = typeof options === 'function' ? {} : options || {};

    const wrappedCallback = function(msg: any) {
      const parentContext = extractContext(msg.headers || {});
      const span = tracer.startSpan(`nats.process ${subject}`, {
        kind: SpanKind.CONSUMER,
        attributes: {
          'messaging.system': 'nats',
          'messaging.destination': subject,
          'messaging.destination_kind': 'topic',
          'messaging.operation': 'process',
        },
      }, parentContext);

      context.with(trace.setSpan(context.active(), span), async () => {
        try {
          // Create context from message
          const natsContext = createNatsContext(msg);
          
          logger.debug({
            subject,
            traceId: span.spanContext().traceId,
            correlationId: natsContext.correlationId,
          }, 'Processing NATS message');

          // Call original callback
          const result = await cb(msg);
          
          span.setStatus({ code: SpanStatusCode.OK });
          
          // Record metric
          recordEvent(`nats.${subject}`, 'messaging', 'processed');
          
          return result;
        } catch (error) {
          span.recordException(error as Error);
          span.setStatus({ 
            code: SpanStatusCode.ERROR, 
            message: (error as Error).message 
          });
          
          logger.error({ error, subject }, 'Failed to process NATS message');
          throw error;
        } finally {
          span.end();
        }
      });
    };

    return originalSubscribe(subject, opts, wrappedCallback);
  };

  return natsClient;
}

// Redis instrumentation wrapper
export function instrumentRedisClient(redisClient: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

  // List of Redis commands to instrument
  const commands = ['get', 'set', 'del', 'hget', 'hset', 'hdel', 'sadd', 'srem', 'smembers', 'zadd', 'zrem', 'zrange'];

  commands.forEach(command => {
    if (typeof redisClient[command] === 'function') {
      const original = redisClient[command].bind(redisClient);
      
      redisClient[command] = function(...args: any[]) {
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
          const callback = (err: any, result: any) => {
            const duration = Date.now() - startTime;

            if (err) {
              span.recordException(err);
              span.setStatus({ 
                code: SpanStatusCode.ERROR, 
                message: err.message 
              });
              
              logger.error({ 
                error: err, 
                command, 
                key: args[0],
                duration 
              }, 'Redis command failed');
              
              reject(err);
            } else {
              span.setStatus({ code: SpanStatusCode.OK });
              
              logger.debug({ 
                command, 
                key: args[0],
                duration 
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
export function instrumentMongoCollection(collection: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

  // List of MongoDB methods to instrument
  const methods = ['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'aggregate'];

  methods.forEach(method => {
    if (typeof collection[method] === 'function') {
      const original = collection[method].bind(collection);
      
      collection[method] = function(...args: any[]) {
        const span = tracer.startSpan(`mongodb.${method}`, {
          kind: SpanKind.CLIENT,
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
            result.toArray = async function() {
              try {
                const docs = await originalToArray();
                const duration = Date.now() - startTime;
                
                span.setAttributes({
                  'db.count': docs.length,
                  'db.duration': duration,
                });
                span.setStatus({ code: SpanStatusCode.OK });
                
                logger.debug({
                  method,
                  collection: collection.collectionName,
                  count: docs.length,
                  duration,
                }, 'MongoDB operation completed');
                
                return docs;
              } catch (error) {
                span.recordException(error as Error);
                span.setStatus({ 
                  code: SpanStatusCode.ERROR, 
                  message: (error as Error).message 
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
            return result
              .then((data: any) => {
                const duration = Date.now() - startTime;
                
                span.setAttributes({
                  'db.duration': duration,
                });
                span.setStatus({ code: SpanStatusCode.OK });
                
                logger.debug({
                  method,
                  collection: collection.collectionName,
                  duration,
                }, 'MongoDB operation completed');
                
                span.end();
                return data;
              })
              .catch((error: Error) => {
                span.recordException(error);
                span.setStatus({ 
                  code: SpanStatusCode.ERROR, 
                  message: error.message 
                });
                span.end();
                throw error;
              });
          }
          
          return result;
        } catch (error) {
          span.recordException(error as Error);
          span.setStatus({ 
            code: SpanStatusCode.ERROR, 
            message: (error as Error).message 
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
export function instrumentGraphQLResolvers(resolvers: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

  const instrumentResolver = (resolver: any, typeName: string, fieldName: string) => {
    return async function(parent: any, args: any, context: any, info: any) {
      const span = tracer.startSpan(`graphql.${typeName}.${fieldName}`, {
        kind: SpanKind.INTERNAL,
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
        
        span.setStatus({ code: SpanStatusCode.OK });
        
        logger.debug({
          type: typeName,
          field: fieldName,
        }, 'GraphQL resolver completed');
        
        return result;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ 
          code: SpanStatusCode.ERROR, 
          message: (error as Error).message 
        });
        
        logger.error({
          error,
          type: typeName,
          field: fieldName,
        }, 'GraphQL resolver failed');
        
        throw error;
      } finally {
        span.end();
      }
    };
  };

  // Recursively instrument all resolvers
  const instrumentedResolvers: any = {};
  
  Object.keys(resolvers).forEach(typeName => {
    instrumentedResolvers[typeName] = {};
    
    Object.keys(resolvers[typeName]).forEach(fieldName => {
      const resolver = resolvers[typeName][fieldName];
      
      if (typeof resolver === 'function') {
        instrumentedResolvers[typeName][fieldName] = instrumentResolver(resolver, typeName, fieldName);
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

// Kafka instrumentation
export function instrumentKafkaProducer(producer: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

  const originalSend = producer.send.bind(producer);
  
  producer.send = async function(record: any) {
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
      
      record.messages = record.messages.map((message: any) => {
        const headers = message.headers || {};
        injectContext(headers);
        return { ...message, headers };
      });

      logger.debug({
        topic: record.topic,
        messageCount: record.messages.length,
      }, 'Sending Kafka messages');

      const result = await originalSend(record);
      
      span.setStatus({ code: SpanStatusCode.OK });
      
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: (error as Error).message 
      });
      
      logger.error({ error, topic: record.topic }, 'Failed to send Kafka messages');
      throw error;
    } finally {
      span.end();
    }
  };

  return producer;
}

export function instrumentKafkaConsumer(consumer: any): any {
  const logger = getLogger();
  const tracer = trace.getTracer('@a4co/observability');

  const originalRun = consumer.run.bind(consumer);
  
  consumer.run = async function(config: any) {
    const originalEachMessage = config.eachMessage;
    
    config.eachMessage = async function(payload: any) {
      const { topic, partition, message } = payload;
      
      // Extract trace context from headers
      const parentContext = extractContext(message.headers || {});
      
      const span = tracer.startSpan(`kafka.process ${topic}`, {
        kind: SpanKind.CONSUMER,
        attributes: {
          'messaging.system': 'kafka',
          'messaging.destination': topic,
          'messaging.destination_kind': 'topic',
          'messaging.kafka.partition': partition,
          'messaging.kafka.offset': message.offset,
        },
      }, parentContext);

      return context.with(trace.setSpan(context.active(), span), async () => {
        try {
          logger.debug({
            topic,
            partition,
            offset: message.offset,
          }, 'Processing Kafka message');

          const result = await originalEachMessage(payload);
          
          span.setStatus({ code: SpanStatusCode.OK });
          
          return result;
        } catch (error) {
          span.recordException(error as Error);
          span.setStatus({ 
            code: SpanStatusCode.ERROR, 
            message: (error as Error).message 
          });
          
          logger.error({ error, topic, partition }, 'Failed to process Kafka message');
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