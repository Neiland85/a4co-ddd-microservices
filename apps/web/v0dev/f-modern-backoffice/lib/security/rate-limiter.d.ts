interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
}
export declare class RateLimiter {
    private store;
    private config;
    constructor(config: RateLimitConfig);
    checkLimit(identifier: string): {
        allowed: boolean;
        remaining: number;
        resetTime: number;
    };
    private cleanup;
    reset(identifier: string): void;
    getStats(): {
        totalEntries: number;
        blockedEntries: number;
    };
}
export declare const apiRateLimiter: RateLimiter;
export declare const loginRateLimiter: RateLimiter;
export {};
//# sourceMappingURL=rate-limiter.d.ts.map