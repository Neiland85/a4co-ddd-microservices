import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { EventEmitter } from 'events';

/**
 * Configuración de seguridad para Axios con protección contra DoS
 */
export interface AxiosSecurityConfig {
  // Límites de tamaño
  maxContentLength?: number; // bytes (default: 10MB)
  maxBodyLength?: number; // bytes (default: 10MB)
  maxResponseSize?: number; // bytes (default: 50MB)

  // Timeouts
  timeout?: number; // ms (default: 30000)
  connectTimeout?: number; // ms (default: 10000)

  // Circuit breaker
  circuitBreakerEnabled?: boolean;
  failureThreshold?: number; // número de fallos antes de abrir (default: 5)
  recoveryTimeout?: number; // ms para intentar recuperación (default: 60000)
  monitoringWindow?: number; // ms para contar fallos (default: 60000)

  // Rate limiting
  rateLimitEnabled?: boolean;
  maxRequestsPerMinute?: number;

  // Retry logic
  retryEnabled?: boolean;
  maxRetries?: number;
  retryDelay?: number;

  // Memory monitoring
  memoryMonitoringEnabled?: boolean;
  memoryThreshold?: number; // porcentaje (default: 80)
}

/**
 * Estados del circuit breaker
 */
export enum CircuitState {
  CLOSED = 'CLOSED', // Normal operation
  OPEN = 'OPEN', // Circuit is open, failing fast
  HALF_OPEN = 'HALF_OPEN', // Testing if service recovered
}

/**
 * Circuit Breaker para protección contra cascadas de fallos
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures = 0;
  private lastFailureTime = 0;
  private successCount = 0;

  constructor(
    private config: {
      failureThreshold: number;
      recoveryTimeout: number;
      monitoringWindow: number;
      successThreshold?: number;
    }
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.config.recoveryTimeout) {
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= (this.config.successThreshold || 3)) {
        this.state = CircuitState.CLOSED;
      }
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    // Reset failure count if outside monitoring window
    if (Date.now() - this.lastFailureTime > this.config.monitoringWindow) {
      this.failures = 1;
    }

    if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getStats() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
      successCount: this.successCount,
    };
  }
}

/**
 * Rate limiter simple basado en token bucket
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {
    this.tokens = maxRequests;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = Math.floor((timePassed / this.windowMs) * this.maxRequests);

    this.tokens = Math.min(this.maxRequests, this.tokens + tokensToAdd);
    this.lastRefill = now;

    if (this.tokens <= 0) {
      throw new Error('Rate limit exceeded');
    }

    this.tokens--;
  }
}

/**
 * Monitor de memoria para detectar leaks y uso excesivo
 */
export class MemoryMonitor {
  private eventEmitter = new EventEmitter();
  private intervalId?: NodeJS.Timeout;
  private lastMemoryUsage = process.memoryUsage();

  constructor(private thresholdPercent: number = 80) {}

  start(intervalMs: number = 30000): void {
    this.intervalId = setInterval(() => {
      this.checkMemoryUsage();
    }, intervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private checkMemoryUsage(): void {
    const memUsage = process.memoryUsage();
    const rssMB = memUsage.rss / 1024 / 1024;
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    const heapTotalMB = memUsage.heapTotal / 1024 / 1024;

    const heapUsagePercent = (heapUsedMB / heapTotalMB) * 100;

    if (heapUsagePercent > this.thresholdPercent) {
      this.eventEmitter.emit('memoryThresholdExceeded', {
        rss: rssMB,
        heapUsed: heapUsedMB,
        heapTotal: heapTotalMB,
        usagePercent: heapUsagePercent,
        threshold: this.thresholdPercent,
      });
    }

    // Detectar leaks (aumento significativo)
    const rssIncrease = memUsage.rss - this.lastMemoryUsage.rss;
    if (rssIncrease > 50 * 1024 * 1024) {
      // 50MB increase
      this.eventEmitter.emit('memoryLeakDetected', {
        increaseMB: rssIncrease / 1024 / 1024,
        currentRSS: rssMB,
      });
    }

    this.lastMemoryUsage = memUsage;
  }

  on(event: 'memoryThresholdExceeded' | 'memoryLeakDetected', listener: (data: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  getCurrentUsage() {
    const memUsage = process.memoryUsage();
    return {
      rss: memUsage.rss / 1024 / 1024,
      heapUsed: memUsage.heapUsed / 1024 / 1024,
      heapTotal: memUsage.heapTotal / 1024 / 1024,
      external: memUsage.external / 1024 / 1024,
    };
  }
}

/**
 * Cliente HTTP seguro con todas las mitigaciones contra DoS
 */
export class SecureAxiosClient {
  private axiosInstance: AxiosInstance;
  private circuitBreaker: CircuitBreaker;
  private rateLimiter?: RateLimiter;
  private memoryMonitor: MemoryMonitor;
  private config: Required<AxiosSecurityConfig>;

  constructor(baseURL: string, securityConfig: AxiosSecurityConfig = {}) {
    this.config = {
      maxContentLength: 10 * 1024 * 1024, // 10MB
      maxBodyLength: 10 * 1024 * 1024, // 10MB
      maxResponseSize: 50 * 1024 * 1024, // 50MB
      timeout: 30000, // 30s
      connectTimeout: 10000, // 10s
      circuitBreakerEnabled: true,
      failureThreshold: 5,
      recoveryTimeout: 60000, // 1min
      monitoringWindow: 60000, // 1min
      rateLimitEnabled: false,
      maxRequestsPerMinute: 60,
      retryEnabled: true,
      maxRetries: 3,
      retryDelay: 1000,
      memoryMonitoringEnabled: true,
      memoryThreshold: 80,
      ...securityConfig,
    };

    // Initialize components
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: this.config.failureThreshold,
      recoveryTimeout: this.config.recoveryTimeout,
      monitoringWindow: this.config.monitoringWindow,
    });

    if (this.config.rateLimitEnabled) {
      this.rateLimiter = new RateLimiter(
        this.config.maxRequestsPerMinute,
        60000 // 1 minute window
      );
    }

    this.memoryMonitor = new MemoryMonitor(this.config.memoryThreshold);

    // Create axios instance with security config
    this.axiosInstance = axios.create({
      baseURL,
      timeout: this.config.timeout,
      maxContentLength: this.config.maxContentLength,
      maxBodyLength: this.config.maxBodyLength,
      transitional: {
        clarifyTimeoutError: true,
      },
      // Additional security headers
      headers: {
        'User-Agent': 'SecureAxiosClient/1.0',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });

    this.setupInterceptors();
    this.setupMemoryMonitoring();
  }

  /**
   * Configurar interceptores para seguridad adicional
   */
  private setupInterceptors(): void {
    // Request interceptor - size validation
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Validate request body size
        if (config.data) {
          const dataSize = this.calculateDataSize(config.data);
          if (dataSize > this.config.maxBodyLength) {
            throw new Error(
              `Request body too large: ${dataSize} bytes (max: ${this.config.maxBodyLength})`
            );
          }
        }

        // Add security headers
        if (config.headers) {
          (config.headers as any)['X-Request-Size'] = config.data
            ? this.calculateDataSize(config.data)
            : 0;
        } else {
          config.headers = {
            'X-Request-Size': config.data ? this.calculateDataSize(config.data) : 0,
          } as any;
        }

        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor - size validation and circuit breaker
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Validate response size
        const responseSize = this.calculateResponseSize(response);
        if (responseSize > this.config.maxResponseSize) {
          throw new Error(
            `Response too large: ${responseSize} bytes (max: ${this.config.maxResponseSize})`
          );
        }

        // Add response metadata
        (response as any).metadata = {
          size: responseSize,
          timestamp: Date.now(),
        };

        return response;
      },
      async (error: AxiosError) => {
        // Circuit breaker logic
        if (this.config.circuitBreakerEnabled) {
          try {
            return await this.circuitBreaker.execute(() => {
              throw error; // Re-throw to maintain error chain
            });
          } catch (circuitError) {
            // Circuit is open, return fast failure
            throw new Error(`Circuit breaker open: ${error.message}`);
          }
        }

        // Retry logic for network errors
        if (this.shouldRetry(error) && this.config.retryEnabled) {
          return this.retryRequest(error.config as InternalAxiosRequestConfig);
        }

        throw error;
      }
    );
  }

  /**
   * Configurar monitoreo de memoria
   */
  private setupMemoryMonitoring(): void {
    if (this.config.memoryMonitoringEnabled) {
      this.memoryMonitor.start();

      this.memoryMonitor.on('memoryThresholdExceeded', data => {
        console.warn('🚨 Memory threshold exceeded:', data);
        // Could implement emergency measures here
      });

      this.memoryMonitor.on('memoryLeakDetected', data => {
        console.error('💥 Memory leak detected:', data);
        // Could trigger alerts or graceful shutdown
      });
    }
  }

  /**
   * Determinar si una petición debe reintentarse
   */
  private shouldRetry(error: AxiosError): boolean {
    if (!error.config || !this.config.retryEnabled) return false;

    // Retry on network errors, 5xx, timeouts
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    const isRetryableStatus = error.response?.status
      ? retryableStatuses.includes(error.response.status)
      : false;
    const isNetworkError = !error.response && error.code !== 'ECONNABORTED';

    return isRetryableStatus || isNetworkError;
  }

  /**
   * Reintentar petición con backoff exponencial
   */
  private async retryRequest(
    config: InternalAxiosRequestConfig,
    attempt: number = 1
  ): Promise<AxiosResponse> {
    if (attempt > this.config.maxRetries) {
      throw new Error(`Max retries exceeded (${this.config.maxRetries})`);
    }

    const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
    await new Promise(resolve => setTimeout(resolve, delay));

    return this.axiosInstance.request(config);
  }

  /**
   * Calcular tamaño de datos de petición
   */
  private calculateDataSize(data: any): number {
    if (!data) return 0;

    if (typeof data === 'string') return Buffer.byteLength(data, 'utf8');
    if (Buffer.isBuffer(data)) return data.length;
    if (data instanceof ArrayBuffer) return data.byteLength;

    try {
      return Buffer.byteLength(JSON.stringify(data), 'utf8');
    } catch {
      return 0;
    }
  }

  /**
   * Calcular tamaño de respuesta
   */
  private calculateResponseSize(response: AxiosResponse): number {
    let size = 0;

    // Headers size
    Object.entries(response.headers).forEach(([key, value]) => {
      size += Buffer.byteLength(`${key}: ${value}`, 'utf8');
    });

    // Body size
    if (response.data) {
      size += this.calculateDataSize(response.data);
    }

    return size;
  }

  /**
   * Métodos públicos que delegan a axios con seguridad
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.executeWithSecurity(() => this.axiosInstance.get<T>(url, config));
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.executeWithSecurity(() => this.axiosInstance.post<T>(url, data, config));
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.executeWithSecurity(() => this.axiosInstance.put<T>(url, data, config));
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.executeWithSecurity(() => this.axiosInstance.delete<T>(url, config));
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.executeWithSecurity(() => this.axiosInstance.patch<T>(url, data, config));
  }

  /**
   * Ejecutar petición con todas las medidas de seguridad
   */
  private async executeWithSecurity<T>(operation: () => Promise<T>): Promise<T> {
    // Rate limiting
    if (this.rateLimiter) {
      await this.rateLimiter.acquire();
    }

    // Circuit breaker
    if (this.config.circuitBreakerEnabled) {
      return this.circuitBreaker.execute(operation);
    }

    return operation();
  }

  /**
   * Obtener estadísticas de seguridad
   */
  getSecurityStats() {
    return {
      circuitBreaker: this.circuitBreaker.getStats(),
      memoryUsage: this.memoryMonitor.getCurrentUsage(),
      config: this.config,
    };
  }

  /**
   * Limpiar recursos
   */
  destroy(): void {
    this.memoryMonitor.stop();
  }
}

/**
 * Factory para crear clientes axios seguros
 */
export class SecureAxiosFactory {
  static createClient(baseURL: string, config?: AxiosSecurityConfig): SecureAxiosClient {
    return new SecureAxiosClient(baseURL, config);
  }

  static createDefaultConfig(): AxiosSecurityConfig {
    return {
      maxContentLength: 10 * 1024 * 1024, // 10MB
      maxBodyLength: 10 * 1024 * 1024, // 10MB
      maxResponseSize: 50 * 1024 * 1024, // 50MB
      timeout: 30000,
      connectTimeout: 10000,
      circuitBreakerEnabled: true,
      failureThreshold: 5,
      recoveryTimeout: 60000,
      monitoringWindow: 60000,
      rateLimitEnabled: false,
      maxRequestsPerMinute: 60,
      retryEnabled: true,
      maxRetries: 3,
      retryDelay: 1000,
      memoryMonitoringEnabled: true,
      memoryThreshold: 80,
    };
  }
}

// Exportar singleton para uso global
export const secureAxiosFactory = SecureAxiosFactory;
