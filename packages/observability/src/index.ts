import { initializeLogger, createLogger, createHttpLogger, getGlobalLogger } from './logging';
import { 
  initializeTracing, 
  initializeMetrics, 
  getTracer, 
  shutdown,
  withTracing,
  tracePropagationMiddleware,
  createDDDSpan,
  injectTraceContext,
  type DDDMetadata,
  type ControllerSpanOptions
} from './tracing';
import {
  initializeFrontendObservability,
  getFrontendTracer,
  useComponentTracking,
  useNavigationTracking,
  useAPITracking,
  usePerformanceTracking,
  withTracking,
  sendLogToBackend,
  ErrorBoundaryWithTracking,
  type FrontendObservabilityConfig,
  type UserEvent,
  type PerformanceMetric
} from './frontend';
import {
  DSComponentPlugin,
  withDSPlugin,
  useDSPlugin,
  TrackedButton,
  TrackedInput,
  TrackedCard,
  createDSSpan,
  trackFormEvent,
  trackUserNavigation,
  trackUserInteraction,
  type DSComponentProps,
  type DSEvent,
  type DSPluginConfig
} from './design-system';
import type { LoggerConfig } from './logging';
import type { TracingConfig, MetricsConfig } from './tracing';

// Re-exportar tipos
export type { 
  LoggerConfig, 
  TracingConfig, 
  MetricsConfig,
  DDDMetadata,
  ControllerSpanOptions,
  FrontendObservabilityConfig,
  UserEvent,
  PerformanceMetric,
  DSComponentProps,
  DSEvent,
  DSPluginConfig
};

// Re-exportar funciones individuales
export {
  createLogger,
  createHttpLogger,
  getGlobalLogger,
  initializeLogger,
  initializeTracing,
  initializeMetrics,
  getTracer,
  shutdown,
  // Nuevas funciones de tracing
  withTracing,
  tracePropagationMiddleware,
  createDDDSpan,
  injectTraceContext,
  // Funciones de frontend
  initializeFrontendObservability,
  getFrontendTracer,
  useComponentTracking,
  useNavigationTracking,
  useAPITracking,
  usePerformanceTracking,
  withTracking,
  sendLogToBackend,
  ErrorBoundaryWithTracking,
  // Funciones de Design System
  DSComponentPlugin,
  withDSPlugin,
  useDSPlugin,
  TrackedButton,
  TrackedInput,
  TrackedCard,
  createDSSpan,
  trackFormEvent,
  trackUserNavigation,
  trackUserInteraction
};

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
  // Inicializar logger
  const logger = initializeLogger({
    serviceName: config.serviceName,
    serviceVersion: config.serviceVersion,
    environment: config.environment,
    level: config.logging?.level,
    prettyPrint: config.logging?.prettyPrint,
  });

  // Inicializar tracing si está habilitado
  let tracingSDK = null;
  if (config.tracing?.enabled !== false) {
    tracingSDK = initializeTracing({
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
    metricsExporter = initializeMetrics({
      serviceName: config.serviceName,
      port: config.metrics?.port,
      endpoint: config.metrics?.endpoint,
    });
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

export const logger = new Proxy({}, {
  get(target, prop) {
    if (!defaultLogger) {
      defaultLogger = createLogger({
        serviceName: process.env.SERVICE_NAME || 'unknown-service',
        environment: process.env.NODE_ENV || 'development',
      });
    }
    return defaultLogger[prop];
  }
});

// Función helper para obtener el tracer por defecto
export function tracer(name?: string) {
  return getTracer(name);
}