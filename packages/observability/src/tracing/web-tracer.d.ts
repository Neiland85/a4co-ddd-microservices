/**
 * OpenTelemetry tracer for web/frontend applications
 */
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SpanKind, Span } from '@opentelemetry/api';
import { Logger } from '../logging/types';
export interface WebTracerConfig {
    serviceName: string;
    serviceVersion: string;
    environment: string;
    collectorUrl?: string;
    logger?: Logger;
}
/**
 * Initialize OpenTelemetry for web applications
 */
export declare function initializeWebTracer(config: WebTracerConfig): WebTracerProvider;
/**
 * Get web tracer instance
 */
export declare function getWebTracer(name: string, version?: string): import("@opentelemetry/api").Tracer;
/**
 * Start a span for web operations
 */
export declare function startWebSpan(name: string, options?: {
    kind?: SpanKind;
    attributes?: Record<string, any>;
}): Span;
/**
 * Trace a web operation
 */
export declare function traceWebOperation<T>(name: string, operation: (span: Span) => Promise<T>, options?: {
    kind?: SpanKind;
    attributes?: Record<string, any>;
}): Promise<T>;
/**
 * Trace React component render
 */
export declare function traceComponentRender(componentName: string, props?: Record<string, any>): Span;
/**
 * Trace route navigation
 */
export declare function traceRouteNavigation(fromRoute: string, toRoute: string): Span;
/**
 * Trace user interaction
 */
export declare function traceUserInteraction(interactionType: string, target: string, metadata?: Record<string, any>): Span;
/**
 * Performance metrics collection
 */
export interface PerformanceMetrics {
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    timeToInteractive?: number;
    cumulativeLayoutShift?: number;
    firstInputDelay?: number;
}
export declare function collectPerformanceMetrics(): PerformanceMetrics;
/**
 * Add performance metrics to current span
 */
export declare function addPerformanceMetricsToSpan(): void;
//# sourceMappingURL=web-tracer.d.ts.map