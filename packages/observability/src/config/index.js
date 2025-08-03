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
exports.mergeConfig = mergeConfig;
exports.initializeObservability = initializeObservability;
exports.shutdownObservability = shutdownObservability;
exports.getEnvironmentConfig = getEnvironmentConfig;
exports.validateConfig = validateConfig;
exports.quickStart = quickStart;
var logger_1 = require("../logger");
var tracer_1 = require("../tracer");
var metrics_1 = require("../metrics");
// Global observability instance
var observabilityInitialized = false;
// Default configuration
var defaultConfig = {
    environment: process.env.NODE_ENV || 'development',
    logging: {
        level: 'info',
        prettyPrint: process.env.NODE_ENV === 'development',
    },
    tracing: {
        enabled: true,
        jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
        enableConsoleExporter: process.env.NODE_ENV === 'development',
        enableAutoInstrumentation: true,
        samplingRate: 1.0,
    },
    metrics: {
        enabled: true,
        port: parseInt(process.env.METRICS_PORT || '9090'),
        endpoint: '/metrics',
    },
};
// Merge configurations
function mergeConfig(config) {
    return __assign(__assign(__assign({}, defaultConfig), config), { logging: __assign(__assign({}, defaultConfig.logging), config.logging), tracing: __assign(__assign({}, defaultConfig.tracing), config.tracing), metrics: __assign(__assign({}, defaultConfig.metrics), config.metrics) });
}
// Initialize observability
function initializeObservability(config) {
    return __awaiter(this, void 0, void 0, function () {
        var finalConfig, logger;
        var _a, _b;
        return __generator(this, function (_c) {
            if (observabilityInitialized) {
                throw new Error('Observability already initialized');
            }
            finalConfig = mergeConfig(config);
            logger = (0, logger_1.initializeLogger)(__assign(__assign({}, finalConfig.logging), { serviceName: finalConfig.serviceName, serviceVersion: finalConfig.serviceVersion, environment: finalConfig.environment }));
            logger.info({ config: finalConfig }, 'Initializing observability');
            // Initialize tracing
            if ((_a = finalConfig.tracing) === null || _a === void 0 ? void 0 : _a.enabled) {
                try {
                    (0, tracer_1.initializeTracing)(__assign(__assign({}, finalConfig.tracing), { serviceName: finalConfig.serviceName, serviceVersion: finalConfig.serviceVersion, environment: finalConfig.environment }));
                    logger.info('Tracing initialized successfully');
                }
                catch (error) {
                    logger.error({ error: error }, 'Failed to initialize tracing');
                    throw error;
                }
            }
            // Initialize metrics
            if ((_b = finalConfig.metrics) === null || _b === void 0 ? void 0 : _b.enabled) {
                try {
                    (0, metrics_1.initializeMetrics)(__assign(__assign({}, finalConfig.metrics), { serviceName: finalConfig.serviceName, serviceVersion: finalConfig.serviceVersion, environment: finalConfig.environment }));
                    logger.info('Metrics initialized successfully');
                }
                catch (error) {
                    logger.error({ error: error }, 'Failed to initialize metrics');
                    throw error;
                }
            }
            observabilityInitialized = true;
            // Setup graceful shutdown
            setupGracefulShutdown();
            return [2 /*return*/];
        });
    });
}
// Shutdown observability
function shutdownObservability() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = (0, logger_1.getLogger)();
                    logger.info('Shutting down observability');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all([
                            (0, tracer_1.shutdownTracing)(),
                            (0, metrics_1.shutdownMetrics)(),
                        ])];
                case 2:
                    _a.sent();
                    logger.info('Observability shutdown complete');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger.error({ error: error_1 }, 'Error during observability shutdown');
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Setup graceful shutdown handlers
function setupGracefulShutdown() {
    var _this = this;
    var logger = (0, logger_1.getLogger)();
    var shuttingDown = false;
    var shutdown = function (signal) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (shuttingDown)
                        return [2 /*return*/];
                    shuttingDown = true;
                    logger.info({ signal: signal }, 'Received shutdown signal');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, shutdownObservability()];
                case 2:
                    _a.sent();
                    process.exit(0);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    logger.error({ error: error_2 }, 'Error during shutdown');
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Handle different signals
    process.on('SIGTERM', function () { return shutdown('SIGTERM'); });
    process.on('SIGINT', function () { return shutdown('SIGINT'); });
    process.on('SIGUSR2', function () { return shutdown('SIGUSR2'); });
    // Handle uncaught exceptions
    process.on('uncaughtException', function (error) {
        logger.fatal({ error: error }, 'Uncaught exception');
        shutdown('uncaughtException');
    });
    // Handle unhandled promise rejections
    process.on('unhandledRejection', function (reason, promise) {
        logger.fatal({ reason: reason, promise: promise }, 'Unhandled promise rejection');
        shutdown('unhandledRejection');
    });
}
// Environment-specific configurations
function getEnvironmentConfig(environment) {
    switch (environment) {
        case 'production':
            return {
                logging: {
                    level: 'info',
                    prettyPrint: false,
                },
                tracing: {
                    enableConsoleExporter: false,
                    samplingRate: 0.1, // Sample 10% in production
                },
            };
        case 'staging':
            return {
                logging: {
                    level: 'debug',
                    prettyPrint: false,
                },
                tracing: {
                    enableConsoleExporter: false,
                    samplingRate: 0.5, // Sample 50% in staging
                },
            };
        case 'development':
        default:
            return {
                logging: {
                    level: 'debug',
                    prettyPrint: true,
                },
                tracing: {
                    enableConsoleExporter: true,
                    samplingRate: 1.0, // Sample 100% in development
                },
            };
    }
}
// Configuration validation
function validateConfig(config) {
    var _a, _b;
    if (!config.serviceName) {
        throw new Error('serviceName is required in ObservabilityConfig');
    }
    if (((_a = config.tracing) === null || _a === void 0 ? void 0 : _a.samplingRate) !== undefined) {
        if (config.tracing.samplingRate < 0 || config.tracing.samplingRate > 1) {
            throw new Error('tracing.samplingRate must be between 0 and 1');
        }
    }
    if (((_b = config.metrics) === null || _b === void 0 ? void 0 : _b.port) !== undefined) {
        if (config.metrics.port < 1 || config.metrics.port > 65535) {
            throw new Error('metrics.port must be a valid port number');
        }
    }
}
// Quick start helper
function quickStart(serviceName_1) {
    return __awaiter(this, arguments, void 0, function (serviceName, options) {
        var environment, envConfig, config;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    environment = process.env.NODE_ENV || 'development';
                    envConfig = getEnvironmentConfig(environment);
                    config = __assign(__assign({ serviceName: serviceName, environment: environment }, envConfig), options);
                    validateConfig(config);
                    return [4 /*yield*/, initializeObservability(config)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
