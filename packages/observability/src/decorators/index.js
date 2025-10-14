"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trace = Trace;
exports.Log = Log;
exports.CommandHandler = CommandHandler;
exports.EventHandler = EventHandler;
exports.Metrics = Metrics;
exports.CacheableWithObservability = CacheableWithObservability;
exports.Repository = Repository;
const api_1 = require("@opentelemetry/api");
const logger_1 = require("../logger");
const metrics_1 = require("../metrics");
// Trace decorator for methods
function Trace(options = {}) {
    return function (target, propertyName, descriptor) {
        const originalMethod = descriptor.value;
        const className = target.constructor.name;
        const spanName = options.name || `${className}.${propertyName}`;
        descriptor.value = async function (...args) {
            const tracer = api_1.trace.getTracer('@a4co/observability');
            const span = tracer.startSpan(spanName, {
                kind: api_1.SpanKind.INTERNAL,
                attributes: {
                    'code.function': propertyName,
                    'code.namespace': className,
                    ...options.attributes,
                },
            });
            const logger = (0, logger_1.getLogger)().withContext({
                spanId: span.spanContext().spanId,
                traceId: span.spanContext().traceId,
                method: propertyName,
                class: className,
            });
            logger.debug({ args: options.recordResult ? args : undefined }, `${spanName} started`);
            try {
                const result = await originalMethod.apply(this, args);
                span.setStatus({ code: api_1.SpanStatusCode.OK });
                if (options.recordResult) {
                    span.setAttribute('result', JSON.stringify(result));
                }
                logger.debug({ result: options.recordResult ? result : undefined }, `${spanName} completed`);
                return result;
            }
            catch (error) {
                const err = error;
                if (options.recordException !== false) {
                    span.recordException(err);
                }
                span.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: err.message,
                });
                logger.error({ error: err, stack: err.stack }, `${spanName} failed`);
                throw error;
            }
            finally {
                span.end();
            }
        };
        return descriptor;
    };
}
// Log decorator for methods
function Log(level = 'info') {
    return function (target, propertyName, descriptor) {
        const originalMethod = descriptor.value;
        const className = target.constructor.name;
        descriptor.value = async function (...args) {
            const logger = (0, logger_1.getLogger)();
            const methodName = `${className}.${propertyName}`;
            logger[level]({ method: methodName, args }, `Executing ${methodName}`);
            try {
                const result = await originalMethod.apply(this, args);
                logger[level]({ method: methodName, result }, `${methodName} completed`);
                return result;
            }
            catch (error) {
                logger.error({ method: methodName, error }, `${methodName} failed`);
                throw error;
            }
        };
        return descriptor;
    };
}
// Command handler decorator for DDD
function CommandHandler(commandName, aggregateName) {
    return function (target, propertyName, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const tracer = api_1.trace.getTracer('@a4co/observability');
            const span = tracer.startSpan(`command.${commandName}`, {
                kind: api_1.SpanKind.INTERNAL,
                attributes: {
                    'ddd.command.name': commandName,
                    'ddd.aggregate.name': aggregateName,
                    'ddd.handler': `${target.constructor.name}.${propertyName}`,
                },
            });
            const logger = (0, logger_1.getLogger)().withDDD({
                commandName,
                aggregateName,
            });
            const startTime = Date.now();
            logger.info({ command: commandName, aggregate: aggregateName }, 'Command execution started');
            try {
                const result = await originalMethod.apply(this, args);
                span.setStatus({ code: api_1.SpanStatusCode.OK });
                const duration = Date.now() - startTime;
                logger.info({ command: commandName, duration }, 'Command executed successfully');
                (0, metrics_1.recordCommandExecution)(commandName, aggregateName, true, duration);
                return result;
            }
            catch (error) {
                const err = error;
                span.recordException(err);
                span.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: err.message,
                });
                const duration = Date.now() - startTime;
                logger.error({ command: commandName, error: err, duration }, 'Command execution failed');
                (0, metrics_1.recordCommandExecution)(commandName, aggregateName, false, duration);
                throw error;
            }
            finally {
                span.end();
            }
        };
        return descriptor;
    };
}
// Event handler decorator for DDD
function EventHandler(eventName, aggregateName) {
    return function (target, propertyName, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const tracer = api_1.trace.getTracer('@a4co/observability');
            const span = tracer.startSpan(`event.${eventName}`, {
                kind: api_1.SpanKind.INTERNAL,
                attributes: {
                    'ddd.event.name': eventName,
                    'ddd.aggregate.name': aggregateName,
                    'ddd.handler': `${target.constructor.name}.${propertyName}`,
                },
            });
            const logger = (0, logger_1.getLogger)().withDDD({
                eventName,
                aggregateName,
            });
            logger.info({ event: eventName, aggregate: aggregateName }, 'Event processing started');
            try {
                const result = await originalMethod.apply(this, args);
                span.setStatus({ code: api_1.SpanStatusCode.OK });
                logger.info({ event: eventName }, 'Event processed successfully');
                (0, metrics_1.recordEvent)(eventName, aggregateName, 'processed');
                return result;
            }
            catch (error) {
                const err = error;
                span.recordException(err);
                span.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: err.message,
                });
                logger.error({ event: eventName, error: err }, 'Event processing failed');
                throw error;
            }
            finally {
                span.end();
            }
        };
        return descriptor;
    };
}
// Metrics decorator
function Metrics(metricName) {
    return function (target, propertyName, descriptor) {
        const originalMethod = descriptor.value;
        const className = target.constructor.name;
        descriptor.value = async function (...args) {
            const startTime = Date.now();
            try {
                const result = await originalMethod.apply(this, args);
                const duration = Date.now() - startTime;
                // Record custom metric
                const metrics = await import('../metrics');
                const histogram = metrics.createCustomHistogram(metricName, `Duration of ${className}.${propertyName}`, 'ms');
                histogram.record(duration, {
                    class: className,
                    method: propertyName,
                    status: 'success',
                });
                return result;
            }
            catch (error) {
                const duration = Date.now() - startTime;
                // Record error metric
                const metrics = await import('../metrics');
                const histogram = metrics.createCustomHistogram(metricName, `Duration of ${className}.${propertyName}`, 'ms');
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
function CacheableWithObservability(ttl = 300) {
    const cache = new Map();
    return function (target, propertyName, descriptor) {
        const originalMethod = descriptor.value;
        const className = target.constructor.name;
        descriptor.value = async function (...args) {
            const cacheKey = JSON.stringify(args);
            const cached = cache.get(cacheKey);
            const logger = (0, logger_1.getLogger)();
            const span = api_1.trace.getActiveSpan();
            if (cached && cached.expiry > Date.now()) {
                logger.debug({ method: `${className}.${propertyName}`, cacheKey }, 'Cache hit');
                if (span) {
                    span.setAttribute('cache.hit', true);
                }
                return cached.value;
            }
            logger.debug({ method: `${className}.${propertyName}`, cacheKey }, 'Cache miss');
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
function Repository(aggregateName) {
    return function (constructor) {
        const originalConstructor = constructor;
        const wrappedConstructor = function (...args) {
            const instance = new originalConstructor(...args);
            // Wrap common repository methods
            const methodsToWrap = ['save', 'findById', 'findAll', 'delete', 'update'];
            methodsToWrap.forEach(methodName => {
                if (typeof instance[methodName] === 'function') {
                    const originalMethod = instance[methodName];
                    instance[methodName] = async function (...methodArgs) {
                        const span = api_1.trace.getActiveSpan();
                        if (span) {
                            span.setAttribute('repository.aggregate', aggregateName);
                            span.setAttribute('repository.method', methodName);
                        }
                        const logger = (0, logger_1.getLogger)().withContext({
                            repository: constructor.name,
                            aggregate: aggregateName,
                            method: methodName,
                        });
                        logger.debug({ args: methodArgs }, `Repository ${methodName} called`);
                        try {
                            const result = await originalMethod.apply(this, methodArgs);
                            logger.debug({ result }, `Repository ${methodName} completed`);
                            return result;
                        }
                        catch (error) {
                            logger.error({ error }, `Repository ${methodName} failed`);
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
//# sourceMappingURL=index.js.map