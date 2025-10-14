import { NodeSDK } from '@opentelemetry/sdk-node';
import { Tracer } from '@opentelemetry/sdk-trace-base';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
export interface TracingConfig {
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
    jaegerEndpoint?: string;
    enableConsoleExporter?: boolean;
    enableAutoInstrumentation?: boolean;
    instrumentations?: any[];
}
export interface MetricsConfig {
    port?: number;
    endpoint?: string;
}
export declare function initializeTracing(config: TracingConfig): NodeSDK;
export declare function initializeMetrics(config: MetricsConfig & {
    serviceName: string;
}): PrometheusExporter;
export declare function getTracer(name?: string): Tracer;
export declare function shutdown(): Promise<void>;
//# sourceMappingURL=tracing.d.ts.map