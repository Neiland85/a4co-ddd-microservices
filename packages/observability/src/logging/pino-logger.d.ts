/**
 * Pino logger implementation for A4CO observability
 */
import { Logger, LoggerConfig, LogContext } from './types';
export declare class PinoLoggerAdapter implements Logger {
    private logger;
    private baseContext;
    constructor(config: LoggerConfig);
    private mergeContext;
    trace(message: string, context?: Partial<LogContext>): void;
    debug(message: string, context?: Partial<LogContext>): void;
    info(message: string, context?: Partial<LogContext>): void;
    warn(message: string, context?: Partial<LogContext>): void;
    error(message: string, error?: Error | unknown, context?: Partial<LogContext>): void;
    fatal(message: string, error?: Error | unknown, context?: Partial<LogContext>): void;
    child(context: Partial<LogContext>): Logger;
}
/**
 * Factory function to create a logger instance
 */
export declare function createLogger(config: LoggerConfig): Logger;
//# sourceMappingURL=pino-logger.d.ts.map