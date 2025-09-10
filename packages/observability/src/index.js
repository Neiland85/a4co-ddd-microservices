"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.context = exports.trace = exports.SpanStatusCode = exports.SpanKind = exports.logger = exports.shutdown = exports.getTracer = exports.initializeMetrics = exports.initializeTracing = exports.initializeLogger = exports.getGlobalLogger = exports.createHttpLogger = exports.createLogger = void 0;
exports.initializeObservability = initializeObservability;
exports.tracer = tracer;
cursor / design - microservice - communication - strategy - a023;
develop;
develop;
const logging_1 = require("./logging");
Object.defineProperty(exports, "initializeLogger", { enumerable: true, get: function () { return logging_1.initializeLogger; } });
Object.defineProperty(exports, "createLogger", { enumerable: true, get: function () { return logging_1.createLogger; } });
Object.defineProperty(exports, "createHttpLogger", { enumerable: true, get: function () { return logging_1.createHttpLogger; } });
Object.defineProperty(exports, "getGlobalLogger", { enumerable: true, get: function () { return logging_1.getGlobalLogger; } });
const tracing_1 = require("./tracing");
Object.defineProperty(exports, "initializeTracing", { enumerable: true, get: function () { return tracing_1.initializeTracing; } });
Object.defineProperty(exports, "initializeMetrics", { enumerable: true, get: function () { return tracing_1.initializeMetrics; } });
Object.defineProperty(exports, "getTracer", { enumerable: true, get: function () { return tracing_1.getTracer; } });
Object.defineProperty(exports, "shutdown", { enumerable: true, get: function () { return tracing_1.shutdown; } });
// Función principal para inicializar todo
function initializeObservability(config) {
    // Inicializar logger
    const logger = (0, logging_1.initializeLogger)({
        serviceName: config.serviceName,
        serviceVersion: config.serviceVersion,
        environment: config.environment,
        level: config.logging?.level,
        prettyPrint: config.logging?.prettyPrint,
    });
    // Inicializar tracing si está habilitado
    let tracingSDK = null;
    if (config.tracing?.enabled !== false) {
        tracingSDK = (0, tracing_1.initializeTracing)({
            serviceName: config.serviceName,
            serviceVersion: config.serviceVersion,
            environment: config.environment,
            jaegerEndpoint: config.tracing?.jaegerEndpoint,
            enableConsoleExporter: config.tracing?.enableConsoleExporter,
            enableAutoInstrumentation: config.tracing?.enableAutoInstrumentation,
        });
    }
    // Inicializar métricas si está habilitado
    let metricsExporter = null;
    if (config.metrics?.enabled !== false) {
        metricsExporter = (0, tracing_1.initializeMetrics)({
            serviceName: config.serviceName,
            port: config.metrics?.port,
            endpoint: config.metrics?.endpoint,
        });
    }
    return {
        logger,
        tracingSDK,
        metricsExporter,
        httpLogger: (0, logging_1.createHttpLogger)(logger),
        getTracer: tracing_1.getTracer,
        shutdown: tracing_1.shutdown,
    };
}
// Exportar el logger global por defecto si no se ha inicializado
let defaultLogger = null;
exports.logger = new Proxy({}, {
    get(target, prop) {
        if (!defaultLogger) {
            defaultLogger = (0, logging_1.createLogger)({
                serviceName: process.env.SERVICE_NAME || 'unknown-service',
                environment: process.env.NODE_ENV || 'development',
            });
        }
        return defaultLogger[prop];
    }
});
// Función helper para obtener el tracer por defecto
function tracer(name) {
    return (0, tracing_1.getTracer)(name);
    cursor / design - microservice - communication - strategy - a023;
}
// Exportar módulos de frontend
__exportStar(require("./frontend"), exports);
// Exportar módulos de DDD
__exportStar(require("./ddd-tracing"), exports);
// Exportar módulos del Design System
__exportStar(require("./design-system"), exports);
// Main exports for @a4co/observability package
__exportStar(require("./logger"), exports);
__exportStar(require("./tracer"), exports);
__exportStar(require("./metrics"), exports);
__exportStar(require("./middleware"), exports);
__exportStar(require("./decorators"), exports);
__exportStar(require("./context"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./instrumentation"), exports);
__exportStar(require("./config"), exports);
develop;
/**
 * @a4co/observability - Unified observability package
 *
 * This package provides structured logging, distributed tracing,
 * and metrics collection for the A4CO platform.
 */
// Logging exports
__exportStar(require("./logging/types"), exports);
__exportStar(require("./logging/pino-logger"), exports);
__exportStar(require("./logging/frontend-logger"), exports);
__exportStar(require("./logging/react-hooks"), exports);
__exportStar(require("./logging/http-client-wrapper"), exports);
// Tracing exports
__exportStar(require("./tracing/tracer"), exports);
__exportStar(require("./tracing/web-tracer"), exports);
__exportStar(require("./tracing/react-tracing"), exports);
__exportStar(require("./tracing/middleware"), exports);
__exportStar(require("./tracing/nats-tracing"), exports);
// Re-export commonly used OpenTelemetry types
var api_1 = require("@opentelemetry/api");
Object.defineProperty(exports, "SpanKind", { enumerable: true, get: function () { return api_1.SpanKind; } });
Object.defineProperty(exports, "SpanStatusCode", { enumerable: true, get: function () { return api_1.SpanStatusCode; } });
Object.defineProperty(exports, "trace", { enumerable: true, get: function () { return api_1.trace; } });
Object.defineProperty(exports, "context", { enumerable: true, get: function () { return api_1.context; } });
// Version
exports.VERSION = '1.0.0';
main;
develop;
//# sourceMappingURL=index.js.map