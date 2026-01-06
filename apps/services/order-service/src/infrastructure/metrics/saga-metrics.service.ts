import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Gauge, register } from 'prom-client';

/**
 * Servicio de métricas para el Saga Orchestrator
 * Expone métricas de Prometheus para monitoreo
 */
@Injectable()
export class SagaMetricsService {
  // Counters
  private readonly sagaStartedCounter: Counter;
  private readonly sagaSuccessCounter: Counter;
  private readonly sagaFailureCounter: Counter;
  private readonly sagaCompensationCounter: Counter;
  private readonly sagaCompensationSuccessCounter: Counter;
  private readonly sagaErrorsCounter: Counter;

  // Histograms
  private readonly sagaDurationHistogram: Histogram;

  // Gauges
  private readonly activeSagasGauge: Gauge;
  private readonly orderStatusGauge: Gauge;

  constructor() {
    // Initialize metrics
    this.sagaStartedCounter = new Counter({
      name: 'saga_started_total',
      help: 'Total number of sagas started',
      labelNames: ['order_type'],
    });

    this.sagaSuccessCounter = new Counter({
      name: 'saga_success_total',
      help: 'Total number of successful sagas',
      labelNames: ['order_type'],
    });

    this.sagaFailureCounter = new Counter({
      name: 'saga_failure_total',
      help: 'Total number of failed sagas',
      labelNames: ['failure_stage'],
    });

    this.sagaCompensationCounter = new Counter({
      name: 'saga_compensation_total',
      help: 'Total number of saga compensations',
      labelNames: ['reason'],
    });

    this.sagaCompensationSuccessCounter = new Counter({
      name: 'saga_compensation_success_total',
      help: 'Total number of successful compensations',
    });

    this.sagaErrorsCounter = new Counter({
      name: 'saga_errors_total',
      help: 'Total number of saga errors',
      labelNames: ['error_type'],
    });

    this.sagaDurationHistogram = new Histogram({
      name: 'saga_duration_seconds',
      help: 'Duration of saga execution in seconds',
      labelNames: ['status'],
      buckets: [0.1, 0.5, 1, 2, 3, 5, 10, 30],
    });

    this.activeSagasGauge = new Gauge({
      name: 'saga_active_count',
      help: 'Number of currently active sagas',
    });

    this.orderStatusGauge = new Gauge({
      name: 'order_status_count',
      help: 'Number of orders by status',
      labelNames: ['status'],
    });

    register.registerMetric(this.sagaStartedCounter);
    register.registerMetric(this.sagaSuccessCounter);
    register.registerMetric(this.sagaFailureCounter);
    register.registerMetric(this.sagaCompensationCounter);
    register.registerMetric(this.sagaCompensationSuccessCounter);
    register.registerMetric(this.sagaErrorsCounter);
    register.registerMetric(this.sagaDurationHistogram);
    register.registerMetric(this.activeSagasGauge);
    register.registerMetric(this.orderStatusGauge);
  }

  /**
   * Incrementa el contador de sagas iniciadas
   */
  incrementSagaStarted(orderType = 'standard'): void {
    this.sagaStartedCounter.inc({ order_type: orderType });
    this.activeSagasGauge.inc();
  }

  /**
   * Incrementa el contador de sagas exitosas
   */
  incrementSagaSuccess(orderType = 'standard', durationSeconds: number): void {
    this.sagaSuccessCounter.inc({ order_type: orderType });
    this.sagaDurationHistogram.observe({ status: 'success' }, durationSeconds);
    this.activeSagasGauge.dec();
  }

  /**
   * Incrementa el contador de sagas fallidas
   */
  incrementSagaFailure(failureStage: string, durationSeconds: number): void {
    this.sagaFailureCounter.inc({ failure_stage: failureStage });
    this.sagaDurationHistogram.observe({ status: 'failure' }, durationSeconds);
    this.activeSagasGauge.dec();
  }

  /**
   * Incrementa el contador de compensaciones
   */
  incrementSagaCompensation(reason: string): void {
    this.sagaCompensationCounter.inc({ reason });
  }

  /**
   * Incrementa el contador de compensaciones exitosas
   */
  incrementSagaCompensationSuccess(): void {
    this.sagaCompensationSuccessCounter.inc();
  }

  /**
   * Incrementa el contador de errores
   */
  incrementSagaError(errorType: string): void {
    this.sagaErrorsCounter.inc({ error_type: errorType });
  }

  /**
   * Actualiza el gauge de órdenes por estado
   */
  setOrderStatusCount(status: string, count: number): void {
    this.orderStatusGauge.set({ status }, count);
  }

  /**
   * Obtiene las métricas en formato Prometheus
   */
  async getMetrics(): Promise<string> {
    return register.metrics();
  }

  /**
   * Obtiene el registro de métricas
   */
  getRegister() {
    return register;
  }

  /**
   * Calcula la tasa de éxito de sagas
   * Note: This returns a placeholder as getting internal metric values
   * requires using the metrics() method which returns a promise
   */
  calculateSuccessRate(): number {
    // For real-time success rate calculation, we would need to use:
    // await this.sagaStartedCounter.get() and await this.sagaSuccessCounter.get()
    // For now, return 0 as a placeholder - actual metrics are exposed via /metrics endpoint
    return 0;
  }
}
