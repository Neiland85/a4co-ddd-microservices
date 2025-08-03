"use strict";
/**
 * OpenTelemetry tracer for web/frontend applications
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
exports.initializeWebTracer = initializeWebTracer;
exports.getWebTracer = getWebTracer;
exports.startWebSpan = startWebSpan;
exports.traceWebOperation = traceWebOperation;
exports.traceComponentRender = traceComponentRender;
exports.traceRouteNavigation = traceRouteNavigation;
exports.traceUserInteraction = traceUserInteraction;
exports.collectPerformanceMetrics = collectPerformanceMetrics;
exports.addPerformanceMetricsToSpan = addPerformanceMetricsToSpan;
var sdk_trace_web_1 = require("@opentelemetry/sdk-trace-web");
var resources_1 = require("@opentelemetry/resources");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
var exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
var instrumentation_1 = require("@opentelemetry/instrumentation");
var instrumentation_fetch_1 = require("@opentelemetry/instrumentation-fetch");
var instrumentation_xml_http_request_1 = require("@opentelemetry/instrumentation-xml-http-request");
var api_1 = require("@opentelemetry/api");
var context_zone_1 = require("@opentelemetry/context-zone");
/**
 * Initialize OpenTelemetry for web applications
 */
function initializeWebTracer(config) {
    var _a;
    var serviceName = config.serviceName, serviceVersion = config.serviceVersion, environment = config.environment, _b = config.collectorUrl, collectorUrl = _b === void 0 ? 'http://localhost:4318/v1/traces' : _b, logger = config.logger;
    // Create resource
    var resource = new resources_1.Resource((_a = {},
        _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] = serviceName,
        _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION] = serviceVersion,
        _a[semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT] = environment,
        _a));
    // Create provider
    var provider = new sdk_trace_web_1.WebTracerProvider({
        resource: resource,
    });
    // Create OTLP exporter
    var exporter = new exporter_trace_otlp_http_1.OTLPTraceExporter({
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
                applyCustomAttributesOnSpan: function (span, request, response) {
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
    logger === null || logger === void 0 ? void 0 : logger.info('Web tracer initialized', {
        custom: {
            serviceName: serviceName,
            serviceVersion: serviceVersion,
            environment: environment,
            collectorUrl: collectorUrl,
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
    var tracer = getWebTracer('web');
    return tracer.startSpan(name, {
        kind: (options === null || options === void 0 ? void 0 : options.kind) || api_1.SpanKind.CLIENT,
        attributes: options === null || options === void 0 ? void 0 : options.attributes,
    });
}
/**
 * Trace a web operation
 */
function traceWebOperation(name, operation, options) {
    return __awaiter(this, void 0, void 0, function () {
        var span, ctx, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    span = startWebSpan(name, options);
                    ctx = api_1.trace.setSpan(api_1.context.active(), span);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api_1.context.with(ctx, function () { return operation(span); })];
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
}
/**
 * Trace React component render
 */
function traceComponentRender(componentName, props) {
    var span = startWebSpan("Component: ".concat(componentName), {
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
    var span = startWebSpan('Route Navigation', {
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
    var span = startWebSpan("User Interaction: ".concat(interactionType), {
        kind: api_1.SpanKind.INTERNAL,
        attributes: __assign({ 'interaction.type': interactionType, 'interaction.target': target }, metadata),
    });
    return span;
}
function collectPerformanceMetrics() {
    var metrics = {};
    if (typeof window !== 'undefined' && 'performance' in window) {
        var paintEntries = performance.getEntriesByType('paint');
        var fcpEntry = paintEntries.find(function (entry) { return entry.name === 'first-contentful-paint'; });
        if (fcpEntry) {
            metrics.firstContentfulPaint = fcpEntry.startTime;
        }
        // Collect Web Vitals if available
        if ('PerformanceObserver' in window) {
            try {
                // LCP
                var lcpObserver = new PerformanceObserver(function (list) {
                    var entries = list.getEntries();
                    var lastEntry = entries[entries.length - 1];
                    metrics.largestContentfulPaint = lastEntry.startTime;
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                // CLS
                var clsValue_1 = 0;
                var clsObserver = new PerformanceObserver(function (list) {
                    for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                        var entry = _a[_i];
                        if (!entry.hadRecentInput) {
                            clsValue_1 += entry.value;
                        }
                    }
                    metrics.cumulativeLayoutShift = clsValue_1;
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                // FID
                var fidObserver = new PerformanceObserver(function (list) {
                    var firstEntry = list.getEntries()[0];
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
    var span = api_1.trace.getActiveSpan();
    if (span) {
        var metrics = collectPerformanceMetrics();
        Object.entries(metrics).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (value !== undefined) {
                span.setAttribute("performance.".concat(key), value);
            }
        });
    }
}
