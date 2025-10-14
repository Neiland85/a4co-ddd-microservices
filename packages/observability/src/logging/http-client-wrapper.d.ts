/**
 * HTTP client wrapper with automatic logging and tracing
 */
import { Logger } from './types';
export interface RequestConfig extends RequestInit {
    traceId?: string;
    spanId?: string;
    logger?: Logger;
}
export interface FetchWrapperConfig {
    baseURL?: string;
    defaultHeaders?: Record<string, string>;
    logger: Logger;
    propagateTrace?: boolean;
}
/**
 * Enhanced fetch wrapper with logging and tracing
 */
export declare class FetchWrapper {
    private config;
    constructor(config: FetchWrapperConfig);
    private generateTraceHeaders;
    private getFullUrl;
    request(url: string, config?: RequestConfig): Promise<Response>;
    get(url: string, config?: RequestConfig): Promise<Response>;
    post(url: string, body?: any, config?: RequestConfig): Promise<Response>;
    put(url: string, body?: any, config?: RequestConfig): Promise<Response>;
    patch(url: string, body?: any, config?: RequestConfig): Promise<Response>;
    delete(url: string, config?: RequestConfig): Promise<Response>;
}
/**
 * Factory function to create a fetch wrapper instance
 */
export declare function createFetchWrapper(config: FetchWrapperConfig): FetchWrapper;
/**
 * Axios-like interceptor for the fetch wrapper
 */
export interface Interceptor<T = any> {
    onFulfilled?: (value: T) => T | Promise<T>;
    onRejected?: (error: any) => any;
}
export declare class InterceptorManager<T = any> {
    private handlers;
    use(onFulfilled?: (value: T) => T | Promise<T>, onRejected?: (error: any) => any): number;
    eject(id: number): void;
    forEach(fn: (handler: Interceptor<T>) => void): void;
}
/**
 * Enhanced fetch wrapper with interceptors
 */
export declare class FetchWrapperWithInterceptors extends FetchWrapper {
    interceptors: {
        request: InterceptorManager<RequestConfig>;
        response: InterceptorManager<Response>;
    };
    request(url: string, config?: RequestConfig): Promise<Response>;
}
//# sourceMappingURL=http-client-wrapper.d.ts.map