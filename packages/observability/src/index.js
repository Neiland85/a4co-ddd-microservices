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
exports.logger = exports.shutdown = exports.getTracer = exports.initializeMetrics = exports.initializeTracing = exports.initializeLogger = exports.getGlobalLogger = exports.createHttpLogger = exports.createLogger = void 0;
exports.initializeObservability = initializeObservability;
exports.tracer = tracer;
develop;
var logging_1 = require("./logging");
Object.defineProperty(exports, "initializeLogger", { enumerable: true, get: function () { return logging_1.initializeLogger; } });
Object.defineProperty(exports, "createLogger", { enumerable: true, get: function () { return logging_1.createLogger; } });
Object.defineProperty(exports, "createHttpLogger", { enumerable: true, get: function () { return logging_1.createHttpLogger; } });
Object.defineProperty(exports, "getGlobalLogger", { enumerable: true, get: function () { return logging_1.getGlobalLogger; } });
var tracing_1 = require("./tracing");
Object.defineProperty(exports, "initializeTracing", { enumerable: true, get: function () { return tracing_1.initializeTracing; } });
Object.defineProperty(exports, "initializeMetrics", { enumerable: true, get: function () { return tracing_1.initializeMetrics; } });
Object.defineProperty(exports, "getTracer", { enumerable: true, get: function () { return tracing_1.getTracer; } });
Object.defineProperty(exports, "shutdown", { enumerable: true, get: function () { return tracing_1.shutdown; } });
// Función principal para inicializar todo
function initializeObservability(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // Inicializar logger
    var logger = (0, logging_1.initializeLogger)({
        serviceName: config.serviceName,
        serviceVersion: config.serviceVersion,
        environment: config.environment,
        level: (_a = config.logging) === null || _a === void 0 ? void 0 : _a.level,
        prettyPrint: (_b = config.logging) === null || _b === void 0 ? void 0 : _b.prettyPrint,
    });
    // Inicializar tracing si está habilitado
    var tracingSDK = null;
    if (((_c = config.tracing) === null || _c === void 0 ? void 0 : _c.enabled) !== false) {
        tracingSDK = (0, tracing_1.initializeTracing)({
            serviceName: config.serviceName,
            serviceVersion: config.serviceVersion,
            environment: config.environment,
            jaegerEndpoint: (_d = config.tracing) === null || _d === void 0 ? void 0 : _d.jaegerEndpoint,
            enableConsoleExporter: (_e = config.tracing) === null || _e === void 0 ? void 0 : _e.enableConsoleExporter,
            enableAutoInstrumentation: (_f = config.tracing) === null || _f === void 0 ? void 0 : _f.enableAutoInstrumentation,
        });
    }
    // Inicializar métricas si está habilitado
    var metricsExporter = null;
    if (((_g = config.metrics) === null || _g === void 0 ? void 0 : _g.enabled) !== false) {
        metricsExporter = (0, tracing_1.initializeMetrics)({
            serviceName: config.serviceName,
            port: (_h = config.metrics) === null || _h === void 0 ? void 0 : _h.port,
            endpoint: (_j = config.metrics) === null || _j === void 0 ? void 0 : _j.endpoint,
        });
    }
    return {
        logger: logger,
        tracingSDK: tracingSDK,
        metricsExporter: metricsExporter,
        httpLogger: (0, logging_1.createHttpLogger)(logger),
        getTracer: tracing_1.getTracer,
        shutdown: tracing_1.shutdown,
    };
}
// Exportar el logger global por defecto si no se ha inicializado
var defaultLogger = null;
exports.logger = new Proxy({}, {
    get: function (target, prop) {
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
