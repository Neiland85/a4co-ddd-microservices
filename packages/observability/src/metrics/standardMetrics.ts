/**
 * Standard metrics following OpenTelemetry semantic conventions
 * Provides standardized metrics for all A4CO microservices
 */
import type { Counter, Histogram, ObservableGauge, UpDownCounter } from '@opentelemetry/api';
import { metrics } from '@opentelemetry/api';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import type { Request, Response, NextFunction } from 'express';

// Global metrics state
let globalMeterProvider: MeterProvider | null = null;
let prometheusExporter: PrometheusExporter | null = null;

/**
 * Standard metrics configuration
 */
export interface StandardMetricsConfig {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  prometheusPort?: number;
  prometheusEndpoint?: string;
}

/**
 * Standard application metrics following OpenTelemetry semantic conventions
 */
export interface StandardMetrics {
  // HTTP metrics (OpenTelemetry semantic conventions)
  httpRequestsTotal: Counter;
  requestDurationSeconds: Histogram;
  httpActiveRequests: UpDownCounter;
  
  // Database health metrics
  dbConnectionsActive: ObservableGauge;
  dbQueryDurationSeconds: Histogram;
  dbQueryTotal: Counter;
  dbQueryErrors: Counter;
  
  // Business metrics for A4CO platform
  commerceListedTotal: Counter;
  promoNearbyRequestTotal: Counter;
  
  // System metrics
  memoryUsageBytes: ObservableGauge;
  cpuUsagePercent: ObservableGauge;
}

let standardMetrics: StandardMetrics | null = null;

/**
 * Initialize standard metrics with OpenTelemetry
 */
export function initializeStandardMetrics(config: StandardMetricsConfig): PrometheusExporter {
  const {
    serviceName,
    prometheusPort = 9464,
    prometheusEndpoint = '/metrics',
  } = config;

  // Create Prometheus exporter
  prometheusExporter = new PrometheusExporter(
    {
      port: prometheusPort,
      endpoint: prometheusEndpoint,
      preventServerStart: false,
    },
    () => {
      console.log(`[${serviceName}] Prometheus metrics available at :${prometheusPort}${prometheusEndpoint}`);
    }
  );

  // Create meter provider
  globalMeterProvider = new MeterProvider({});

  // Register as global provider
  metrics.setGlobalMeterProvider(globalMeterProvider);

  // Initialize metrics
  const meter = metrics.getMeter(serviceName, config.serviceVersion || '1.0.0');

  standardMetrics = {
    // HTTP metrics - OpenTelemetry semantic conventions
    httpRequestsTotal: meter.createCounter('http_requests_total', {
      description: 'Total number of HTTP requests',
      unit: '1',
    }),
    
    requestDurationSeconds: meter.createHistogram('request_duration_seconds', {
      description: 'Duration of HTTP requests in seconds',
      unit: 's',
    }),
    
    httpActiveRequests: meter.createUpDownCounter('http_active_requests', {
      description: 'Number of active HTTP requests',
      unit: '1',
    }),
    
    // Database health metrics
    dbConnectionsActive: meter.createObservableGauge('db_connections_active', {
      description: 'Number of active database connections',
      unit: '1',
    }),
    
    dbQueryDurationSeconds: meter.createHistogram('db_query_duration_seconds', {
      description: 'Duration of database queries in seconds',
      unit: 's',
    }),
    
    dbQueryTotal: meter.createCounter('db_query_total', {
      description: 'Total number of database queries',
      unit: '1',
    }),
    
    dbQueryErrors: meter.createCounter('db_query_errors_total', {
      description: 'Total number of database query errors',
      unit: '1',
    }),
    
    // A4CO business metrics
    commerceListedTotal: meter.createCounter('commerce_listed_total', {
      description: 'Total number of commerce listings created',
      unit: '1',
    }),
    
    promoNearbyRequestTotal: meter.createCounter('promo_nearby_request_total', {
      description: 'Total number of nearby promotion requests',
      unit: '1',
    }),
    
    // System metrics
    memoryUsageBytes: meter.createObservableGauge('process_memory_bytes', {
      description: 'Process memory usage in bytes',
      unit: 'By',
    }),
    
    cpuUsagePercent: meter.createObservableGauge('process_cpu_percent', {
      description: 'Process CPU usage percentage',
      unit: '%',
    }),
  };

  // Register system metrics callbacks
  registerSystemMetricsCallbacks(standardMetrics);

  return prometheusExporter;
}

/**
 * Register callbacks for system metrics
 */
function registerSystemMetricsCallbacks(metricsInstance: StandardMetrics): void {
  // Memory usage observer
  metricsInstance.memoryUsageBytes.addCallback((result) => {
    const memUsage = process.memoryUsage();
    result.observe(memUsage.heapUsed, { type: 'heap_used' });
    result.observe(memUsage.heapTotal, { type: 'heap_total' });
    result.observe(memUsage.rss, { type: 'rss' });
    result.observe(memUsage.external, { type: 'external' });
  });

  // CPU usage observer
  let previousCpuUsage = process.cpuUsage();
  let previousTime = Date.now();
  
  metricsInstance.cpuUsagePercent.addCallback((result) => {
    const currentTime = Date.now();
    const elapsedMs = currentTime - previousTime;
    
    if (elapsedMs > 0) {
      const currentCpuUsage = process.cpuUsage(previousCpuUsage);
      const totalUsageMicros = currentCpuUsage.user + currentCpuUsage.system;
      const elapsedMicros = elapsedMs * 1000;
      const percentage = (totalUsageMicros / elapsedMicros) * 100;
      
      result.observe(Math.min(percentage, 100));
      
      previousCpuUsage = process.cpuUsage();
      previousTime = currentTime;
    }
  });
}

/**
 * Get standard metrics instance
 */
export function getStandardMetrics(): StandardMetrics {
  if (!standardMetrics) {
    throw new Error('Standard metrics not initialized. Call initializeStandardMetrics() first.');
  }
  return standardMetrics;
}

/**
 * Record HTTP request metrics
 */
export function recordHttpRequest(
  method: string,
  route: string,
  statusCode: number,
  durationSeconds: number
): void {
  const metricsInstance = getStandardMetrics();
  const labels = {
    method,
    route,
    status_code: String(statusCode),
    status_class: `${Math.floor(statusCode / 100)}xx`,
  };

  metricsInstance.httpRequestsTotal.add(1, labels);
  metricsInstance.requestDurationSeconds.record(durationSeconds, labels);
}

/**
 * Record database query metrics
 */
export function recordDbQuery(
  operation: string,
  table: string,
  durationSeconds: number,
  success: boolean
): void {
  const metricsInstance = getStandardMetrics();
  const labels = {
    operation,
    table,
    success: String(success),
  };

  metricsInstance.dbQueryTotal.add(1, labels);
  metricsInstance.dbQueryDurationSeconds.record(durationSeconds, labels);
  
  if (!success) {
    metricsInstance.dbQueryErrors.add(1, labels);
  }
}

/**
 * Increment commerce listed counter
 */
export function recordCommerceListed(commerceType?: string): void {
  const metricsInstance = getStandardMetrics();
  metricsInstance.commerceListedTotal.add(1, { commerce_type: commerceType || 'unknown' });
}

/**
 * Increment promo nearby request counter
 */
export function recordPromoNearbyRequest(promoType?: string): void {
  const metricsInstance = getStandardMetrics();
  metricsInstance.promoNearbyRequestTotal.add(1, { promo_type: promoType || 'unknown' });
}

/**
 * Express/NestJS middleware for automatic HTTP metrics collection
 */
export function httpMetricsMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = process.hrtime.bigint();
    let metricsInstance: StandardMetrics;
    
    try {
      metricsInstance = getStandardMetrics();
    } catch {
      // Metrics not initialized, skip collection
      next();
      return;
    }
    
    // Increment active requests
    metricsInstance.httpActiveRequests.add(1);

    // Store original end method
    const originalEnd = res.end.bind(res);
    
    // Override end method to capture metrics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (res as any).end = function(chunk?: unknown, encoding?: BufferEncoding | (() => void), cb?: () => void): Response {
      // Calculate duration in seconds
      const endTime = process.hrtime.bigint();
      const durationNanos = Number(endTime - startTime);
      const durationSeconds = durationNanos / 1e9;

      // Get route path (prefer express route if available)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const route = (req as any).route?.path || req.path || 'unknown';

      // Record metrics
      recordHttpRequest(req.method, route, res.statusCode, durationSeconds);
      
      // Decrement active requests
      metricsInstance.httpActiveRequests.add(-1);

      // Call original end with proper arguments
      if (typeof encoding === 'function') {
        return originalEnd(chunk, encoding);
      }
      return originalEnd(chunk, encoding, cb);
    };

    next();
  };
}

/**
 * Shutdown standard metrics
 */
export async function shutdownStandardMetrics(): Promise<void> {
  if (globalMeterProvider) {
    await globalMeterProvider.shutdown();
    globalMeterProvider = null;
  }
  if (prometheusExporter) {
    await prometheusExporter.shutdown();
    prometheusExporter = null;
  }
  standardMetrics = null;
}
