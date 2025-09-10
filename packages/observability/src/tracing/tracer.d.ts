/**
 * OpenTelemetry tracer initialization and configuration
 */
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SpanKind, Span } from '@opentelemetry/api';
import { Logger } from '../logging/types';
export interface TracerConfig {
    serviceName: string;
    serviceVersion: string;
    environment: string;
    jaegerEndpoint?: string;
    prometheusPort?: number;
    logger?: Logger;
}
export interface TracingContext {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
}
/**
 * Initialize OpenTelemetry SDK for Node.js services
 */
export declare function initializeTracer(config: TracerConfig): NodeSDK;
/**
 * Get or create a tracer instance
 */
export declare function getTracer(name: string, version?: string): import("@opentelemetry/api").Tracer;
/**
 * Start a new span
 */
export declare function startSpan(name: string, options?: {
    kind?: SpanKind;
    attributes?: Record<string, any>;
    parent?: Span;
}): Span;
/**
 * Decorator for tracing class methods
 */
export declare function Trace(options?: {
    name?: string;
    kind?: SpanKind;
    attributes?: Record<string, any>;
}): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * Wrap a function with tracing
 */
export declare function withSpan<T>(name: string, fn: (span: Span) => Promise<T>, options?: {
    kind?: SpanKind;
    attributes?: Record<string, any>;
}): Promise<T>;
/**
 * Extract tracing context from current span
 */
export declare function getTracingContext(): TracingContext | null;
/**
 * Add event to current span
 */
export declare function addSpanEvent(name: string, attributes?: Record<string, any>): void;
/**
 * Add attributes to current span
 */
export declare function setSpanAttributes(attributes: Record<string, any>): void;
//# sourceMappingURL=tracer.d.ts.map