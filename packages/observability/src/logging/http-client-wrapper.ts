/**
 * HTTP client wrapper with automatic logging and tracing
 */

import { Logger } from './types';
import { v4 as uuidv4 } from 'uuid';

export interface RequestConfig extends RequestInit {
  traceId?: string;
  spanId?: string;
  logger?: Logger;
}

export interface FetchWrapperConfig {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  logger: Logger;
  propagateTrace?: boolean;
}

/**
 * Enhanced fetch wrapper with logging and tracing
 */
export class FetchWrapper {
  private config: FetchWrapperConfig;

  constructor(config: FetchWrapperConfig) {
    this.config = config;
  }

  private generateTraceHeaders(traceId?: string, spanId?: string): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (this.config.propagateTrace) {
      headers['X-Trace-Id'] = traceId || uuidv4();
      headers['X-Span-Id'] = spanId || uuidv4();
      headers['X-Parent-Span-Id'] = spanId || '';
    }
    
    return headers;
  }

  private getFullUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    return this.config.baseURL ? `${this.config.baseURL}${url}` : url;
  }

  async request(url: string, config?: RequestConfig): Promise<Response> {
    const fullUrl = this.getFullUrl(url);
    const traceId = config?.traceId || uuidv4();
    const spanId = config?.spanId || uuidv4();
    const logger = config?.logger || this.config.logger;
    
    const startTime = Date.now();

    const headers = {
      ...this.config.defaultHeaders,
      ...config?.headers,
      ...this.generateTraceHeaders(traceId, spanId),
    };

    logger.info('HTTP request started', {
      traceId,
      spanId,
      http: {
        method: config?.method || 'GET',
        url: fullUrl,
      },
      custom: {
        hasBody: !!config?.body,
      },
    });

    try {
      const response = await fetch(fullUrl, {
        ...config,
        headers,
      });

      const duration = Date.now() - startTime;

      logger.info('HTTP request completed', {
        traceId,
        spanId,
        http: {
          method: config?.method || 'GET',
          url: fullUrl,
          statusCode: response.status,
          duration,
        },
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error('HTTP request failed', error, {
        traceId,
        spanId,
        http: {
          method: config?.method || 'GET',
          url: fullUrl,
          duration,
        },
      });

      throw error;
    }
  }

  async get(url: string, config?: RequestConfig): Promise<Response> {
    return this.request(url, { ...config, method: 'GET' });
  }

  async post(url: string, body?: any, config?: RequestConfig): Promise<Response> {
    return this.request(url, {
      ...config,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
  }

  async put(url: string, body?: any, config?: RequestConfig): Promise<Response> {
    return this.request(url, {
      ...config,
      method: 'PUT',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
  }

  async patch(url: string, body?: any, config?: RequestConfig): Promise<Response> {
    return this.request(url, {
      ...config,
      method: 'PATCH',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
  }

  async delete(url: string, config?: RequestConfig): Promise<Response> {
    return this.request(url, { ...config, method: 'DELETE' });
  }
}

/**
 * Factory function to create a fetch wrapper instance
 */
export function createFetchWrapper(config: FetchWrapperConfig): FetchWrapper {
  return new FetchWrapper(config);
}

/**
 * Axios-like interceptor for the fetch wrapper
 */
export interface Interceptor<T = any> {
  onFulfilled?: (value: T) => T | Promise<T>;
  onRejected?: (error: any) => any;
}

export class InterceptorManager<T = any> {
  private handlers: Array<Interceptor<T> | null> = [];

  use(onFulfilled?: (value: T) => T | Promise<T>, onRejected?: (error: any) => any): number {
    this.handlers.push({
      onFulfilled,
      onRejected,
    });
    return this.handlers.length - 1;
  }

  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  forEach(fn: (handler: Interceptor<T>) => void): void {
    this.handlers.forEach((handler) => {
      if (handler !== null) {
        fn(handler);
      }
    });
  }
}

/**
 * Enhanced fetch wrapper with interceptors
 */
export class FetchWrapperWithInterceptors extends FetchWrapper {
  interceptors = {
    request: new InterceptorManager<RequestConfig>(),
    response: new InterceptorManager<Response>(),
  };

  async request(url: string, config?: RequestConfig): Promise<Response> {
    let finalConfig = config || {};

    // Apply request interceptors
    const requestInterceptorChain: Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>> = [];
    this.interceptors.request.forEach((interceptor) => {
      if (interceptor.onFulfilled) {
        requestInterceptorChain.push(interceptor.onFulfilled);
      }
    });

    for (const interceptor of requestInterceptorChain) {
      try {
        finalConfig = await interceptor(finalConfig);
      } catch (error) {
        throw error;
      }
    }

    try {
      let response = await super.request(url, finalConfig);

      // Apply response interceptors
      const responseInterceptorChain: Array<(response: Response) => Response | Promise<Response>> = [];
      this.interceptors.response.forEach((interceptor) => {
        if (interceptor.onFulfilled) {
          responseInterceptorChain.push(interceptor.onFulfilled);
        }
      });

      for (const interceptor of responseInterceptorChain) {
        response = await interceptor(response);
      }

      return response;
    } catch (error) {
      // Apply error interceptors
      let finalError = error;
      this.interceptors.response.forEach((interceptor) => {
        if (interceptor.onRejected) {
          finalError = interceptor.onRejected(finalError);
        }
      });

      throw finalError;
    }
  }
}