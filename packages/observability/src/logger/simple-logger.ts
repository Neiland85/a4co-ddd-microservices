import pino from 'pino';
import { getTraceContext } from '../utils/async-context';
import type { LogPayload } from '../types/log-payload.types';

/**
 * Simplified logger class that automatically injects trace context
 * Uses AsyncLocalStorage to get current trace context
 */
export class SimpleLogger {
  private pinoLogger: pino.Logger;

  constructor(pinoLogger: pino.Logger) {
    this.pinoLogger = pinoLogger;
  }

  /**
   * Log info level message with automatic trace context injection
   * 
   * @param payload - Structured log payload
   * @param message - Log message
   */
  info(payload: LogPayload, message: string): void;
  info(message: string, payload?: LogPayload): void;
  info(payloadOrMessage: LogPayload | string, messageOrPayload?: string | LogPayload): void {
    const { payload, message } = this.normalizeArgs(payloadOrMessage, messageOrPayload);
    const context = getTraceContext();
    
    this.pinoLogger.info(
      { 
        ...payload, 
        traceId: payload.traceId || context.traceId,
        spanId: payload.spanId || context.spanId,
      },
      message
    );
  }

  /**
   * Log warning level message with automatic trace context injection
   * 
   * @param payload - Structured log payload
   * @param message - Log message
   */
  warn(payload: LogPayload, message: string): void;
  warn(message: string, payload?: LogPayload): void;
  warn(payloadOrMessage: LogPayload | string, messageOrPayload?: string | LogPayload): void {
    const { payload, message } = this.normalizeArgs(payloadOrMessage, messageOrPayload);
    const context = getTraceContext();
    
    this.pinoLogger.warn(
      { 
        ...payload, 
        traceId: payload.traceId || context.traceId,
        spanId: payload.spanId || context.spanId,
      },
      message
    );
  }

  /**
   * Log error level message with automatic trace context injection
   * 
   * @param payload - Structured log payload or Error object
   * @param message - Log message or Error object
   */
  error(payload: LogPayload | Error, message?: string | Error): void;
  error(message: string | Error, payload?: LogPayload): void;
  error(payloadOrMessage: LogPayload | Error | string, messageOrPayload?: string | Error | LogPayload): void {
    const context = getTraceContext();
    
    // Handle Error objects
    if (payloadOrMessage instanceof Error) {
      const error = payloadOrMessage;
      const additionalPayload = typeof messageOrPayload === 'object' && !(messageOrPayload instanceof Error) 
        ? messageOrPayload 
        : {};
      
      this.pinoLogger.error(
        { 
          ...additionalPayload,
          traceId: additionalPayload.traceId || context.traceId,
          spanId: additionalPayload.spanId || context.spanId,
          error: {
            message: error.message,
            name: error.name,
            stack: error.stack,
          },
        },
        error.message
      );
      return;
    }

    if (messageOrPayload instanceof Error) {
      const error = messageOrPayload;
      const payload = typeof payloadOrMessage === 'object' ? payloadOrMessage : {};
      
      this.pinoLogger.error(
        { 
          ...payload,
          traceId: payload.traceId || context.traceId,
          spanId: payload.spanId || context.spanId,
          error: {
            message: error.message,
            name: error.name,
            stack: error.stack,
          },
        },
        error.message
      );
      return;
    }

    // Handle string messages
    const { payload, message } = this.normalizeArgs(payloadOrMessage, messageOrPayload);
    
    this.pinoLogger.error(
      { 
        ...payload, 
        traceId: payload.traceId || context.traceId,
        spanId: payload.spanId || context.spanId,
      },
      message
    );
  }

  /**
   * Log debug level message with automatic trace context injection
   * 
   * @param payload - Structured log payload
   * @param message - Log message
   */
  debug(payload: LogPayload, message: string): void;
  debug(message: string, payload?: LogPayload): void;
  debug(payloadOrMessage: LogPayload | string, messageOrPayload?: string | LogPayload): void {
    const { payload, message } = this.normalizeArgs(payloadOrMessage, messageOrPayload);
    const context = getTraceContext();
    
    this.pinoLogger.debug(
      { 
        ...payload, 
        traceId: payload.traceId || context.traceId,
        spanId: payload.spanId || context.spanId,
      },
      message
    );
  }

  /**
   * Log fatal level message with automatic trace context injection
   * 
   * @param payload - Structured log payload
   * @param message - Log message
   */
  fatal(payload: LogPayload, message: string): void;
  fatal(message: string, payload?: LogPayload): void;
  fatal(payloadOrMessage: LogPayload | string, messageOrPayload?: string | LogPayload): void {
    const { payload, message } = this.normalizeArgs(payloadOrMessage, messageOrPayload);
    const context = getTraceContext();
    
    this.pinoLogger.fatal(
      { 
        ...payload, 
        traceId: payload.traceId || context.traceId,
        spanId: payload.spanId || context.spanId,
      },
      message
    );
  }

  /**
   * Create a child logger with additional context
   * 
   * @param context - Additional context to include in all logs
   * @returns New logger instance with merged context
   */
  child(context: Record<string, any>): SimpleLogger {
    return new SimpleLogger(this.pinoLogger.child(context));
  }

  /**
   * Get the underlying Pino logger instance
   * Useful for advanced use cases
   */
  get raw(): pino.Logger {
    return this.pinoLogger;
  }

  /**
   * Normalize arguments to extract payload and message
   * Supports both (payload, message) and (message, payload) signatures
   */
  private normalizeArgs(
    first: LogPayload | string,
    second?: string | LogPayload
  ): { payload: LogPayload; message: string } {
    if (typeof first === 'string') {
      return {
        message: first,
        payload: (typeof second === 'object' ? second : {}) as LogPayload,
      };
    }
    
    return {
      payload: first as LogPayload,
      message: (typeof second === 'string' ? second : '') as string,
    };
  }
}

/**
 * Create a simple logger instance with Pino configuration
 * 
 * @param config - Logger configuration
 * @returns SimpleLogger instance
 */
export function createSimpleLogger(config: {
  serviceName: string;
  environment: string;
  level?: string;
  prettyPrint?: boolean;
}): SimpleLogger {
  const isProduction = config.environment === 'production';

  const pinoConfig: pino.LoggerOptions = {
    name: config.serviceName,
    level: config.level || (isProduction ? 'info' : 'debug'),
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label }),
      bindings: (bindings) => ({
        service: bindings.name || config.serviceName,
        pid: bindings.pid,
        hostname: bindings.hostname,
        environment: config.environment,
      }),
    },
    serializers: {
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
      err: pino.stdSerializers.err,
    },
  };

  // Use pino-pretty for development
  if (!isProduction && config.prettyPrint !== false) {
    const pinoLogger = pino({
      ...pinoConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      },
    });
    return new SimpleLogger(pinoLogger);
  }

  const pinoLogger = pino(pinoConfig);
  return new SimpleLogger(pinoLogger);
}
