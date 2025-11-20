import type { LogContext } from './types';
export interface ObservabilityLogger {
    withContext(context: LogContext): ObservabilityLogger;
    startSpan(name: string, attributes?: Record<string, unknown>): unknown;
    info(message: string, context?: Record<string, unknown>): void;
    error(message: string, errorOrContext?: Error | Record<string, unknown>, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    debug(message: string, context?: Record<string, unknown>): void;
}
//# sourceMappingURL=ObservabilityLogger.d.ts.map