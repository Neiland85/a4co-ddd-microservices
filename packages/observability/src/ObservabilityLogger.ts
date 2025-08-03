// Se comentan las importaciones porque los módulos pueden no estar disponibles en todos los entornos.
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
