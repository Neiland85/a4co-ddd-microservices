"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeLogger = exports.getLogger = exports.createLogger = exports.createHttpLogger = void 0;
exports.initializeTracing = initializeTracing;
exports.getTracer = getTracer;
exports.shutdownTracing = shutdownTracing;
exports.startActiveSpan = startActiveSpan;
exports.withSpan = withSpan;
exports.injectContext = injectContext;
exports.extractContext = extractContext;
exports.createDDDSpan = createDDDSpan;
const api_1 = require("@opentelemetry/api");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const core_1 = require("@opentelemetry/core");
const exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
const instrumentation_1 = require("@opentelemetry/instrumentation");
const instrumentation_express_1 = require("@opentelemetry/instrumentation-express");
const instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
const instrumentation_koa_1 = require("@opentelemetry/instrumentation-koa");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
const logger_1 = require("./logger");
let globalTracerProvider = null;
let globalSDK = null;
class CustomMessagePropagator {
    constructor() {
        this.propagator = new core_1.W3CTraceContextPropagator();
    }
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
        return originalStartSpan(name, { ...options, attributes: attributes }, context);
    };
    const originalStartActiveSpan = baseTracer.startActiveSpan?.bind(baseTracer);
    if (originalStartActiveSpan) {
        enhancedTracer.startActiveSpan = function (name, options, fn) {
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
            return originalStartActiveSpan(name, { ...options, attributes }, fn);
        };
    }
    Object.setPrototypeOf(enhancedTracer, baseTracer);
    return enhancedTracer;
}
function initializeTracing(config) {
    const logger = (0, logger_1.getLogger)();
    const provider = new sdk_trace_node_1.NodeTracerProvider({});
    const exporters = [];
    if (config.jaegerEndpoint) {
        exporters.push('jaeger');
    }
    if (config.enableConsoleExporter) {
        exporters.push('console');
    }
    provider.register({
        propagator: new core_1.CompositePropagator({
            propagators: [new core_1.W3CTraceContextPropagator(), new core_1.W3CBaggagePropagator()],
        }),
    });
    globalTracerProvider = provider;
    if (config.enableAutoInstrumentation !== false) {
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
            ],
        });
    }
    const sdk = new sdk_node_1.NodeSDK({
        traceExporter: config.jaegerEndpoint
            ? new exporter_jaeger_1.JaegerExporter({
                endpoint: config.jaegerEndpoint,
            })
            : undefined,
        instrumentations: config.enableAutoInstrumentation ? [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()] : [],
    });
    try {
        sdk.start();
        logger.info(`Tracing initialized with exporters: ${exporters.join(', ')}`);
    }
    catch (error) {
        logger.error(`Error initializing tracing: ${error instanceof Error ? error.message : String(error)}`);
    }
    globalSDK = sdk;
    return sdk;
}
function getTracer(name, version) {
    const tracerName = name || '@a4co/observability';
    const baseTracer = api_1.trace.getTracer(tracerName, version);
    return createEnhancedTracer(baseTracer);
}
async function shutdownTracing() {
    if (globalSDK) {
        await globalSDK.shutdown();
    }
    if (globalTracerProvider) {
        await globalTracerProvider.shutdown();
    }
}
function startActiveSpan(name, fn, options) {
    const tracer = getTracer();
    return tracer.startActiveSpan(name, options, fn);
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
function injectContext(carrier) {
    const activeContext = api_1.context.active();
    messagePropagator.inject(activeContext, carrier);
}
function extractContext(carrier) {
    return messagePropagator.extract(api_1.context.active(), carrier);
}
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
var logger_2 = require("./logger");
Object.defineProperty(exports, "createHttpLogger", { enumerable: true, get: function () { return logger_2.createHttpLogger; } });
Object.defineProperty(exports, "createLogger", { enumerable: true, get: function () { return logger_2.createLogger; } });
Object.defineProperty(exports, "getLogger", { enumerable: true, get: function () { return logger_2.getLogger; } });
Object.defineProperty(exports, "initializeLogger", { enumerable: true, get: function () { return logger_2.initializeLogger; } });
//# sourceMappingURL=index.js.map