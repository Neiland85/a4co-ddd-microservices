"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonMetrics = exports.CustomMetrics = void 0;
exports.initializeMetrics = initializeMetrics;
exports.metricsMiddleware = metricsMiddleware;
exports.measureAsync = measureAsync;
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const exporter_prometheus_1 = require("@opentelemetry/exporter-prometheus");
const resources_1 = require("@opentelemetry/resources");
const api_1 = require("@opentelemetry/api");
// Inicializar exportador de Prometheus
function initializeMetrics(config) {
    // Crear exportador de Prometheus
    const prometheusExporter = new exporter_prometheus_1.PrometheusExporter({
        port: config.port || 9464,
        endpoint: config.endpoint || '/metrics',
    }, () => {
        console.log(`Prometheus metrics server started on port ${config.port || 9464}`);
    });
    // Crear meter provider
    const meterProvider = new sdk_metrics_1.MeterProvider({
        resource: new resources_1.Resource({
            'service.name': config.serviceName,
        }),
    });
    // Registrar el meter provider globalmente
    api_1.metrics.setGlobalMeterProvider(meterProvider);
    // Agregar el exportador
    meterProvider.addMetricReader(prometheusExporter);
    return prometheusExporter;
}
// Clase para gestionar métricas personalizadas
class CustomMetrics {
    meter;
    counters = new Map();
    histograms = new Map();
    gauges = new Map();
    constructor(meterName) {
        this.meter = api_1.metrics.getMeter(meterName);
    }
    // Crear o obtener un contador
    getCounter(name, description) {
        if (!this.counters.has(name)) {
            const counter = this.meter.createCounter(name, {
                description: description || `Counter for ${name}`,
            });
            this.counters.set(name, counter);
        }
        return this.counters.get(name);
    }
    // Crear o obtener un histograma
    getHistogram(name, description, boundaries) {
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
    getGauge(name, description) {
        if (!this.gauges.has(name)) {
            const gauge = this.meter.createUpDownCounter(name, {
                description: description || `Gauge for ${name}`,
            });
            this.gauges.set(name, gauge);
        }
        return this.gauges.get(name);
    }
    // Incrementar contador
    incrementCounter(name, value = 1, labels) {
        const counter = this.getCounter(name);
        counter.add(value, labels);
    }
    // Registrar duración
    recordDuration(name, duration, labels) {
        const histogram = this.getHistogram(name);
        histogram.record(duration, labels);
    }
    // Actualizar gauge
    updateGauge(name, value, labels) {
        const gauge = this.getGauge(name);
        gauge.add(value, labels);
    }
}
exports.CustomMetrics = CustomMetrics;
// Métricas predefinidas comunes
class CommonMetrics {
    metrics;
    constructor(serviceName) {
        this.metrics = new CustomMetrics(serviceName);
    }
    // HTTP Request metrics
    recordHttpRequest(method, path, statusCode, duration) {
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
    recordDatabaseQuery(operation, collection, duration, success) {
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
    recordBusinessMetric(name, value, labels) {
        this.metrics.incrementCounter(`business_${name}_total`, value, labels);
    }
    // Cache metrics
    recordCacheOperation(operation, duration) {
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
    recordQueueOperation(queue, operation, success, duration) {
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
    updateActiveConnections(delta, type) {
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
exports.CommonMetrics = CommonMetrics;
// Middleware para Express que registra métricas automáticamente
function metricsMiddleware(metrics) {
    return (req, res, next) => {
        const startTime = Date.now();
        // Incrementar conexiones activas
        metrics.updateActiveConnections(1, 'http');
        // Interceptar el método end
        const originalEnd = res.end;
        res.end = function (...args) {
            // Registrar métricas
            const duration = Date.now() - startTime;
            metrics.recordHttpRequest(req.method, req.route?.path || req.path, res.statusCode, duration);
            // Decrementar conexiones activas
            metrics.updateActiveConnections(-1, 'http');
            // Llamar al método original
            return originalEnd.apply(res, args);
        };
        next();
    };
}
// Función helper para medir duración de operaciones asíncronas
async function measureAsync(metrics, metricName, labels, fn) {
    const startTime = Date.now();
    try {
        const result = await fn();
        const duration = Date.now() - startTime;
        metrics.recordDuration(metricName, duration / 1000, {
            ...labels,
            success: 'true',
        });
        return result;
    }
    catch (error) {
        const duration = Date.now() - startTime;
        metrics.recordDuration(metricName, duration / 1000, {
            ...labels,
            success: 'false',
        });
        throw error;
    }
}
//# sourceMappingURL=metrics.js.map