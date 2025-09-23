import pino from 'pino';
import pinoHttp, { Options as PinoHttpOptions } from 'pino-http';
import { trace } from '@opentelemetry/api';

/**
 * Creates a Pino logger instance with default configuration
 * @param options - Pino logger options
 * @returns Pino logger instance
 */
export function createLogger(options?: pino.LoggerOptions) {
  return pino({
    level: process.env.LOG_LEVEL || 'info',
    ...options,
  });
}

/**
 * Creates a Pino HTTP logger middleware for Express
 * @param options - Pino HTTP options
 * @returns Pino HTTP middleware
 */
export function createHttpLogger(options?: PinoHttpOptions) {
  return pinoHttp({
    logger: createLogger(),
    ...options,
  });
}

/**
 * Gets an OpenTelemetry tracer instance
 * @param name - Tracer name (optional)
 * @returns OpenTelemetry tracer
 */
export function getTracer(name?: string) {
  return trace.getTracer(name || 'default-tracer');
}
export function tracer(name?: string) {
  return getTracer(name);
}

// Version
export const VERSION = '1.0.0';
