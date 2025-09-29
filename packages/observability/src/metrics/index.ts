import { Counter, Histogram, metrics, ObservableGauge, UpDownCounter } from '@opentelemetry/api';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Resource } from '@opentelemetry/resources';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getLogger } from '../logger';
import { MetricsConfig } from '../types';

// Global metrics provider
let globalMeterProvider: MeterProvider | null = null;
let prometheusExporter: PrometheusExporter | null = null;

// Common metrics
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

let appMetrics: AppMetrics | null = null;

// Initialize metrics
export function initializeMetrics(
  config: MetricsConfig & { serviceName: string; serviceVersion?: string; environment?: string }
): PrometheusExporter {
  const logger = getLogger();

  // Create resource
  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion || '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment || 'development',
      ...config.labels,
    })
  );

  // Create Prometheus exporter
  prometheusExporter = new PrometheusExporter(
    {
      port: config.port || 9090,
      endpoint: config.endpoint || '/metrics',
      preventServerStart: false,
    },
    () => {
      logger.info('Prometheus metrics server started', {
        port: config.port || 9090,
        endpoint: config.endpoint || '/metrics',
      });
    }
  );

  // Create meter provider
  globalMeterProvider = new MeterProvider({
    resource,
  });

  // Register as global provider
  metrics.setGlobalMeterProvider(globalMeterProvider);

  // Initialize common metrics
  initializeAppMetrics(config.serviceName);

  return prometheusExporter;
}

// Initialize application metrics
function initializeAppMetrics(serviceName: string): void {
  const meter = metrics.getMeter(serviceName, '1.0.0');

  appMetrics = {
    // HTTP metrics
    httpRequestDuration: meter.createHistogram('http_request_duration_ms', {
      description: 'Duration of HTTP requests in milliseconds',
      unit: 'ms',
    }),
    httpRequestTotal: meter.createCounter('http_requests_total', {
      description: 'Total number of HTTP requests',
    }),
    httpRequestErrors: meter.createCounter('http_request_errors_total', {
      description: 'Total number of HTTP request errors',
    }),
    activeConnections: meter.createUpDownCounter('http_active_connections', {
      description: 'Number of active HTTP connections',
    }),

    // DDD metrics
    commandExecutions: meter.createCounter('ddd_command_executions_total', {
      description: 'Total number of command executions',
    }),
    commandErrors: meter.createCounter('ddd_command_errors_total', {
      description: 'Total number of command execution errors',
    }),
    eventPublished: meter.createCounter('ddd_events_published_total', {
      description: 'Total number of events published',
    }),
    eventProcessed: meter.createCounter('ddd_events_processed_total', {
      description: 'Total number of events processed',
    }),

    // System metrics
    queueSize: meter.createObservableGauge('queue_size', {
      description: 'Current size of the message queue',
    }),
    memoryUsage: meter.createObservableGauge('memory_usage_bytes', {
      description: 'Current memory usage in bytes',
      unit: 'bytes',
    }),
    cpuUsage: meter.createObservableGauge('cpu_usage_percent', {
      description: 'Current CPU usage percentage',
      unit: '%',
    }),
  };

  // Register system metrics callbacks
  registerSystemMetrics(appMetrics);
}

// Register system metrics observers
function registerSystemMetrics(metrics: AppMetrics): void {
  // Memory usage observer
  metrics.memoryUsage.addCallback(result => {
    const memUsage = process.memoryUsage();
    result.observe(memUsage.heapUsed, { type: 'heap_used' });
    result.observe(memUsage.heapTotal, { type: 'heap_total' });
    result.observe(memUsage.rss, { type: 'rss' });
    result.observe(memUsage.external, { type: 'external' });
  });

  // CPU usage observer (simplified)
  let previousCpuUsage = process.cpuUsage();
  metrics.cpuUsage.addCallback(result => {
    const currentCpuUsage = process.cpuUsage(previousCpuUsage);
    const totalUsage = (currentCpuUsage.user + currentCpuUsage.system) / 1000000; // Convert to seconds
    const percentage = (totalUsage / 1) * 100; // Assuming 1 second interval
    result.observe(Math.min(percentage, 100));
    previousCpuUsage = process.cpuUsage();
  });
}

// Get metrics instance
export function getMetrics(): AppMetrics {
  if (!appMetrics) {
    throw new Error('Metrics not initialized. Call initializeMetrics() first.');
  }
  return appMetrics;
}

// Record HTTP request
export function recordHttpRequest(
  method: string,
  route: string,
  statusCode: number,
  duration: number
): void {
  const metrics = getMetrics();
  const labels = { method, route, status_code: statusCode.toString() };

  metrics.httpRequestTotal.add(1, labels);
  metrics.httpRequestDuration.record(duration, labels);

  if (statusCode >= 400) {
    metrics.httpRequestErrors.add(1, labels);
  }
}

// Record DDD command execution
export function recordCommandExecution(
  commandName: string,
  aggregateName: string,
  success: boolean,
  duration?: number
): void {
  const metrics = getMetrics();
  const labels = {
    command: commandName,
    aggregate: aggregateName,
    status: success ? 'success' : 'error',
  };

  metrics.commandExecutions.add(1, labels);
  if (!success) {
    metrics.commandErrors.add(1, labels);
  }

  if (duration !== undefined) {
    const meter = globalMeterProvider?.getMeter('@a4co/observability');
    if (!meter) return;
    const commandDuration = meter.createHistogram('ddd_command_duration_ms', {
      description: 'Duration of command executions in milliseconds',
      unit: 'ms',
    });
    commandDuration.record(duration, labels);
  }
}

// Record DDD event
export function recordEvent(
  eventName: string,
  aggregateName: string,
  action: 'published' | 'processed'
): void {
  const metrics = getMetrics();
  const labels = { event: eventName, aggregate: aggregateName };

  if (action === 'published') {
    metrics.eventPublished.add(1, labels);
  } else {
    metrics.eventProcessed.add(1, labels);
  }
}

// Custom metric helpers
export function createCustomCounter(name: string, description: string): Counter {
  const meter = metrics.getMeter('@a4co/observability');
  return meter.createCounter(name, { description });
}

export function createCustomHistogram(name: string, description: string, unit?: string): Histogram {
  const meter = metrics.getMeter('@a4co/observability');
  return meter.createHistogram(name, { description, unit });
}

export function createCustomGauge(
  name: string,
  description: string,
  unit?: string
): ObservableGauge {
  const meter = metrics.getMeter('@a4co/observability');
  return meter.createObservableGauge(name, { description, unit });
}

// Shutdown metrics
export async function shutdownMetrics(): Promise<void> {
  if (globalMeterProvider) {
    await globalMeterProvider.shutdown();
  }
  if (prometheusExporter) {
    await prometheusExporter.shutdown();
  }
}

// Export metrics API
export { metrics };
