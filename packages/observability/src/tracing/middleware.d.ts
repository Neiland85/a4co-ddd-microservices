/**
 * Middleware for adding tracing to HTTP requests
 */
import { Request, Response, NextFunction } from 'express';
import { Context, Next } from 'koa';
import { Logger } from '../logging/types';
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
export declare function expressTracingMiddleware(options?: TracingMiddlewareOptions): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Koa middleware for distributed tracing
 */
export declare function koaTracingMiddleware(options?: TracingMiddlewareOptions): (ctx: Context, next: Next) => Promise<void>;
/**
 * Decorator for controller methods to add span
 */
export declare function TraceController(options?: {
    name?: string;
    captureArgs?: boolean;
    captureResult?: boolean;
}): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=middleware.d.ts.map