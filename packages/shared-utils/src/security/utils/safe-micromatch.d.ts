import micromatch from 'micromatch';
import { PatternValidationResult } from '../validators/micromatch-pattern.validator';
export interface SafeMicromatchOptions {
    timeout?: number;
    allowRiskyPatterns?: boolean;
    enableCircuitBreaker?: boolean;
    context?: string;
}
export declare class SafeMicromatch {
    private protector;
    constructor(options?: SafeMicromatchOptions);
    match(list: string[], patterns: string | string[], options?: micromatch.Options): Promise<string[]>;
    isMatch(str: string, patterns: string | string[], options?: micromatch.Options): Promise<boolean>;
    makeRe(pattern: string, options?: micromatch.Options): Promise<RegExp | null>;
    some(list: string[], patterns: string | string[], options?: micromatch.Options): Promise<boolean>;
    every(list: string[], patterns: string | string[], options?: micromatch.Options): Promise<boolean>;
    all(list: string[], patterns: string | string[], options?: micromatch.Options): Promise<string[]>;
    not(list: string[], patterns: string | string[], options?: micromatch.Options): Promise<string[]>;
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
    validatePatterns(patterns: string[]): PatternValidationResult[];
    sanitizePattern(pattern: string): string;
}
export declare function createSafeMicromatch(options?: SafeMicromatchOptions): SafeMicromatch;
export declare function safeMatch(list: string[], patterns: string | string[], options?: micromatch.Options & SafeMicromatchOptions): Promise<string[]>;
export declare function safeIsMatch(str: string, patterns: string | string[], options?: micromatch.Options & SafeMicromatchOptions): Promise<boolean>;
export declare function safeMakeRe(pattern: string, options?: micromatch.Options & SafeMicromatchOptions): Promise<RegExp | null>;
//# sourceMappingURL=safe-micromatch.d.ts.map