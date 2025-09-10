import pino from 'pino';
export interface LoggerConfig {
    serviceName: string;
    environment: string;
    level?: string;
    prettyPrint?: boolean;
}
export declare function createLogger(config: LoggerConfig): pino.Logger;
export declare function createHttpLogger(logger: pino.Logger): any;
export declare class StructuredLogger {
    private logger;
    constructor(logger: pino.Logger);
    logWithContext(level: string, message: string, context: Record<string, any>): void;
    info(message: string, context?: Record<string, any>): void;
    error(message: string, error?: Error, context?: Record<string, any>): void;
    warn(message: string, context?: Record<string, any>): void;
    debug(message: string, context?: Record<string, any>): void;
    metric(name: string, value: number, tags?: Record<string, string>): void;
    audit(action: string, userId: string, resource: string, details?: Record<string, any>): void;
}
//# sourceMappingURL=logger.d.ts.map