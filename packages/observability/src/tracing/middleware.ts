/**
 * Middleware for adding tracing to HTTP requests
 */

import { context, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import type { NextFunction, Request, Response } from 'express';
import type { Context, Next } from 'koa';
import { v4 as uuidv4 } from 'uuid';
import type { Logger } from '../logging/types';

export interface TracingMiddlewareOptions {
  serviceName?: string;
  logger?: Logger;
  extractTraceHeaders?: boolean;
  injectTraceHeaders?: boolean;
  captureRequestBody?: boolean;
  captureResponseBody?: boolean;
  sensitiveHeaders?: string[];
}

/**
 * Express middleware for distributed tracing
 */
export function expressTracingMiddleware(options: TracingMiddlewareOptions = {}) {
  const {
    serviceName = 'express-app',
    logger,
    extractTraceHeaders: _extractTraceHeaders = true,
    injectTraceHeaders = true,
    captureRequestBody = false,
    captureResponseBody = false,
    sensitiveHeaders: _sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'],
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    // Extract trace headers
    const traceId = (req.headers['x-trace-id'] as string) || uuidv4();
    const parentSpanId = req.headers['x-span-id'] as string;
    let traceId = (req.headers['x-trace-id'] as string) || uuidv4();
    let parentSpanId = req.headers['x-span-id'] as string;

    const tracer = trace.getTracer(serviceName);
    const span = tracer.startSpan(`${req.method} ${req.path}`, {
      kind: SpanKind.SERVER,
      attributes: {
        'http.method': req.method,
        'http.url': req.url,
        'http.target': req.path,
        'http.host': req.hostname,
        'http.scheme': req.protocol,
        'http.user_agent': req.headers['user-agent'],
        'http.request_content_length': req.headers['content-length'],
        'net.peer.ip': req.ip,
        'trace.id': traceId,
        'parent.span.id': parentSpanId,
      },
    });

    // Set trace context
    const ctx = trace.setSpan(context.active(), span);

    // Add request body if enabled
    if (captureRequestBody && req.body) {
      span.setAttribute('http.request.body', JSON.stringify(req.body));
    }

    // Inject trace headers
    if (injectTraceHeaders) {
      const spanContext = span.spanContext();
      res.setHeader('X-Trace-Id', spanContext.traceId);
      res.setHeader('X-Span-Id', spanContext.spanId);
    }

    // Attach span to request for access in route handlers
    (req as unknown as { __span: typeof span; __traceId: string }).__span = span;
    (req as unknown as { __span: typeof span; __traceId: string }).__traceId = traceId;

    // Log request
    logger?.info('HTTP request received', {
      traceId,
      spanId: span.spanContext().spanId,
      http: {
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      },
    });

    // Capture response
    const originalSend = res.send;
    const originalJson = res.json;
    const startTime = Date.now();

    res.send = function(data: string | Buffer | object): Response {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    res.send = function (data: any) {
      span.setAttribute('http.status_code', res.statusCode);
      span.setAttribute('http.response_content_length', Buffer.byteLength(dataString));
      span.setAttribute('http.duration', Date.now() - startTime);

      if (captureResponseBody) {
        span.setAttribute('http.response.body', String(data));
      }

      if (res.statusCode >= 400) {
        span.setStatus({ code: SpanStatusCode.ERROR });
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }

      span.end();

      // Log response
      logger?.info('HTTP request completed', {
        traceId,
        spanId: span.spanContext().spanId,
        http: {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration: Date.now() - startTime,
        },
      });

      return originalSend.call(this, data);
    };

    res.json = function(data: unknown): Response {
    res.json = function (data: any) {
      span.setAttribute('http.status_code', res.statusCode);
      span.setAttribute('http.response_content_type', 'application/json');
      span.setAttribute('http.duration', Date.now() - startTime);

      if (captureResponseBody) {
        span.setAttribute('http.response.body', JSON.stringify(data));
      }

      if (res.statusCode >= 400) {
        span.setStatus({ code: SpanStatusCode.ERROR });
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }

      span.end();

      // Log response
      logger?.info('HTTP request completed', {
        traceId,
        spanId: span.spanContext().spanId,
        http: {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration: Date.now() - startTime,
        },
      });

      return originalJson.call(this, data);
    };

    // Continue with context
    context.with(ctx, () => {
      next();
    });
  };
}

/**
 * Koa middleware for distributed tracing
 */
export function koaTracingMiddleware(options: TracingMiddlewareOptions = {}) {
  const {
    serviceName = 'koa-app',
    logger,
    extractTraceHeaders: _extractTraceHeaders = true,
    injectTraceHeaders = true,
    captureRequestBody = false,
    captureResponseBody = false,
    sensitiveHeaders: _sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'],
  } = options;

  return async(ctx: Context, next: Next): Promise<void> => {
    // Extract trace headers
    const traceId = (ctx.headers['x-trace-id'] as string) || uuidv4();
    const parentSpanId = ctx.headers['x-span-id'] as string;
    let traceId = (ctx.headers['x-trace-id'] as string) || uuidv4();
    let parentSpanId = ctx.headers['x-span-id'] as string;

    const tracer = trace.getTracer(serviceName);
    const span = tracer.startSpan(`${ctx.method} ${ctx.path}`, {
      kind: SpanKind.SERVER,
      attributes: {
        'http.method': ctx.method,
        'http.url': ctx.url,
        'http.target': ctx.path,
        'http.host': ctx.hostname,
        'http.scheme': ctx.protocol,
        'http.user_agent': ctx.headers['user-agent'],
        'http.request_content_length': ctx.headers['content-length'],
        'net.peer.ip': ctx.ip,
        'trace.id': traceId,
        'parent.span.id': parentSpanId,
      },
    });

    // Set trace context
    const tracingContext = trace.setSpan(context.active(), span);

    // Add request body if enabled
    if (captureRequestBody && (ctx.request as unknown as { body?: unknown }).body) {
      span.setAttribute(
        'http.request.body',
        JSON.stringify((ctx.request as unknown as { body?: unknown }).body),
      );
    }

    // Inject trace headers
    if (injectTraceHeaders) {
      const spanContext = span.spanContext();
      ctx.set('X-Trace-Id', spanContext.traceId);
      ctx.set('X-Span-Id', spanContext.spanId);
    }

    // Attach span to context for access in route handlers
    ctx.state['span'] = span;
    ctx.state['traceId'] = traceId;

    // Log request
    logger?.info('HTTP request received', {
      traceId,
      spanId: span.spanContext().spanId,
      http: {
        method: ctx.method,
        url: ctx.url,
        userAgent: ctx.headers['user-agent'],
        ip: ctx.ip,
      },
    });

    const startTime = Date.now();

    try {
      // Continue with context
      await context.with(tracingContext, async() => {
        await next();
      });

      // Set response attributes
      span.setAttribute('http.status_code', ctx.status);
      span.setAttribute('http.response_content_length', ctx.length || 0);
      span.setAttribute('http.duration', Date.now() - startTime);

      if (captureResponseBody && ctx.body) {
        span.setAttribute(
          'http.response.body',
          typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body),
          typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body)
        );
      }

      if (ctx.status >= 400) {
        span.setStatus({ code: SpanStatusCode.ERROR });
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }

      // Log response
      logger?.info('HTTP request completed', {
        traceId,
        spanId: span.spanContext().spanId,
        http: {
          method: ctx.method,
          url: ctx.url,
          statusCode: ctx.status,
          duration: Date.now() - startTime,
        },
      });
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });

      // Log error
      logger?.error('HTTP request failed', error, {
        traceId,
        spanId: span.spanContext().spanId,
        http: {
          method: ctx.method,
          url: ctx.url,
          duration: Date.now() - startTime,
        },
      });

      throw error;
    } finally {
      span.end();
    }
  };
}

/**
 * Decorator for controller methods to add span
 */
export function TraceController(options?: {
  name?: string;
  captureArgs?: boolean;
  captureResult?: boolean;
}) {
  return function(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: unknown[]): Promise<unknown> {
      // Get request object (Express or Koa)
      const req = args[0] as { __span?: unknown; state?: { span?: unknown } };
      const parentSpan = req.__span || req.state?.span;

      if (!parentSpan) {
        return originalMethod.apply(this, args);
      }

      const tracer = trace.getTracer('controller');
      const spanName = options?.name || `${target.constructor.name}.${propertyKey}`;

      const span = tracer.startSpan(spanName, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'controller.name': target.constructor.name,
          'controller.method': propertyKey,
        },
      });

      if (options?.captureArgs) {
        span.setAttribute('controller.args', JSON.stringify(args.slice(1)));
      }

      try {
        const result = await originalMethod.apply(this, args);

        if (options?.captureResult) {
          span.setAttribute('controller.result', JSON.stringify(result));
        }

        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        throw error;
      } finally {
        span.end();
      }
    };

    return descriptor;
  };
}
