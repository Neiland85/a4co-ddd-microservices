"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metrics = void 0;
exports.initializeMetrics = initializeMetrics;
exports.getMetrics = getMetrics;
exports.recordHttpRequest = recordHttpRequest;
exports.recordCommandExecution = recordCommandExecution;
exports.recordEvent = recordEvent;
exports.createCustomCounter = createCustomCounter;
exports.createCustomHistogram = createCustomHistogram;
exports.createCustomGauge = createCustomGauge;
exports.shutdownMetrics = shutdownMetrics;
const exporter_prometheus_1 = require("@opentelemetry/exporter-prometheus");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const api_1 = require("@opentelemetry/api");
Object.defineProperty(exports, "metrics", { enumerable: true, get: function () { return api_1.metrics; } });
const logger_1 = require("../logger");
// Global metrics provider
let globalMeterProvider = null;
let prometheusExporter = null;
let appMetrics = null;
// Initialize metrics
function initializeMetrics(config) {
    const logger = (0, logger_1.getLogger)();
    // Create resource
    const resource = resources_1.Resource.default().merge(new resources_1.Resource({
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion || '1.0.0',
        [semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment || 'development',
        ...config.labels,
    }));
    // Create Prometheus exporter
    prometheusExporter = new exporter_prometheus_1.PrometheusExporter({
        port: config.port || 9090,
        endpoint: config.endpoint || '/metrics',
        preventServerStart: false,
    }, () => {
        logger.info({ port: config.port || 9090, endpoint: config.endpoint || '/metrics' }, 'Prometheus metrics server started');
    });
    // Create meter provider
    globalMeterProvider = new sdk_metrics_1.MeterProvider({
        resource,
        readers: [prometheusExporter],
    });
    // Register as global provider
    api_1.metrics.setGlobalMeterProvider(globalMeterProvider);
    // Initialize common metrics
    initializeAppMetrics(config.serviceName);
    return prometheusExporter;
}
// Initialize application metrics
function initializeAppMetrics(serviceName) {
    const meter = api_1.metrics.getMeter(serviceName, '1.0.0');
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
function registerSystemMetrics(metrics) {
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
function getMetrics() {
    if (!appMetrics) {
        throw new Error('Metrics not initialized. Call initializeMetrics() first.');
    }
    return appMetrics;
}
// Record HTTP request
function recordHttpRequest(method, route, statusCode, duration) {
    const metrics = getMetrics();
    const labels = { method, route, status_code: statusCode.toString() };
    metrics.httpRequestTotal.add(1, labels);
    metrics.httpRequestDuration.record(duration, labels);
    if (statusCode >= 400) {
        metrics.httpRequestErrors.add(1, labels);
    }
}
// Record DDD command execution
function recordCommandExecution(commandName, aggregateName, success, duration) {
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
        const meter = metrics.getMeter('@a4co/observability');
        const commandDuration = meter.createHistogram('ddd_command_duration_ms', {
            description: 'Duration of command executions in milliseconds',
            unit: 'ms',
        });
        commandDuration.record(duration, labels);
    }
}
// Record DDD event
function recordEvent(eventName, aggregateName, action) {
    const metrics = getMetrics();
    const labels = { event: eventName, aggregate: aggregateName };
    if (action === 'published') {
        metrics.eventPublished.add(1, labels);
    }
    else {
        metrics.eventProcessed.add(1, labels);
    }
}
// Custom metric helpers
function createCustomCounter(name, description) {
    const meter = api_1.metrics.getMeter('@a4co/observability');
    return meter.createCounter(name, { description });
}
function createCustomHistogram(name, description, unit) {
    const meter = api_1.metrics.getMeter('@a4co/observability');
    return meter.createHistogram(name, { description, unit });
}
function createCustomGauge(name, description, unit) {
    const meter = api_1.metrics.getMeter('@a4co/observability');
    return meter.createObservableGauge(name, { description, unit });
}
// Shutdown metrics
async function shutdownMetrics() {
    if (globalMeterProvider) {
        await globalMeterProvider.shutdown();
    }
    if (prometheusExporter) {
        await prometheusExporter.shutdown();
    }
}
//# sourceMappingURL=index.js.map