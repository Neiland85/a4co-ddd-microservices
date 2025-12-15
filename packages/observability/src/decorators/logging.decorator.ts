import { getLogger } from '../logger';

/**
 * Decorator options for @Log()
 */
export interface LogOptions {
  /**
   * Log level (default: 'info')
   */
  level?: 'debug' | 'info' | 'warn' | 'error';

  /**
   * Custom message prefix
   */
  prefix?: string;

  /**
   * Whether to log method arguments (default: false for security)
   */
  logArgs?: boolean;

  /**
   * Whether to log return value (default: false for security)
   */
  logResult?: boolean;

  /**
   * Whether to log execution time (default: true)
   */
  logExecutionTime?: boolean;

  /**
   * Additional context to include in logs
   */
  context?: Record<string, any>;
}

/**
 * @Log() - Method decorator for automatic logging
 * 
 * Logs method entry, exit, errors, and optionally execution time
 * Automatically includes trace context (traceId, spanId)
 * 
 * @example
 * ```typescript
 * class OrderService {
 *   @Log()
 *   async createOrder(dto: CreateOrderDto) {
 *     // Logs: "OrderService.createOrder started"
 *     // Logs: "OrderService.createOrder completed (123ms)"
 *   }
 * 
 *   @Log({ level: 'debug', logArgs: true })
 *   validateOrder(order: Order) {
 *     // Logs with debug level and arguments
 *   }
 * 
 *   @Log({ prefix: '🎯', logResult: true })
 *   calculateTotal(items: Item[]) {
 *     // Custom prefix and logs result
 *   }
 * }
 * ```
 */
export function Log(options: LogOptions = {}): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    const methodName = String(propertyKey);
    const logger = getLogger();

    const {
      level = 'info',
      prefix = '',
      logArgs = false,
      logResult = false,
      logExecutionTime = true,
      context = {},
    } = options;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const fullMethodName = `${className}.${methodName}`;
      const logPrefix = prefix ? `${prefix} ` : '';

      // Log method entry
      const entryContext = {
        ...context,
        method: fullMethodName,
        ...(logArgs && { arguments: args }),
      };

      logger[level](`${logPrefix}${fullMethodName} started`, entryContext);

      try {
        // Execute original method
        const result = await originalMethod.apply(this, args);

        // Log method success
        const duration = Date.now() - startTime;
        const successContext = {
          ...context,
          method: fullMethodName,
          ...(logExecutionTime && { durationMs: duration }),
          ...(logResult && { result }),
        };

        logger[level](`${logPrefix}${fullMethodName} completed`, successContext);

        return result;
      } catch (error) {
        // Log method error
        const duration = Date.now() - startTime;
        const errorContext = {
          ...context,
          method: fullMethodName,
          ...(logExecutionTime && { durationMs: duration }),
          error: error instanceof Error ? error.message : String(error),
          ...(error instanceof Error && { stack: error.stack }),
        };

        logger.error(`${logPrefix}${fullMethodName} failed`, errorContext);

        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * @LogDDD() - Decorator for Domain-Driven Design operations with structured logging
 * 
 * Similar to @Log() but includes DDD-specific context
 * 
 * @example
 * ```typescript
 * class OrderAggregate {
 *   @LogDDD({ 
 *     aggregateName: 'Order',
 *     commandName: 'CreateOrder',
 *     level: 'info'
 *   })
 *   async create(dto: CreateOrderDto) {
 *     // Logs with DDD context
 *   }
 * }
 * ```
 */
export function LogDDD(options: {
  aggregateName?: string;
  aggregateId?: string;
  commandName?: string;
  eventName?: string;
  level?: 'debug' | 'info' | 'warn' | 'error';
  logArgs?: boolean;
  logResult?: boolean;
}): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    const methodName = String(propertyKey);
    const logger = getLogger();

    const {
      aggregateName,
      aggregateId,
      commandName,
      eventName,
      level = 'info',
      logArgs = false,
      logResult = false,
    } = options;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();

      // Build DDD context
      const dddContext: Record<string, any> = {
        className,
        methodName,
      };

      if (aggregateName) dddContext.aggregateName = aggregateName;
      if (aggregateId) dddContext.aggregateId = aggregateId;
      if (commandName) dddContext.commandName = commandName;
      if (eventName) dddContext.eventName = eventName;
      if (logArgs) dddContext.arguments = args;

      logger[level](`DDD operation started`, dddContext);

      try {
        const result = await originalMethod.apply(this, args);

        const duration = Date.now() - startTime;
        logger[level](`DDD operation completed`, {
          ...dddContext,
          durationMs: duration,
          ...(logResult && { result }),
        });

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`DDD operation failed`, {
          ...dddContext,
          durationMs: duration,
          error: error instanceof Error ? error.message : String(error),
          ...(error instanceof Error && { stack: error.stack }),
        });

        throw error;
      }
    };

    return descriptor;
  };
}
