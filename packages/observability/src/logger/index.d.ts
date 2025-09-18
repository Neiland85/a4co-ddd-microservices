import pino, { Logger, LoggerOptions } from 'pino';
import { LoggerConfig, LogContext } from '../types';
import type { ObservabilityLogger } from '../ObservabilityLogger';
export declare function createLogger(config: LoggerConfig & {
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
}): ObservabilityLogger;
export declare function initializeLogger(config: LoggerConfig & {
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
}): ObservabilityLogger;
export declare function getLogger(): ObservabilityLogger;
export declare function createChildLogger(context: LogContext): ObservabilityLogger;
export declare function createHttpLogger(logger?: ObservabilityLogger): (req: any, res: any, next: any) => void;
export { pino };
export type { Logger, LoggerOptions };
//# sourceMappingURL=index.d.ts.map