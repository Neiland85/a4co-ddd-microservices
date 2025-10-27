import { context, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { NextFunction, Request, Response } from 'express';
import { Context as KoaContext, Next as KoaNext } from 'koa';
import { v4 as uuidv4 } from 'uuid';
import { getLogger } from '../logger';
import { recordHttpRequest } from '../metrics/index';
import { extractContext } from '../tracer';
import { MiddlewareOptions } from '../types';

// Express middleware
export function expressObservabilityMiddleware(options: MiddlewareOptions = {}) {
  const logger = getLogger();
  const {
    ignorePaths = ['/health', '/metrics', '/favicon.ico'],
    includeRequestBody = false,
    includeResponseBody = false,
    redactHeaders = ['authorization', 'cookie', 'x-api-key'],
    customAttributes = () => ({}),
  } = options;

  return (req: Request & { id?: string; log?: any }, res: Response, next: NextFunction) => {
    // Skip ignored paths
    if (ignorePaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Extract trace context from headers
    const parentContext = extractContext(req.headers);

    // Start span
    const tracer = trace.getTracer('@a4co/observability');
    const span = tracer.startSpan(
      `${req.method} ${req.route?.path || req.path}`,
      {
        kind: SpanKind.SERVER,
        attributes: {
          'http.method': req.method,
          'http.url': req.url,
          'http.target': req.path,
          'http.host': req.hostname,
          'http.scheme': req.protocol,
          'http.user_agent': req.headers['user-agent'],
          'http.remote_addr': req.ip,
          ...customAttributes(req),
        },
      },
      parentContext,
    );

    // Set trace context
    const ctx = trace.setSpan(context.active(), span);

    // Generate request ID
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();
    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;

    // Add to request
    req.id = requestId;

    // Create logger with context
    req.log = logger.withContext({
      requestId,
      traceId,
      spanId,
      method: req.method,
      path: req.path,
      ip: req.ip,
    });

    // Log request
    const requestLog: any = {
      method: req.method,
      url: req.url,
      headers: filterHeaders(req.headers, redactHeaders),
    };

    if (includeRequestBody && req.body) {
      requestLog.body = req.body;
    }

    req.log.info(requestLog, 'Request received');

    // Track response
    const startTime = Date.now();
    const originalSend = res.send;
    let responseBody: any;

    res.send = function (data: any) {
      responseBody = data;
      return originalSend.call(this, data);
    };

    // Handle response completion
    res.on('finish', () => {
      const duration = Date.now() - startTime;

      // Update span
      span.setAttributes({
        'http.status_code': res.statusCode,
        'http.response.size': res.get('content-length'),
      });

      if (res.statusCode >= 400) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: `HTTP ${res.statusCode}` });
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }

      span.end();

      // Log response
      const responseLog: any = {
        statusCode: res.statusCode,
        duration,
        headers: filterHeaders(res.getHeaders(), redactHeaders),
      };

      if (includeResponseBody && responseBody) {
        responseLog.body = responseBody;
      }

      const level = res.statusCode >= 400 ? 'error' : 'info';
      req.log[level](responseLog, 'Request completed');

      // Record metrics
      recordHttpRequest(req.method, req.route?.path || req.path, res.statusCode, duration);
    });

    // Handle errors
    res.on('error', error => {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      req.log.error({ error }, 'Response error');
    });

    // Continue with context
    context.with(ctx, () => {
      next();
    });
  };
}

// Koa middleware
export function koaObservabilityMiddleware(options: MiddlewareOptions = {}) {
  const logger = getLogger();
  const {
    ignorePaths = ['/health', '/metrics', '/favicon.ico'],
    includeRequestBody = false,
    includeResponseBody = false,
    redactHeaders = ['authorization', 'cookie', 'x-api-key'],
    customAttributes = () => ({}),
  } = options;

  return async(ctx: KoaContext & { id?: string; log?: any }, next: KoaNext) => {
    // Skip ignored paths
    if (ignorePaths.some(path => ctx.path.startsWith(path))) {
      return next();
    }

    // Extract trace context from headers
    const parentContext = extractContext(ctx.headers);

    // Start span
    const tracer = trace.getTracer('@a4co/observability');
    const span = tracer.startSpan(
      `${ctx.method} ${ctx.path}`,
      {
        kind: SpanKind.SERVER,
        attributes: {
          'http.method': ctx.method,
          'http.url': ctx.url,
          'http.target': ctx.path,
          'http.host': ctx.host,
          'http.scheme': ctx.protocol,
          'http.user_agent': ctx.headers['user-agent'],
          'http.remote_addr': ctx.ip,
          ...customAttributes(ctx),
        },
      },
      parentContext,
    );

    // Set trace context
    const traceCtx = trace.setSpan(context.active(), span);

    // Generate request ID
    const requestId = (ctx.headers['x-request-id'] as string) || uuidv4();
    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;

    // Add to context
    ctx.id = requestId;
    ctx.state['traceId'] = traceId;
    ctx.state['spanId'] = spanId;
    ctx.state.traceId = traceId;
    ctx.state.spanId = spanId;

    // Create logger with context
    ctx.log = logger.withContext({
      requestId,
      traceId,
      spanId,
      method: ctx.method,
      path: ctx.path,
      ip: ctx.ip,
    });

    // Set response headers
    ctx.set('X-Request-ID', requestId);
    ctx.set('X-Trace-ID', traceId);

    // Log request
    const requestLog: any = {
      method: ctx.method,
      url: ctx.url,
      headers: filterHeaders(ctx.headers, redactHeaders),
    };

    if (includeRequestBody && (ctx.request as any).body) {
      requestLog.body = (ctx.request as any).body;
    if (includeRequestBody && ctx.request.body) {
      requestLog.body = ctx.request.body;
    }

    ctx.log.info(requestLog, 'Request received');

    const startTime = Date.now();

    try {
      // Continue with context
      await context.with(traceCtx, async() => {
        await next();
      });

      const duration = Date.now() - startTime;

      // Update span
      span.setAttributes({
        'http.status_code': ctx.status,
        'http.response.size': ctx.response.length,
      });

      if (ctx.status >= 400) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: `HTTP ${ctx.status}` });
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }

      // Log response
      const responseLog: any = {
        statusCode: ctx.status,
        duration,
        headers: filterHeaders(ctx.response.headers, redactHeaders),
      };

      if (includeResponseBody && ctx.body) {
        responseLog.body = ctx.body;
      }

      const level = ctx.status >= 400 ? 'error' : 'info';
      ctx.log[level](responseLog, 'Request completed');

      // Record metrics
      recordHttpRequest(ctx.method, ctx.path, ctx.status, duration);
    } catch (error) {
      const duration = Date.now() - startTime;

      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message });

      ctx.log.error({ error, duration }, 'Request failed');

      // Record error metrics
      recordHttpRequest(ctx.method, ctx.path, 500, duration);

      throw error;
    } finally {
      span.end();
    }
  };
}

// Helper to filter sensitive headers
function filterHeaders(headers: any, redactList: string[]): any {
  const filtered = { ...headers };
  redactList.forEach(header => {
    const key = header.toLowerCase();
    if (filtered[key]) {
      filtered[key] = '[REDACTED]';
    }
  });
  return filtered;
}

// Error handler middleware for Express
export function expressErrorHandler() {
  return (err: Error, req: Request & { log?: any }, res: Response, next: NextFunction) => {
    const logger = req.log || getLogger();

    logger.error(
      {
        error: err,
        stack: err.stack,
        url: req.url,
        method: req.method,
      },
      'Unhandled error',
      'Unhandled error'
    );

    // Get current span if available
    const span = trace.getActiveSpan();
    if (span) {
      span.recordException(err);
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env['NODE_ENV'] === 'development' ? err.message : undefined,
      requestId: req.id,
    });
  };
}

// Error handler middleware for Koa
export function koaErrorHandler() {
  return async(ctx: KoaContext & { log?: any }, next: KoaNext) => {
    try {
      await next();
    } catch (err) {
      const error = err as Error;
      const logger = ctx.log || getLogger();

      logger.error(
        {
          error,
          stack: error.stack,
          url: ctx.url,
          method: ctx.method,
        },
        'Unhandled error',
        'Unhandled error'
      );

      // Get current span if available
      const span = trace.getActiveSpan();
      if (span) {
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      }

      ctx.status = 500;
      ctx.body = {
        error: 'Internal Server Error',
        message: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
        requestId: ctx['id'],
      };
    }
  };
}
