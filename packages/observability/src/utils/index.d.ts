import { AxiosInstance, AxiosRequestConfig } from 'axios';
export declare function generateCorrelationId(): string;
export declare function generateCausationId(correlationId: string): string;
export declare function sanitize(data: any, sensitiveKeys?: string[]): any;
export declare function formatDuration(ms: number): string;
export declare function createInstrumentedHttpClient(config?: AxiosRequestConfig): AxiosInstance;
export declare function retryWithBackoff<T>(fn: () => Promise<T>, options?: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
    onRetry?: (error: Error, attempt: number) => void;
}): Promise<T>;
export declare class CircuitBreaker<T> {
    private readonly fn;
    private readonly options;
    private failures;
    private lastFailureTime;
    private state;
    constructor(fn: () => Promise<T>, options?: {
        failureThreshold?: number;
        resetTimeout?: number;
        onStateChange?: (state: 'closed' | 'open' | 'half-open') => void;
    });
    execute(): Promise<T>;
    private setState;
}
export declare class PerformanceTimer {
    private startTime;
    private marks;
    mark(name: string): void;
    measure(name: string, startMark?: string, endMark?: string): number;
    reset(): void;
}
export declare class BatchProcessor<T, R> {
    private readonly processor;
    private readonly options;
    private batch;
    private timer;
    constructor(processor: (items: T[]) => Promise<R[]>, options?: {
        maxBatchSize?: number;
        flushInterval?: number;
        onError?: (error: Error, items: T[]) => void;
    });
    add(item: T): Promise<void>;
    flush(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map