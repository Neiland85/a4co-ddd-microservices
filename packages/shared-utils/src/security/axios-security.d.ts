import { AxiosRequestConfig, AxiosResponse } from 'axios';
export interface AxiosSecurityConfig {
    maxContentLength?: number;
    maxBodyLength?: number;
    maxResponseSize?: number;
    timeout?: number;
    connectTimeout?: number;
    circuitBreakerEnabled?: boolean;
    failureThreshold?: number;
    recoveryTimeout?: number;
    monitoringWindow?: number;
    rateLimitEnabled?: boolean;
    maxRequestsPerMinute?: number;
    retryEnabled?: boolean;
    maxRetries?: number;
    retryDelay?: number;
    memoryMonitoringEnabled?: boolean;
    memoryThreshold?: number;
}
export declare enum CircuitState {
    CLOSED = "CLOSED",
    OPEN = "OPEN",
    HALF_OPEN = "HALF_OPEN"
}
export declare class CircuitBreaker {
    private config;
    private state;
    private failures;
    private lastFailureTime;
    private successCount;
    constructor(config: {
        failureThreshold: number;
        recoveryTimeout: number;
        monitoringWindow: number;
        successThreshold?: number;
    });
    execute<T>(operation: () => Promise<T>): Promise<T>;
    private onSuccess;
    private onFailure;
    getState(): CircuitState;
    getStats(): {
        state: CircuitState;
        failures: number;
        lastFailureTime: number;
        successCount: number;
    };
}
export declare class RateLimiter {
    private maxRequests;
    private windowMs;
    private tokens;
    private lastRefill;
    constructor(maxRequests: number, windowMs: number);
    acquire(): Promise<void>;
}
export declare class MemoryMonitor {
    private thresholdPercent;
    private eventEmitter;
    private intervalId?;
    private lastMemoryUsage;
    constructor(thresholdPercent?: number);
    start(intervalMs?: number): void;
    stop(): void;
    private checkMemoryUsage;
    on(event: 'memoryThresholdExceeded' | 'memoryLeakDetected', listener: (data: any) => void): void;
    getCurrentUsage(): {
        rss: number;
        heapUsed: number;
        heapTotal: number;
        external: number;
    };
}
export declare class SecureAxiosClient {
    private axiosInstance;
    private circuitBreaker;
    private rateLimiter?;
    private memoryMonitor;
    private config;
    constructor(baseURL: string, securityConfig?: AxiosSecurityConfig);
    private setupInterceptors;
    private setupMemoryMonitoring;
    private shouldRetry;
    private retryRequest;
    private calculateDataSize;
    private calculateResponseSize;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    private executeWithSecurity;
    getSecurityStats(): {
        circuitBreaker: {
            state: CircuitState;
            failures: number;
            lastFailureTime: number;
            successCount: number;
        };
        memoryUsage: {
            rss: number;
            heapUsed: number;
            heapTotal: number;
            external: number;
        };
        config: Required<AxiosSecurityConfig>;
    };
    destroy(): void;
}
export declare class SecureAxiosFactory {
    static createClient(baseURL: string, config?: AxiosSecurityConfig): SecureAxiosClient;
    static createDefaultConfig(): AxiosSecurityConfig;
}
export declare const secureAxiosFactory: typeof SecureAxiosFactory;
//# sourceMappingURL=axios-security.d.ts.map