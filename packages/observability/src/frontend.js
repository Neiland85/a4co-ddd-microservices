"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFrontendObservability = initializeFrontendObservability;
exports.useErrorLogger = useErrorLogger;
exports.useUILogger = useUILogger;
exports.useComponentTracing = useComponentTracing;
exports.withObservability = withObservability;
exports.createObservableFetch = createObservableFetch;
exports.getFrontendLogger = getFrontendLogger;
exports.getFrontendTracer = getFrontendTracer;
const react_1 = require("react");
const api_1 = require("@opentelemetry/api");
const sdk_trace_web_1 = require("@opentelemetry/sdk-trace-web");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const context_zone_1 = require("@opentelemetry/context-zone");
const instrumentation_1 = require("@opentelemetry/instrumentation");
const instrumentation_document_load_1 = require("@opentelemetry/instrumentation-document-load");
const instrumentation_user_interaction_1 = require("@opentelemetry/instrumentation-user-interaction");
const instrumentation_xml_http_request_1 = require("@opentelemetry/instrumentation-xml-http-request");
const instrumentation_fetch_1 = require("@opentelemetry/instrumentation-fetch");
// Clase para logging estructurado en frontend
class FrontendLogger {
    config;
    sessionId;
    constructor(config) {
        this.config = config;
        this.sessionId = this.generateSessionId();
    }
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }
    createLogEntry(level, message, data) {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            service: this.config.serviceName,
            version: this.config.serviceVersion,
            environment: this.config.environment,
            sessionId: this.sessionId,
            userId: this.getUserId(),
            ...data
        };
    }
    getUserId() {
        // Implementar lógica para obtener el ID del usuario desde localStorage, cookies, etc.
        return localStorage.getItem('userId') || undefined;
    }
    async sendLog(logEntry) {
        if (this.config.endpoint) {
            try {
                await fetch(this.config.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(logEntry),
                });
            }
            catch (error) {
                console.error('Error sending log:', error);
            }
        }
        // También loggear en consola en desarrollo
        if (this.config.environment === 'development') {
            console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.message}`, logEntry);
        }
    }
    debug(message, data) {
        if (this.config.level === 'debug') {
            this.sendLog(this.createLogEntry('debug', message, data));
        }
    }
    info(message, data) {
        if (['debug', 'info'].includes(this.config.level || 'info')) {
            this.sendLog(this.createLogEntry('info', message, data));
        }
    }
    warn(message, data) {
        if (['debug', 'info', 'warn'].includes(this.config.level || 'info')) {
            this.sendLog(this.createLogEntry('warn', message, data));
        }
    }
    error(message, error, data) {
        this.sendLog(this.createLogEntry('error', message, {
            error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
            } : undefined,
            ...data
        }));
    }
    logUIEvent(event) {
        const uiEvent = {
            ...event,
            timestamp: Date.now(),
            sessionId: this.sessionId,
        };
        this.info(`UI Event: ${event.component}.${event.action}`, uiEvent);
    }
}
// Clase para tracing en frontend
class FrontendTracer {
    provider;
    config;
    constructor(config) {
        this.config = config;
        this.initializeTracer();
    }
    initializeTracer() {
        this.provider = new sdk_trace_web_1.WebTracerProvider({
            resource: new resources_1.Resource({
                [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: this.config.serviceName,
                [semantic_conventions_1.SemanticResourceAttributes.SERVICE_VERSION]: this.config.serviceVersion,
                [semantic_conventions_1.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: this.config.environment,
            }),
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
    }
    createSpan(name, kind = api_1.SpanKind.INTERNAL) {
        const tracer = api_1.trace.getTracer(this.config.serviceName);
        return tracer.startSpan(name, { kind });
    }
    createChildSpan(parentSpan, name, kind = api_1.SpanKind.INTERNAL) {
        const tracer = api_1.trace.getTracer(this.config.serviceName);
        return tracer.startSpan(name, { kind }, api_1.context.active());
    }
    addEvent(span, name, attributes) {
        span.addEvent(name, attributes);
    }
    setAttributes(span, attributes) {
        span.setAttributes(attributes);
    }
    endSpan(span, status = api_1.SpanStatusCode.OK) {
        span.setStatus(status);
        span.end();
    }
}
// Instancia global
let frontendLogger = null;
let frontendTracer = null;
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
    const logError = (0, react_1.useCallback)((error, context) => {
        if (frontendLogger) {
            frontendLogger.error(`Error in ${context || 'component'}`, error);
        }
    }, []);
    return { logError };
}
// Hook para logging de eventos de UI
function useUILogger() {
    const logUIEvent = (0, react_1.useCallback)((event) => {
        if (frontendLogger) {
            frontendLogger.logUIEvent(event);
        }
    }, []);
    return { logUIEvent };
}
// Hook para tracing de componentes
function useComponentTracing(componentName) {
    const spanRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (frontendTracer) {
            spanRef.current = frontendTracer.createSpan(`${componentName}.mount`);
            frontendTracer.setAttributes(spanRef.current, {
                'component.name': componentName,
                'component.type': 'react',
            });
        }
        return () => {
            if (spanRef.current && frontendTracer) {
                frontendTracer.endSpan(spanRef.current);
            }
        };
    }, [componentName]);
    const createChildSpan = (0, react_1.useCallback)((action) => {
        if (frontendTracer && spanRef.current) {
            return frontendTracer.createChildSpan(spanRef.current, `${componentName}.${action}`);
        }
        return null;
    }, [componentName]);
    return { createChildSpan };
}
// HOC para instrumentar componentes
function withObservability(WrappedComponent, componentName) {
    return function ObservabilityWrapper(props) {
        const { logUIEvent } = useUILogger();
        const { createChildSpan } = useComponentTracing(componentName);
        const handleInteraction = (0, react_1.useCallback)((action, data) => {
            const span = createChildSpan(action);
            if (span && frontendTracer) {
                frontendTracer.setAttributes(span, data || {});
                frontendTracer.endSpan(span);
            }
            logUIEvent({
                component: componentName,
                action,
                props: data,
            });
        }, [componentName, createChildSpan, logUIEvent]);
        return { ...props };
        onInteraction = { handleInteraction }
            /  >
        ;
        ;
    };
}
// Wrapper para fetch con observabilidad
function createObservableFetch(baseURL) {
    return async (url, options) => {
        const fullUrl = baseURL ? `${baseURL}${url}` : url;
        const span = frontendTracer?.createSpan('http.request', api_1.SpanKind.CLIENT);
        if (span) {
            frontendTracer?.setAttributes(span, {
                'http.url': fullUrl,
                'http.method': options?.method || 'GET',
            });
        }
        try {
            const startTime = performance.now();
            const response = await fetch(fullUrl, options);
            const duration = performance.now() - startTime;
            if (span) {
                frontendTracer?.setAttributes(span, {
                    'http.status_code': response.status,
                    'http.response_time': duration,
                });
                frontendTracer?.endSpan(span, response.ok ? api_1.SpanStatusCode.OK : api_1.SpanStatusCode.ERROR);
            }
            if (!response.ok) {
                frontendLogger?.error(`HTTP Error: ${response.status}`, new Error(`HTTP ${response.status}`), {
                    url: fullUrl,
                    status: response.status,
                });
            }
            return response;
        }
        catch (error) {
            if (span) {
                frontendTracer?.setAttributes(span, {
                    'error': true,
                    'error.message': error instanceof Error ? error.message : String(error),
                });
                frontendTracer?.endSpan(span, api_1.SpanStatusCode.ERROR);
            }
            frontendLogger?.error(`Network Error`, error instanceof Error ? error : new Error(String(error)), {
                url: fullUrl,
            });
            throw error;
        }
    };
}
// Exportar instancias globales
function getFrontendLogger() {
    return frontendLogger;
}
function getFrontendTracer() {
    return frontendTracer;
}
//# sourceMappingURL=frontend.js.map