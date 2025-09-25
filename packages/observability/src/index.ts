cursor / design - microservice - communication - strategy - a023;

develop;
develop;
import type { LoggerConfig } from './logging';
import { createHttpLogger, createLogger, getGlobalLogger, initializeLogger } from './logging';
import type { MetricsConfig, TracingConfig } from './tracing';
import { getTracer, initializeMetrics, initializeTracing, shutdown } from './tracing';

// Re-exportar tipos
export type { LoggerConfig, MetricsConfig, TracingConfig };

// Re-exportar funciones individuales
export {
  createHttpLogger,
  createLogger,
  getGlobalLogger,
  getTracer,
  initializeLogger,
  initializeMetrics,
  initializeTracing,
  shutdown,
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

export const logger = new Proxy(
  {},
  {
    get(target, prop) {
      if (!defaultLogger) {
        defaultLogger = createLogger({
          serviceName: process.env.SERVICE_NAME || 'unknown-service',
          environment: process.env.NODE_ENV || 'development',
        });
      }
      return defaultLogger[prop];
    },
  }
);

// Función helper para obtener el tracer por defecto
export function tracer(name?: string) {
  return getTracer(name);
  cursor / design - microservice - communication - strategy - a023;
}

// Exportar módulos de frontend
export * from './frontend';

// Exportar módulos de DDD
export * from './ddd-tracing';

// Exportar módulos del Design System
export * from './design-system';

// Main exports for @a4co/observability package
export * from './config';
export * from './context';
export * from './decorators';
export * from './instrumentation';
export * from './logger';
export * from './metrics';
export * from './middleware';
export * from './tracer';
export * from './types';
export * from './utils';
develop;

/**
 * @a4co/observability - Unified observability package
 *
 * This package provides structured logging, distributed tracing,
 * and metrics collection for the A4CO platform.
 */

// Logging exports
export * from './logging/frontend-logger';
export * from './logging/http-client-wrapper';
export * from './logging/pino-logger';
export * from './logging/react-hooks';
export * from './logging/types';

// Tracing exports
export * from './tracing/middleware';
export * from './tracing/nats-tracing';
export * from './tracing/react-tracing';
export * from './tracing/tracer';
export * from './tracing/web-tracer';

// Re-export commonly used OpenTelemetry types
export { context, Span, SpanContext, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';

// Version
export const VERSION = '1.0.0';
main;
develop;
