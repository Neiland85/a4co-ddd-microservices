import { Request, Response, NextFunction } from 'express';
import { AxiosRequestConfig } from 'axios';
export interface TracedRequest extends Request {
    traceId?: string;
    spanId?: string;
    parentSpanId?: string;
    baggage?: Record<string, string>;
}
export declare const TRACE_HEADERS: {
    TRACE_ID: string;
    SPAN_ID: string;
    PARENT_SPAN_ID: string;
    TRACE_PARENT: string;
    TRACE_STATE: string;
    BAGGAGE: string;
    B3_TRACE_ID: string;
    B3_SPAN_ID: string;
    B3_PARENT_SPAN_ID: string;
    B3_SAMPLED: string;
    B3_FLAGS: string;
};
export declare function observabilityMiddleware(): (req: TracedRequest, res: Response, next: NextFunction) => void;
export declare class TracedHttpClient {
    private axiosInstance;
    constructor(baseConfig?: AxiosRequestConfig);
    get(url: string, config?: AxiosRequestConfig): any;
    post(url: string, data?: any, config?: AxiosRequestConfig): any;
    put(url: string, data?: any, config?: AxiosRequestConfig): any;
    delete(url: string, config?: AxiosRequestConfig): any;
    patch(url: string, data?: any, config?: AxiosRequestConfig): any;
}
export declare function extractTraceId(headers: any): string | undefined;
export declare function logCorrelationMiddleware(logger: any): (req: TracedRequest, res: Response, next: NextFunction) => void;
export declare function withPropagatedContext<T>(fn: () => Promise<T>, parentContext?: any): Promise<T>;
export declare function createTracingHeaders(): Record<string, string>;
export declare function errorHandlingMiddleware(logger: any): (err: Error, req: TracedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=middleware.d.ts.map