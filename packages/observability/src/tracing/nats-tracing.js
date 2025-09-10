"use strict";
/**
 * NATS integration for distributed tracing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracedNatsClient = void 0;
exports.createTracedPublisher = createTracedPublisher;
exports.createTracedSubscriber = createTracedSubscriber;
exports.createTracedRequest = createTracedRequest;
const api_1 = require("@opentelemetry/api");
const uuid_1 = require("uuid");
/**
 * Wrap NATS publish with tracing
 */
function createTracedPublisher(config) {
    const { serviceName, logger } = config;
    const tracer = api_1.trace.getTracer(serviceName);
    return async function publishWithTracing(subject, data, options) {
        const span = tracer.startSpan(`NATS Publish: ${subject}`, {
            kind: api_1.SpanKind.PRODUCER,
            attributes: {
                'messaging.system': 'nats',
                'messaging.destination': subject,
                'messaging.operation': 'publish',
                'messaging.message.payload_size_bytes': JSON.stringify(data).length,
            },
        });
        const spanContext = span.spanContext();
        const tracedMessage = {
            data,
            headers: {
                traceId: spanContext.traceId,
                spanId: spanContext.spanId,
                timestamp: new Date().toISOString(),
                ...options?.headers,
            },
        };
        if (options?.replyTo) {
            span.setAttribute('messaging.nats.reply_to', options.replyTo);
        }
        try {
            // Here you would call the actual NATS publish method
            // For example: await nc.publish(subject, JSON.stringify(tracedMessage))
            logger?.info('NATS message published', {
                traceId: spanContext.traceId,
                spanId: spanContext.spanId,
                custom: {
                    subject,
                    payloadSize: JSON.stringify(data).length,
                    replyTo: options?.replyTo,
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
            logger?.error('NATS publish failed', error, {
                traceId: spanContext.traceId,
                spanId: spanContext.spanId,
                custom: {
                    subject,
                },
            });
            throw error;
        }
        finally {
            span.end();
        }
    };
}
/**
 * Wrap NATS subscribe with tracing
 */
function createTracedSubscriber(config) {
    const { serviceName, logger } = config;
    const tracer = api_1.trace.getTracer(serviceName);
    return function subscribeWithTracing(subject, handler) {
        return async (msg) => {
            let tracedMessage;
            try {
                // Parse the message if it's a string
                tracedMessage = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
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
            const span = tracer.startSpan(`NATS Consume: ${subject}`, {
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
            const ctx = api_1.trace.setSpan(api_1.context.active(), span);
            logger?.info('NATS message received', {
                traceId: tracedMessage.headers.traceId,
                spanId: span.spanContext().spanId,
                parentSpanId: tracedMessage.headers.spanId,
                custom: {
                    subject,
                    messageId: msg.sid,
                    payloadSize: JSON.stringify(tracedMessage.data).length,
                },
            });
            try {
                await api_1.context.with(ctx, async () => {
                    await handler(tracedMessage.data, span);
                });
                span.setStatus({ code: api_1.SpanStatusCode.OK });
                logger?.info('NATS message processed', {
                    traceId: tracedMessage.headers.traceId,
                    spanId: span.spanContext().spanId,
                    custom: {
                        subject,
                        messageId: msg.sid,
                    },
                });
            }
            catch (error) {
                span.recordException(error);
                span.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: error instanceof Error ? error.message : String(error),
                });
                logger?.error('NATS message processing failed', error, {
                    traceId: tracedMessage.headers.traceId,
                    spanId: span.spanContext().spanId,
                    custom: {
                        subject,
                        messageId: msg.sid,
                    },
                });
                throw error;
            }
            finally {
                span.end();
            }
        };
    };
}
/**
 * Wrap NATS request-reply with tracing
 */
function createTracedRequest(config) {
    const { serviceName, logger } = config;
    const tracer = api_1.trace.getTracer(serviceName);
    return async function requestWithTracing(subject, data, options) {
        const span = tracer.startSpan(`NATS Request: ${subject}`, {
            kind: api_1.SpanKind.CLIENT,
            attributes: {
                'messaging.system': 'nats',
                'messaging.destination': subject,
                'messaging.operation': 'request',
                'messaging.message.payload_size_bytes': JSON.stringify(data).length,
            },
        });
        const spanContext = span.spanContext();
        const tracedMessage = {
            data,
            headers: {
                traceId: spanContext.traceId,
                spanId: spanContext.spanId,
                timestamp: new Date().toISOString(),
                ...options?.headers,
            },
        };
        if (options?.timeout) {
            span.setAttribute('messaging.nats.timeout_ms', options.timeout);
        }
        const startTime = Date.now();
        try {
            // Here you would call the actual NATS request method
            // For example: const response = await nc.request(subject, JSON.stringify(tracedMessage), options)
            const duration = Date.now() - startTime;
            span.setAttribute('messaging.duration_ms', duration);
            logger?.info('NATS request completed', {
                traceId: spanContext.traceId,
                spanId: spanContext.spanId,
                custom: {
                    subject,
                    duration,
                    payloadSize: JSON.stringify(data).length,
                },
            });
            span.setStatus({ code: api_1.SpanStatusCode.OK });
            // Return the response data
            // return response.data;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            span.setAttribute('messaging.duration_ms', duration);
            span.recordException(error);
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: error instanceof Error ? error.message : String(error),
            });
            logger?.error('NATS request failed', error, {
                traceId: spanContext.traceId,
                spanId: spanContext.spanId,
                custom: {
                    subject,
                    duration,
                },
            });
            throw error;
        }
        finally {
            span.end();
        }
    };
}
/**
 * Create a traced NATS client wrapper
 */
class TracedNatsClient {
    config;
    publish;
    subscribe;
    request;
    constructor(config) {
        this.config = config;
        this.publish = createTracedPublisher(config);
        this.subscribe = createTracedSubscriber(config);
        this.request = createTracedRequest(config);
    }
    async publishEvent(subject, event) {
        const span = api_1.trace.getActiveSpan();
        const parentContext = span?.spanContext();
        await this.publish(subject, event, {
            headers: {
                'event.type': event.type,
                'event.aggregate_id': event.aggregateId,
                'event.timestamp': new Date().toISOString(),
                ...(parentContext
                    ? {
                        'trace.parent_trace_id': parentContext.traceId,
                        'trace.parent_span_id': parentContext.spanId,
                    }
                    : {}),
            },
        });
    }
    subscribeToEvents(subject, handler) {
        this.subscribe(subject, async (event, span) => {
            // Add event-specific attributes to span
            if (event.type) {
                span.setAttribute('event.type', event.type);
            }
            if (event.aggregateId) {
                span.setAttribute('event.aggregate_id', event.aggregateId);
            }
            await handler(event, span);
        });
    }
    async sendCommand(subject, command, timeout) {
        const span = api_1.trace.getActiveSpan();
        const parentContext = span?.spanContext();
        return this.request(subject, command, {
            timeout,
            headers: {
                'command.type': command.type,
                'command.aggregate_id': command.aggregateId,
                'command.timestamp': new Date().toISOString(),
                ...(parentContext
                    ? {
                        'trace.parent_trace_id': parentContext.traceId,
                        'trace.parent_span_id': parentContext.spanId,
                    }
                    : {}),
            },
        });
    }
}
exports.TracedNatsClient = TracedNatsClient;
//# sourceMappingURL=nats-tracing.js.map