import { context, propagation, type Span, SpanStatusCode, trace } from '@opentelemetry/api';
import { connect, type NatsConnection, type Subscription } from 'nats';

// Tipos para NATS
interface Command {
  type: string;
  aggregateId: string;
  data: unknown;
  metadata?: Record<string, unknown>;
}

// Clase para manejar tracing con NATS
export class NatsTracing {
  private nats: NatsConnection;

  constructor(nats: NatsConnection) {
    this.nats = nats;
  }

  async connect(url: string): Promise<void> {
    try {
      this.nats = await connect({ servers: url });
    } catch (e) {
      const span = trace.getActiveSpan();
      if (span && e instanceof Error) {
        span.recordException(e);
        span.setStatus({ code: SpanStatusCode.ERROR, message: e.message });
      }
      throw e;
    }
  }

  subscribeToEvents(subject: string, handler: (event: any, span: Span) => Promise<void>): void {
    const subscription: Subscription = this.nats.subscribe(subject);
    (async () => {
      for await (const msg of subscription) {
        const span = trace.getTracer('nats-tracer').startSpan(`receive:${subject}`, {
          attributes: {
            'nats.subject': subject,
          },
        });

        context.with(trace.setSpan(context.active(), span), async () => {
          try {
            await handler(msg.data, span);
            span.setStatus({ code: SpanStatusCode.OK });
          } catch (e) {
            if (e instanceof Error) {
              span.recordException(e);
              span.setStatus({ code: SpanStatusCode.ERROR, message: e.message });
            }
            throw e;
          } finally {
            span.end();
          }
        });
      }
    })();
  }

  async sendCommand(subject: string, command: Command, timeout?: number): Promise<unknown> {
    const span = trace.getActiveSpan();
    const parentContext = span?.spanContext();
    const headers: Record<string, string> = {};

    if (parentContext) {
      propagation.inject(context.active(), headers);
      headers['x-trace-id'] = parentContext.traceId;
      headers['x-span-id'] = parentContext.spanId;
    }

    try {
      // NATS request payloads must be binary/string; serialize command to JSON
      const response = await this.nats.request(subject, JSON.stringify(command), {
        timeout: timeout ?? 5000,
        // nats headers type may differ; cast for compatibility
        headers: headers as any,
      });
      span?.setStatus({ code: SpanStatusCode.OK });
      return response.data;
    } catch (e) {
      if (e instanceof Error && span) {
        span.recordException(e);
        span.setStatus({ code: SpanStatusCode.ERROR, message: e.message });
      }
      throw e;
    } finally {
      span?.end();
    }
  }
}
