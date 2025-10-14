"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDDContext = void 0;
exports.TraceAggregateMethod = TraceAggregateMethod;
exports.TraceCommand = TraceCommand;
exports.TraceEventHandler = TraceEventHandler;
exports.createDomainSpan = createDomainSpan;
exports.injectNATSTraceContext = injectNATSTraceContext;
exports.extractNATSTraceContext = extractNATSTraceContext;
exports.dddContextMiddleware = dddContextMiddleware;
exports.traceDomainTransaction = traceDomainTransaction;
const api_1 = require("@opentelemetry/api");
const tracer_1 = require("./tracer");
// Decorador para métodos de agregados
function TraceAggregateMethod(aggregateName) {
    return function (target, propertyName, descriptor) {
        const method = descriptor.value;
        descriptor.value = async function (...args) {
            const tracer = (0, tracer_1.getTracer)('ddd-aggregate');
            const span = tracer.startSpan(`${aggregateName}.${propertyName}`, {
                kind: api_1.SpanKind.INTERNAL,
                attributes: {
                    'ddd.aggregate.name': aggregateName,
                    'ddd.method.name': propertyName,
                    'ddd.method.type': 'aggregate',
                },
            });
            try {
                // Extraer metadata del contexto si está disponible
                const activeContext = api_1.context.active();
                const correlationId = activeContext.getValue('correlationId');
                const userId = activeContext.getValue('userId');
                if (correlationId) {
                    span.setAttribute('ddd.correlation_id', correlationId);
                }
                if (userId) {
                    span.setAttribute('ddd.user_id', userId);
                }
                // Ejecutar el método original
                const result = await method.apply(this, args);
                span.setStatus({ code: api_1.SpanStatusCode.OK });
                return result;
            }
            catch (error) {
                span.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: error instanceof Error ? error.message : String(error),
                });
                span.recordException(error);
                throw error;
            }
            finally {
                span.end();
            }
        };
    };
}
// Decorador para comandos
function TraceCommand(commandName) {
    return function (target, propertyName, descriptor) {
        const method = descriptor.value;
        descriptor.value = async function (...args) {
            const tracer = (0, tracer_1.getTracer)('ddd-command');
            const span = tracer.startSpan(`command.${commandName}`, {
                kind: api_1.SpanKind.INTERNAL,
                attributes: {
                    'ddd.command.name': commandName,
                    'ddd.command.handler': target.constructor.name,
                    'ddd.command.method': propertyName,
                },
            });
            try {
                // Extraer metadata del comando si está disponible
                const command = args[0];
                if (command) {
                    if (command.commandId) {
                        span.setAttribute('ddd.command.id', command.commandId);
                    }
                    if (command.aggregateId) {
                        span.setAttribute('ddd.aggregate.id', command.aggregateId);
                    }
                    if (command.userId) {
                        span.setAttribute('ddd.user.id', command.userId);
                    }
                    if (command.correlationId) {
                        span.setAttribute('ddd.correlation.id', command.correlationId);
                    }
                }
                // Ejecutar el comando
                const result = await method.apply(this, args);
                span.setStatus({ code: api_1.SpanStatusCode.OK });
                return result;
            }
            catch (error) {
                span.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: error instanceof Error ? error.message : String(error),
                });
                span.recordException(error);
                throw error;
            }
            finally {
                span.end();
            }
        };
    };
}
// Decorador para event handlers
function TraceEventHandler(eventName) {
    return function (target, propertyName, descriptor) {
        const method = descriptor.value;
        descriptor.value = async function (...args) {
            const tracer = (0, tracer_1.getTracer)('ddd-event');
            const span = tracer.startSpan(`event.${eventName}`, {
                kind: api_1.SpanKind.INTERNAL,
                attributes: {
                    'ddd.event.name': eventName,
                    'ddd.event.handler': target.constructor.name,
                    'ddd.event.method': propertyName,
                },
            });
            try {
                // Extraer metadata del evento
                const event = args[0];
                if (event) {
                    if (event.eventId) {
                        span.setAttribute('ddd.event.id', event.eventId);
                    }
                    if (event.aggregateId) {
                        span.setAttribute('ddd.aggregate.id', event.aggregateId);
                    }
                    if (event.correlationId) {
                        span.setAttribute('ddd.correlation.id', event.correlationId);
                    }
                    if (event.causationId) {
                        span.setAttribute('ddd.causation.id', event.causationId);
                    }
                }
                // Ejecutar el handler
                const result = await method.apply(this, args);
                span.setStatus({ code: api_1.SpanStatusCode.OK });
                return result;
            }
            catch (error) {
                span.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: error instanceof Error ? error.message : String(error),
                });
                span.recordException(error);
                throw error;
            }
            finally {
                span.end();
            }
        };
    };
}
// Clase para manejo de contexto DDD
class DDDContext {
    static correlationIdKey = Symbol('correlationId');
    static userIdKey = Symbol('userId');
    static causationIdKey = Symbol('causationId');
    static setCorrelationId(correlationId) {
        api_1.context.active().setValue(this.correlationIdKey, correlationId);
    }
    static getCorrelationId() {
        return api_1.context.active().getValue(this.correlationIdKey);
    }
    static setUserId(userId) {
        api_1.context.active().setValue(this.userIdKey, userId);
    }
    static getUserId() {
        return api_1.context.active().getValue(this.userIdKey);
    }
    static setCausationId(causationId) {
        api_1.context.active().setValue(this.causationIdKey, causationId);
    }
    static getCausationId() {
        return api_1.context.active().getValue(this.causationIdKey);
    }
    static createContext(metadata) {
        let ctx = api_1.context.active();
        if (metadata.correlationId) {
            ctx = ctx.setValue(this.correlationIdKey, metadata.correlationId);
        }
        if (metadata.userId) {
            ctx = ctx.setValue(this.userIdKey, metadata.userId);
        }
        if (metadata.causationId) {
            ctx = ctx.setValue(this.causationIdKey, metadata.causationId);
        }
        return ctx;
    }
}
exports.DDDContext = DDDContext;
// Función para crear spans de dominio
function createDomainSpan(operation, metadata, kind = api_1.SpanKind.INTERNAL) {
    const tracer = (0, tracer_1.getTracer)('ddd-domain');
    const span = tracer.startSpan(operation, { kind });
    // Establecer atributos comunes
    if ('aggregateName' in metadata) {
        span.setAttribute('ddd.aggregate.name', metadata.aggregateName);
        span.setAttribute('ddd.aggregate.id', metadata.aggregateId);
    }
    if ('commandName' in metadata) {
        span.setAttribute('ddd.command.name', metadata.commandName);
        span.setAttribute('ddd.command.id', metadata.commandId);
        if (metadata.aggregateId) {
            span.setAttribute('ddd.aggregate.id', metadata.aggregateId);
        }
        if (metadata.userId) {
            span.setAttribute('ddd.user.id', metadata.userId);
        }
        if (metadata.correlationId) {
            span.setAttribute('ddd.correlation.id', metadata.correlationId);
        }
    }
    if ('eventName' in metadata) {
        span.setAttribute('ddd.event.name', metadata.eventName);
        span.setAttribute('ddd.event.id', metadata.eventId);
        if (metadata.aggregateId) {
            span.setAttribute('ddd.aggregate.id', metadata.aggregateId);
        }
        if (metadata.correlationId) {
            span.setAttribute('ddd.correlation.id', metadata.correlationId);
        }
        if (metadata.causationId) {
            span.setAttribute('ddd.causation.id', metadata.causationId);
        }
    }
    return span;
}
// Función para propagar contexto en mensajes NATS
function injectNATSTraceContext(headers) {
    const activeContext = api_1.context.active();
    const correlationId = DDDContext.getCorrelationId();
    const userId = DDDContext.getUserId();
    const causationId = DDDContext.getCausationId();
    const traceHeaders = {
        ...headers,
        'x-correlation-id': correlationId || '',
        'x-user-id': userId || '',
        'x-causation-id': causationId || '',
    };
    // Inyectar contexto de OpenTelemetry
    const tracer = (0, tracer_1.getTracer)('ddd-nats');
    const span = tracer.startSpan('nats.message.inject');
    try {
        // Aquí se inyectaría el contexto de trace en los headers
        // usando el propagator de OpenTelemetry
        span.setAttributes({
            'messaging.system': 'nats',
            'messaging.operation': 'publish',
        });
    }
    finally {
        span.end();
    }
    return traceHeaders;
}
// Función para extraer contexto de mensajes NATS
function extractNATSTraceContext(headers) {
    const correlationId = headers['x-correlation-id'];
    const userId = headers['x-user-id'];
    const causationId = headers['x-causation-id'];
    if (correlationId) {
        DDDContext.setCorrelationId(correlationId);
    }
    if (userId) {
        DDDContext.setUserId(userId);
    }
    if (causationId) {
        DDDContext.setCausationId(causationId);
    }
    // Extraer contexto de trace de OpenTelemetry
    const tracer = (0, tracer_1.getTracer)('ddd-nats');
    const span = tracer.startSpan('nats.message.extract');
    try {
        span.setAttributes({
            'messaging.system': 'nats',
            'messaging.operation': 'consume',
            'ddd.correlation.id': correlationId,
            'ddd.user.id': userId,
            'ddd.causation.id': causationId,
        });
    }
    finally {
        span.end();
    }
}
// Middleware para Express/Koa que propaga contexto DDD
function dddContextMiddleware() {
    return (req, res, next) => {
        const correlationId = req.headers['x-correlation-id'] || req.headers['x-request-id'];
        const userId = req.headers['x-user-id'];
        const causationId = req.headers['x-causation-id'];
        if (correlationId) {
            DDDContext.setCorrelationId(correlationId);
        }
        if (userId) {
            DDDContext.setUserId(userId);
        }
        if (causationId) {
            DDDContext.setCausationId(causationId);
        }
        // Agregar headers de respuesta para propagar el contexto
        res.setHeader('x-correlation-id', correlationId || '');
        res.setHeader('x-user-id', userId || '');
        res.setHeader('x-causation-id', causationId || '');
        next();
    };
}
// Función para crear spans de transacciones de dominio
function traceDomainTransaction(operation, metadata, fn) {
    const span = createDomainSpan(operation, metadata);
    return api_1.context.with(DDDContext.createContext({
        correlationId: metadata.correlationId,
        userId: metadata.userId,
        causationId: metadata.causationId,
    }), async () => {
        try {
            const result = await fn();
            span.setStatus({ code: api_1.SpanStatusCode.OK });
            return result;
        }
        catch (error) {
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: error instanceof Error ? error.message : String(error),
            });
            span.recordException(error);
            throw error;
        }
        finally {
            span.end();
        }
    });
}
//# sourceMappingURL=ddd-tracing.js.map