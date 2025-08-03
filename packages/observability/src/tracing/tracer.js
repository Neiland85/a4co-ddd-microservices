"use strict";
/**
 * OpenTelemetry tracer initialization and configuration
 */
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
exports.initializeTracer = initializeTracer;
exports.getTracer = getTracer;
exports.startSpan = startSpan;
exports.Trace = Trace;
exports.withSpan = withSpan;
exports.getTracingContext = getTracingContext;
exports.addSpanEvent = addSpanEvent;
exports.setSpanAttributes = setSpanAttributes;
var sdk_node_1 = require("@opentelemetry/sdk-node");
var resources_1 = require("@opentelemetry/resources");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var exporter_jaeger_1 = require("@opentelemetry/exporter-jaeger");
var exporter_prometheus_1 = require("@opentelemetry/exporter-prometheus");
var sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
var sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
var instrumentation_1 = require("@opentelemetry/instrumentation");
var instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
var instrumentation_express_1 = require("@opentelemetry/instrumentation-express");
var instrumentation_grpc_1 = require("@opentelemetry/instrumentation-grpc");
var api_1 = require("@opentelemetry/api");
/**
 * Initialize OpenTelemetry SDK for Node.js services
 */
function initializeTracer(config) {
    var _a;
    var serviceName = config.serviceName, serviceVersion = config.serviceVersion, environment = config.environment, _b = config.jaegerEndpoint, jaegerEndpoint = _b === void 0 ? 'http://localhost:14268/api/traces' : _b, _c = config.prometheusPort, prometheusPort = _c === void 0 ? 9090 : _c, logger = config.logger;
    // Create resource
    var resource = new resources_1.Resource((_a = {},
        _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] = serviceName,
        _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION] = serviceVersion,
        _a[semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT] = environment,
        _a));
    // Create Jaeger exporter
    var jaegerExporter = new exporter_jaeger_1.JaegerExporter({
        endpoint: jaegerEndpoint,
    });
    // Create Prometheus exporter
    var prometheusExporter = new exporter_prometheus_1.PrometheusExporter({
        port: prometheusPort,
    }, function () {
        logger === null || logger === void 0 ? void 0 : logger.info("Prometheus metrics server started on port ".concat(prometheusPort));
    });
    // Register instrumentations
    (0, instrumentation_1.registerInstrumentations)({
        instrumentations: [
            new instrumentation_http_1.HttpInstrumentation({
                requestHook: function (span, request) {
                    span.setAttribute('http.request.body.size', request.headers['content-length'] || 0);
                },
                responseHook: function (span, response) {
                    span.setAttribute('http.response.body.size', response.headers['content-length'] || 0);
                },
            }),
            new instrumentation_express_1.ExpressInstrumentation(),
            new instrumentation_grpc_1.GrpcInstrumentation(),
        ],
    });
    // Create SDK
    var sdk = new sdk_node_1.NodeSDK({
        resource: resource,
        spanProcessor: new sdk_trace_base_1.BatchSpanProcessor(jaegerExporter),
        metricReader: new sdk_metrics_1.PeriodicExportingMetricReader({
            exporter: prometheusExporter,
            exportIntervalMillis: 10000,
        }),
    });
    // Initialize SDK
    sdk.start();
    logger === null || logger === void 0 ? void 0 : logger.info('OpenTelemetry tracer initialized', {
        custom: {
            serviceName: serviceName,
            serviceVersion: serviceVersion,
            environment: environment,
            jaegerEndpoint: jaegerEndpoint,
            prometheusPort: prometheusPort,
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
    var tracer = getTracer('default');
    if (options === null || options === void 0 ? void 0 : options.parent) {
        var ctx = api_1.trace.setSpan(api_1.context.active(), options.parent);
        return tracer.startSpan(name, {
            kind: options.kind,
            attributes: options.attributes,
        }, ctx);
    }
    return tracer.startActiveSpan(name, {
        kind: options === null || options === void 0 ? void 0 : options.kind,
        attributes: options === null || options === void 0 ? void 0 : options.attributes,
    }, function (span) { return span; });
}
/**
 * Decorator for tracing class methods
 */
function Trace(options) {
    return function (target, propertyKey, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var spanName, span, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spanName = (options === null || options === void 0 ? void 0 : options.name) || "".concat(target.constructor.name, ".").concat(propertyKey);
                            span = startSpan(spanName, {
                                kind: (options === null || options === void 0 ? void 0 : options.kind) || api_1.SpanKind.INTERNAL,
                                attributes: __assign({ 'code.function': propertyKey, 'code.namespace': target.constructor.name }, options === null || options === void 0 ? void 0 : options.attributes),
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, originalMethod.apply(this, args)];
                        case 2:
                            result = _a.sent();
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            return [2 /*return*/, result];
                        case 3:
                            error_1 = _a.sent();
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: error_1 instanceof Error ? error_1.message : String(error_1),
                            });
                            if (error_1 instanceof Error) {
                                span.recordException(error_1);
                            }
                            throw error_1;
                        case 4:
                            span.end();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return descriptor;
    };
}
/**
 * Wrap a function with tracing
 */
function withSpan(name, fn, options) {
    return __awaiter(this, void 0, void 0, function () {
        var span, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    span = startSpan(name, options);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fn(span)];
                case 2:
                    result = _a.sent();
                    span.setStatus({ code: api_1.SpanStatusCode.OK });
                    return [2 /*return*/, result];
                case 3:
                    error_2 = _a.sent();
                    span.setStatus({
                        code: api_1.SpanStatusCode.ERROR,
                        message: error_2 instanceof Error ? error_2.message : String(error_2),
                    });
                    if (error_2 instanceof Error) {
                        span.recordException(error_2);
                    }
                    throw error_2;
                case 4:
                    span.end();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Extract tracing context from current span
 */
function getTracingContext() {
    var span = api_1.trace.getActiveSpan();
    if (!span) {
        return null;
    }
    var spanContext = span.spanContext();
    return {
        traceId: spanContext.traceId,
        spanId: spanContext.spanId,
    };
}
/**
 * Add event to current span
 */
function addSpanEvent(name, attributes) {
    var span = api_1.trace.getActiveSpan();
    if (span) {
        span.addEvent(name, attributes);
    }
}
/**
 * Add attributes to current span
 */
function setSpanAttributes(attributes) {
    var span = api_1.trace.getActiveSpan();
    if (span) {
        span.setAttributes(attributes);
    }
}
