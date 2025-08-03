import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Resource } from '@opentelemetry/resources';
import { metrics } from '@opentelemetry/api';

export interface MetricsConfig {
  serviceName: string;
  port?: number;
  endpoint?: string;
}

// Inicializar exportador de Prometheus
export function initializeMetrics(config: MetricsConfig) {
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
  private meter: any;
  private counters: Map<string, any> = new Map();
  private histograms: Map<string, any> = new Map();
  private gauges: Map<string, any> = new Map();

  constructor(meterName: string) {
    this.meter = metrics.getMeter(meterName);
  }

  // Crear o obtener un contador
  getCounter(name: string, description?: string) {
    if (!this.counters.has(name)) {
      const counter = this.meter.createCounter(name, {
        description: description || `Counter for ${name}`,
      });
      this.counters.set(name, counter);
    }
    return this.counters.get(name);
  }

  // Crear o obtener un histograma
  getHistogram(name: string, description?: string, boundaries?: number[]) {
    if (!this.histograms.has(name)) {
      const histogram = this.meter.createHistogram(name, {
        description: description || `Histogram for ${name}`,
        boundaries: boundaries || [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      });
      this.histograms.set(name, histogram);
    }
    return this.histograms.get(name);
  }

  // Crear o obtener un gauge
  getGauge(name: string, description?: string) {
    if (!this.gauges.has(name)) {
      const gauge = this.meter.createUpDownCounter(name, {
        description: description || `Gauge for ${name}`,
      });
      this.gauges.set(name, gauge);
    }
    return this.gauges.get(name);
  }

  // Incrementar contador
  incrementCounter(name: string, value: number = 1, labels?: Record<string, string>) {
    const counter = this.getCounter(name);
    counter.add(value, labels);
  }

  // Registrar duración
  recordDuration(name: string, duration: number, labels?: Record<string, string>) {
    const histogram = this.getHistogram(name);
    histogram.record(duration, labels);
  }

  // Actualizar gauge
  updateGauge(name: string, value: number, labels?: Record<string, string>) {
    const gauge = this.getGauge(name);
    gauge.add(value, labels);
  }
}

// Métricas predefinidas comunes
export class CommonMetrics {
  private metrics: CustomMetrics;

  constructor(serviceName: string) {
    this.metrics = new CustomMetrics(serviceName);
  }

  // HTTP Request metrics
  recordHttpRequest(method: string, path: string, statusCode: number, duration: number) {
    // Request counter
    this.metrics.incrementCounter('http_requests_total', 1, {
      method,
      path,
      status: statusCode.toString(),
    });

    // Request duration
    this.metrics.recordDuration('http_request_duration_seconds', duration / 1000, {
      method,
      path,
      status: statusCode.toString(),
    });

    // Error counter
    if (statusCode >= 400) {
      this.metrics.incrementCounter('http_errors_total', 1, {
        method,
        path,
        status: statusCode.toString(),
      });
    }
  }

  // Database metrics
  recordDatabaseQuery(operation: string, collection: string, duration: number, success: boolean) {
    // Query counter
    this.metrics.incrementCounter('db_queries_total', 1, {
      operation,
      collection,
      success: success.toString(),
    });

    // Query duration
    this.metrics.recordDuration('db_query_duration_seconds', duration / 1000, {
      operation,
      collection,
    });

    // Error counter
    if (!success) {
      this.metrics.incrementCounter('db_errors_total', 1, {
        operation,
        collection,
      });
    }
  }

  // Business metrics
  recordBusinessMetric(name: string, value: number, labels?: Record<string, string>) {
    this.metrics.incrementCounter(`business_${name}_total`, value, labels);
  }

  // Cache metrics
  recordCacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', duration?: number) {
    // Cache counter
    this.metrics.incrementCounter('cache_operations_total', 1, {
      operation,
    });

    // Cache duration if provided
    if (duration !== undefined) {
      this.metrics.recordDuration('cache_operation_duration_seconds', duration / 1000, {
        operation,
      });
    }

    // Hit rate tracking
    if (operation === 'hit' || operation === 'miss') {
      this.metrics.incrementCounter('cache_requests_total', 1, {
        result: operation,
      });
    }
  }

  // Queue metrics
  recordQueueOperation(queue: string, operation: 'enqueue' | 'dequeue' | 'process', success: boolean, duration?: number) {
    // Queue operation counter
    this.metrics.incrementCounter('queue_operations_total', 1, {
      queue,
      operation,
      success: success.toString(),
    });

    // Processing duration
    if (duration !== undefined && operation === 'process') {
      this.metrics.recordDuration('queue_processing_duration_seconds', duration / 1000, {
        queue,
      });
    }
  }

  // Active connections gauge
  updateActiveConnections(delta: number, type: 'http' | 'websocket' | 'database') {
    this.metrics.updateGauge('active_connections', delta, {
      type,
    });
  }

  // Memory usage
  recordMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    
    this.metrics.updateGauge('memory_usage_bytes', memoryUsage.heapUsed, {
      type: 'heap_used',
    });
    
    this.metrics.updateGauge('memory_usage_bytes', memoryUsage.heapTotal, {
      type: 'heap_total',
    });
    
    this.metrics.updateGauge('memory_usage_bytes', memoryUsage.rss, {
      type: 'rss',
    });
    
    this.metrics.updateGauge('memory_usage_bytes', memoryUsage.external, {
      type: 'external',
    });
  }
}

// Middleware para Express que registra métricas automáticamente
export function metricsMiddleware(metrics: CommonMetrics) {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();
    
    // Incrementar conexiones activas
    metrics.updateActiveConnections(1, 'http');
    
    // Interceptar el método end
    const originalEnd = res.end;
    res.end = function(...args: any[]) {
      // Registrar métricas
      const duration = Date.now() - startTime;
      metrics.recordHttpRequest(
        req.method,
        req.route?.path || req.path,
        res.statusCode,
        duration
      );
      
      // Decrementar conexiones activas
      metrics.updateActiveConnections(-1, 'http');
      
      // Llamar al método original
      return originalEnd.apply(res, args);
    };
    
    next();
  };
}

// Función helper para medir duración de operaciones asíncronas
export async function measureAsync<T>(
  metrics: CustomMetrics,
  metricName: string,
  labels: Record<string, string>,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    
    metrics.recordDuration(metricName, duration / 1000, {
      ...labels,
      success: 'true',
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    metrics.recordDuration(metricName, duration / 1000, {
      ...labels,
      success: 'false',
    });
    
    throw error;
  }
}