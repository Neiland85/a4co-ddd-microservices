import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Gauge, Registry, register } from 'prom-client';

@Injectable()
export class OrderMetricsService {
  private readonly registry: Registry;

  // Saga metrics
  private sagaStartedCounter: Counter<string>;
  private sagaCompletedCounter: Counter<string>;
  private sagaFailedCounter: Counter<string>;
  private sagaCompensatedCounter: Counter<string>;
  private sagaDurationHistogram: Histogram<string>;

  // Business metrics
  private ordersCreatedCounter: Counter<string>;
  private orderValueHistogram: Histogram<string>;
  private activeOrdersGauge: Gauge<string>;

  constructor() {
    this.registry = register;
    this.initializeMetrics();
  }

  private initializeMetrics() {
    // Saga metrics
    this.sagaStartedCounter = new Counter({
      name: 'order_saga_started_total',
      help: 'Total number of order sagas started',
      labelNames: ['status'],
      registers: [this.registry],
    });

    this.sagaCompletedCounter = new Counter({
      name: 'order_saga_completed_total',
      help: 'Total number of order sagas completed successfully',
      registers: [this.registry],
    });

    this.sagaFailedCounter = new Counter({
      name: 'order_saga_failed_total',
      help: 'Total number of order sagas that failed',
      labelNames: ['reason'],
      registers: [this.registry],
    });

    this.sagaCompensatedCounter = new Counter({
      name: 'order_saga_compensated_total',
      help: 'Total number of order sagas that were compensated',
      labelNames: ['trigger'],
      registers: [this.registry],
    });

    this.sagaDurationHistogram = new Histogram({
      name: 'order_saga_duration_seconds',
      help: 'Duration of order saga execution',
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
      registers: [this.registry],
    });

    // Business metrics
    this.ordersCreatedCounter = new Counter({
      name: 'orders_created_total',
      help: 'Total number of orders created',
      labelNames: ['customer_type'],
      registers: [this.registry],
    });

    this.orderValueHistogram = new Histogram({
      name: 'order_value_dollars',
      help: 'Distribution of order values',
      buckets: [10, 50, 100, 250, 500, 1000, 5000],
      registers: [this.registry],
    });

    this.activeOrdersGauge = new Gauge({
      name: 'active_orders',
      help: 'Number of orders currently being processed',
      labelNames: ['status'],
      registers: [this.registry],
    });
  }

  // Methods to record metrics
  recordSagaStarted() {
    this.sagaStartedCounter.inc();
  }

  recordSagaCompleted(durationSeconds: number) {
    this.sagaCompletedCounter.inc();
    this.sagaDurationHistogram.observe(durationSeconds);
  }

  recordSagaFailed(reason: string) {
    this.sagaFailedCounter.labels(reason).inc();
  }

  recordSagaCompensated(trigger: string) {
    this.sagaCompensatedCounter.labels(trigger).inc();
  }

  recordOrderCreated(value: number, customerType: string = 'standard') {
    this.ordersCreatedCounter.labels(customerType).inc();
    this.orderValueHistogram.observe(value);
  }

  setActiveOrders(status: string, count: number) {
    this.activeOrdersGauge.labels(status).set(count);
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
