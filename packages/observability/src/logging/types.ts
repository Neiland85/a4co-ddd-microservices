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
  context?: Record<string, unknown>;
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
  custom?: Record<string, unknown>;
}

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LoggerConfig {
  level?: LogLevel;
  pretty?: boolean;
  service: string;
  environment: string;
  version: string;
  customSerializers?: Record<string, (_value: unknown) => unknown>;
  destination?: string;
  redact?: string[];
}

export interface Logger {
<<<<<<< HEAD
  trace(_message: string, _context?: Partial<LogContext>): void;
  debug(_message: string, _context?: Partial<LogContext>): void;
  info(_message: string, _context?: Partial<LogContext>): void;
  warn(_message: string, _context?: Partial<LogContext>): void;
  error(_message: string, _error?: Error | unknown, _context?: Partial<LogContext>): void;
  fatal(_message: string, _error?: Error | unknown, _context?: Partial<LogContext>): void;
  child(_context: Partial<LogContext>): Logger;
=======
  trace(message: string, context?: Partial<LogContext>): void;
  debug(message: string, context?: Partial<LogContext>): void;
  info(message: string, context?: Partial<LogContext>): void;
  warn(message: string, context?: Partial<LogContext>): void;
  error(message: string, error?: Error | unknown, context?: Partial<LogContext>): void;
  fatal(message: string, error?: Error | unknown, context?: Partial<LogContext>): void;
  child(context: Partial<LogContext>): Logger;
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
}
