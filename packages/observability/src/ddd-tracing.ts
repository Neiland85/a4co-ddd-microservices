import { SpanStatusCode, trace } from '@opentelemetry/api';

export function TraceEventHandler(eventName: string) {
  return function <T extends new (...args: any[]) => any>(
    target: T,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ): void {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const span = trace.getTracer('ddd-tracer').startSpan(`event:${eventName}`, {
        attributes: {
          'ddd.event.name': eventName,
        },
      });

      try {
        const result = await originalMethod.apply(this, args);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        if (error instanceof Error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        }
        throw error;
      } finally {
        span.end();
      }
    };
  };
}
