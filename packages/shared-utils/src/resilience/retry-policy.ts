/**
 * Retry Policy implementation with exponential backoff
 * Provides intelligent retry logic for transient failures
 */
export class RetryPolicy {
  constructor(
    private readonly options: RetryPolicyOptions = {}
  ) {
    this.options = {
      maxAttempts: options.maxAttempts || 3,
      initialDelay: options.initialDelay || 1000,
      maxDelay: options.maxDelay || 30000,
      factor: options.factor || 2,
      jitter: options.jitter ?? true,
      retryableErrors: options.retryableErrors || [],
      onRetry: options.onRetry,
      ...options
    };
  }

  /**
   * Execute a function with retry logic
   */
  async execute<T>(
    fn: () => Promise<T>,
    context?: RetryContext
  ): Promise<T> {
    let lastError: Error;
    let delay = this.options.initialDelay!;

    for (let attempt = 1; attempt <= this.options.maxAttempts!; attempt++) {
      try {
        // Execute the function
        const result = await fn();
        
        // Success - return result
        return result;
      } catch (error) {
        lastError = error as Error;

        // Check if error is retryable
        if (!this.isRetryable(lastError)) {
          throw lastError;
        }

        // Check if we've exhausted retries
        if (attempt === this.options.maxAttempts) {
          throw new RetryExhaustedError(
            `Failed after ${attempt} attempts: ${lastError.message}`,
            lastError,
            attempt
          );
        }

        // Calculate delay for next attempt
        delay = this.calculateDelay(attempt, delay);

        // Call onRetry callback if provided
        if (this.options.onRetry) {
          await this.options.onRetry({
            attempt,
            error: lastError,
            delay,
            context
          });
        }

        // Wait before next attempt
        await this.sleep(delay);
      }
    }

    // This should never be reached due to the throw above
    throw lastError!;
  }

  /**
   * Calculate delay for next retry attempt
   */
  private calculateDelay(attempt: number, currentDelay: number): number {
    // Exponential backoff
    let delay = Math.min(
      currentDelay * Math.pow(this.options.factor!, attempt - 1),
      this.options.maxDelay!
    );

    // Add jitter to prevent thundering herd
    if (this.options.jitter) {
      const jitterValue = delay * 0.2; // 20% jitter
      delay = delay + (Math.random() * jitterValue * 2 - jitterValue);
    }

    return Math.round(delay);
  }

  /**
   * Check if an error is retryable
   */
  private isRetryable(error: Error): boolean {
    // Check custom retryable errors
    if (this.options.retryableErrors!.length > 0) {
      return this.options.retryableErrors!.some(
        retryableError => error instanceof retryableError
      );
    }

    // Default retryable conditions
    const errorMessage = error.message.toLowerCase();
    const retryableMessages = [
      'timeout',
      'econnrefused',
      'enotfound',
      'econnreset',
      'etimedout',
      'ehostunreach',
      'epipe',
      'service unavailable',
      'too many requests',
      'rate limit'
    ];

    return retryableMessages.some(msg => errorMessage.includes(msg));
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create a retry policy with linear backoff
   */
  static linear(options?: Partial<RetryPolicyOptions>): RetryPolicy {
    return new RetryPolicy({
      ...options,
      factor: 1
    });
  }

  /**
   * Create a retry policy with exponential backoff
   */
  static exponential(options?: Partial<RetryPolicyOptions>): RetryPolicy {
    return new RetryPolicy({
      ...options,
      factor: options?.factor || 2
    });
  }

  /**
   * Create a retry policy with fixed delay
   */
  static fixed(delay: number, options?: Partial<RetryPolicyOptions>): RetryPolicy {
    return new RetryPolicy({
      ...options,
      initialDelay: delay,
      factor: 0,
      jitter: false
    });
  }
}

/**
 * Configuration options for Retry Policy
 */
export interface RetryPolicyOptions {
  /**
   * Maximum number of retry attempts
   */
  maxAttempts?: number;

  /**
   * Initial delay between retries (ms)
   */
  initialDelay?: number;

  /**
   * Maximum delay between retries (ms)
   */
  maxDelay?: number;

  /**
   * Exponential backoff factor
   */
  factor?: number;

  /**
   * Add random jitter to delays
   */
  jitter?: boolean;

  /**
   * List of error types that are retryable
   */
  retryableErrors?: Array<new (...args: any[]) => Error>;

  /**
   * Callback invoked before each retry
   */
  onRetry?: (info: RetryInfo) => void | Promise<void>;
}

/**
 * Information about a retry attempt
 */
export interface RetryInfo {
  attempt: number;
  error: Error;
  delay: number;
  context?: RetryContext;
}

/**
 * Context information for retry operations
 */
export interface RetryContext {
  operationName?: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

/**
 * Error thrown when all retry attempts are exhausted
 */
export class RetryExhaustedError extends Error {
  constructor(
    message: string,
    public readonly lastError: Error,
    public readonly attempts: number
  ) {
    super(message);
    this.name = 'RetryExhaustedError';
  }
}