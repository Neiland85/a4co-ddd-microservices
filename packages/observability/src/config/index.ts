import { ObservabilityConfig } from '../types';
import { initializeLogger, getLogger } from '../logger';
import { initializeTracing, shutdownTracing } from '../tracer';
import { initializeMetrics, shutdownMetrics } from '../metrics';

// Global observability instance
let observabilityInitialized = false;

// Default configuration
const defaultConfig: Partial<ObservabilityConfig> = {
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
export function mergeConfig(config: ObservabilityConfig): ObservabilityConfig {
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
export async function initializeObservability(config: ObservabilityConfig): Promise<void> {
  if (observabilityInitialized) {
    throw new Error('Observability already initialized');
  }

  const finalConfig = mergeConfig(config);

  // Initialize logger first
  const logger = initializeLogger({
    ...finalConfig.logging,
    serviceName: finalConfig.serviceName,
    serviceVersion: finalConfig.serviceVersion,
    environment: finalConfig.environment,
  });

  logger.info({ config: finalConfig }, 'Initializing observability');

  // Initialize tracing
  if (finalConfig.tracing?.enabled) {
    try {
      initializeTracing({
        ...finalConfig.tracing,
        serviceName: finalConfig.serviceName,
        serviceVersion: finalConfig.serviceVersion,
        environment: finalConfig.environment,
      });
      logger.info('Tracing initialized successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize tracing');
      throw error;
    }
  }

  // Initialize metrics
  if (finalConfig.metrics?.enabled) {
    try {
      initializeMetrics({
        ...finalConfig.metrics,
        serviceName: finalConfig.serviceName,
        serviceVersion: finalConfig.serviceVersion,
        environment: finalConfig.environment,
      });
      logger.info('Metrics initialized successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize metrics');
      throw error;
    }
  }

  observabilityInitialized = true;

  // Setup graceful shutdown
  setupGracefulShutdown();
}

// Shutdown observability
export async function shutdownObservability(): Promise<void> {
  const logger = getLogger();
  logger.info('Shutting down observability');

  try {
    await Promise.all([
      shutdownTracing(),
      shutdownMetrics(),
    ]);
    logger.info('Observability shutdown complete');
  } catch (error) {
    logger.error({ error }, 'Error during observability shutdown');
    throw error;
  }
}

// Setup graceful shutdown handlers
function setupGracefulShutdown(): void {
  const logger = getLogger();
  let shuttingDown = false;

  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.info({ signal }, 'Received shutdown signal');

    try {
      await shutdownObservability();
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Error during shutdown');
      process.exit(1);
    }
  };

  // Handle different signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGUSR2', () => shutdown('SIGUSR2'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
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
export function getEnvironmentConfig(environment: string): Partial<ObservabilityConfig> {
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
export function validateConfig(config: ObservabilityConfig): void {
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
export async function quickStart(serviceName: string, options: Partial<ObservabilityConfig> = {}): Promise<void> {
  const environment = process.env.NODE_ENV || 'development';
  const envConfig = getEnvironmentConfig(environment);
  
  const config: ObservabilityConfig = {
    serviceName,
    environment,
    ...envConfig,
    ...options,
  };

  validateConfig(config);
  await initializeObservability(config);
}