"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeConfig = mergeConfig;
exports.initializeObservability = initializeObservability;
exports.shutdownObservability = shutdownObservability;
exports.getEnvironmentConfig = getEnvironmentConfig;
exports.validateConfig = validateConfig;
exports.quickStart = quickStart;
const logger_1 = require("../logger");
const tracer_1 = require("../tracer");
const metrics_1 = require("../metrics");
// Global observability instance
let observabilityInitialized = false;
// Default configuration
const defaultConfig = {
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
    return {
        ...defaultConfig,
        ...config,
        logging: {
            ...defaultConfig.logging,
            ...config.logging,
        },
        tracing: {
            ...defaultConfig.tracing,
            ...config.tracing,
        },
        metrics: {
            ...defaultConfig.metrics,
            ...config.metrics,
        },
    };
}
// Initialize observability
async function initializeObservability(config) {
    if (observabilityInitialized) {
        throw new Error('Observability already initialized');
    }
    const finalConfig = mergeConfig(config);
    // Initialize logger first
    const logger = (0, logger_1.initializeLogger)({
        ...finalConfig.logging,
        serviceName: finalConfig.serviceName,
        serviceVersion: finalConfig.serviceVersion,
        environment: finalConfig.environment,
    });
    logger.info({ config: finalConfig }, 'Initializing observability');
    // Initialize tracing
    if (finalConfig.tracing?.enabled) {
        try {
            (0, tracer_1.initializeTracing)({
                ...finalConfig.tracing,
                serviceName: finalConfig.serviceName,
                serviceVersion: finalConfig.serviceVersion,
                environment: finalConfig.environment,
            });
            logger.info('Tracing initialized successfully');
        }
        catch (error) {
            logger.error({ error }, 'Failed to initialize tracing');
            throw error;
        }
    }
    // Initialize metrics
    if (finalConfig.metrics?.enabled) {
        try {
            (0, metrics_1.initializeMetrics)({
                ...finalConfig.metrics,
                serviceName: finalConfig.serviceName,
                serviceVersion: finalConfig.serviceVersion,
                environment: finalConfig.environment,
            });
            logger.info('Metrics initialized successfully');
        }
        catch (error) {
            logger.error({ error }, 'Failed to initialize metrics');
            throw error;
        }
    }
    observabilityInitialized = true;
    // Setup graceful shutdown
    setupGracefulShutdown();
}
// Shutdown observability
async function shutdownObservability() {
    const logger = (0, logger_1.getLogger)();
    logger.info('Shutting down observability');
    try {
        await Promise.all([(0, tracer_1.shutdownTracing)(), (0, metrics_1.shutdownMetrics)()]);
        logger.info('Observability shutdown complete');
    }
    catch (error) {
        logger.error({ error }, 'Error during observability shutdown');
        throw error;
    }
}
// Setup graceful shutdown handlers
function setupGracefulShutdown() {
    const logger = (0, logger_1.getLogger)();
    let shuttingDown = false;
    const shutdown = async (signal) => {
        if (shuttingDown)
            return;
        shuttingDown = true;
        logger.info({ signal }, 'Received shutdown signal');
        try {
            await shutdownObservability();
            process.exit(0);
        }
        catch (error) {
            logger.error({ error }, 'Error during shutdown');
            process.exit(1);
        }
    };
    // Handle different signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGUSR2', () => shutdown('SIGUSR2'));
    // Handle uncaught exceptions
    process.on('uncaughtException', error => {
        logger.fatal({ error }, 'Uncaught exception');
        shutdown('uncaughtException');
    });
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
        logger.fatal({ reason, promise }, 'Unhandled promise rejection');
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
    if (!config.serviceName) {
        throw new Error('serviceName is required in ObservabilityConfig');
    }
    if (config.tracing?.samplingRate !== undefined) {
        if (config.tracing.samplingRate < 0 || config.tracing.samplingRate > 1) {
            throw new Error('tracing.samplingRate must be between 0 and 1');
        }
    }
    if (config.metrics?.port !== undefined) {
        if (config.metrics.port < 1 || config.metrics.port > 65535) {
            throw new Error('metrics.port must be a valid port number');
        }
    }
}
// Quick start helper
async function quickStart(serviceName, options = {}) {
    const environment = process.env.NODE_ENV || 'development';
    const envConfig = getEnvironmentConfig(environment);
    const config = {
        serviceName,
        environment,
        ...envConfig,
        ...options,
    };
    validateConfig(config);
    await initializeObservability(config);
}
//# sourceMappingURL=index.js.map