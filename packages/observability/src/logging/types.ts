/**
 * Logging types and interfaces for A4CO observability
 */

export interface DDDMetadata {
  aggregateId?: string;
  aggregateType?: string;
  aggregateName?: string; // Alias for aggregateType for backward compatibility
  commandName?: string;
  eventName?: string;
  eventVersion?: number;
  userId?: string;
  tenantId?: string;
  correlationId?: string;
  causationId?: string;
  timestamp?: string;
}

export interface HttpMetadata {
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  userAgent?: string;
  ip?: string;
  requestId?: string;
}

export interface ErrorMetadata {
  code?: string;
  stackTrace?: string;
  context?: Record<string, any>;
}

export interface LogContext {
  service: string;
  environment: string;
  version: string;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  ddd?: DDDMetadata;
  http?: HttpMetadata;
  error?: ErrorMetadata;
  custom?: Record<string, any>;
}

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LoggerConfig {
  level?: LogLevel;
  pretty?: boolean;
  service: string;
  environment: string;
  version: string;
  customSerializers?: Record<string, (value: any) => any>;
  destination?: string;
  redact?: string[];
}

export interface Logger {
  trace(message: string, context?: Partial<LogContext>): void;
  debug(message: string, context?: Partial<LogContext>): void;
  info(message: string, context?: Partial<LogContext>): void;
  warn(message: string, context?: Partial<LogContext>): void;
  error(message: string, error?: Error | unknown, context?: Partial<LogContext>): void;
  fatal(message: string, error?: Error | unknown, context?: Partial<LogContext>): void;
  child(context: Partial<LogContext>): Logger;
}
