import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { metrics, Counter, Histogram, UpDownCounter, ObservableGauge } from '@opentelemetry/api';
import { MetricsConfig } from '../types';
export interface AppMetrics {
    httpRequestDuration: Histogram;
    httpRequestTotal: Counter;
    httpRequestErrors: Counter;
    activeConnections: UpDownCounter;
    commandExecutions: Counter;
    commandErrors: Counter;
    eventPublished: Counter;
    eventProcessed: Counter;
    queueSize: ObservableGauge;
    memoryUsage: ObservableGauge;
    cpuUsage: ObservableGauge;
}
export declare function initializeMetrics(config: MetricsConfig & {
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
}): PrometheusExporter;
export declare function getMetrics(): AppMetrics;
export declare function recordHttpRequest(method: string, route: string, statusCode: number, duration: number): void;
export declare function recordCommandExecution(commandName: string, aggregateName: string, success: boolean, duration?: number): void;
export declare function recordEvent(eventName: string, aggregateName: string, action: 'published' | 'processed'): void;
export declare function createCustomCounter(name: string, description: string): Counter;
export declare function createCustomHistogram(name: string, description: string, unit?: string): Histogram;
export declare function createCustomGauge(name: string, description: string, unit?: string): ObservableGauge;
export declare function shutdownMetrics(): Promise<void>;
export { metrics };
//# sourceMappingURL=index.d.ts.map