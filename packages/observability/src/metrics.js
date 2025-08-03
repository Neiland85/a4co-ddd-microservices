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
exports.CommonMetrics = exports.CustomMetrics = void 0;
exports.initializeMetrics = initializeMetrics;
exports.metricsMiddleware = metricsMiddleware;
exports.measureAsync = measureAsync;
var sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
var exporter_prometheus_1 = require("@opentelemetry/exporter-prometheus");
var resources_1 = require("@opentelemetry/resources");
var api_1 = require("@opentelemetry/api");
// Inicializar exportador de Prometheus
function initializeMetrics(config) {
    // Crear exportador de Prometheus
    var prometheusExporter = new exporter_prometheus_1.PrometheusExporter({
        port: config.port || 9464,
        endpoint: config.endpoint || '/metrics',
    }, function () {
        console.log("Prometheus metrics server started on port ".concat(config.port || 9464));
    });
    // Crear meter provider
    var meterProvider = new sdk_metrics_1.MeterProvider({
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
var CustomMetrics = /** @class */ (function () {
    function CustomMetrics(meterName) {
        this.counters = new Map();
        this.histograms = new Map();
        this.gauges = new Map();
        this.meter = api_1.metrics.getMeter(meterName);
    }
    // Crear o obtener un contador
    CustomMetrics.prototype.getCounter = function (name, description) {
        if (!this.counters.has(name)) {
            var counter = this.meter.createCounter(name, {
                description: description || "Counter for ".concat(name),
            });
            this.counters.set(name, counter);
        }
        return this.counters.get(name);
    };
    // Crear o obtener un histograma
    CustomMetrics.prototype.getHistogram = function (name, description, boundaries) {
        if (!this.histograms.has(name)) {
            var histogram = this.meter.createHistogram(name, {
                description: description || "Histogram for ".concat(name),
                boundaries: boundaries || [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
            });
            this.histograms.set(name, histogram);
        }
        return this.histograms.get(name);
    };
    // Crear o obtener un gauge
    CustomMetrics.prototype.getGauge = function (name, description) {
        if (!this.gauges.has(name)) {
            var gauge = this.meter.createUpDownCounter(name, {
                description: description || "Gauge for ".concat(name),
            });
            this.gauges.set(name, gauge);
        }
        return this.gauges.get(name);
    };
    // Incrementar contador
    CustomMetrics.prototype.incrementCounter = function (name, value, labels) {
        if (value === void 0) { value = 1; }
        var counter = this.getCounter(name);
        counter.add(value, labels);
    };
    // Registrar duración
    CustomMetrics.prototype.recordDuration = function (name, duration, labels) {
        var histogram = this.getHistogram(name);
        histogram.record(duration, labels);
    };
    // Actualizar gauge
    CustomMetrics.prototype.updateGauge = function (name, value, labels) {
        var gauge = this.getGauge(name);
        gauge.add(value, labels);
    };
    return CustomMetrics;
}());
exports.CustomMetrics = CustomMetrics;
// Métricas predefinidas comunes
var CommonMetrics = /** @class */ (function () {
    function CommonMetrics(serviceName) {
        this.metrics = new CustomMetrics(serviceName);
    }
    // HTTP Request metrics
    CommonMetrics.prototype.recordHttpRequest = function (method, path, statusCode, duration) {
        // Request counter
        this.metrics.incrementCounter('http_requests_total', 1, {
            method: method,
            path: path,
            status: statusCode.toString(),
        });
        // Request duration
        this.metrics.recordDuration('http_request_duration_seconds', duration / 1000, {
            method: method,
            path: path,
            status: statusCode.toString(),
        });
        // Error counter
        if (statusCode >= 400) {
            this.metrics.incrementCounter('http_errors_total', 1, {
                method: method,
                path: path,
                status: statusCode.toString(),
            });
        }
    };
    // Database metrics
    CommonMetrics.prototype.recordDatabaseQuery = function (operation, collection, duration, success) {
        // Query counter
        this.metrics.incrementCounter('db_queries_total', 1, {
            operation: operation,
            collection: collection,
            success: success.toString(),
        });
        // Query duration
        this.metrics.recordDuration('db_query_duration_seconds', duration / 1000, {
            operation: operation,
            collection: collection,
        });
        // Error counter
        if (!success) {
            this.metrics.incrementCounter('db_errors_total', 1, {
                operation: operation,
                collection: collection,
            });
        }
    };
    // Business metrics
    CommonMetrics.prototype.recordBusinessMetric = function (name, value, labels) {
        this.metrics.incrementCounter("business_".concat(name, "_total"), value, labels);
    };
    // Cache metrics
    CommonMetrics.prototype.recordCacheOperation = function (operation, duration) {
        // Cache counter
        this.metrics.incrementCounter('cache_operations_total', 1, {
            operation: operation,
        });
        // Cache duration if provided
        if (duration !== undefined) {
            this.metrics.recordDuration('cache_operation_duration_seconds', duration / 1000, {
                operation: operation,
            });
        }
        // Hit rate tracking
        if (operation === 'hit' || operation === 'miss') {
            this.metrics.incrementCounter('cache_requests_total', 1, {
                result: operation,
            });
        }
    };
    // Queue metrics
    CommonMetrics.prototype.recordQueueOperation = function (queue, operation, success, duration) {
        // Queue operation counter
        this.metrics.incrementCounter('queue_operations_total', 1, {
            queue: queue,
            operation: operation,
            success: success.toString(),
        });
        // Processing duration
        if (duration !== undefined && operation === 'process') {
            this.metrics.recordDuration('queue_processing_duration_seconds', duration / 1000, {
                queue: queue,
            });
        }
    };
    // Active connections gauge
    CommonMetrics.prototype.updateActiveConnections = function (delta, type) {
        this.metrics.updateGauge('active_connections', delta, {
            type: type,
        });
    };
    // Memory usage
    CommonMetrics.prototype.recordMemoryUsage = function () {
        var memoryUsage = process.memoryUsage();
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
    };
    return CommonMetrics;
}());
exports.CommonMetrics = CommonMetrics;
// Middleware para Express que registra métricas automáticamente
function metricsMiddleware(metrics) {
    return function (req, res, next) {
        var startTime = Date.now();
        // Incrementar conexiones activas
        metrics.updateActiveConnections(1, 'http');
        // Interceptar el método end
        var originalEnd = res.end;
        res.end = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Registrar métricas
            var duration = Date.now() - startTime;
            metrics.recordHttpRequest(req.method, ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || req.path, res.statusCode, duration);
            // Decrementar conexiones activas
            metrics.updateActiveConnections(-1, 'http');
            // Llamar al método original
            return originalEnd.apply(res, args);
        };
        next();
    };
}
// Función helper para medir duración de operaciones asíncronas
function measureAsync(metrics, metricName, labels, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, result, duration, error_1, duration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fn()];
                case 2:
                    result = _a.sent();
                    duration = Date.now() - startTime;
                    metrics.recordDuration(metricName, duration / 1000, __assign(__assign({}, labels), { success: 'true' }));
                    return [2 /*return*/, result];
                case 3:
                    error_1 = _a.sent();
                    duration = Date.now() - startTime;
                    metrics.recordDuration(metricName, duration / 1000, __assign(__assign({}, labels), { success: 'false' }));
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
