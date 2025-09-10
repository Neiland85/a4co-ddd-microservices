"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTracing = initializeTracing;
exports.initializeMetrics = initializeMetrics;
exports.getTracer = getTracer;
exports.shutdown = shutdown;
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
const exporter_prometheus_1 = require("@opentelemetry/exporter-prometheus");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const propagator_b3_1 = require("@opentelemetry/propagator-b3");
const core_2 = require("@opentelemetry/core");
let sdk = null;
let prometheusExporter = null;
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
    // Crear recurso con metadatos del servicio
    const resource = resources_1.Resource.default().merge(new resources_1.Resource({
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion || '1.0.0',
        [semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment || 'development',
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_INSTANCE_ID]: process.env.HOSTNAME || `${config.serviceName}-${Date.now()}`,
        [semantic_conventions_1.SemanticResourceAttributes.PROCESS_PID]: process.pid,
        [semantic_conventions_1.SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'nodejs',
        [semantic_conventions_1.SemanticResourceAttributes.PROCESS_RUNTIME_VERSION]: process.version,
    }));
    // Configurar propagadores para context propagation
    const propagators = new core_2.CompositePropagator({
        propagators: [
            new core_1.W3CTraceContextPropagator(),
            new propagator_b3_1.B3Propagator({
                injectEncoding: propagator_b3_1.B3InjectEncoding.MULTI_HEADER,
            }),
        ],
    });
    // Crear span processor
    const spanExporter = createSpanExporter(config);
    const spanProcessor = new sdk_trace_base_1.BatchSpanProcessor(spanExporter, {
        maxQueueSize: 2048,
        maxExportBatchSize: 512,
        scheduledDelayMillis: 5000,
        exportTimeoutMillis: 30000,
    });
    // Configurar instrumentaciones
    let instrumentations = config.instrumentations || [];
    if (config.enableAutoInstrumentation !== false) {
        instrumentations = [
            ...instrumentations,
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
        ];
    }
    // Crear SDK
    sdk = new sdk_node_1.NodeSDK({
        resource,
        spanProcessor,
        instrumentations,
        textMapPropagator: propagators,
    });
    // Inicializar SDK
    sdk.start();
    // Log de confirmación
    console.log(`OpenTelemetry tracing initialized for ${config.serviceName}`);
    return sdk;
}
// Inicializar métricas con Prometheus
function initializeMetrics(config) {
    prometheusExporter = new exporter_prometheus_1.PrometheusExporter({
        port: config.port || 9464,
        endpoint: config.endpoint || '/metrics',
    }, () => {
        console.log(`Prometheus metrics server started on port ${config.port || 9464}`);
    });
    // Crear meter provider
    const meterProvider = new sdk_metrics_1.MeterProvider({
        resource: new resources_1.Resource({
            [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
        }),
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
async function shutdown() {
    if (sdk) {
        try {
            await sdk.shutdown();
            console.log('OpenTelemetry SDK shut down successfully');
        }
        catch (error) {
            console.error('Error shutting down OpenTelemetry SDK', error);
        }
    }
    if (prometheusExporter) {
        prometheusExporter.shutdown();
    }
}
// Registrar handlers para shutdown graceful
process.on('SIGTERM', async () => {
    await shutdown();
});
process.on('SIGINT', async () => {
    await shutdown();
});
//# sourceMappingURL=tracing.js.map