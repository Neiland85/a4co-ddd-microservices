import type { Counter, Histogram, Meter, UpDownCounter } from '@opentelemetry/api';
import { metrics } from '@opentelemetry/api';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Resource } from '@opentelemetry/resources';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import type { NextFunction, Request, Response } from 'express';

export interface MetricsConfig {
  serviceName: string;
  port?: number;
  endpoint?: string;
}

// Inicializar exportador de Prometheus
export function initializeMetrics(config: MetricsConfig): PrometheusExporter {
  // Crear exportador de Prometheus
  const prometheusExporter = new PrometheusExporter(
    {
      port: config.port || 9464,
      endpoint: config.endpoint || '/metrics',
    },
    () => {
      console.log(`Prometheus metrics server started on port ${config.port || 9464}`);
    }
  );

  // Crear meter provider
  const meterProvider = new MeterProvider({
    resource: new Resource({
      'service.name': config.serviceName,
    }),
  });

  // Registrar el meter provider globalmente
  metrics.setGlobalMeterProvider(meterProvider);

  // Agregar el exportador
  meterProvider.addMetricReader(prometheusExporter);

  return prometheusExporter;
}

// Clase para gestionar métricas personalizadas
export class CustomMetrics {
  private meter: Meter;
  private counters: Map<string, Counter> = new Map();
  private histograms: Map<string, Histogram> = new Map();
  private gauges: Map<string, UpDownCounter> = new Map();

  constructor(serviceName: string) {
    this.meter = metrics.getMeter(serviceName);
  }

  getCounter(name: string, description?: string): Counter {
    if (!this.counters.has(name)) {
      const counter = this.meter.createCounter(name, {
        description: description || `Counter for ${name}`,
      });
      this.counters.set(name, counter);
    }
    return this.counters.get(name)!;
  }

  getHistogram(name: string, description?: string): Histogram {
    if (!this.histograms.has(name)) {
      const histogram = this.meter.createHistogram(name, {
        description: description || `Histogram for ${name}`,
      });
      this.histograms.set(name, histogram);
    }
    return this.histograms.get(name)!;
  }

  getGauge(name: string, description?: string): UpDownCounter {
    if (!this.gauges.has(name)) {
      const gauge = this.meter.createUpDownCounter(name, {
        description: description || `Gauge for ${name}`,
      });
      this.gauges.set(name, gauge);
    }
    return this.gauges.get(name)!;
  }

  incrementCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
    const counter = this.counters.get(name);
    if (counter) {
      counter.add(value, labels);
    }
  }

  recordDuration(name: string, duration: number, labels?: Record<string, string>): void {
    const histogram = this.histograms.get(name);
    if (histogram) {
      histogram.record(duration, labels);
    }
  }

  updateGauge(name: string, value: number, labels?: Record<string, string>): void {
    const gauge = this.gauges.get(name);
    if (gauge) {
      gauge.add(value, labels);
    }
  }

  recordHttpRequest(method: string, path: string, statusCode: number, duration: number): void {
    this.incrementCounter('http_requests_total', 1, {
      method,
      path,
      status: statusCode.toString(),
    });
    this.recordDuration('http_request_duration', duration, {
      method,
      path,
      status: statusCode.toString(),
    });
  }

  recordDatabaseQuery(
    operation: string,
    collection: string,
    duration: number,
    success: boolean
  ): void {
    this.incrementCounter('db_queries_total', 1, {
      operation,
      collection,
      success: success.toString(),
    });
    this.recordDuration('db_query_duration', duration, {
      operation,
      collection,
    });
  }

  recordBusinessMetric(name: string, value: number, labels?: Record<string, string>): void {
    this.incrementCounter(`business_${name}`, value, labels);
  }

  recordCacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', duration?: number): void {
    this.incrementCounter('cache_operations_total', 1, {
      operation,
    });
    if (duration !== undefined) {
      this.recordDuration('cache_operation_duration', duration, {
        operation,
      });
    }
  }

  recordQueueOperation(
    queue: string,
    operation: 'enqueue' | 'dequeue' | 'process',
    success: boolean,
    duration?: number
  ): void {
    // Queue operation counter
    this.incrementCounter('queue_operations_total', 1, {
      queue,
      operation,
      success: success.toString(),
    });

    // Queue operation duration
    if (duration !== undefined) {
      this.recordDuration('queue_operation_duration', duration, {
        queue,
        operation,
      });
    }
  }

  updateActiveConnections(delta: number, type: 'http' | 'websocket' | 'database'): void {
    this.updateGauge('active_connections', delta, { type });
  }

  recordMemoryUsage(): void {
    const memUsage = process.memoryUsage();
    this.updateGauge('memory_heap_used', memUsage.heapUsed);
    this.updateGauge('memory_heap_total', memUsage.heapTotal);
    this.updateGauge('memory_external', memUsage.external);
    this.updateGauge('memory_rss', memUsage.rss);
  }
}

// Middleware para métricas HTTP
export function httpMetricsMiddleware(metrics: CustomMetrics) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    // Incrementar conexiones activas
    metrics.updateActiveConnections(1, 'http');

    // Interceptar el método end
    const originalEnd = res.end;
    (res.end as unknown) = function (
      chunk?: unknown,
      encoding?: unknown,
      cb?: () => void
    ): unknown {
      // Registrar métricas
      const duration = Date.now() - startTime;
      metrics.recordHttpRequest(req.method, req.route?.path || req.path, res.statusCode, duration);

      // Decrementar conexiones activas
      metrics.updateActiveConnections(-1, 'http');

      // Llamar al método original
      return (originalEnd as Function).call(res, chunk, encoding, cb);
    };

    next();
  };
}

// Función helper para medir duración de operaciones asíncronas
export async function measureAsync<T>(
  metrics: CustomMetrics,
  metricName: string,
  operation: () => Promise<T>,
  labels?: Record<string, string>
): Promise<T> {
  const startTime = Date.now();
  try {
    const result = await operation();
    const duration = Date.now() - startTime;
    metrics.recordDuration(metricName, duration, { ...labels, success: 'true' });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    metrics.recordDuration(metricName, duration, { ...labels, success: 'false' });
    throw error;
  }
}
