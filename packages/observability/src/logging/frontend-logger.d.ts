/**
 * Frontend logger implementation for React applications
 */
import { Logger, LoggerConfig, LogContext } from './types';
export interface FrontendLoggerConfig extends Omit<LoggerConfig, 'destination'> {
    endpoint?: string;
    bufferSize?: number;
    flushInterval?: number;
    enableConsole?: boolean;
    enableRemote?: boolean;
}
export declare class FrontendLogger implements Logger {
    private buffer;
    private config;
    private baseContext;
    private flushTimer?;
    constructor(config: FrontendLoggerConfig);
    private startFlushTimer;
    private handleWindowError;
    private handleUnhandledRejection;
    private shouldLog;
    private log;
    private logToConsole;
    private addToBuffer;
    private flush;
    trace(message: string, context?: Partial<LogContext>): void;
    debug(message: string, context?: Partial<LogContext>): void;
    info(message: string, context?: Partial<LogContext>): void;
    warn(message: string, context?: Partial<LogContext>): void;
    error(message: string, error?: Error | unknown, context?: Partial<LogContext>): void;
    fatal(message: string, error?: Error | unknown, context?: Partial<LogContext>): void;
    child(context: Partial<LogContext>): Logger;
    destroy(): void;
}
/**
 * Factory function to create a frontend logger instance
 */
export declare function createFrontendLogger(config: FrontendLoggerConfig): FrontendLogger;
//# sourceMappingURL=frontend-logger.d.ts.map