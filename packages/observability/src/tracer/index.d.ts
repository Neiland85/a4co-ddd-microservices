import { NodeSDK } from '@opentelemetry/sdk-node';
import { trace, context, SpanStatusCode, SpanKind, Span, SpanOptions, Context, propagation } from '@opentelemetry/api';
import { TracingConfig, DDDMetadata, ObservabilityTracer } from '../types';
export declare function initializeTracing(config: TracingConfig & {
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
}): NodeSDK;
export declare function getTracer(name?: string, version?: string): ObservabilityTracer;
export declare function shutdownTracing(): Promise<void>;
export declare function startActiveSpan<T>(name: string, fn: (span: Span) => T, options?: SpanOptions): T;
export declare function withSpan<T>(name: string, fn: () => T | Promise<T>, options?: SpanOptions): Promise<T>;
export declare function injectContext(carrier: any): void;
export declare function extractContext(carrier: any): Context;
export declare function createDDDSpan(name: string, metadata: DDDMetadata, options?: SpanOptions): Span;
export { trace, context, propagation, SpanStatusCode, SpanKind, type Span, type SpanOptions, type Context, };
//# sourceMappingURL=index.d.ts.map