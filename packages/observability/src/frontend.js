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
exports.initializeFrontendObservability = initializeFrontendObservability;
exports.useErrorLogger = useErrorLogger;
exports.useUILogger = useUILogger;
exports.useComponentTracing = useComponentTracing;
exports.withObservability = withObservability;
exports.createObservableFetch = createObservableFetch;
exports.getFrontendLogger = getFrontendLogger;
exports.getFrontendTracer = getFrontendTracer;
var react_1 = require("react");
var api_1 = require("@opentelemetry/api");
var sdk_trace_web_1 = require("@opentelemetry/sdk-trace-web");
var sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
var exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
var resources_1 = require("@opentelemetry/resources");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var context_zone_1 = require("@opentelemetry/context-zone");
var instrumentation_1 = require("@opentelemetry/instrumentation");
var instrumentation_document_load_1 = require("@opentelemetry/instrumentation-document-load");
var instrumentation_user_interaction_1 = require("@opentelemetry/instrumentation-user-interaction");
var instrumentation_xml_http_request_1 = require("@opentelemetry/instrumentation-xml-http-request");
var instrumentation_fetch_1 = require("@opentelemetry/instrumentation-fetch");
// Clase para logging estructurado en frontend
var FrontendLogger = /** @class */ (function () {
    function FrontendLogger(config) {
        this.config = config;
        this.sessionId = this.generateSessionId();
    }
    FrontendLogger.prototype.generateSessionId = function () {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    };
    FrontendLogger.prototype.createLogEntry = function (level, message, data) {
        return __assign({ level: level, message: message, timestamp: new Date().toISOString(), service: this.config.serviceName, version: this.config.serviceVersion, environment: this.config.environment, sessionId: this.sessionId, userId: this.getUserId() }, data);
    };
    FrontendLogger.prototype.getUserId = function () {
        // Implementar lógica para obtener el ID del usuario desde localStorage, cookies, etc.
        return localStorage.getItem('userId') || undefined;
    };
    FrontendLogger.prototype.sendLog = function (logEntry) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.endpoint) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch(this.config.endpoint, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(logEntry),
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error sending log:', error_1);
                        return [3 /*break*/, 4];
                    case 4:
                        // También loggear en consola en desarrollo
                        if (this.config.environment === 'development') {
                            console.log("[".concat(logEntry.level.toUpperCase(), "] ").concat(logEntry.message), logEntry);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FrontendLogger.prototype.debug = function (message, data) {
        if (this.config.level === 'debug') {
            this.sendLog(this.createLogEntry('debug', message, data));
        }
    };
    FrontendLogger.prototype.info = function (message, data) {
        if (['debug', 'info'].includes(this.config.level || 'info')) {
            this.sendLog(this.createLogEntry('info', message, data));
        }
    };
    FrontendLogger.prototype.warn = function (message, data) {
        if (['debug', 'info', 'warn'].includes(this.config.level || 'info')) {
            this.sendLog(this.createLogEntry('warn', message, data));
        }
    };
    FrontendLogger.prototype.error = function (message, error, data) {
        this.sendLog(this.createLogEntry('error', message, __assign({ error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
            } : undefined }, data)));
    };
    FrontendLogger.prototype.logUIEvent = function (event) {
        var uiEvent = __assign(__assign({}, event), { timestamp: Date.now(), sessionId: this.sessionId });
        this.info("UI Event: ".concat(event.component, ".").concat(event.action), uiEvent);
    };
    return FrontendLogger;
}());
// Clase para tracing en frontend
var FrontendTracer = /** @class */ (function () {
    function FrontendTracer(config) {
        this.config = config;
        this.initializeTracer();
    }
    FrontendTracer.prototype.initializeTracer = function () {
        var _a;
        this.provider = new sdk_trace_web_1.WebTracerProvider({
            resource: new resources_1.Resource((_a = {},
                _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] = this.config.serviceName,
                _a[semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION] = this.config.serviceVersion,
                _a[semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT] = this.config.environment,
                _a)),
        });
        // Configurar exportador
        if (this.config.endpoint) {
            this.provider.addSpanProcessor(new sdk_trace_base_1.BatchSpanProcessor(new exporter_trace_otlp_http_1.OTLPTraceExporter({
                url: this.config.endpoint,
            })));
        }
        // Registrar instrumentaciones automáticas
        (0, instrumentation_1.registerInstrumentations)({
            instrumentations: [
                new instrumentation_document_load_1.DocumentLoadInstrumentation(),
                new instrumentation_user_interaction_1.UserInteractionInstrumentation(),
                new instrumentation_xml_http_request_1.XMLHttpRequestInstrumentation(),
                new instrumentation_fetch_1.FetchInstrumentation(),
            ],
        });
        // Registrar el provider
        this.provider.register({
            contextManager: new context_zone_1.ZoneContextManager(),
        });
    };
    FrontendTracer.prototype.createSpan = function (name, kind) {
        if (kind === void 0) { kind = api_1.SpanKind.INTERNAL; }
        var tracer = api_1.trace.getTracer(this.config.serviceName);
        return tracer.startSpan(name, { kind: kind });
    };
    FrontendTracer.prototype.createChildSpan = function (parentSpan, name, kind) {
        if (kind === void 0) { kind = api_1.SpanKind.INTERNAL; }
        var tracer = api_1.trace.getTracer(this.config.serviceName);
        return tracer.startSpan(name, { kind: kind }, api_1.context.active());
    };
    FrontendTracer.prototype.addEvent = function (span, name, attributes) {
        span.addEvent(name, attributes);
    };
    FrontendTracer.prototype.setAttributes = function (span, attributes) {
        span.setAttributes(attributes);
    };
    FrontendTracer.prototype.endSpan = function (span, status) {
        if (status === void 0) { status = api_1.SpanStatusCode.OK; }
        span.setStatus(status);
        span.end();
    };
    return FrontendTracer;
}());
// Instancia global
var frontendLogger = null;
var frontendTracer = null;
// Función de inicialización
function initializeFrontendObservability(loggerConfig, tracingConfig) {
    frontendLogger = new FrontendLogger(loggerConfig);
    frontendTracer = new FrontendTracer(tracingConfig);
    return {
        logger: frontendLogger,
        tracer: frontendTracer,
    };
}
// Hook para logging de errores
function useErrorLogger() {
    var logError = (0, react_1.useCallback)(function (error, context) {
        if (frontendLogger) {
            frontendLogger.error("Error in ".concat(context || 'component'), error);
        }
    }, []);
    return { logError: logError };
}
// Hook para logging de eventos de UI
function useUILogger() {
    var logUIEvent = (0, react_1.useCallback)(function (event) {
        if (frontendLogger) {
            frontendLogger.logUIEvent(event);
        }
    }, []);
    return { logUIEvent: logUIEvent };
}
// Hook para tracing de componentes
function useComponentTracing(componentName) {
    var spanRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (frontendTracer) {
            spanRef.current = frontendTracer.createSpan("".concat(componentName, ".mount"));
            frontendTracer.setAttributes(spanRef.current, {
                'component.name': componentName,
                'component.type': 'react',
            });
        }
        return function () {
            if (spanRef.current && frontendTracer) {
                frontendTracer.endSpan(spanRef.current);
            }
        };
    }, [componentName]);
    var createChildSpan = (0, react_1.useCallback)(function (action) {
        if (frontendTracer && spanRef.current) {
            return frontendTracer.createChildSpan(spanRef.current, "".concat(componentName, ".").concat(action));
        }
        return null;
    }, [componentName]);
    return { createChildSpan: createChildSpan };
}
// HOC para instrumentar componentes
function withObservability(WrappedComponent, componentName) {
    return function ObservabilityWrapper(props) {
        var logUIEvent = useUILogger().logUIEvent;
        var createChildSpan = useComponentTracing(componentName).createChildSpan;
        var handleInteraction = (0, react_1.useCallback)(function (action, data) {
            var span = createChildSpan(action);
            if (span && frontendTracer) {
                frontendTracer.setAttributes(span, data || {});
                frontendTracer.endSpan(span);
            }
            logUIEvent({
                component: componentName,
                action: action,
                props: data,
            });
        }, [componentName, createChildSpan, logUIEvent]);
        return __assign({}, props);
        onInteraction = { handleInteraction: handleInteraction }
            /  >
        ;
        ;
    };
}
// Wrapper para fetch con observabilidad
function createObservableFetch(baseURL) {
    var _this = this;
    return function (url, options) { return __awaiter(_this, void 0, void 0, function () {
        var fullUrl, span, startTime, response, duration, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fullUrl = baseURL ? "".concat(baseURL).concat(url) : url;
                    span = frontendTracer === null || frontendTracer === void 0 ? void 0 : frontendTracer.createSpan('http.request', api_1.SpanKind.CLIENT);
                    if (span) {
                        frontendTracer === null || frontendTracer === void 0 ? void 0 : frontendTracer.setAttributes(span, {
                            'http.url': fullUrl,
                            'http.method': (options === null || options === void 0 ? void 0 : options.method) || 'GET',
                        });
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    startTime = performance.now();
                    return [4 /*yield*/, fetch(fullUrl, options)];
                case 2:
                    response = _a.sent();
                    duration = performance.now() - startTime;
                    if (span) {
                        frontendTracer === null || frontendTracer === void 0 ? void 0 : frontendTracer.setAttributes(span, {
                            'http.status_code': response.status,
                            'http.response_time': duration,
                        });
                        frontendTracer === null || frontendTracer === void 0 ? void 0 : frontendTracer.endSpan(span, response.ok ? api_1.SpanStatusCode.OK : api_1.SpanStatusCode.ERROR);
                    }
                    if (!response.ok) {
                        frontendLogger === null || frontendLogger === void 0 ? void 0 : frontendLogger.error("HTTP Error: ".concat(response.status), new Error("HTTP ".concat(response.status)), {
                            url: fullUrl,
                            status: response.status,
                        });
                    }
                    return [2 /*return*/, response];
                case 3:
                    error_2 = _a.sent();
                    if (span) {
                        frontendTracer === null || frontendTracer === void 0 ? void 0 : frontendTracer.setAttributes(span, {
                            'error': true,
                            'error.message': error_2 instanceof Error ? error_2.message : String(error_2),
                        });
                        frontendTracer === null || frontendTracer === void 0 ? void 0 : frontendTracer.endSpan(span, api_1.SpanStatusCode.ERROR);
                    }
                    frontendLogger === null || frontendLogger === void 0 ? void 0 : frontendLogger.error("Network Error", error_2 instanceof Error ? error_2 : new Error(String(error_2)), {
                        url: fullUrl,
                    });
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    }); };
}
// Exportar instancias globales
function getFrontendLogger() {
    return frontendLogger;
}
function getFrontendTracer() {
    return frontendTracer;
}
