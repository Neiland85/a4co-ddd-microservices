/**
 * Trace context types for distributed tracing
 */

/**
 * Standard trace context following W3C Trace Context specification
 */
export interface TraceContext {
  /** Unique identifier for the trace across all services */
  traceId: string;
  /** Unique identifier for the current span */
  spanId: string;
  /** Optional parent span ID for hierarchical tracing */
  parentSpanId?: string;
  /** Optional trace flags (e.g., sampled) */
  traceFlags?: string;
}

/**
 * Extended request interface with trace context
 * Can be used with Express or NestJS Request objects
 */
export interface TracedRequest {
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  [key: string]: any;
}

/**
 * Headers used for trace context propagation
 */
export const TRACE_CONTEXT_HEADERS = {
  /** Custom trace ID header (A4CO standard) */
  TRACE_ID: 'x-trace-id',
  /** Custom span ID header */
  SPAN_ID: 'x-span-id',
  /** W3C Trace Context standard header */
  TRACEPARENT: 'traceparent',
  /** W3C Trace State header */
  TRACESTATE: 'tracestate',
  /** Zipkin B3 trace ID header */
  B3_TRACE_ID: 'x-b3-traceid',
  /** Zipkin B3 span ID header */
  B3_SPAN_ID: 'x-b3-spanid',
  /** Request ID header */
  REQUEST_ID: 'x-request-id',
  /** Correlation ID header for event tracking */
  CORRELATION_ID: 'x-correlation-id',
} as const;

/**
 * Trace context options for middleware configuration
 */
export interface TraceContextOptions {
  /** Whether to generate trace ID if not present in headers */
  generateIfMissing?: boolean;
  /** Header name to use for trace ID (default: x-trace-id) */
  traceIdHeader?: string;
  /** Whether to include trace ID in response headers */
  includeInResponse?: boolean;
  /** Paths to exclude from tracing (e.g., health checks) */
  excludePaths?: string[];
  /** Custom trace ID generator function */
  traceIdGenerator?: () => string;
}
