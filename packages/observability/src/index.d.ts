import { initializeLogger, createLogger, createHttpLogger, getGlobalLogger } from './logging';
import { initializeTracing, initializeMetrics, getTracer, shutdown } from './tracing';
import type { LoggerConfig } from './logging';
import type { TracingConfig, MetricsConfig } from './tracing';
export type { LoggerConfig, TracingConfig, MetricsConfig };
export { createLogger, createHttpLogger, getGlobalLogger, initializeLogger, initializeTracing, initializeMetrics, getTracer, shutdown };
export interface ObservabilityConfig {
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
    logging?: {
        level?: string;
        prettyPrint?: boolean;
    };
    tracing?: {
        enabled?: boolean;
        jaegerEndpoint?: string;
        enableConsoleExporter?: boolean;
        enableAutoInstrumentation?: boolean;
    };
    metrics?: {
        enabled?: boolean;
        port?: number;
        endpoint?: string;
    };
}
export declare function initializeObservability(config: ObservabilityConfig): {
    logger: import("pino").default.Logger<never>;
    tracingSDK: import("@opentelemetry/sdk-node").NodeSDK | null;
    metricsExporter: import("@opentelemetry/exporter-prometheus").PrometheusExporter | null;
    httpLogger: import("pino-http").HttpLogger<import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, never>;
    getTracer: typeof getTracer;
    shutdown: typeof shutdown;
};
export declare const logger: {};
export declare function tracer(name?: string): import("@opentelemetry/sdk-trace-base").Tracer;
export * from './frontend';
export * from './ddd-tracing';
export * from './design-system';
export * from './logger';
export * from './tracer';
export * from './metrics';
export * from './middleware';
export * from './decorators';
export * from './context';
export * from './types';
export * from './utils';
export * from './instrumentation';
export * from './config';
/**
 * @a4co/observability - Unified observability package
 *
 * This package provides structured logging, distributed tracing,
 * and metrics collection for the A4CO platform.
 */
export * from './logging/types';
export * from './logging/pino-logger';
export * from './logging/frontend-logger';
export * from './logging/react-hooks';
export * from './logging/http-client-wrapper';
export * from './tracing/tracer';
export * from './tracing/web-tracer';
export * from './tracing/react-tracing';
export * from './tracing/middleware';
export * from './tracing/nats-tracing';
export { SpanKind, SpanStatusCode, Span, SpanContext, trace, context, } from '@opentelemetry/api';
export declare const VERSION = "1.0.0";
//# sourceMappingURL=index.d.ts.map