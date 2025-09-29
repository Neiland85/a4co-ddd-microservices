import { SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { getLogger } from '../logger';
import { recordCommandExecution, recordEvent } from '../metrics/index';
import { TraceDecoratorOptions } from '../types';

// Trace decorator for methods
export function Trace(options: TraceDecoratorOptions = {}) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    const spanName = options.name || `${className}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      const tracer = trace.getTracer('@a4co/observability');
      const span = tracer.startSpan(spanName, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'code.function': propertyName,
          'code.namespace': className,
          ...options.attributes,
        },
      });

      const logger = getLogger().withContext({
        spanId: span.spanContext().spanId,
        traceId: span.spanContext().traceId,
        method: propertyName,
        class: className,
      });

      logger.debug(`${spanName} started`, { args: options.recordResult ? args : undefined });

      try {
        const result = await originalMethod.apply(this, args);

        span.setStatus({ code: SpanStatusCode.OK });

        if (options.recordResult) {
          span.setAttribute('result', JSON.stringify(result));
        }

        logger.debug(`${spanName} completed`, {
          result: options.recordResult ? result : undefined,
        });

        return result;
      } catch (error) {
        const err = error as Error;

        if (options.recordException !== false) {
          span.recordException(err);
        }

        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        });

        logger.error(`${spanName} failed`, { error: err, stack: err.stack });

        throw error;
      } finally {
        span.end();
      }
    };

    return descriptor;
  };
}

// Log decorator for methods
export function Log(level: 'debug' | 'info' | 'warn' | 'error' = 'info') {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;

    descriptor.value = async function (...args: any[]) {
      const logger = getLogger();
      const methodName = `${className}.${propertyName}`;

      logger[level](`Executing ${methodName}`, { method: methodName, args });

      try {
        const result = await originalMethod.apply(this, args);
        logger[level](`${methodName} completed`, { method: methodName, result });
        return result;
      } catch (error) {
        logger.error(`${methodName} failed`, { method: methodName, error });
        throw error;
      }
    };

    return descriptor;
  };
}

// Command handler decorator for DDD
export function CommandHandler(commandName: string, aggregateName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const tracer = trace.getTracer('@a4co/observability');
      const span = tracer.startSpan(`command.${commandName}`, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'ddd.command.name': commandName,
          'ddd.aggregate.name': aggregateName,
          'ddd.handler': `${target.constructor.name}.${propertyName}`,
        },
      });

      const logger = getLogger().withDDD({
        commandName,
        aggregateName,
      });

      const startTime = Date.now();
      logger.info('Command execution started', { command: commandName, aggregate: aggregateName });

      try {
        const result = await originalMethod.apply(this, args);

        span.setStatus({ code: SpanStatusCode.OK });

        const duration = Date.now() - startTime;
        logger.info('Command executed successfully', { command: commandName, duration });

        recordCommandExecution(commandName, aggregateName, true, duration);

        return result;
      } catch (error) {
        const err = error as Error;
        span.recordException(err);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        });

        const duration = Date.now() - startTime;
        logger.error('Command execution failed', { command: commandName, error: err, duration });

        recordCommandExecution(commandName, aggregateName, false, duration);

        throw error;
      } finally {
        span.end();
      }
    };

    return descriptor;
  };
}

// Event handler decorator for DDD
export function EventHandler(eventName: string, aggregateName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const tracer = trace.getTracer('@a4co/observability');
      const span = tracer.startSpan(`event.${eventName}`, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'ddd.event.name': eventName,
          'ddd.aggregate.name': aggregateName,
          'ddd.handler': `${target.constructor.name}.${propertyName}`,
        },
      });

      const logger = getLogger().withDDD({
        eventName,
        aggregateName,
      });

      logger.info('Event processing started', { event: eventName, aggregate: aggregateName });

      try {
        const result = await originalMethod.apply(this, args);

        span.setStatus({ code: SpanStatusCode.OK });

        logger.info('Event processed successfully', { event: eventName });

        recordEvent(eventName, aggregateName, 'processed');

        return result;
      } catch (error) {
        const err = error as Error;
        span.recordException(err);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        });

        logger.error('Event processing failed', { event: eventName, error: err });

        throw error;
      } finally {
        span.end();
      }
    };

    return descriptor;
  };
}

// Metrics decorator
export function Metrics(metricName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;

        // Record custom metric
        const { createCustomHistogram } = await import('../metrics/index');
        const histogram = createCustomHistogram(
          metricName,
          `Duration of ${className}.${propertyName}`,
          'ms'
        );
        histogram.record(duration, {
          class: className,
          method: propertyName,
          status: 'success',
        });

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        // Record error metric
        const { createCustomHistogram } = await import('../metrics/index');
        const histogram = createCustomHistogram(
          metricName,
          `Duration of ${className}.${propertyName}`,
          'ms'
        );
        histogram.record(duration, {
          class: className,
          method: propertyName,
          status: 'error',
        });

        throw error;
      }
    };

    return descriptor;
  };
}

// Cache decorator with observability
export function CacheableWithObservability(ttl: number = 300) {
  const cache = new Map<string, { value: any; expiry: number }>();

  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = JSON.stringify(args);
      const cached = cache.get(cacheKey);

      const logger = getLogger();
      const span = trace.getActiveSpan();

      if (cached && cached.expiry > Date.now()) {
        logger.debug('Cache hit', { method: `${className}.${propertyName}`, cacheKey });
        if (span) {
          span.setAttribute('cache.hit', true);
        }
        return cached.value;
      }

      logger.debug('Cache miss', { method: `${className}.${propertyName}`, cacheKey });
      if (span) {
        span.setAttribute('cache.hit', false);
      }

      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, {
        value: result,
        expiry: Date.now() + ttl * 1000,
      });

      return result;
    };

    return descriptor;
  };
}

// Repository decorator for DDD
export function Repository(aggregateName: string) {
  return function (constructor: Function) {
    const originalConstructor = constructor;

    const wrappedConstructor: any = function (...args: any[]) {
      const instance = new (originalConstructor as any)(...args);

      // Wrap common repository methods
      const methodsToWrap = ['save', 'findById', 'findAll', 'delete', 'update'];

      methodsToWrap.forEach(methodName => {
        if (typeof instance[methodName] === 'function') {
          const originalMethod = instance[methodName];

          instance[methodName] = async function (...methodArgs: any[]) {
            const span = trace.getActiveSpan();
            if (span) {
              span.setAttribute('repository.aggregate', aggregateName);
              span.setAttribute('repository.method', methodName);
            }

            const logger = getLogger().withContext({
              repository: constructor.name,
              aggregate: aggregateName,
              method: methodName,
            });

            logger.debug(`Repository ${methodName} called`, { args: methodArgs });

            try {
              const result = await originalMethod.apply(this, methodArgs);
              logger.debug(`Repository ${methodName} completed`, { result });
              return result;
            } catch (error) {
              logger.error(`Repository ${methodName} failed`, { error });
              throw error;
            }
          };
        }
      });

      return instance;
    };

    wrappedConstructor.prototype = originalConstructor.prototype;
    return wrappedConstructor;
  };
}
