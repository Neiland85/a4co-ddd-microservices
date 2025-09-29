// Se comentan las importaciones porque los módulos pueden no estar disponibles en todos los entornos.
// import { Logger } from 'pino';
// import { Span, Tracer } from '@opentelemetry/api';
import type { DDDMetadata } from './logging/types';

// Re-export DDDMetadata for convenience
export type { DDDMetadata };

// Tipos de configuración
export type ObservabilityConfig = {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  logging?: LoggerConfig;
  tracing?: TracingConfig;
  metrics?: MetricsConfig;
};

export type LoggerConfig = {
  level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  prettyPrint?: boolean;
  redact?: string[];
  serializers?: Record<string, (_value: unknown) => unknown>;
};

export type TracingConfig = {
  enabled?: boolean;
  jaegerEndpoint?: string;
  otlpEndpoint?: string;
  enableConsoleExporter?: boolean;
  enableAutoInstrumentation?: boolean;
  propagators?: string[];
  samplingRate?: number;
};

export type MetricsConfig = {
  enabled?: boolean;
  port?: number;
  endpoint?: string;
  interval?: number;
  labels?: Record<string, string>;
  serviceName?: string;
  serviceVersion?: string;
  environment?: string;
};

// Context types
export type ObservabilityContext = {
  traceId?: string;
  spanId?: string;
  correlationId?: string;
  causationId?: string;
  userId?: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
};

// Logger context types
export type LogContext = ObservabilityContext & {
  [key: string]: unknown;
};

// UI Event types
export type UIEvent = {
  eventType: 'click' | 'input' | 'navigation' | 'error' | 'custom';
  componentName: string;
  componentProps?: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, unknown>;
};

// Component tracking
export type ComponentTrackingConfig = {
  trackProps?: string[];
  trackEvents?: string[];
  trackPerformance?: boolean;
  samplingRate?: number;
};

// Interfaz de envoltorio para Tracer
export type ObservabilityTracer = {
  withContext(_contexto: ObservabilityContext): ObservabilityTracer;
  startSpan(_name: string, _options?: Record<string, unknown>): unknown;
  startActiveSpan(
    _name: string,
    _options?: Record<string, unknown>,
    _fn?: (_span: unknown) => unknown
  ): unknown;
  withDDD?(_metadata: DDDMetadata): ObservabilityTracer;
};

// Middleware options
export type MiddlewareOptions = {
  ignorePaths?: string[];
  includeRequestBody?: boolean;
  includeResponseBody?: boolean;
  redactHeaders?: string[];
  customAttributes?: (_req: unknown) => Record<string, unknown>;
};

// Decorator options
export type TraceDecoratorOptions = {
  name?: string;
  attributes?: Record<string, unknown>;
  recordException?: boolean;
  recordResult?: boolean;
};

// Export utility types
export type ExtractContext<T> = T extends { context: infer C } ? C : never;
export type WithContext<T, C> = T & { context: C };
