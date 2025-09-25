// Se comentan las importaciones porque los módulos pueden no estar disponibles en todos los entornos.
// import { Logger } from 'pino';
// import { Span, Tracer } from '@opentelemetry/api';

// Tipos de configuración
export interface ObservabilityConfig {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  logging?: LoggerConfig;
  tracing?: TracingConfig;
  metrics?: MetricsConfig;
}

export interface LoggerConfig {
  level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  prettyPrint?: boolean;
  redact?: string[];
  serializers?: Record<string, (value: any) => any>;
}

export interface TracingConfig {
  enabled?: boolean;
  jaegerEndpoint?: string;
  otlpEndpoint?: string;
  enableConsoleExporter?: boolean;
  enableAutoInstrumentation?: boolean;
  propagators?: string[];
  samplingRate?: number;
}

export interface MetricsConfig {
  enabled?: boolean;
  port?: number;
  endpoint?: string;
  interval?: number;
  labels?: Record<string, string>;
}

// Context types
export interface ObservabilityContext {
  traceId?: string;
  spanId?: string;
  correlationId?: string;
  causationId?: string;
  userId?: string;
  tenantId?: string;
  metadata?: Record<string, any>;
}

// Logger context types
export interface LogContext extends ObservabilityContext {
  [key: string]: any;
}

// UI Event types
export interface UIEvent {
  eventType: 'click' | 'input' | 'navigation' | 'error' | 'custom';
  componentName: string;
  componentProps?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// Component tracking
export interface ComponentTrackingConfig {
  trackProps?: string[];
  trackEvents?: string[];
  trackPerformance?: boolean;
  samplingRate?: number;
}

// Interfaz de envoltorio para Tracer
export interface ObservabilityTracer /* extends Tracer */ {
  withContext(contexto: ObservabilityContext): ObservabilityTracer;
}

// Middleware options
export interface MiddlewareOptions {
  ignorePaths?: string[];
  includeRequestBody?: boolean;
  includeResponseBody?: boolean;
  redactHeaders?: string[];
  customAttributes?: (req: any) => Record<string, any>;
}

// Decorator options
export interface TraceDecoratorOptions {
  name?: string;
  attributes?: Record<string, any>;
  recordException?: boolean;
  recordResult?: boolean;
}

// Export utility types
export type ExtractContext<T> = T extends { context: infer C } ? C : never;
export type WithContext<T, C> = T & { context: C };
