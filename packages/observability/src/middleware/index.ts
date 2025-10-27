import { type Middleware } from 'koa';
import { trace, context, propagation } from '@opentelemetry/api';

export interface MiddlewareOptions {
  ignorePaths?: string[];
}

export function koaObservabilityMiddleware(options: MiddlewareOptions = {}): Middleware {
  return async (ctx, next) => {
    if (options.ignorePaths?.includes(ctx.path)) {
      await next();
      return;
    }

    const span = trace.getTracer('koa-tracer').startSpan(`request:${ctx.method} ${ctx.path}`, {
      attributes: {
        'http.method': ctx.method,
        'http.url': ctx.url,
      },
    });

    await context.with(trace.setSpan(context.active(), span), async () => {
      await next();
      span.setAttribute('http.status_code', ctx.status);
      span.end();
    });
  };
}
