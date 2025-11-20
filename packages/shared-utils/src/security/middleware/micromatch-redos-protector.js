"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicromatchReDoSProtector = void 0;
let logger;
try {
    const observability = require('@a4co/observability');
    logger = observability.getGlobalLogger();
}
catch {
    logger = {
        info: console.info,
        warn: console.warn,
        error: console.error,
    };
}
const micromatch_pattern_validator_1 = require("../validators/micromatch-pattern.validator");
class MicromatchReDoSProtector {
    constructor() {
        this.circuitBreaker = {
            failures: 0,
            lastFailureTime: 0,
            state: 'closed',
        };
        this.operationStats = {
            totalOperations: 0,
            timeoutOperations: 0,
            errorOperations: 0,
            averageExecutionTime: 0,
        };
    }
    static { this.DEFAULT_TIMEOUT = 1000; }
    static { this.CIRCUIT_BREAKER_THRESHOLD = 5; }
    static { this.CIRCUIT_BREAKER_TIMEOUT = 60000; }
    async safeMatch(operation, patterns, options = {}) {
        const startTime = Date.now();
        const timeout = options.timeout || MicromatchReDoSProtector.DEFAULT_TIMEOUT;
        const context = options.context || 'unknown';
        if (this.isCircuitBreakerOpen()) {
            return {
                success: false,
                error: 'Circuit breaker is open - too many recent failures',
                executionTime: 0,
                patternRisk: {
                    isValid: false,
                    riskLevel: 'critical',
                    complexity: 0,
                    issues: [],
                    recommendations: [],
                },
            };
        }
        const patternValidations = micromatch_pattern_validator_1.MicromatchPatternValidator.validatePatterns(patterns);
        const hasCriticalPatterns = patternValidations.some(v => v.riskLevel === 'critical');
        const hasHighRiskPatterns = patternValidations.some(v => v.riskLevel === 'high');
        if (hasCriticalPatterns && !options.allowRiskyPatterns) {
            this.recordFailure();
            return {
                success: false,
                error: 'Pattern contains critical ReDoS risk',
                executionTime: Date.now() - startTime,
                patternRisk: patternValidations[0],
            };
        }
        if (hasHighRiskPatterns) {
            logger.warn(`High-risk pattern detected in ${context}`, {
                patterns,
                validations: patternValidations,
            });
        }
        try {
            const result = await this.executeWithTimeout(operation, timeout);
            this.recordSuccess();
            const executionTime = Date.now() - startTime;
            this.updateStats(executionTime, false, false);
            return {
                success: true,
                result,
                executionTime,
                patternRisk: patternValidations[0],
            };
        }
        catch (error) {
            this.recordFailure();
            const executionTime = Date.now() - startTime;
            const isTimeout = error instanceof Error && error.message?.includes('timeout');
            this.updateStats(executionTime, isTimeout, !isTimeout);
            logger.error(`Micromatch operation failed in ${context}`, {
                error: error instanceof Error ? error.message : String(error),
                patterns,
                executionTime,
                isTimeout,
                circuitBreakerState: this.circuitBreaker.state,
            });
            return {
                success: false,
                error: isTimeout
                    ? 'Operation timed out - possible ReDoS attack'
                    : error instanceof Error
                        ? error.message
                        : String(error),
                executionTime,
                patternRisk: patternValidations[0],
            };
        }
    }
    async executeWithTimeout(operation, timeoutMs) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(`Operation timed out after ${timeoutMs}ms`));
            }, timeoutMs);
            try {
                const result = operation();
                if (result instanceof Promise) {
                    result
                        .then(resolve)
                        .catch(reject)
                        .finally(() => clearTimeout(timeout));
                }
                else {
                    clearTimeout(timeout);
                    resolve(result);
                }
            }
            catch (error) {
                clearTimeout(timeout);
                reject(error);
            }
        });
    }
    isCircuitBreakerOpen() {
        if (this.circuitBreaker.state === 'closed') {
            return false;
        }
        if (this.circuitBreaker.state === 'open') {
            const timeSinceLastFailure = Date.now() - this.circuitBreaker.lastFailureTime;
            if (timeSinceLastFailure > MicromatchReDoSProtector.CIRCUIT_BREAKER_TIMEOUT) {
                this.circuitBreaker.state = 'half-open';
                return false;
            }
            return true;
        }
        return false;
    }
    recordSuccess() {
        if (this.circuitBreaker.state === 'half-open') {
            this.circuitBreaker.failures = 0;
            this.circuitBreaker.state = 'closed';
        }
    }
    recordFailure() {
        this.circuitBreaker.failures++;
        this.circuitBreaker.lastFailureTime = Date.now();
        if (this.circuitBreaker.failures >= MicromatchReDoSProtector.CIRCUIT_BREAKER_THRESHOLD) {
            this.circuitBreaker.state = 'open';
            logger.warn('Circuit breaker opened due to excessive failures', {
                failures: this.circuitBreaker.failures,
                threshold: MicromatchReDoSProtector.CIRCUIT_BREAKER_THRESHOLD,
            });
        }
    }
    updateStats(executionTime, isTimeout, isError) {
        this.operationStats.totalOperations++;
        if (isTimeout) {
            this.operationStats.timeoutOperations++;
        }
        if (isError) {
            this.operationStats.errorOperations++;
        }
        const alpha = 0.1;
        this.operationStats.averageExecutionTime =
            this.operationStats.averageExecutionTime * (1 - alpha) + executionTime * alpha;
    }
    getStats() {
        return {
            ...this.operationStats,
            circuitBreaker: { ...this.circuitBreaker },
            failureRate: this.operationStats.totalOperations > 0
                ? (this.operationStats.errorOperations + this.operationStats.timeoutOperations) /
                    this.operationStats.totalOperations
                : 0,
        };
    }
    resetCircuitBreaker() {
        this.circuitBreaker = {
            failures: 0,
            lastFailureTime: 0,
            state: 'closed',
        };
    }
}
exports.MicromatchReDoSProtector = MicromatchReDoSProtector;
//# sourceMappingURL=micromatch-redos-protector.js.map