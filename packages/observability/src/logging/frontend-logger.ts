/**
 * Frontend logger implementation for React applications
 */

import { Logger, LoggerConfig, LogContext, LogLevel } from './types';

export interface FrontendLoggerConfig extends Omit<LoggerConfig, 'destination'> {
  endpoint?: string;
  bufferSize?: number;
  flushInterval?: number;
  enableConsole?: boolean;
  enableRemote?: boolean;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context: Partial<LogContext>;
  timestamp: string;
}

export class FrontendLogger implements Logger {
  private buffer: LogEntry[] = [];
  private config: FrontendLoggerConfig;
  private baseContext: Partial<LogContext>;
  private flushTimer?: NodeJS.Timeout;

  constructor(config: FrontendLoggerConfig) {
    this.config = {
      level: 'info',
      bufferSize: 100,
      flushInterval: 5000,
      enableConsole: true,
      enableRemote: true,
      ...config,
    };

    this.baseContext = {
      service: config.service,
      environment: config.environment,
      version: config.version,
    };

    if (this.config.enableRemote && this.config.flushInterval) {
      this.startFlushTimer();
    }

    // Attach to window error events
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleWindowError.bind(this));
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private handleWindowError(event: ErrorEvent): void {
    this.error('Unhandled error', event.error, {
      custom: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    this.error('Unhandled promise rejection', event.reason);
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
    const configLevelIndex = levels.indexOf(this.config.level || 'info');
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= configLevelIndex;
  }

  private log(level: LogLevel, message: string, context?: Partial<LogContext>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      context: {
        ...this.baseContext,
        ...context,
        custom: {
          ...context?.custom,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        },
      },
      timestamp: new Date().toISOString(),
    };

    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    if (this.config.enableRemote) {
      this.addToBuffer(entry);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const consoleMethods = {
      trace: console.trace,
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
      fatal: console.error,
    };

    const method = consoleMethods[entry.level] || console.log;
    method(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.context);
  }

  private addToBuffer(entry: LogEntry): void {
    this.buffer.push(entry);

    if (this.buffer.length >= (this.config.bufferSize || 100)) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0 || !this.config.endpoint) {
      return;
    }

    const logsToSend = [...this.buffer];
    this.buffer = [];

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: logsToSend,
          metadata: {
            service: this.config.service,
            environment: this.config.environment,
            version: this.config.version,
          },
        }),
      });
    } catch (error) {
      // Re-add logs to buffer if send fails
      this.buffer = [...logsToSend, ...this.buffer];
      console.error('Failed to send logs to server:', error);
    }
  }

  trace(message: string, context?: Partial<LogContext>): void {
    this.log('trace', message, context);
  }

  debug(message: string, context?: Partial<LogContext>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Partial<LogContext>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Partial<LogContext>): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: Partial<LogContext>): void {
    const errorContext =
      error instanceof Error
        ? {
            error: {
              message: error.message,
              stackTrace: error.stack,
              name: error.name,
            },
          }
        : error
          ? { error: String(error) }
          : {};

    this.log('error', message, {
      ...context,
      ...errorContext,
    });
  }

  fatal(message: string, error?: Error | unknown, context?: Partial<LogContext>): void {
    const errorContext =
      error instanceof Error
        ? {
            error: {
              message: error.message,
              stackTrace: error.stack,
              name: error.name,
            },
          }
        : error
          ? { error: String(error) }
          : {};

    this.log('fatal', message, {
      ...context,
      ...errorContext,
    });
  }

  child(context: Partial<LogContext>): Logger {
    const childLogger = new FrontendLogger(this.config);
    childLogger.baseContext = { ...this.baseContext, ...context };
    return childLogger;
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

/**
 * Factory function to create a frontend logger instance
 */
export function createFrontendLogger(config: FrontendLoggerConfig): FrontendLogger {
  return new FrontendLogger(config);
}
