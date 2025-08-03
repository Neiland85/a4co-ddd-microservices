"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var exporter_prometheus_1 = require("@opentelemetry/exporter-prometheus");
var sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
var resources_1 = require("@opentelemetry/resources");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var api_1 = require("@opentelemetry/api");
Object.defineProperty(exports, "metrics", { enumerable: true, get: function () { return api_1.metrics; } });
var logger_1 = require("../logger");
// Global metrics provider
var globalMeterProvider = null;
var prometheusExporter = null;
var appMetrics = null;
// Initialize metrics
function initializeMetrics(config) {
    var _a;
    var logger = (0, logger_1.getLogger)();
    // Create resource
    var resource = resources_1.Resource.default().merge(new resources_1.Resource(__assign((_a = {}, _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] = config.serviceName, _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION] = config.serviceVersion || '1.0.0', _a[semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT] = config.environment || 'development', _a), config.labels)));
    // Create Prometheus exporter
    prometheusExporter = new exporter_prometheus_1.PrometheusExporter({
        port: config.port || 9090,
        endpoint: config.endpoint || '/metrics',
        preventServerStart: false,
    }, function () {
        logger.info({ port: config.port || 9090, endpoint: config.endpoint || '/metrics' }, 'Prometheus metrics server started');
    });
    // Create meter provider
    globalMeterProvider = new sdk_metrics_1.MeterProvider({
        resource: resource,
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
    var meter = api_1.metrics.getMeter(serviceName, '1.0.0');
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
    metrics.memoryUsage.addCallback(function (result) {
        var memUsage = process.memoryUsage();
        result.observe(memUsage.heapUsed, { type: 'heap_used' });
        result.observe(memUsage.heapTotal, { type: 'heap_total' });
        result.observe(memUsage.rss, { type: 'rss' });
        result.observe(memUsage.external, { type: 'external' });
    });
    // CPU usage observer (simplified)
    var previousCpuUsage = process.cpuUsage();
    metrics.cpuUsage.addCallback(function (result) {
        var currentCpuUsage = process.cpuUsage(previousCpuUsage);
        var totalUsage = (currentCpuUsage.user + currentCpuUsage.system) / 1000000; // Convert to seconds
        var percentage = (totalUsage / 1) * 100; // Assuming 1 second interval
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
    var metrics = getMetrics();
    var labels = { method: method, route: route, status_code: statusCode.toString() };
    metrics.httpRequestTotal.add(1, labels);
    metrics.httpRequestDuration.record(duration, labels);
    if (statusCode >= 400) {
        metrics.httpRequestErrors.add(1, labels);
    }
}
// Record DDD command execution
function recordCommandExecution(commandName, aggregateName, success, duration) {
    var metrics = getMetrics();
    var labels = { command: commandName, aggregate: aggregateName, status: success ? 'success' : 'error' };
    metrics.commandExecutions.add(1, labels);
    if (!success) {
        metrics.commandErrors.add(1, labels);
    }
    if (duration !== undefined) {
        var meter = metrics.getMeter('@a4co/observability');
        var commandDuration = meter.createHistogram('ddd_command_duration_ms', {
            description: 'Duration of command executions in milliseconds',
            unit: 'ms',
        });
        commandDuration.record(duration, labels);
    }
}
// Record DDD event
function recordEvent(eventName, aggregateName, action) {
    var metrics = getMetrics();
    var labels = { event: eventName, aggregate: aggregateName };
    if (action === 'published') {
        metrics.eventPublished.add(1, labels);
    }
    else {
        metrics.eventProcessed.add(1, labels);
    }
}
// Custom metric helpers
function createCustomCounter(name, description) {
    var meter = api_1.metrics.getMeter('@a4co/observability');
    return meter.createCounter(name, { description: description });
}
function createCustomHistogram(name, description, unit) {
    var meter = api_1.metrics.getMeter('@a4co/observability');
    return meter.createHistogram(name, { description: description, unit: unit });
}
function createCustomGauge(name, description, unit) {
    var meter = api_1.metrics.getMeter('@a4co/observability');
    return meter.createObservableGauge(name, { description: description, unit: unit });
}
// Shutdown metrics
function shutdownMetrics() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!globalMeterProvider) return [3 /*break*/, 2];
                    return [4 /*yield*/, globalMeterProvider.shutdown()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!prometheusExporter) return [3 /*break*/, 4];
                    return [4 /*yield*/, prometheusExporter.shutdown()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
