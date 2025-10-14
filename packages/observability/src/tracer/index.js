"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpanKind = exports.SpanStatusCode = exports.propagation = exports.context = exports.trace = void 0;
exports.initializeTracing = initializeTracing;
exports.getTracer = getTracer;
exports.shutdownTracing = shutdownTracing;
exports.startActiveSpan = startActiveSpan;
exports.withSpan = withSpan;
exports.injectContext = injectContext;
exports.extractContext = extractContext;
exports.createDDDSpan = createDDDSpan;
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
const instrumentation_1 = require("@opentelemetry/instrumentation");
const instrumentation_express_1 = require("@opentelemetry/instrumentation-express");
const instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
const instrumentation_koa_1 = require("@opentelemetry/instrumentation-koa");
const api_1 = require("@opentelemetry/api");
Object.defineProperty(exports, "trace", { enumerable: true, get: function () { return api_1.trace; } });
Object.defineProperty(exports, "context", { enumerable: true, get: function () { return api_1.context; } });
Object.defineProperty(exports, "SpanStatusCode", { enumerable: true, get: function () { return api_1.SpanStatusCode; } });
Object.defineProperty(exports, "SpanKind", { enumerable: true, get: function () { return api_1.SpanKind; } });
Object.defineProperty(exports, "propagation", { enumerable: true, get: function () { return api_1.propagation; } });
const core_1 = require("@opentelemetry/core");
const core_2 = require("@opentelemetry/core");
const logger_1 = require("../logger");
// Global tracer provider
let globalTracerProvider = null;
let globalSDK = null;
// Custom propagator for NATS and other messaging systems
class CustomMessagePropagator {
    propagator = new core_1.W3CTraceContextPropagator();
    inject(context, carrier) {
        const setter = {
            set(carrier, key, value) {
                if (!carrier.headers)
                    carrier.headers = {};
                carrier.headers[key] = value;
            },
        };
        this.propagator.inject(context, carrier, setter);
    }
    extract(context, carrier) {
        const getter = {
            keys(carrier) {
                return carrier.headers ? Object.keys(carrier.headers) : [];
            },
            get(carrier, key) {
                return carrier.headers?.[key];
            },
        };
        return this.propagator.extract(context, carrier, getter);
    }
}
const messagePropagator = new CustomMessagePropagator();
// Enhanced tracer with context support
function createEnhancedTracer(baseTracer, defaultContext) {
    const enhancedTracer = Object.create(baseTracer);
    enhancedTracer.withContext = function (ctx) {
        return createEnhancedTracer(baseTracer, { ...defaultContext, ...ctx });
    };
    enhancedTracer.withDDD = function (metadata) {
        const dddContext = {
            ...defaultContext,
            metadata: {
                ...defaultContext?.metadata,
                ...metadata,
            },
        };
        return createEnhancedTracer(baseTracer, dddContext);
    };
    // Override startSpan to include default context
    const originalStartSpan = baseTracer.startSpan.bind(baseTracer);
    enhancedTracer.startSpan = function (name, options, context) {
        const attributes = {
            ...options?.attributes,
            ...defaultContext?.metadata,
        };
        if (defaultContext?.correlationId) {
            attributes['correlation.id'] = defaultContext.correlationId;
        }
        if (defaultContext?.causationId) {
            attributes['causation.id'] = defaultContext.causationId;
        }
        if (defaultContext?.userId) {
            attributes['user.id'] = defaultContext.userId;
        }
        if (defaultContext?.tenantId) {
            attributes['tenant.id'] = defaultContext.tenantId;
        }
        return originalStartSpan(name, { ...options, attributes }, context);
    };
    // Ensure all original methods are available
    Object.setPrototypeOf(enhancedTracer, baseTracer);
    return enhancedTracer;
}
// Initialize tracing
function initializeTracing(config) {
    const logger = (0, logger_1.getLogger)();
    // Create resource
    const resource = resources_1.Resource.default().merge(new resources_1.Resource({
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion || '1.0.0',
        [semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment || 'development',
    }));
    // Create tracer provider
    const provider = new sdk_trace_node_1.NodeTracerProvider({
        resource,
    });
    // Add exporters
    const exporters = [];
    // Jaeger exporter
    if (config.jaegerEndpoint) {
        const jaegerExporter = new exporter_jaeger_1.JaegerExporter({
            endpoint: config.jaegerEndpoint,
            // Additional Jaeger configuration can be added here
        });
        provider.addSpanProcessor(new sdk_trace_base_1.BatchSpanProcessor(jaegerExporter));
        exporters.push('jaeger');
    }
    // Console exporter for development
    if (config.enableConsoleExporter) {
        provider.addSpanProcessor(new sdk_trace_base_1.SimpleSpanProcessor(new sdk_trace_base_1.ConsoleSpanExporter()));
        exporters.push('console');
    }
    // Register the provider
    provider.register({
        propagator: new core_2.CompositePropagator({
            propagators: [new core_1.W3CTraceContextPropagator(), new core_2.W3CBaggagePropagator()],
        }),
    });
    globalTracerProvider = provider;
    // Register instrumentations
    if (config.enableAutoInstrumentation) {
        (0, instrumentation_1.registerInstrumentations)({
            instrumentations: [
                new instrumentation_http_1.HttpInstrumentation({
                    requestHook: (span, request) => {
                        span.setAttributes({
                            'http.request.body.size': request.headers?.['content-length'],
                            'http.user_agent': request.headers?.['user-agent'],
                        });
                    },
                    responseHook: (span, response) => {
                        span.setAttributes({
                            'http.response.body.size': response.headers?.['content-length'],
                        });
                    },
                }),
                new instrumentation_express_1.ExpressInstrumentation({
                    requestHook: (span, info) => {
                        span.setAttributes({
                            'express.route': info.route,
                            'express.layer_type': info.layerType,
                        });
                    },
                }),
                new instrumentation_koa_1.KoaInstrumentation(),
                // Add more instrumentations as needed
            ],
        });
    }
    // Create SDK
    const sdk = new sdk_node_1.NodeSDK({
        resource,
        traceExporter: config.jaegerEndpoint
            ? new exporter_jaeger_1.JaegerExporter({
                endpoint: config.jaegerEndpoint,
            })
            : undefined,
        instrumentations: config.enableAutoInstrumentation ? [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()] : [],
    });
    // Initialize SDK
    sdk
        .start()
        .then(() => logger.info({ exporters }, 'Tracing initialized'))
        .catch(error => logger.error({ error }, 'Error initializing tracing'));
    globalSDK = sdk;
    return sdk;
}
// Get tracer instance
function getTracer(name, version) {
    const tracerName = name || '@a4co/observability';
    const baseTracer = api_1.trace.getTracer(tracerName, version);
    return createEnhancedTracer(baseTracer);
}
// Shutdown tracing
async function shutdownTracing() {
    if (globalSDK) {
        await globalSDK.shutdown();
    }
    if (globalTracerProvider) {
        await globalTracerProvider.shutdown();
    }
}
// Span utilities
function startActiveSpan(name, fn, options) {
    const tracer = getTracer();
    return tracer.startActiveSpan(name, options || {}, fn);
}
function withSpan(name, fn, options) {
    return startActiveSpan(name, async (span) => {
        try {
            const result = await fn();
            span.setStatus({ code: api_1.SpanStatusCode.OK });
            return result;
        }
        catch (error) {
            span.recordException(error);
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
        finally {
            span.end();
        }
    }, options);
}
// Context propagation utilities
function injectContext(carrier) {
    const activeContext = api_1.context.active();
    messagePropagator.inject(activeContext, carrier);
}
function extractContext(carrier) {
    return messagePropagator.extract(api_1.context.active(), carrier);
}
// DDD span helpers
function createDDDSpan(name, metadata, options) {
    const attributes = {
        ...options?.attributes,
    };
    if (metadata.aggregateId)
        attributes['ddd.aggregate.id'] = metadata.aggregateId;
    if (metadata.aggregateName)
        attributes['ddd.aggregate.name'] = metadata.aggregateName;
    if (metadata.commandName)
        attributes['ddd.command.name'] = metadata.commandName;
    if (metadata.eventName)
        attributes['ddd.event.name'] = metadata.eventName;
    if (metadata.eventVersion)
        attributes['ddd.event.version'] = metadata.eventVersion;
    if (metadata.correlationId)
        attributes['correlation.id'] = metadata.correlationId;
    if (metadata.causationId)
        attributes['causation.id'] = metadata.causationId;
    if (metadata.userId)
        attributes['user.id'] = metadata.userId;
    if (metadata.tenantId)
        attributes['tenant.id'] = metadata.tenantId;
    const tracer = getTracer();
    return tracer.startSpan(name, { ...options, attributes });
}
//# sourceMappingURL=index.js.map