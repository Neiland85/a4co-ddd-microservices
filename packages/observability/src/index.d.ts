import type { Context, Span, SpanOptions } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import type { DDDMetadata, ObservabilityTracer, TracingConfig } from './types';
export declare function initializeTracing(config: TracingConfig & {
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
}): NodeSDK;
export declare function getTracer(name?: string, version?: string): ObservabilityTracer;
export declare function shutdownTracing(): Promise<void>;
export declare function startActiveSpan<T>(name: string, fn: (span: Span) => T, options?: SpanOptions): T;
export declare function withSpan<T>(name: string, fn: () => T | Promise<T>, options?: SpanOptions): Promise<T>;
export declare function injectContext(carrier: Record<string, unknown>): void;
export declare function extractContext(carrier: Record<string, unknown>): Context;
export declare function createDDDSpan(name: string, metadata: DDDMetadata, options?: SpanOptions): Span;
export { createHttpLogger, createLogger, getLogger, initializeLogger } from './logger';
export type { ObservabilityLogger } from './ObservabilityLogger';
//# sourceMappingURL=index.d.ts.map