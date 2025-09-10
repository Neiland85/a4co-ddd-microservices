/**
 * NATS integration for distributed tracing
 */

import { trace, context, SpanKind, SpanStatusCode, Span } from '@opentelemetry/api';
import { Logger } from '../logging/types';
import { v4 as uuidv4 } from 'uuid';

export interface NatsTracingConfig {
  serviceName: string;
  logger?: Logger;
}

export interface TracedMessage {
  data: any;
  headers: {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    timestamp: string;
    [key: string]: any;
  };
}

/**
 * Wrap NATS publish with tracing
 */
export function createTracedPublisher(config: NatsTracingConfig) {
  const { serviceName, logger } = config;
  const tracer = trace.getTracer(serviceName);

  return async function publishWithTracing(
    subject: string,
    data: any,
    options?: {
      replyTo?: string;
      headers?: Record<string, string>;
    }
  ): Promise<void> {
    const span = tracer.startSpan(`NATS Publish: ${subject}`, {
      kind: SpanKind.PRODUCER,
      attributes: {
        'messaging.system': 'nats',
        'messaging.destination': subject,
        'messaging.operation': 'publish',
        'messaging.message.payload_size_bytes': JSON.stringify(data).length,
      },
    });

    const spanContext = span.spanContext();
    const tracedMessage: TracedMessage = {
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

      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
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
    } finally {
      span.end();
    }
  };
}

/**
 * Wrap NATS subscribe with tracing
 */
export function createTracedSubscriber(config: NatsTracingConfig) {
  const { serviceName, logger } = config;
  const tracer = trace.getTracer(serviceName);

  return function subscribeWithTracing(
    subject: string,
    handler: (msg: any, span: Span) => Promise<void>
  ) {
    return async (msg: any) => {
      let tracedMessage: TracedMessage;

      try {
        // Parse the message if it's a string
        tracedMessage = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
      } catch (e) {
        // If parsing fails, treat as plain message
        tracedMessage = {
          data: msg.data,
          headers: {
            traceId: uuidv4(),
            spanId: uuidv4(),
            timestamp: new Date().toISOString(),
          },
        };
      }

      const span = tracer.startSpan(`NATS Consume: ${subject}`, {
        kind: SpanKind.CONSUMER,
        attributes: {
          'messaging.system': 'nats',
          'messaging.destination': subject,
          'messaging.operation': 'consume',
          'messaging.message.id': msg.sid || uuidv4(),
          'messaging.message.payload_size_bytes': JSON.stringify(tracedMessage.data).length,
          'trace.parent.id': tracedMessage.headers.traceId,
          'span.parent.id': tracedMessage.headers.spanId,
        },
      });

      const ctx = trace.setSpan(context.active(), span);

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
        await context.with(ctx, async () => {
          await handler(tracedMessage.data, span);
        });

        span.setStatus({ code: SpanStatusCode.OK });

        logger?.info('NATS message processed', {
          traceId: tracedMessage.headers.traceId,
          spanId: span.spanContext().spanId,
          custom: {
            subject,
            messageId: msg.sid,
          },
        });
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
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
      } finally {
        span.end();
      }
    };
  };
}

/**
 * Wrap NATS request-reply with tracing
 */
export function createTracedRequest(config: NatsTracingConfig) {
  const { serviceName, logger } = config;
  const tracer = trace.getTracer(serviceName);

  return async function requestWithTracing(
    subject: string,
    data: any,
    options?: {
      timeout?: number;
      headers?: Record<string, string>;
    }
  ): Promise<any> {
    const span = tracer.startSpan(`NATS Request: ${subject}`, {
      kind: SpanKind.CLIENT,
      attributes: {
        'messaging.system': 'nats',
        'messaging.destination': subject,
        'messaging.operation': 'request',
        'messaging.message.payload_size_bytes': JSON.stringify(data).length,
      },
    });

    const spanContext = span.spanContext();
    const tracedMessage: TracedMessage = {
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

      span.setStatus({ code: SpanStatusCode.OK });

      // Return the response data
      // return response.data;
    } catch (error) {
      const duration = Date.now() - startTime;
      span.setAttribute('messaging.duration_ms', duration);

      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
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
    } finally {
      span.end();
    }
  };
}

/**
 * Create a traced NATS client wrapper
 */
export class TracedNatsClient {
  private config: NatsTracingConfig;
  private publish: ReturnType<typeof createTracedPublisher>;
  private subscribe: ReturnType<typeof createTracedSubscriber>;
  private request: ReturnType<typeof createTracedRequest>;

  constructor(config: NatsTracingConfig) {
    this.config = config;
    this.publish = createTracedPublisher(config);
    this.subscribe = createTracedSubscriber(config);
    this.request = createTracedRequest(config);
  }

  async publishEvent(
    subject: string,
    event: {
      type: string;
      aggregateId: string;
      data: any;
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    const span = trace.getActiveSpan();
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

  subscribeToEvents(subject: string, handler: (event: any, span: Span) => Promise<void>): void {
    this.subscribe(subject, async (event: any, span: Span) => {
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

  async sendCommand(
    subject: string,
    command: {
      type: string;
      aggregateId: string;
      data: any;
      metadata?: Record<string, any>;
    },
    timeout?: number
  ): Promise<any> {
    const span = trace.getActiveSpan();
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
