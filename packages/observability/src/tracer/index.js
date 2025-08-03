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
exports.SpanKind = exports.SpanStatusCode = exports.propagation = exports.context = exports.trace = void 0;
exports.initializeTracing = initializeTracing;
exports.getTracer = getTracer;
exports.shutdownTracing = shutdownTracing;
exports.startActiveSpan = startActiveSpan;
exports.withSpan = withSpan;
exports.injectContext = injectContext;
exports.extractContext = extractContext;
exports.createDDDSpan = createDDDSpan;
var sdk_node_1 = require("@opentelemetry/sdk-node");
var auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
var resources_1 = require("@opentelemetry/resources");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
var sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
var sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
var instrumentation_1 = require("@opentelemetry/instrumentation");
var instrumentation_express_1 = require("@opentelemetry/instrumentation-express");
var instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
var instrumentation_koa_1 = require("@opentelemetry/instrumentation-koa");
var api_1 = require("@opentelemetry/api");
Object.defineProperty(exports, "trace", { enumerable: true, get: function () { return api_1.trace; } });
Object.defineProperty(exports, "context", { enumerable: true, get: function () { return api_1.context; } });
Object.defineProperty(exports, "SpanStatusCode", { enumerable: true, get: function () { return api_1.SpanStatusCode; } });
Object.defineProperty(exports, "SpanKind", { enumerable: true, get: function () { return api_1.SpanKind; } });
Object.defineProperty(exports, "propagation", { enumerable: true, get: function () { return api_1.propagation; } });
var core_1 = require("@opentelemetry/core");
var core_2 = require("@opentelemetry/core");
var logger_1 = require("../logger");
// Global tracer provider
var globalTracerProvider = null;
var globalSDK = null;
// Custom propagator for NATS and other messaging systems
var CustomMessagePropagator = /** @class */ (function () {
    function CustomMessagePropagator() {
        this.propagator = new core_1.W3CTraceContextPropagator();
    }
    CustomMessagePropagator.prototype.inject = function (context, carrier) {
        var setter = {
            set: function (carrier, key, value) {
                if (!carrier.headers)
                    carrier.headers = {};
                carrier.headers[key] = value;
            }
        };
        this.propagator.inject(context, carrier, setter);
    };
    CustomMessagePropagator.prototype.extract = function (context, carrier) {
        var getter = {
            keys: function (carrier) {
                return carrier.headers ? Object.keys(carrier.headers) : [];
            },
            get: function (carrier, key) {
                var _a;
                return (_a = carrier.headers) === null || _a === void 0 ? void 0 : _a[key];
            }
        };
        return this.propagator.extract(context, carrier, getter);
    };
    return CustomMessagePropagator;
}());
var messagePropagator = new CustomMessagePropagator();
// Enhanced tracer with context support
function createEnhancedTracer(baseTracer, defaultContext) {
    var enhancedTracer = Object.create(baseTracer);
    enhancedTracer.withContext = function (ctx) {
        return createEnhancedTracer(baseTracer, __assign(__assign({}, defaultContext), ctx));
    };
    enhancedTracer.withDDD = function (metadata) {
        var dddContext = __assign(__assign({}, defaultContext), { metadata: __assign(__assign({}, defaultContext === null || defaultContext === void 0 ? void 0 : defaultContext.metadata), metadata) });
        return createEnhancedTracer(baseTracer, dddContext);
    };
    // Override startSpan to include default context
    var originalStartSpan = baseTracer.startSpan.bind(baseTracer);
    enhancedTracer.startSpan = function (name, options, context) {
        var attributes = __assign(__assign({}, options === null || options === void 0 ? void 0 : options.attributes), defaultContext === null || defaultContext === void 0 ? void 0 : defaultContext.metadata);
        if (defaultContext === null || defaultContext === void 0 ? void 0 : defaultContext.correlationId) {
            attributes['correlation.id'] = defaultContext.correlationId;
        }
        if (defaultContext === null || defaultContext === void 0 ? void 0 : defaultContext.causationId) {
            attributes['causation.id'] = defaultContext.causationId;
        }
        if (defaultContext === null || defaultContext === void 0 ? void 0 : defaultContext.userId) {
            attributes['user.id'] = defaultContext.userId;
        }
        if (defaultContext === null || defaultContext === void 0 ? void 0 : defaultContext.tenantId) {
            attributes['tenant.id'] = defaultContext.tenantId;
        }
        return originalStartSpan(name, __assign(__assign({}, options), { attributes: attributes }), context);
    };
    // Ensure all original methods are available
    Object.setPrototypeOf(enhancedTracer, baseTracer);
    return enhancedTracer;
}
// Initialize tracing
function initializeTracing(config) {
    var _a;
    var logger = (0, logger_1.getLogger)();
    // Create resource
    var resource = resources_1.Resource.default().merge(new resources_1.Resource((_a = {},
        _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] = config.serviceName,
        _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION] = config.serviceVersion || '1.0.0',
        _a[semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT] = config.environment || 'development',
        _a)));
    // Create tracer provider
    var provider = new sdk_trace_node_1.NodeTracerProvider({
        resource: resource,
    });
    // Add exporters
    var exporters = [];
    // Jaeger exporter
    if (config.jaegerEndpoint) {
        var jaegerExporter = new exporter_jaeger_1.JaegerExporter({
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
            propagators: [
                new core_1.W3CTraceContextPropagator(),
                new core_2.W3CBaggagePropagator(),
            ],
        }),
    });
    globalTracerProvider = provider;
    // Register instrumentations
    if (config.enableAutoInstrumentation) {
        (0, instrumentation_1.registerInstrumentations)({
            instrumentations: [
                new instrumentation_http_1.HttpInstrumentation({
                    requestHook: function (span, request) {
                        var _a, _b;
                        span.setAttributes({
                            'http.request.body.size': (_a = request.headers) === null || _a === void 0 ? void 0 : _a['content-length'],
                            'http.user_agent': (_b = request.headers) === null || _b === void 0 ? void 0 : _b['user-agent'],
                        });
                    },
                    responseHook: function (span, response) {
                        var _a;
                        span.setAttributes({
                            'http.response.body.size': (_a = response.headers) === null || _a === void 0 ? void 0 : _a['content-length'],
                        });
                    },
                }),
                new instrumentation_express_1.ExpressInstrumentation({
                    requestHook: function (span, info) {
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
    var sdk = new sdk_node_1.NodeSDK({
        resource: resource,
        traceExporter: config.jaegerEndpoint ? new exporter_jaeger_1.JaegerExporter({
            endpoint: config.jaegerEndpoint,
        }) : undefined,
        instrumentations: config.enableAutoInstrumentation ? [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()] : [],
    });
    // Initialize SDK
    sdk.start()
        .then(function () { return logger.info({ exporters: exporters }, 'Tracing initialized'); })
        .catch(function (error) { return logger.error({ error: error }, 'Error initializing tracing'); });
    globalSDK = sdk;
    return sdk;
}
// Get tracer instance
function getTracer(name, version) {
    var tracerName = name || '@a4co/observability';
    var baseTracer = api_1.trace.getTracer(tracerName, version);
    return createEnhancedTracer(baseTracer);
}
// Shutdown tracing
function shutdownTracing() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!globalSDK) return [3 /*break*/, 2];
                    return [4 /*yield*/, globalSDK.shutdown()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!globalTracerProvider) return [3 /*break*/, 4];
                    return [4 /*yield*/, globalTracerProvider.shutdown()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Span utilities
function startActiveSpan(name, fn, options) {
    var tracer = getTracer();
    return tracer.startActiveSpan(name, options || {}, fn);
}
function withSpan(name, fn, options) {
    var _this = this;
    return startActiveSpan(name, function (span) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, fn()];
                case 1:
                    result = _a.sent();
                    span.setStatus({ code: api_1.SpanStatusCode.OK });
                    return [2 /*return*/, result];
                case 2:
                    error_1 = _a.sent();
                    span.recordException(error_1);
                    span.setStatus({
                        code: api_1.SpanStatusCode.ERROR,
                        message: error_1 instanceof Error ? error_1.message : 'Unknown error'
                    });
                    throw error_1;
                case 3:
                    span.end();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, options);
}
// Context propagation utilities
function injectContext(carrier) {
    var activeContext = api_1.context.active();
    messagePropagator.inject(activeContext, carrier);
}
function extractContext(carrier) {
    return messagePropagator.extract(api_1.context.active(), carrier);
}
// DDD span helpers
function createDDDSpan(name, metadata, options) {
    var attributes = __assign({}, options === null || options === void 0 ? void 0 : options.attributes);
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
    var tracer = getTracer();
    return tracer.startSpan(name, __assign(__assign({}, options), { attributes: attributes }));
}
