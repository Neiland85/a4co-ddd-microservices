"use strict";
/**
 * OpenTelemetry tracer for web/frontend applications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebTracer = initializeWebTracer;
exports.getWebTracer = getWebTracer;
exports.startWebSpan = startWebSpan;
exports.traceWebOperation = traceWebOperation;
exports.traceComponentRender = traceComponentRender;
exports.traceRouteNavigation = traceRouteNavigation;
exports.traceUserInteraction = traceUserInteraction;
exports.collectPerformanceMetrics = collectPerformanceMetrics;
exports.addPerformanceMetricsToSpan = addPerformanceMetricsToSpan;
const sdk_trace_web_1 = require("@opentelemetry/sdk-trace-web");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const instrumentation_1 = require("@opentelemetry/instrumentation");
const instrumentation_fetch_1 = require("@opentelemetry/instrumentation-fetch");
const instrumentation_xml_http_request_1 = require("@opentelemetry/instrumentation-xml-http-request");
const api_1 = require("@opentelemetry/api");
const context_zone_1 = require("@opentelemetry/context-zone");
/**
 * Initialize OpenTelemetry for web applications
 */
function initializeWebTracer(config) {
    const { serviceName, serviceVersion, environment, collectorUrl = 'http://localhost:4318/v1/traces', logger, } = config;
    // Create resource
    const resource = new resources_1.Resource({
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
        [semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
    });
    // Create provider
    const provider = new sdk_trace_web_1.WebTracerProvider({
        resource,
    });
    // Create OTLP exporter
    const exporter = new exporter_trace_otlp_http_1.OTLPTraceExporter({
        url: collectorUrl,
        headers: {},
    });
    // Add span processor
    provider.addSpanProcessor(new sdk_trace_base_1.BatchSpanProcessor(exporter));
    // Set global provider
    provider.register({
        contextManager: new context_zone_1.ZoneContextManager(),
    });
    // Register instrumentations
    (0, instrumentation_1.registerInstrumentations)({
        instrumentations: [
            new instrumentation_fetch_1.FetchInstrumentation({
                propagateTraceHeaderCorsUrls: /.*/,
                clearTimingResources: true,
                applyCustomAttributesOnSpan: (span, request, response) => {
                    span.setAttribute('http.request.method', request.method);
                    span.setAttribute('http.url', request.url);
                    if (response) {
                        span.setAttribute('http.status_code', response.status);
                    }
                },
            }),
            new instrumentation_xml_http_request_1.XMLHttpRequestInstrumentation({
                propagateTraceHeaderCorsUrls: /.*/,
                clearTimingResources: true,
            }),
        ],
    });
    logger?.info('Web tracer initialized', {
        custom: {
            serviceName,
            serviceVersion,
            environment,
            collectorUrl,
        },
    });
    return provider;
}
/**
 * Get web tracer instance
 */
function getWebTracer(name, version) {
    return api_1.trace.getTracer(name, version);
}
/**
 * Start a span for web operations
 */
function startWebSpan(name, options) {
    const tracer = getWebTracer('web');
    return tracer.startSpan(name, {
        kind: options?.kind || api_1.SpanKind.CLIENT,
        attributes: options?.attributes,
    });
}
/**
 * Trace a web operation
 */
async function traceWebOperation(name, operation, options) {
    const span = startWebSpan(name, options);
    const ctx = api_1.trace.setSpan(api_1.context.active(), span);
    try {
        const result = await api_1.context.with(ctx, () => operation(span));
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
 * Trace React component render
 */
function traceComponentRender(componentName, props) {
    const span = startWebSpan(`Component: ${componentName}`, {
        kind: api_1.SpanKind.INTERNAL,
        attributes: {
            'component.name': componentName,
            'component.props': props ? Object.keys(props).join(',') : '',
        },
    });
    return span;
}
/**
 * Trace route navigation
 */
function traceRouteNavigation(fromRoute, toRoute) {
    const span = startWebSpan('Route Navigation', {
        kind: api_1.SpanKind.INTERNAL,
        attributes: {
            'navigation.from': fromRoute,
            'navigation.to': toRoute,
            'navigation.timestamp': new Date().toISOString(),
        },
    });
    return span;
}
/**
 * Trace user interaction
 */
function traceUserInteraction(interactionType, target, metadata) {
    const span = startWebSpan(`User Interaction: ${interactionType}`, {
        kind: api_1.SpanKind.INTERNAL,
        attributes: {
            'interaction.type': interactionType,
            'interaction.target': target,
            ...metadata,
        },
    });
    return span;
}
function collectPerformanceMetrics() {
    const metrics = {};
    if (typeof window !== 'undefined' && 'performance' in window) {
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
            metrics.firstContentfulPaint = fcpEntry.startTime;
        }
        // Collect Web Vitals if available
        if ('PerformanceObserver' in window) {
            try {
                // LCP
                const lcpObserver = new PerformanceObserver(list => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    metrics.largestContentfulPaint = lastEntry.startTime;
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                // CLS
                let clsValue = 0;
                const clsObserver = new PerformanceObserver(list => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    metrics.cumulativeLayoutShift = clsValue;
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                // FID
                const fidObserver = new PerformanceObserver(list => {
                    const firstEntry = list.getEntries()[0];
                    metrics.firstInputDelay = firstEntry.processingStart - firstEntry.startTime;
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            }
            catch (e) {
                // Some browsers might not support all observers
            }
        }
    }
    return metrics;
}
/**
 * Add performance metrics to current span
 */
function addPerformanceMetricsToSpan() {
    const span = api_1.trace.getActiveSpan();
    if (span) {
        const metrics = collectPerformanceMetrics();
        Object.entries(metrics).forEach(([key, value]) => {
            if (value !== undefined) {
                span.setAttribute(`performance.${key}`, value);
            }
        });
    }
}
//# sourceMappingURL=web-tracer.js.map