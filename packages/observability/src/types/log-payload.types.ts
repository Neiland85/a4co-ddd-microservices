/**
 * Types for structured logging payloads
 */

/**
 * Base log payload with trace context
 */
export interface LogPayload {
  /** Trace ID for distributed tracing */
  traceId?: string;
  /** Span ID for the current operation */
  spanId?: string;
  /** User ID if available */
  userId?: string;
  /** Correlation ID for event tracking */
  correlationId?: string;
  /** Action or operation name */
  action?: string;
  /** Additional metadata */
  [key: string]: any;
}

/**
 * HTTP request log payload
 */
export interface HttpRequestLogPayload extends LogPayload {
  /** HTTP method (GET, POST, etc.) */
  method: string;
  /** Request URL path */
  url: string;
  /** Request query parameters */
  query?: Record<string, any>;
  /** Request body (sanitized) */
  body?: any;
  /** Client IP address */
  ip?: string;
  /** User agent string */
  userAgent?: string;
  /** Request headers (sanitized) */
  headers?: Record<string, string>;
}

/**
 * HTTP response log payload
 */
export interface HttpResponseLogPayload extends LogPayload {
  /** HTTP status code */
  statusCode: number;
  /** Response time in milliseconds */
  responseTime?: number;
  /** Response body size in bytes */
  contentLength?: number;
}

/**
 * Error log payload
 */
export interface ErrorLogPayload extends LogPayload {
  /** Error message */
  errorMessage: string;
  /** Error name/type */
  errorName?: string;
  /** Error stack trace */
  stack?: string;
  /** Error code */
  errorCode?: string;
  /** HTTP status code if applicable */
  statusCode?: number;
}

/**
 * DDD event log payload
 */
export interface EventLogPayload extends LogPayload {
  /** Event name */
  eventName: string;
  /** Event version */
  eventVersion?: string;
  /** Aggregate name (e.g., Order, Payment) */
  aggregateName?: string;
  /** Aggregate ID */
  aggregateId?: string;
  /** Event payload (sanitized) */
  eventData?: any;
  /** Event timestamp */
  timestamp?: string;
}

/**
 * Business metric log payload
 */
export interface MetricLogPayload extends LogPayload {
  /** Metric name */
  metricName: string;
  /** Metric value */
  value: number;
  /** Metric unit (e.g., ms, count, bytes) */
  unit?: string;
  /** Metric tags/dimensions */
  tags?: Record<string, string>;
}

/**
 * Audit log payload
 */
export interface AuditLogPayload extends LogPayload {
  /** Action performed */
  action: string;
  /** User who performed the action */
  userId: string;
  /** Resource affected */
  resource: string;
  /** Resource ID */
  resourceId?: string;
  /** Previous state */
  previousState?: any;
  /** New state */
  newState?: any;
  /** IP address of the user */
  ipAddress?: string;
  /** Timestamp of the action */
  timestamp: string;
}

/**
 * Log level enum
 */
export enum LogLevel {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  /** Service name */
  serviceName: string;
  /** Environment (development, production, etc.) */
  environment: string;
  /** Log level */
  level?: LogLevel | string;
  /** Whether to pretty print logs in development */
  prettyPrint?: boolean;
  /** Whether to include timestamp */
  includeTimestamp?: boolean;
  /** Custom serializers for specific fields */
  serializers?: Record<string, (value: any) => any>;
}
