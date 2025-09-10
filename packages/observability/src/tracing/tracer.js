"use strict";
/**
 * OpenTelemetry tracer initialization and configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTracer = initializeTracer;
exports.getTracer = getTracer;
exports.startSpan = startSpan;
exports.Trace = Trace;
exports.withSpan = withSpan;
exports.getTracingContext = getTracingContext;
exports.addSpanEvent = addSpanEvent;
exports.setSpanAttributes = setSpanAttributes;
const sdk_node_1 = require("@opentelemetry/sdk-node");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
const exporter_prometheus_1 = require("@opentelemetry/exporter-prometheus");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const instrumentation_1 = require("@opentelemetry/instrumentation");
const instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
const instrumentation_express_1 = require("@opentelemetry/instrumentation-express");
const instrumentation_grpc_1 = require("@opentelemetry/instrumentation-grpc");
const api_1 = require("@opentelemetry/api");
/**
 * Initialize OpenTelemetry SDK for Node.js services
 */
function initializeTracer(config) {
    const { serviceName, serviceVersion, environment, jaegerEndpoint = 'http://localhost:14268/api/traces', prometheusPort = 9090, logger, } = config;
    // Create resource
    const resource = new resources_1.Resource({
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
        [semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
    });
    // Create Jaeger exporter
    const jaegerExporter = new exporter_jaeger_1.JaegerExporter({
        endpoint: jaegerEndpoint,
    });
    // Create Prometheus exporter
    const prometheusExporter = new exporter_prometheus_1.PrometheusExporter({
        port: prometheusPort,
    }, () => {
        logger?.info(`Prometheus metrics server started on port ${prometheusPort}`);
    });
    // Register instrumentations
    (0, instrumentation_1.registerInstrumentations)({
        instrumentations: [
            new instrumentation_http_1.HttpInstrumentation({
                requestHook: (span, request) => {
                    span.setAttribute('http.request.body.size', request.headers['content-length'] || 0);
                },
                responseHook: (span, response) => {
                    span.setAttribute('http.response.body.size', response.headers['content-length'] || 0);
                },
            }),
            new instrumentation_express_1.ExpressInstrumentation(),
            new instrumentation_grpc_1.GrpcInstrumentation(),
        ],
    });
    // Create SDK
    const sdk = new sdk_node_1.NodeSDK({
        resource,
        spanProcessor: new sdk_trace_base_1.BatchSpanProcessor(jaegerExporter),
        metricReader: new sdk_metrics_1.PeriodicExportingMetricReader({
            exporter: prometheusExporter,
            exportIntervalMillis: 10000,
        }),
    });
    // Initialize SDK
    sdk.start();
    logger?.info('OpenTelemetry tracer initialized', {
        custom: {
            serviceName,
            serviceVersion,
            environment,
            jaegerEndpoint,
            prometheusPort,
        },
    });
    return sdk;
}
/**
 * Get or create a tracer instance
 */
function getTracer(name, version) {
    return api_1.trace.getTracer(name, version);
}
/**
 * Start a new span
 */
function startSpan(name, options) {
    const tracer = getTracer('default');
    if (options?.parent) {
        const ctx = api_1.trace.setSpan(api_1.context.active(), options.parent);
        return tracer.startSpan(name, {
            kind: options.kind,
            attributes: options.attributes,
        }, ctx);
    }
    return tracer.startActiveSpan(name, {
        kind: options?.kind,
        attributes: options?.attributes,
    }, span => span);
}
/**
 * Decorator for tracing class methods
 */
function Trace(options) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const spanName = options?.name || `${target.constructor.name}.${propertyKey}`;
            const span = startSpan(spanName, {
                kind: options?.kind || api_1.SpanKind.INTERNAL,
                attributes: {
                    'code.function': propertyKey,
                    'code.namespace': target.constructor.name,
                    ...options?.attributes,
                },
            });
            try {
                const result = await originalMethod.apply(this, args);
                span.setStatus({ code: api_1.SpanStatusCode.OK });
                return result;
            }
            catch (error) {
                span.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: error instanceof Error ? error.message : String(error),
                });
                if (error instanceof Error) {
                    span.recordException(error);
                }
                throw error;
            }
            finally {
                span.end();
            }
        };
        return descriptor;
    };
}
/**
 * Wrap a function with tracing
 */
async function withSpan(name, fn, options) {
    const span = startSpan(name, options);
    try {
        const result = await fn(span);
        span.setStatus({ code: api_1.SpanStatusCode.OK });
        return result;
    }
    catch (error) {
        span.setStatus({
            code: api_1.SpanStatusCode.ERROR,
            message: error instanceof Error ? error.message : String(error),
        });
        if (error instanceof Error) {
            span.recordException(error);
        }
        throw error;
    }
    finally {
        span.end();
    }
}
/**
 * Extract tracing context from current span
 */
function getTracingContext() {
    const span = api_1.trace.getActiveSpan();
    if (!span) {
        return null;
    }
    const spanContext = span.spanContext();
    return {
        traceId: spanContext.traceId,
        spanId: spanContext.spanId,
    };
}
/**
 * Add event to current span
 */
function addSpanEvent(name, attributes) {
    const span = api_1.trace.getActiveSpan();
    if (span) {
        span.addEvent(name, attributes);
    }
}
/**
 * Add attributes to current span
 */
function setSpanAttributes(attributes) {
    const span = api_1.trace.getActiveSpan();
    if (span) {
        span.setAttributes(attributes);
    }
}
//# sourceMappingURL=tracer.js.map