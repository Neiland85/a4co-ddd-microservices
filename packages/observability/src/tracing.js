"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTracing = initializeTracing;
exports.initializeMetrics = initializeMetrics;
exports.getTracer = getTracer;
exports.shutdown = shutdown;
var sdk_node_1 = require("@opentelemetry/sdk-node");
var auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
var resources_1 = require("@opentelemetry/resources");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
var exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
var exporter_prometheus_1 = require("@opentelemetry/exporter-prometheus");
var sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
var api_1 = require("@opentelemetry/api");
var core_1 = require("@opentelemetry/core");
var propagator_b3_1 = require("@opentelemetry/propagator-b3");
var core_2 = require("@opentelemetry/core");
var sdk = null;
var prometheusExporter = null;
// Crear exportador de spans
function createSpanExporter(config) {
    if (config.jaegerEndpoint) {
        return new exporter_jaeger_1.JaegerExporter({
            endpoint: config.jaegerEndpoint,
            // Agregar tags del servicio
            tags: [
                { key: 'service.name', value: config.serviceName },
                { key: 'service.version', value: config.serviceVersion || '1.0.0' },
                { key: 'deployment.environment', value: config.environment || 'development' },
            ],
        });
    }
    // Por defecto usar console exporter
    return new sdk_trace_base_1.ConsoleSpanExporter();
}
// Inicializar tracing con OpenTelemetry
function initializeTracing(config) {
    var _a;
    // Crear recurso con metadatos del servicio
    var resource = resources_1.Resource.default().merge(new resources_1.Resource((_a = {},
        _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] = config.serviceName,
        _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION] = config.serviceVersion || '1.0.0',
        _a[semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT] = config.environment || 'development',
        _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_INSTANCE_ID] = process.env.HOSTNAME || "".concat(config.serviceName, "-").concat(Date.now()),
        _a[semantic_conventions_1.SemanticResourceAttributes.PROCESS_PID] = process.pid,
        _a[semantic_conventions_1.SemanticResourceAttributes.PROCESS_RUNTIME_NAME] = 'nodejs',
        _a[semantic_conventions_1.SemanticResourceAttributes.PROCESS_RUNTIME_VERSION] = process.version,
        _a)));
    // Configurar propagadores para context propagation
    var propagators = new core_2.CompositePropagator({
        propagators: [
            new core_1.W3CTraceContextPropagator(),
            new propagator_b3_1.B3Propagator({
                injectEncoding: propagator_b3_1.B3InjectEncoding.MULTI_HEADER,
            }),
        ],
    });
    // Crear span processor
    var spanExporter = createSpanExporter(config);
    var spanProcessor = new sdk_trace_base_1.BatchSpanProcessor(spanExporter, {
        maxQueueSize: 2048,
        maxExportBatchSize: 512,
        scheduledDelayMillis: 5000,
        exportTimeoutMillis: 30000,
    });
    // Configurar instrumentaciones
    var instrumentations = config.instrumentations || [];
    if (config.enableAutoInstrumentation !== false) {
        instrumentations = __spreadArray(__spreadArray([], instrumentations, true), [
            (0, auto_instrumentations_node_1.getNodeAutoInstrumentations)({
                '@opentelemetry/instrumentation-fs': {
                    enabled: false, // Deshabilitar fs para evitar ruido
                },
                '@opentelemetry/instrumentation-dns': {
                    enabled: false, // Deshabilitar dns para evitar ruido
                },
                '@opentelemetry/instrumentation-net': {
                    enabled: false, // Deshabilitar net para evitar ruido
                },
            }),
        ], false);
    }
    // Crear SDK
    sdk = new sdk_node_1.NodeSDK({
        resource: resource,
        spanProcessor: spanProcessor,
        instrumentations: instrumentations,
        textMapPropagator: propagators,
    });
    // Inicializar SDK
    sdk.start();
    // Log de confirmación
    console.log("OpenTelemetry tracing initialized for ".concat(config.serviceName));
    return sdk;
}
// Inicializar métricas con Prometheus
function initializeMetrics(config) {
    var _a;
    prometheusExporter = new exporter_prometheus_1.PrometheusExporter({
        port: config.port || 9464,
        endpoint: config.endpoint || '/metrics',
    }, function () {
        console.log("Prometheus metrics server started on port ".concat(config.port || 9464));
    });
    // Crear meter provider
    var meterProvider = new sdk_metrics_1.MeterProvider({
        resource: new resources_1.Resource((_a = {},
            _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] = config.serviceName,
            _a)),
    });
    // Registrar el meter provider globalmente
    api_1.metrics.setGlobalMeterProvider(meterProvider);
    // Agregar el reader de Prometheus
    meterProvider.addMetricReader(prometheusExporter);
    return prometheusExporter;
}
// Obtener tracer para un componente
function getTracer(name) {
    return api_1.trace.getTracer(name || 'default-tracer');
}
// Shutdown graceful
function shutdown() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sdk) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, sdk.shutdown()];
                case 2:
                    _a.sent();
                    console.log('OpenTelemetry SDK shut down successfully');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error shutting down OpenTelemetry SDK', error_1);
                    return [3 /*break*/, 4];
                case 4:
                    if (prometheusExporter) {
                        prometheusExporter.shutdown();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Registrar handlers para shutdown graceful
process.on('SIGTERM', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, shutdown()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, shutdown()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
