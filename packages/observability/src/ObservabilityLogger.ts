// Imports are commented out because the modules may not be available in all environments.
// import { Logger } from 'pino';
// import { Span, Tracer } from '@opentelemetry/api';
import { Logger } from './logger';
import { LogContext, DDDMetadata } from './types';

// Enhanced logger interface

export interface ObservabilityLogger extends Logger {
  withContext(context: LogContext): ObservabilityLogger;
  withDDD(metadata: DDDMetadata): ObservabilityLogger;
  startSpan(name: string, attributes?: Record<string, any>): Span;
}
