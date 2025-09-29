import { resetObservabilityState } from './config';
import type { LoggerConfig } from './logging';
import {
  createHttpLogger,
  createLogger,
  getGlobalLogger,
  initializeLogger,
  resetLoggerState,
} from './logging';
import {
  createCustomHistogram,
  initializeMetrics,
  recordCommandExecution,
  recordEvent,
  recordHttpRequest,
  shutdownMetrics,
} from './metrics/index';
import type { MetricsConfig, TracingConfig } from './tracing';
import { getTracer, initializeTracing, shutdown } from './tracing';

// Re-exportar tipos
export type { LoggerConfig, MetricsConfig, TracingConfig };

// Re-exportar funciones individuales
export {
  createCustomHistogram,
  createHttpLogger,
  createLogger,
  getGlobalLogger,
  getTracer,
  initializeLogger,
  initializeMetrics,
  initializeTracing,
  recordCommandExecution,
  recordEvent,
  recordHttpRequest,
  resetLoggerState,
  resetObservabilityState,
  shutdown,
  shutdownMetrics,
};

console.log('DEBUG: index.ts loaded');

// Interfaz para configuración completa
export interface ObservabilityConfig {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  logging?: {
    level?: string;
    prettyPrint?: boolean;
  };
  tracing?: {
    enabled?: boolean;
    jaegerEndpoint?: string;
    enableConsoleExporter?: boolean;
    enableAutoInstrumentation?: boolean;
  };
  metrics?: {
    enabled?: boolean;
    port?: number;
    endpoint?: string;
  };
}

// Función principal para inicializar todo
export function initializeObservability(config: ObservabilityConfig) {
  // Inicializar logger global y local
  const logger = initializeLogger({
    serviceName: config.serviceName,
    serviceVersion: config.serviceVersion,
    environment: config.environment,
    level: config.logging?.level,
    prettyPrint: config.logging?.prettyPrint,
  });

  console.log('DEBUG: logger initialized:', !!logger, typeof logger);

  if (!logger) {
    throw new Error('Failed to initialize logger');
  }

  // Inicializar tracing si está habilitado
  let tracingSDK = null;
  if (config.tracing?.enabled === true || config.tracing?.enabled === undefined) {
    tracingSDK = initializeTracing({
      serviceName: config.serviceName,
      serviceVersion: config.serviceVersion,
      environment: config.environment,
      jaegerEndpoint: config.tracing?.jaegerEndpoint,
      enableConsoleExporter: config.tracing?.enableConsoleExporter,
      enableAutoInstrumentation: config.tracing?.enableAutoInstrumentation,
    });
  }
  // Si está explícitamente deshabilitado, devolver null
  else if (config.tracing?.enabled === false) {
    tracingSDK = null;
  }

  // Inicializar métricas si está habilitado
  let metricsExporter = null;
  if (config.metrics?.enabled === true || config.metrics?.enabled === undefined) {
    metricsExporter = initializeMetrics({
      serviceName: config.serviceName,
      port: config.metrics?.port,
      endpoint: config.metrics?.endpoint,
    });
  }
  // Si está explícitamente deshabilitado, devolver null
  else if (config.metrics?.enabled === false) {
    metricsExporter = null;
  }

  return {
    logger,
    tracingSDK,
    metricsExporter,
    httpLogger: createHttpLogger(logger),
    getTracer,
    shutdown,
  };
}

// Exportar el logger global por defecto si no se ha inicializado
let defaultLogger: any = null;

export const logger = new Proxy(
  {},
  {
    get(target, prop) {
      if (!defaultLogger) {
        defaultLogger = createLogger({
          serviceName: process.env['SERVICE_NAME'] || 'unknown-service',
          environment: process.env['NODE_ENV'] || 'development',
        });
      }
      return defaultLogger[prop];
    },
  }
);

// Función helper para obtener el tracer por defecto
export function tracer(name?: string) {
  return getTracer(name);
}

// Main exports for @a4co/observability package
export * from './config';
export * from './context';
export * from './decorators';
export * from './instrumentation';
export * from './logger';
export * from './metrics';
export * from './middleware';
export * from './tracer';
export type * from './types';
export * from './utils';

// Specialized exports
export * from './logging/http-client-wrapper';
export * from './logging/pino-logger';
export * from './logging/react-hooks';

export * from './tracing/middleware';
export * from './tracing/nats-tracing';
export * from './tracing/web-tracer';

// Frontend and DDD exports
// export * from './frontend'; // Commented out due to export conflicts
export * from './ddd-tracing';
export * from './design-system';

// Re-export commonly used OpenTelemetry types
export { context, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
export type { Span, SpanContext } from '@opentelemetry/api';

// Version
export const VERSION = '1.0.0';
