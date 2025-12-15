import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique trace ID using UUID v4
 * Compatible with distributed tracing standards
 * 
 * @returns A unique trace ID string
 */
export function generateTraceId(): string {
  return uuidv4();
}

/**
 * Generate a unique span ID using UUID v4
 * 
 * @returns A unique span ID string
 */
export function generateSpanId(): string {
  return uuidv4();
}

/**
 * Validate if a string is a valid UUID v4
 * 
 * @param id - The ID to validate
 * @returns True if the ID is a valid UUID v4
 */
export function isValidUUID(id: string): boolean {
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(id);
}

/**
 * Extract trace ID from various header formats
 * Supports: x-trace-id, traceparent (W3C), x-b3-traceid (Zipkin B3)
 * 
 * @param headers - Request headers object
 * @returns The extracted trace ID or undefined
 */
export function extractTraceIdFromHeaders(
  headers: Record<string, string | string[] | undefined>
): string | undefined {
  // Check x-trace-id header (our standard)
  const xTraceId = headers['x-trace-id'];
  if (xTraceId && typeof xTraceId === 'string') {
    return xTraceId;
  }

  // Check traceparent (W3C Trace Context)
  const traceparent = headers['traceparent'];
  if (traceparent && typeof traceparent === 'string') {
    // Format: version-trace-id-parent-id-trace-flags
    const parts = traceparent.split('-');
    if (parts.length >= 2) {
      return parts[1];
    }
  }

  // Check x-b3-traceid (Zipkin B3)
  const b3TraceId = headers['x-b3-traceid'];
  if (b3TraceId && typeof b3TraceId === 'string') {
    return b3TraceId;
  }

  return undefined;
}
