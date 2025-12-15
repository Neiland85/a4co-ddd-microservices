import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { setTraceContext, getTraceContext } from '../utils/async-context';
import { generateTraceId, generateSpanId, extractTraceIdFromHeaders } from '../utils/trace-id.generator';
import { getLogger } from '../logger';
import type { TraceContext } from '../types/trace-context.types';

/**
 * NestJS middleware for trace context propagation
 * 
 * This middleware:
 * 1. Extracts or generates trace ID from request headers
 * 2. Generates a unique span ID for this request
 * 3. Injects trace context into AsyncLocalStorage
 * 4. Attaches trace IDs to the request object
 * 5. Logs request start and end with trace context
 * 6. Adds trace ID to response headers
 */
@Injectable()
export class TraceContextMiddleware implements NestMiddleware {
  private readonly logger = getLogger();

  use(req: Request & { traceId?: string; spanId?: string }, res: Response, next: NextFunction): void {
    // Extract trace ID from headers or generate new one
    const traceId = extractTraceIdFromHeaders(req.headers as Record<string, string>) || generateTraceId();
    const spanId = generateSpanId();

    // Create trace context
    const traceContext: TraceContext = {
      traceId,
      spanId,
    };

    // Set context in AsyncLocalStorage for automatic propagation
    setTraceContext(traceContext);

    // Attach to request object for easy access
    req.traceId = traceId;
    req.spanId = spanId;

    // Add trace ID to response headers
    res.setHeader('x-trace-id', traceId);
    res.setHeader('x-span-id', spanId);

    // Record request start time
    const startTime = Date.now();

    // Log request start
    this.logger.info({
      traceId,
      spanId,
      method: req.method,
      url: req.url,
      path: req.path,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    }, 'REQUEST_START');

    // Intercept response to log completion
    const originalSend = res.send;
    const originalJson = res.json;

    res.send = function (data: any) {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Log request completion
      const logger = getLogger();
      logger.info({
        traceId,
        spanId,
        statusCode,
        responseTime,
        method: req.method,
        url: req.url,
        contentLength: res.getHeader('content-length'),
      }, 'REQUEST_END');

      return originalSend.call(this, data);
    };

    res.json = function (data: any) {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Log request completion
      const logger = getLogger();
      logger.info({
        traceId,
        spanId,
        statusCode,
        responseTime,
        method: req.method,
        url: req.url,
        contentLength: res.getHeader('content-length'),
      }, 'REQUEST_END');

      return originalJson.call(this, data);
    };

    next();
  }
}

/**
 * Factory function to create middleware with custom options
 * 
 * @param options - Configuration options for the middleware
 * @returns Middleware function
 */
export function createTraceContextMiddleware(options?: {
  excludePaths?: string[];
  generateIfMissing?: boolean;
}) {
  return (req: Request & { traceId?: string; spanId?: string }, res: Response, next: NextFunction): void => {
    // Check if path should be excluded
    if (options?.excludePaths?.some(path => req.path.startsWith(path))) {
      return next();
    }

    const middleware = new TraceContextMiddleware();
    middleware.use(req, res, next);
  };
}
