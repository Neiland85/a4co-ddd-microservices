/**
 * Circuit Breaker Pattern Implementation
 * Protege las llamadas síncronas entre microservicios
 */

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  successThreshold?: number;
  timeout?: number;
  resetTimeout?: number;
  fallbackFunction?: () => Promise<any>;
  onStateChange?: (oldState: CircuitState, newState: CircuitState) => void;
}

export interface CircuitBreakerMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  state: CircuitState;
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures = 0;
  private successes = 0;
  private lastFailTime?: Date;
  private nextAttempt?: Date;
  private metrics: CircuitBreakerMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    consecutiveFailures: 0,
    consecutiveSuccesses: 0,
    state: CircuitState.CLOSED,
  };

  constructor(
    private readonly name: string,
    private readonly options: CircuitBreakerOptions = {}
  ) {
    this.options = {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 3000,
      resetTimeout: 60000,
      ...options,
    };
  }

  /**
   * Ejecuta una función protegida por el circuit breaker
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.metrics.totalRequests++;

    if (this.state === CircuitState.OPEN) {
      if (!this.canAttemptReset()) {
        return this.handleOpenCircuit();
      }
      this.transitionTo(CircuitState.HALF_OPEN);
    }

    try {
      const result = await this.executeWithTimeout(fn);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Ejecuta la función con timeout
   */
  private async executeWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Circuit breaker timeout after ${this.options.timeout}ms`));
      }, this.options.timeout!);

      try {
        const result = await fn();
        clearTimeout(timer);
        resolve(result);
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  /**
   * Maneja el éxito de una llamada
   */
  private onSuccess(): void {
    this.failures = 0;
    this.successes++;
    this.metrics.successfulRequests++;
    this.metrics.consecutiveFailures = 0;
    this.metrics.consecutiveSuccesses++;
    this.metrics.lastSuccessTime = new Date();

    if (this.state === CircuitState.HALF_OPEN) {
      if (this.successes >= this.options.successThreshold!) {
        this.transitionTo(CircuitState.CLOSED);
      }
    }
  }

  /**
   * Maneja el fallo de una llamada
   */
  private onFailure(): void {
    this.failures++;
    this.successes = 0;
    this.lastFailTime = new Date();
    this.metrics.failedRequests++;
    this.metrics.consecutiveSuccesses = 0;
    this.metrics.consecutiveFailures++;
    this.metrics.lastFailureTime = new Date();

    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionTo(CircuitState.OPEN);
    } else if (this.failures >= this.options.failureThreshold!) {
      this.transitionTo(CircuitState.OPEN);
    }
  }

  /**
   * Verifica si se puede intentar resetear el circuito
   */
  private canAttemptReset(): boolean {
    if (!this.nextAttempt) {
      return true;
    }
    return new Date() >= this.nextAttempt;
  }

  /**
   * Maneja la situación cuando el circuito está abierto
   */
  private async handleOpenCircuit(): Promise<any> {
    if (this.options.fallbackFunction) {
      return this.options.fallbackFunction();
    }
    throw new Error(`Circuit breaker '${this.name}' is OPEN`);
  }

  /**
   * Transiciona entre estados
   */
  private transitionTo(newState: CircuitState): void {
    const oldState = this.state;
    this.state = newState;
    this.metrics.state = newState;

    if (newState === CircuitState.OPEN) {
      this.nextAttempt = new Date(Date.now() + this.options.resetTimeout!);
    }

    if (this.options.onStateChange) {
      this.options.onStateChange(oldState, newState);
    }

    console.log(`Circuit breaker '${this.name}' transitioned from ${oldState} to ${newState}`);
  }

  /**
   * Obtiene el estado actual del circuit breaker
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Obtiene las métricas del circuit breaker
   */
  getMetrics(): CircuitBreakerMetrics {
    return { ...this.metrics };
  }

  /**
   * Resetea el circuit breaker
   */
  reset(): void {
    this.failures = 0;
    this.successes = 0;
    this.lastFailTime = undefined;
    this.nextAttempt = undefined;
    this.transitionTo(CircuitState.CLOSED);
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      state: CircuitState.CLOSED,
    };
  }
}

/**
 * Factory para crear circuit breakers
 */
export class CircuitBreakerFactory {
  private static breakers = new Map<string, CircuitBreaker>();

  static create(name: string, options?: CircuitBreakerOptions): CircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, new CircuitBreaker(name, options));
    }
    return this.breakers.get(name)!;
  }

  static get(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  static getAll(): Map<string, CircuitBreaker> {
    return new Map(this.breakers);
  }

  static reset(name: string): void {
    const breaker = this.breakers.get(name);
    if (breaker) {
      breaker.reset();
    }
  }

  static resetAll(): void {
    this.breakers.forEach(breaker => breaker.reset());
  }
}

/**
 * Decorator para aplicar circuit breaker a métodos
 */
export function WithCircuitBreaker(name: string, options?: CircuitBreakerOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const breaker = CircuitBreakerFactory.create(name, options);

    descriptor.value = async function (...args: any[]) {
      return breaker.execute(() => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}