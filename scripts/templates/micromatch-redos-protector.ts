// Import opcional para observabilidad (fallback a console si no está disponible)
let logger: any;
try {
  const observability = require('@a4co/observability');
  logger = observability.logger;
} catch {
  logger = {
    info: console.info,
    warn: console.warn,
    error: console.error,
  };
}

import {
  MicromatchPatternValidator,
  PatternValidationResult,
} from './micromatch-pattern.validator';

/**
 * Micromatch ReDoS Protector
 * Provides timeout protection and circuit breaker for micromatch operations
 */

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

export class MicromatchReDoSProtector {
  private static readonly DEFAULT_TIMEOUT = 1000; // 1 second
  private static readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private static readonly CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute

  private circuitBreaker: CircuitBreakerState = {
    failures: 0,
    lastFailureTime: 0,
    state: 'closed',
  };

  private operationStats = {
    totalOperations: 0,
    timeoutOperations: 0,
    errorOperations: 0,
    averageExecutionTime: 0,
  };

  /**
   * Safely executes a micromatch operation with timeout and circuit breaker protection
   */
  async safeMatch<T>(
    operation: () => Promise<T> | T,
    patterns: string[],
    options: {
      timeout?: number;
      context?: string;
      allowRiskyPatterns?: boolean;
    } = {},
  ): Promise<MicromatchOperationResult<T>> {
    const startTime = Date.now();
    const timeout = options.timeout || MicromatchReDoSProtector.DEFAULT_TIMEOUT;
    const context = options.context || 'unknown';

    // Check circuit breaker
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

    // Validate patterns
    const patternValidations = MicromatchPatternValidator.validatePatterns(patterns);
    const hasCriticalPatterns = patternValidations.some((v) => v.riskLevel === 'critical');
    const hasHighRiskPatterns = patternValidations.some((v) => v.riskLevel === 'high');

    if (hasCriticalPatterns && !options.allowRiskyPatterns) {
      this.recordFailure();
      return {
        success: false,
        error: 'Pattern contains critical ReDoS risk',
        executionTime: Date.now() - startTime,
        patternRisk: patternValidations[0], // Return first validation result
      };
    }

    if (hasHighRiskPatterns) {
      logger.warn(`High-risk pattern detected in ${context}`, {
        patterns,
        validations: patternValidations,
      });
    }

    try {
      // Execute with timeout
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
    } catch (error) {
      this.recordFailure();
      const executionTime = Date.now() - startTime;
      const isTimeout = error.message?.includes('timeout');

      this.updateStats(executionTime, isTimeout, !isTimeout);

      logger.error(`Micromatch operation failed in ${context}`, {
        error: error.message,
        patterns,
        executionTime,
        isTimeout,
        circuitBreakerState: this.circuitBreaker.state,
      });

      return {
        success: false,
        error: isTimeout ? 'Operation timed out - possible ReDoS attack' : error.message,
        executionTime,
        patternRisk: patternValidations[0],
      };
    }
  }

  /**
   * Executes an operation with timeout protection
   */
  private async executeWithTimeout<T>(
    operation: () => Promise<T> | T,
    timeoutMs: number,
  ): Promise<T> {
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
        } else {
          clearTimeout(timeout);
          resolve(result);
        }
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  /**
   * Checks if circuit breaker is open
   */
  private isCircuitBreakerOpen(): boolean {
    if (this.circuitBreaker.state === 'closed') {
      return false;
    }

    if (this.circuitBreaker.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.circuitBreaker.lastFailureTime;
      if (timeSinceLastFailure > MicromatchReDoSProtector.CIRCUIT_BREAKER_TIMEOUT) {
        // Transition to half-open
        this.circuitBreaker.state = 'half-open';
        return false;
      }
      return true;
    }

    return false; // half-open allows one request
  }

  /**
   * Records a successful operation
   */
  private recordSuccess(): void {
    if (this.circuitBreaker.state === 'half-open') {
      // Reset circuit breaker on success in half-open state
      this.circuitBreaker.failures = 0;
      this.circuitBreaker.state = 'closed';
    }
  }

  /**
   * Records a failed operation
   */
  private recordFailure(): void {
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

  /**
   * Updates operation statistics
   */
  private updateStats(executionTime: number, isTimeout: boolean, isError: boolean): void {
    this.operationStats.totalOperations++;

    if (isTimeout) {
      this.operationStats.timeoutOperations++;
    }

    if (isError) {
      this.operationStats.errorOperations++;
    }

    // Update rolling average
    const alpha = 0.1; // Smoothing factor
    this.operationStats.averageExecutionTime =
      this.operationStats.averageExecutionTime * (1 - alpha) + executionTime * alpha;
  }

  /**
   * Gets current statistics
   */
  getStats() {
    return {
      ...this.operationStats,
      circuitBreaker: { ...this.circuitBreaker },
      failureRate:
        this.operationStats.totalOperations > 0
          ? (this.operationStats.errorOperations + this.operationStats.timeoutOperations) /
            this.operationStats.totalOperations
          : 0,
    };
  }

  /**
   * Resets the circuit breaker (for testing/admin purposes)
   */
  resetCircuitBreaker(): void {
    this.circuitBreaker = {
      failures: 0,
      lastFailureTime: 0,
      state: 'closed',
    };
  }
}
