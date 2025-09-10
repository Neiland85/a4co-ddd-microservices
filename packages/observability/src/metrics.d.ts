import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
export interface MetricsConfig {
    serviceName: string;
    port?: number;
    endpoint?: string;
}
export declare function initializeMetrics(config: MetricsConfig): PrometheusExporter;
export declare class CustomMetrics {
    private meter;
    private counters;
    private histograms;
    private gauges;
    constructor(meterName: string);
    getCounter(name: string, description?: string): any;
    getHistogram(name: string, description?: string, boundaries?: number[]): any;
    getGauge(name: string, description?: string): any;
    incrementCounter(name: string, value?: number, labels?: Record<string, string>): void;
    recordDuration(name: string, duration: number, labels?: Record<string, string>): void;
    updateGauge(name: string, value: number, labels?: Record<string, string>): void;
}
export declare class CommonMetrics {
    private metrics;
    constructor(serviceName: string);
    recordHttpRequest(method: string, path: string, statusCode: number, duration: number): void;
    recordDatabaseQuery(operation: string, collection: string, duration: number, success: boolean): void;
    recordBusinessMetric(name: string, value: number, labels?: Record<string, string>): void;
    recordCacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', duration?: number): void;
    recordQueueOperation(queue: string, operation: 'enqueue' | 'dequeue' | 'process', success: boolean, duration?: number): void;
    updateActiveConnections(delta: number, type: 'http' | 'websocket' | 'database'): void;
    recordMemoryUsage(): void;
}
export declare function metricsMiddleware(metrics: CommonMetrics): (req: any, res: any, next: any) => void;
export declare function measureAsync<T>(metrics: CustomMetrics, metricName: string, labels: Record<string, string>, fn: () => Promise<T>): Promise<T>;
//# sourceMappingURL=metrics.d.ts.map