/**
 * Pino logger implementation for A4CO observability
 */

import pino, { Logger as PinoLogger } from 'pino';
import { Logger, LoggerConfig, LogContext, LogLevel } from './types';

export class PinoLoggerAdapter implements Logger {
  private logger: PinoLogger;
  private baseContext: Partial<LogContext>;

  constructor(config: LoggerConfig) {
    const { level = 'info', pretty = false, service, environment, version, customSerializers = {}, destination, redact = [] } = config;

    this.baseContext = {
      service,
      environment,
      version,
    };

    const transport = pretty
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined;

    this.logger = pino({
      level,
      transport,
      base: this.baseContext,
      serializers: {
        ...pino.stdSerializers,
        ...customSerializers,
        ddd: (value) => value,
        http: (value) => value,
        error: pino.stdSerializers.err,
      },
      redact,
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label) => ({ level: label }),
      },
    }, destination ? pino.destination(destination) : undefined);
  }

  private mergeContext(context?: Partial<LogContext>): any {
    return {
      ...this.baseContext,
      ...context,
      timestamp: new Date().toISOString(),
    };
  }

  trace(message: string, context?: Partial<LogContext>): void {
    this.logger.trace(this.mergeContext(context), message);
  }

  debug(message: string, context?: Partial<LogContext>): void {
    this.logger.debug(this.mergeContext(context), message);
  }

  info(message: string, context?: Partial<LogContext>): void {
    this.logger.info(this.mergeContext(context), message);
  }

  warn(message: string, context?: Partial<LogContext>): void {
    this.logger.warn(this.mergeContext(context), message);
  }

  error(message: string, error?: Error | unknown, context?: Partial<LogContext>): void {
    const errorContext = error instanceof Error
      ? {
          error: {
            message: error.message,
            stackTrace: error.stack,
            name: error.name,
          },
        }
      : error
      ? { error }
      : {};

    this.logger.error({
      ...this.mergeContext(context),
      ...errorContext,
    }, message);
  }

  fatal(message: string, error?: Error | unknown, context?: Partial<LogContext>): void {
    const errorContext = error instanceof Error
      ? {
          error: {
            message: error.message,
            stackTrace: error.stack,
            name: error.name,
          },
        }
      : error
      ? { error }
      : {};

    this.logger.fatal({
      ...this.mergeContext(context),
      ...errorContext,
    }, message);
  }

  child(context: Partial<LogContext>): Logger {
    const childLogger = Object.create(this);
    childLogger.logger = this.logger.child(context);
    childLogger.baseContext = { ...this.baseContext, ...context };
    return childLogger;
  }
}

/**
 * Factory function to create a logger instance
 */
export function createLogger(config: LoggerConfig): Logger {
  return new PinoLoggerAdapter(config);
}