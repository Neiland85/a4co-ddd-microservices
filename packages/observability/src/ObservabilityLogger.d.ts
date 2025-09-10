import { Logger } from './logger';
import { LogContext, DDDMetadata } from './types';
export interface ObservabilityLogger extends Logger {
    withContext(context: LogContext): ObservabilityLogger;
    withDDD(metadata: DDDMetadata): ObservabilityLogger;
    startSpan(name: string, attributes?: Record<string, any>): Span;
}
//# sourceMappingURL=ObservabilityLogger.d.ts.map