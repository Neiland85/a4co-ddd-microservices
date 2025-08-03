/**
 * Circuit Breaker implementation for fault tolerance
 * Prevents cascading failures by failing fast when a service is down
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: Date;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private readonly options: CircuitBreakerOptions = {}
  ) {
    this.options = {
      threshold: options.threshold || 5,
      timeout: options.timeout || 60000, // 1 minute
      resetTimeout: options.resetTimeout || 30000, // 30 seconds
      ...options
    };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit is open
    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - (this.lastFailureTime?.getTime() || 0);
      
      if (timeSinceLastFailure > this.options.resetTimeout!) {
        // Try to recover - move to half-open state
        this.state = 'half-open';
      } else {
        // Circuit is still open - fail fast
        throw new CircuitOpenError(
          `Circuit breaker is OPEN. Will retry after ${
            Math.ceil((this.options.resetTimeout! - timeSinceLastFailure) / 1000)
          } seconds`
        );
      }
    }

    try {
      // Execute the function
      const result = await fn();
      
      // Success - handle based on current state
      this.onSuccess();
      
      return result;
    } catch (error) {
      // Failure - handle based on current state
      this.onFailure();
      throw error;
    }
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    if (this.state === 'half-open') {
      // Recovery successful - close the circuit
      this.state = 'closed';
      this.failures = 0;
      this.lastFailureTime = undefined;
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = new Date();

    if (this.state === 'half-open') {
      // Recovery failed - reopen the circuit
      this.state = 'open';
    } else if (this.failures >= this.options.threshold!) {
      // Threshold exceeded - open the circuit
      this.state = 'open';
    }
  }

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitBreakerState {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
      nextRetryTime: this.getNextRetryTime()
    };
  }

  /**
   * Calculate when the next retry attempt will be allowed
   */
  private getNextRetryTime(): Date | undefined {
    if (this.state !== 'open' || !this.lastFailureTime) {
      return undefined;
    }

    return new Date(
      this.lastFailureTime.getTime() + this.options.resetTimeout!
    );
  }

  /**
   * Manually reset the circuit breaker
   */
  reset(): void {
    this.state = 'closed';
    this.failures = 0;
    this.lastFailureTime = undefined;
  }

  /**
   * Force the circuit to open state
   */
  trip(): void {
    this.state = 'open';
    this.lastFailureTime = new Date();
  }
}

/**
 * Configuration options for Circuit Breaker
 */
export interface CircuitBreakerOptions {
  /**
   * Number of failures before opening the circuit
   */
  threshold?: number;

  /**
   * Time window for counting failures (ms)
   */
  timeout?: number;

  /**
   * Time to wait before attempting to close the circuit (ms)
   */
  resetTimeout?: number;
}

/**
 * Current state of the circuit breaker
 */
export interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailureTime?: Date;
  nextRetryTime?: Date;
}

/**
 * Error thrown when circuit is open
 */
export class CircuitOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitOpenError';
  }
}