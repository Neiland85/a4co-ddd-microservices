import { SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { getLogger } from '../logger';
import { recordCommandExecution, recordEvent } from '../metrics/index';
import type { TraceDecoratorOptions } from '../types';

// Trace decorator for methods
export function Trace(
  options: TraceDecoratorOptions = {}
): (
  _target: unknown,
  _propertyName: string,
  _descriptor: PropertyDescriptor
) => PropertyDescriptor {
  return function (
    _target: unknown,
    _propertyName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const className = (_target as { constructor: { name: string } }).constructor.name;
    const spanName = options.name || `${className}.${_propertyName}`;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const tracer = trace.getTracer('@a4co/observability');
      const span = tracer.startSpan(spanName, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'code.function': _propertyName,
          'code.namespace': className,
          ...options.attributes,
        },
      });

      const logger = getLogger().withContext({
        spanId: span.spanContext().spanId,
        traceId: span.spanContext().traceId,
        method: _propertyName,
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
export function Log(
  level: 'debug' | 'info' | 'warn' | 'error' = 'info'
): (
  _target: unknown,
  _propertyName: string,
  _descriptor: PropertyDescriptor
) => PropertyDescriptor {
  return function (
    _target: unknown,
    _propertyName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const className = (_target as { constructor: { name: string } }).constructor.name;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const logger = getLogger();
      const methodName = `${className}.${_propertyName}`;

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
export function CommandHandler(
  commandName: string,
  aggregateName: string
): (
  _target: unknown,
  _propertyName: string,
  _descriptor: PropertyDescriptor
) => PropertyDescriptor {
  return function (
    _target: unknown,
    _propertyName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const tracer = trace.getTracer('@a4co/observability');
      const span = tracer.startSpan(`command.${commandName}`, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'ddd.command.name': commandName,
          'ddd.aggregate.name': aggregateName,
          'ddd.handler': `${(_target as { constructor: { name: string } }).constructor.name}.${_propertyName}`,
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
export function EventHandler(
  eventName: string,
  aggregateName: string
): (
  _target: unknown,
  _propertyName: string,
  _descriptor: PropertyDescriptor
) => PropertyDescriptor {
  return function (
    _target: unknown,
    _propertyName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const tracer = trace.getTracer('@a4co/observability');
      const span = tracer.startSpan(`event.${eventName}`, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'ddd.event.name': eventName,
          'ddd.aggregate.name': aggregateName,
          'ddd.handler': `${(_target as { constructor: { name: string } }).constructor.name}.${_propertyName}`,
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
export function Metrics(
  metricName: string
): (
  _target: unknown,
  _propertyName: string,
  _descriptor: PropertyDescriptor
) => PropertyDescriptor {
  return function (
    _target: unknown,
    _propertyName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const className = (_target as { constructor: { name: string } }).constructor.name;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const startTime = Date.now();

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;

        // Record custom metric
        const { createCustomHistogram } = await import('../metrics/index');
        const histogram = createCustomHistogram(
          metricName,
          `Duration of ${className}.${_propertyName}`,
          'ms'
        );
        histogram.record(duration, {
          class: className,
          method: _propertyName,
          status: 'success',
        });

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        // Record error metric
        const { createCustomHistogram } = await import('../metrics/index');
        const histogram = createCustomHistogram(
          metricName,
          `Duration of ${className}.${_propertyName}`,
          'ms'
        );
        histogram.record(duration, {
          class: className,
          method: _propertyName,
          status: 'error',
        });

        throw error;
      }
    };

    return descriptor;
  };
}

// Cache decorator with observability
export function CacheableWithObservability(
  ttl: number = 300
): (
  _target: unknown,
  _propertyName: string,
  _descriptor: PropertyDescriptor
) => PropertyDescriptor {
  const cache = new Map<string, { value: unknown; expiry: number }>();

  return function (
    _target: unknown,
    _propertyName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const className = (_target as { constructor: { name: string } }).constructor.name;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const cacheKey = JSON.stringify(args);
      const cached = cache.get(cacheKey);

      const logger = getLogger();
      const span = trace.getActiveSpan();

      if (cached && cached.expiry > Date.now()) {
        logger.debug('Cache hit', { method: `${className}.${_propertyName}`, cacheKey });
        if (span) {
          span.setAttribute('cache.hit', true);
        }
        return cached.value;
      }

      logger.debug('Cache miss', { method: `${className}.${_propertyName}`, cacheKey });
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
export function Repository(aggregateName: string): (_constructor: unknown) => unknown {
  return function (_constructor: unknown): unknown {
    const originalConstructor = _constructor as new (..._args: unknown[]) => unknown;

    const wrappedConstructor = function (...args: unknown[]): unknown {
      const instance = new originalConstructor(...args);

      // Wrap common repository methods
      const methodsToWrap = ['save', 'findById', 'findAll', 'delete', 'update'];

      methodsToWrap.forEach(methodName => {
        const instanceAny = instance as Record<string, unknown>;
        if (typeof instanceAny[methodName] === 'function') {
          const originalMethod = instanceAny[methodName] as (
            ..._args: unknown[]
          ) => Promise<unknown>;

          instanceAny[methodName] = async function (...methodArgs: unknown[]): Promise<unknown> {
            const span = trace.getActiveSpan();
            if (span) {
              span.setAttribute('repository.aggregate', aggregateName);
              span.setAttribute('repository.method', methodName);
            }

            const logger = getLogger().withContext({
              repository: (_constructor as { name: string }).name,
              aggregate: aggregateName,
              method: methodName,
            });

            logger.debug(`Repository method ${methodName} called`, { args: methodArgs });

            try {
              const result = await originalMethod.apply(this, methodArgs);
              logger.debug(`Repository method ${methodName} completed`);
              return result;
            } catch (error) {
              logger.error(`Repository method ${methodName} failed`, { error: error as Error });
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
