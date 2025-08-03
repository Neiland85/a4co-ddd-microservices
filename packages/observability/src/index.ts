/**
 * @a4co/observability - Unified observability package
 * 
 * This package provides structured logging, distributed tracing,
 * and metrics collection for the A4CO platform.
 */

// Logging exports
export * from './logging/types';
export * from './logging/pino-logger';
export * from './logging/frontend-logger';
export * from './logging/react-hooks';
export * from './logging/http-client-wrapper';

// Tracing exports
export * from './tracing/tracer';
export * from './tracing/web-tracer';
export * from './tracing/react-tracing';
export * from './tracing/middleware';
export * from './tracing/nats-tracing';

// Re-export commonly used OpenTelemetry types
export { 
  SpanKind, 
  SpanStatusCode,
  Span,
  SpanContext,
  trace,
  context,
} from '@opentelemetry/api';

// Version
export const VERSION = '1.0.0';