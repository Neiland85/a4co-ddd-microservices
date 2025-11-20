import pino from 'pino';
import pinoHttp from 'pino-http';
import type { ObservabilityLogger } from './ObservabilityLogger';
import type { LogContext } from './types';
export interface LoggerConfig {
    serviceName: string;
    environment: string;
    level?: string;
    prettyPrint?: boolean;
}
export declare function createLogger(config: LoggerConfig): pino.Logger;
export declare function createHttpLogger(logger?: pino.Logger): ReturnType<typeof pinoHttp>;
export declare class StructuredLogger implements ObservabilityLogger {
    private logger;
    constructor(logger: pino.Logger);
    logWithContext(level: string, message: string, context: Record<string, unknown>): void;
    logWithContext(level: string, context: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    error(message: string, errorOrContext?: Error | Record<string, unknown>, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    debug(message: string, context?: Record<string, unknown>): void;
    metric(name: string, value: number, tags?: Record<string, string>): void;
    audit(action: string, userId: string, resource: string, details?: Record<string, unknown>): void;
    fatal(message: string, context?: Record<string, unknown>): void;
    withContext(context: LogContext): ObservabilityLogger;
    startSpan(name: string, attributes?: Record<string, unknown>): unknown;
    withDDD(metadata: {
        aggregateName?: string;
        aggregateId?: string;
        commandName?: string;
        eventName?: string;
    }): ObservabilityLogger;
    private defaultContext;
}
export declare function initializeLogger(config: LoggerConfig): ObservabilityLogger;
export declare function getLogger(): ObservabilityLogger;
//# sourceMappingURL=logger.d.ts.map