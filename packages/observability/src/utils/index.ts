import { SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getContext, injectContextToHeaders } from '../context';
import { getLogger } from '../logger';

// Generate correlation ID
export function generateCorrelationId(): string {
  return uuidv4();
}

// Generate causation ID from correlation ID
export function generateCausationId(correlationId: string): string {
  return `${correlationId}-${Date.now()}`;
}

// Sanitize sensitive data
export function sanitize(
  data: any,
  sensitiveKeys: string[] = ['password', 'token', 'apiKey', 'secret']
): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitize(item, sensitiveKeys));
  }

  const sanitized = { ...data };

  Object.keys(sanitized).forEach(key => {
    const lowerKey = key.toLowerCase();

    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitize(sanitized[key], sensitiveKeys);
    }
  });

  return sanitized;
}

// Format duration for logging
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  } else {
    return `${(ms / 60000).toFixed(2)}m`;
  }
}

// Create instrumented HTTP client
export function createInstrumentedHttpClient(config?: AxiosRequestConfig): AxiosInstance {
  const client = axios.create(config);
  const logger = getLogger();

  // Request interceptor
  client.interceptors.request.use(
    config => {
      const ctx = getContext();

      // Inject context headers
      if (ctx) {
        config.headers = {
          ...config.headers,
          ...injectContextToHeaders(ctx),
        } as any;
      }

      // Start span
      const span = trace
        .getTracer('@a4co/observability')
        .startSpan(`HTTP ${config.method?.toUpperCase()} ${config.url}`, {
          kind: SpanKind.CLIENT,
          attributes: {
            'http.method': config.method?.toUpperCase(),
            'http.url': config.url,
            'http.target': new URL(config.url || '', config.baseURL || 'http://localhost').pathname,
          },
        });

      // Attach span to config for response
      (config as any).__span = span;
      (config as any).__startTime = Date.now();

      logger.debug('HTTP request started', {
        method: config.method,
        url: config.url,
        headers: sanitize(config.headers),
      });

      return config;
    },
    error => {
      logger.error('HTTP request failed to start', { error });
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    response => {
      const span = (response.config as any).__span;
      const startTime = (response.config as any).__startTime;
      const duration = Date.now() - startTime;

      if (span) {
        span.setAttributes({
          'http.status_code': response.status,
          'http.response.size': JSON.stringify(response.data).length,
        });
        span.setStatus({ code: SpanStatusCode.OK });
        span.end();
      }

      logger.debug('HTTP request completed', {
        method: response.config.method,
        url: response.config.url,
        status: response.status,
        duration,
      });

      return response;
    },
    error => {
      const span = (error.config as any)?.__span;
      const startTime = (error.config as any)?.__startTime;
      const duration = startTime ? Date.now() - startTime : 0;

      if (span) {
        span.setAttributes({
          'http.status_code': error.response?.status || 0,
          error: true,
        });
        span.recordException(error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        span.end();
      }

      logger.error('HTTP request failed', {
        method: error.config?.method,
        url: error.config?.url,
        status: error.response?.status,
        duration,
        error: error.message,
      });

      return Promise.reject(error);
    }
  );

  return client;
}

// Retry with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, initialDelay = 1000, maxDelay = 30000, factor = 2, onRetry } = options;

  const logger = getLogger();
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        logger.error('All retry attempts failed', { error: lastError, attempts: attempt + 1 });
        throw lastError;
      }

      const delay = Math.min(initialDelay * Math.pow(factor, attempt), maxDelay);

      logger.warn('Operation failed, retrying', {
        error: lastError.message,
        attempt: attempt + 1,
        nextRetryIn: delay,
      });

      if (onRetry) {
        onRetry(lastError, attempt + 1);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Circuit breaker implementation
export class CircuitBreaker<T> {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private readonly fn: () => Promise<T>,
    private readonly options: {
      failureThreshold?: number;
      resetTimeout?: number;
      onStateChange?: (state: 'closed' | 'open' | 'half-open') => void;
    } = {}
  ) {}

  async execute(): Promise<T> {
    const { failureThreshold = 5, resetTimeout = 60000 } = this.options;
    const logger = getLogger();

    // Check if circuit should be reset
    if (this.state === 'open' && Date.now() - this.lastFailureTime > resetTimeout) {
      this.setState('half-open');
    }

    if (this.state === 'open') {
      logger.warn('Circuit breaker is open, rejecting request');
      throw new Error('Circuit breaker is open');
    }

    try {
      const result = await this.fn();

      if (this.state === 'half-open') {
        this.setState('closed');
        this.failures = 0;
      }

      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();

      if (this.failures >= failureThreshold) {
        this.setState('open');
      }

      logger.error('Circuit breaker execution failed', {
        error,
        failures: this.failures,
        state: this.state,
      });

      throw error;
    }
  }

  private setState(state: 'closed' | 'open' | 'half-open'): void {
    if (this.state !== state) {
      this.state = state;

      if (this.options.onStateChange) {
        this.options.onStateChange(state);
      }

      getLogger().info('Circuit breaker state changed', {
        previousState: this.state,
        newState: state,
      });
    }
  }
}

// Performance timer utility
export class PerformanceTimer {
  private startTime = Date.now();
  private marks = new Map<string, number>();

  mark(name: string): void {
    this.marks.set(name, Date.now());
  }

  measure(name: string, startMark?: string, endMark?: string): number {
    const start = startMark ? this.marks.get(startMark) : this.startTime;
    const end = endMark ? this.marks.get(endMark) : Date.now();

    if (!start || !end) {
      throw new Error('Invalid marks for measurement');
    }

    const duration = end - start;

    getLogger().debug('Performance measurement', {
      measurement: name,
      duration,
      startMark,
      endMark,
    });

    return duration;
  }

  reset(): void {
    this.startTime = Date.now();
    this.marks.clear();
  }
}

// Batch processor for aggregating operations
export class BatchProcessor<T, R> {
  private batch: T[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly processor: (items: T[]) => Promise<R[]>,
    private readonly options: {
      maxBatchSize?: number;
      flushInterval?: number;
      onError?: (error: Error, items: T[]) => void;
    } = {}
  ) {}

  async add(item: T): Promise<void> {
    const { maxBatchSize = 100, flushInterval = 1000 } = this.options;

    this.batch.push(item);

    if (this.batch.length >= maxBatchSize) {
      await this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), flushInterval);
    }
  }

  async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.batch.length === 0) {
      return;
    }

    const items = [...this.batch];
    this.batch = [];

    try {
      await this.processor(items);
    } catch (error) {
      getLogger().error('Batch processing failed', { error, batchSize: items.length });

      if (this.options.onError) {
        this.options.onError(error as Error, items);
      }
    }
  }
}
