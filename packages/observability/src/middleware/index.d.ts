import { Request, Response, NextFunction } from 'express';
import { Context as KoaContext, Next as KoaNext } from 'koa';
import { MiddlewareOptions } from '../types';
export declare function expressObservabilityMiddleware(options?: MiddlewareOptions): (req: Request & {
    id?: string;
    log?: any;
}, res: Response, next: NextFunction) => any;
export declare function koaObservabilityMiddleware(options?: MiddlewareOptions): (ctx: KoaContext & {
    id?: string;
    log?: any;
}, next: KoaNext) => Promise<any>;
export declare function expressErrorHandler(): (err: Error, req: Request & {
    log?: any;
}, res: Response, next: NextFunction) => void;
export declare function koaErrorHandler(): (ctx: KoaContext & {
    log?: any;
}, next: KoaNext) => Promise<void>;
//# sourceMappingURL=index.d.ts.map