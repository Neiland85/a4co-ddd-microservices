// Imports are commented out because the modules may not be available in all environments.
// import { Logger } from 'pino';
// import { Span, Tracer } from '@opentelemetry/api';
import type { LogContext } from './types';

// Enhanced logger interface

export interface ObservabilityLogger {
  withContext(context: LogContext): ObservabilityLogger;
  startSpan(name: string, attributes?: Record<string, unknown>): unknown;
}
