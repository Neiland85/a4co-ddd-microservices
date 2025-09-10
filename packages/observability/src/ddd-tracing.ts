import { trace, context, SpanStatusCode, SpanKind } from '@opentelemetry/api';
import { getTracer } from './tracer';

// Interfaces para DDD
export interface AggregateMetadata {
  aggregateName: string;
  aggregateId: string;
  version?: number;
}

export interface CommandMetadata {
  commandName: string;
  commandId: string;
  aggregateId?: string;
  userId?: string;
  correlationId?: string;
}

export interface EventMetadata {
  eventName: string;
  eventId: string;
  aggregateId?: string;
  correlationId?: string;
  causationId?: string;
}

export interface DomainEvent {
  eventId: string;
  eventName: string;
  aggregateId: string;
  aggregateName: string;
  version: number;
  timestamp: Date;
  data: any;
  metadata: {
    correlationId?: string;
    causationId?: string;
    userId?: string;
  };
}

// Decorador para métodos de agregados
export function TraceAggregateMethod(aggregateName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const tracer = getTracer('ddd-aggregate');
      const span = tracer.startSpan(`${aggregateName}.${propertyName}`, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'ddd.aggregate.name': aggregateName,
          'ddd.method.name': propertyName,
          'ddd.method.type': 'aggregate',
        },
      });

      try {
        // Extraer metadata del contexto si está disponible
        const activeContext = context.active();
        const correlationId = activeContext.getValue('correlationId');
        const userId = activeContext.getValue('userId');

        if (correlationId) {
          span.setAttribute('ddd.correlation_id', correlationId as string);
        }
        if (userId) {
          span.setAttribute('ddd.user_id', userId as string);
        }

        // Ejecutar el método original
        const result = await method.apply(this, args);

        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        span.recordException(error as Error);
        throw error;
      } finally {
        span.end();
      }
    };
  };
}

// Decorador para comandos
export function TraceCommand(commandName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const tracer = getTracer('ddd-command');
      const span = tracer.startSpan(`command.${commandName}`, {
        kind: SpanKind.INTERNAL,
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

        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        span.recordException(error as Error);
        throw error;
      } finally {
        span.end();
      }
    };
  };
}

// Decorador para event handlers
export function TraceEventHandler(eventName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const tracer = getTracer('ddd-event');
      const span = tracer.startSpan(`event.${eventName}`, {
        kind: SpanKind.INTERNAL,
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

        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        span.recordException(error as Error);
        throw error;
      } finally {
        span.end();
      }
    };
  };
}

// Clase para manejo de contexto DDD
export class DDDContext {
  private static correlationIdKey = Symbol('correlationId');
  private static userIdKey = Symbol('userId');
  private static causationIdKey = Symbol('causationId');

  static setCorrelationId(correlationId: string): void {
    context.active().setValue(this.correlationIdKey, correlationId);
  }

  static getCorrelationId(): string | undefined {
    return context.active().getValue(this.correlationIdKey) as string;
  }

  static setUserId(userId: string): void {
    context.active().setValue(this.userIdKey, userId);
  }

  static getUserId(): string | undefined {
    return context.active().getValue(this.userIdKey) as string;
  }

  static setCausationId(causationId: string): void {
    context.active().setValue(this.causationIdKey, causationId);
  }

  static getCausationId(): string | undefined {
    return context.active().getValue(this.causationIdKey) as string;
  }

  static createContext(metadata: {
    correlationId?: string;
    userId?: string;
    causationId?: string;
  }) {
    let ctx = context.active();

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

// Función para crear spans de dominio
export function createDomainSpan(
  operation: string,
  metadata: AggregateMetadata | CommandMetadata | EventMetadata,
  kind: SpanKind = SpanKind.INTERNAL
) {
  const tracer = getTracer('ddd-domain');
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
export function injectNATSTraceContext(headers: Record<string, string>): Record<string, string> {
  const activeContext = context.active();
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
  const tracer = getTracer('ddd-nats');
  const span = tracer.startSpan('nats.message.inject');

  try {
    // Aquí se inyectaría el contexto de trace en los headers
    // usando el propagator de OpenTelemetry
    span.setAttributes({
      'messaging.system': 'nats',
      'messaging.operation': 'publish',
    });
  } finally {
    span.end();
  }

  return traceHeaders;
}

// Función para extraer contexto de mensajes NATS
export function extractNATSTraceContext(headers: Record<string, string>): void {
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
  const tracer = getTracer('ddd-nats');
  const span = tracer.startSpan('nats.message.extract');

  try {
    span.setAttributes({
      'messaging.system': 'nats',
      'messaging.operation': 'consume',
      'ddd.correlation.id': correlationId,
      'ddd.user.id': userId,
      'ddd.causation.id': causationId,
    });
  } finally {
    span.end();
  }
}

// Middleware para Express/Koa que propaga contexto DDD
export function dddContextMiddleware() {
  return (req: any, res: any, next: any) => {
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
export function traceDomainTransaction<T>(
  operation: string,
  metadata: AggregateMetadata | CommandMetadata | EventMetadata,
  fn: () => Promise<T>
): Promise<T> {
  const span = createDomainSpan(operation, metadata);

  return context.with(
    DDDContext.createContext({
      correlationId: metadata.correlationId,
      userId: metadata.userId,
      causationId: metadata.causationId,
    }),
    async () => {
      try {
        const result = await fn();
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        span.recordException(error as Error);
        throw error;
      } finally {
        span.end();
      }
    }
  );
}
