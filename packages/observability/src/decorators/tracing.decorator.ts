import { context, SpanStatusCode, trace } from '@opentelemetry/api';
import type { Span } from '@opentelemetry/api';

/**
 * Decorator options for @Tracing()
 */
export interface TracingOptions {
  /**
   * Custom span name. If not provided, uses class.method format
   */
  name?: string;

  /**
   * Additional attributes to add to the span
   */
  attributes?: Record<string, string | number | boolean>;

  /**
   * Whether to record exceptions in the span
   */
  recordException?: boolean;
}

/**
 * @Tracing() - Method decorator for automatic span creation
 * 
 * Creates a new span for the decorated method and automatically:
 * - Sets span name based on class and method name
 * - Records method arguments as attributes (configurable)
 * - Handles errors and sets error status
 * - Ensures span is ended even if method throws
 * 
 * @example
 * ```typescript
 * class OrderService {
 *   @Tracing()
 *   async createOrder(dto: CreateOrderDto) {
 *     // Span automatically created: OrderService.createOrder
 *     return this.orderRepository.save(dto);
 *   }
 * 
 *   @Tracing({ name: 'order.validate', attributes: { version: '2.0' } })
 *   validateOrder(order: Order) {
 *     // Custom span name and attributes
 *   }
 * }
 * ```
 */
export function Tracing(options: TracingOptions = {}): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    const methodName = String(propertyKey);

    // Default span name: ClassName.methodName
    const spanName = options.name || `${className}.${methodName}`;

    descriptor.value = async function (...args: any[]) {
      const tracer = trace.getTracer('@a4co/observability');

      return tracer.startActiveSpan(spanName, async (span: Span) => {
        try {
          // Add custom attributes
          if (options.attributes) {
            span.setAttributes(options.attributes);
          }

          // Add method context
          span.setAttributes({
            'code.function': methodName,
            'code.namespace': className,
          });

          // Execute original method
          const result = await originalMethod.apply(this, args);

          // Mark span as successful
          span.setStatus({ code: SpanStatusCode.OK });

          return result;
        } catch (error) {
          // Record exception if enabled (default: true)
          if (options.recordException !== false) {
            span.recordException(error as Error);
          }

          // Set error status
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error instanceof Error ? error.message : 'Unknown error',
          });

          throw error;
        } finally {
          // Always end the span
          span.end();
        }
      });
    };

    return descriptor;
  };
}

/**
 * @TraceDDD() - Decorator for Domain-Driven Design operations
 * 
 * Similar to @Tracing() but adds DDD-specific attributes
 * 
 * @example
 * ```typescript
 * class OrderAggregate {
 *   @TraceDDD({ 
 *     aggregateName: 'Order', 
 *     commandName: 'CreateOrder' 
 *   })
 *   async create(dto: CreateOrderDto) {
 *     // Span with DDD attributes
 *   }
 * }
 * ```
 */
export function TraceDDD(options: {
  aggregateName?: string;
  aggregateId?: string;
  commandName?: string;
  eventName?: string;
  attributes?: Record<string, string | number | boolean>;
}): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    const methodName = String(propertyKey);

    const spanName = `${options.aggregateName || className}.${options.commandName || methodName}`;

    descriptor.value = async function (...args: any[]) {
      const tracer = trace.getTracer('@a4co/observability');

      return tracer.startActiveSpan(spanName, async (span: Span) => {
        try {
          // Add DDD attributes
          const attributes: Record<string, string> = {
            'code.function': methodName,
            'code.namespace': className,
          };

          if (options.aggregateName) {
            attributes['ddd.aggregate.name'] = options.aggregateName;
          }
          if (options.aggregateId) {
            attributes['ddd.aggregate.id'] = options.aggregateId;
          }
          if (options.commandName) {
            attributes['ddd.command.name'] = options.commandName;
          }
          if (options.eventName) {
            attributes['ddd.event.name'] = options.eventName;
          }

          // Add custom attributes
          if (options.attributes) {
            Object.assign(attributes, options.attributes);
          }

          span.setAttributes(attributes);

          // Execute original method
          const result = await originalMethod.apply(this, args);

          span.setStatus({ code: SpanStatusCode.OK });

          return result;
        } catch (error) {
          span.recordException(error as Error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error instanceof Error ? error.message : 'Unknown error',
          });

          throw error;
        } finally {
          span.end();
        }
      });
    };

    return descriptor;
  };
}
