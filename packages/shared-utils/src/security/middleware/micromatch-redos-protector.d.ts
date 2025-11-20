import { PatternValidationResult } from '../validators/micromatch-pattern.validator';
export interface MicromatchOperationResult<T = any> {
    success: boolean;
    result?: T;
    error?: string;
    executionTime: number;
    patternRisk: PatternValidationResult;
}
export interface CircuitBreakerState {
    failures: number;
    lastFailureTime: number;
    state: 'closed' | 'open' | 'half-open';
}
export declare class MicromatchReDoSProtector {
    private static readonly DEFAULT_TIMEOUT;
    private static readonly CIRCUIT_BREAKER_THRESHOLD;
    private static readonly CIRCUIT_BREAKER_TIMEOUT;
    private circuitBreaker;
    private operationStats;
    safeMatch<T>(operation: () => Promise<T> | T, patterns: string[], options?: {
        timeout?: number;
        context?: string;
        allowRiskyPatterns?: boolean;
    }): Promise<MicromatchOperationResult<T>>;
    private executeWithTimeout;
    private isCircuitBreakerOpen;
    private recordSuccess;
    private recordFailure;
    private updateStats;
    getStats(): {
        circuitBreaker: {
            failures: number;
            lastFailureTime: number;
            state: "closed" | "open" | "half-open";
        };
        failureRate: number;
        totalOperations: number;
        timeoutOperations: number;
        errorOperations: number;
        averageExecutionTime: number;
    };
    resetCircuitBreaker(): void;
}
//# sourceMappingURL=micromatch-redos-protector.d.ts.map