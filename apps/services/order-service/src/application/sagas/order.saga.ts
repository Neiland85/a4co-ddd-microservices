import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderCommand } from '../commands/create-order.command.js';
import { IOrderRepository as OrderRepository } from '@a4co/domain-order';

export interface EventMessage<T = any> {
  data: T;
  eventType?: string;
}

export enum SagaState {
  STARTED = 'STARTED',
  STOCK_RESERVED = 'STOCK_RESERVED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
}

export interface SagaContext {
  orderId: string;
  state: SagaState;
  reservationId?: string;
  paymentIntentId?: string;
  error?: string;
  startedAt: Date;
  updatedAt: Date;
  processedEvents: Set<string>;
}

@Injectable()
export class OrderSaga implements OnModuleInit {
  private readonly logger = new Logger(OrderSaga.name);
  private readonly sagaContexts = new Map<string, SagaContext>();
  private readonly SAGA_TIMEOUT = 30_000; // 30s

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('NATS_CLIENT')
    private readonly natsClient: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // En Fase 1 los handlers llegan desde controllers / listeners externos
  }

  /* ------------------------------------------------------------------
   * Guards y helpers de hardening
   * ------------------------------------------------------------------ */

  private assertState(
    context: SagaContext,
    allowed: SagaState[],
    action: string,
  ): void {
    if (!allowed.includes(context.state)) {
      throw new Error(
        `Invalid saga transition on ${action}. Current=${context.state}, Allowed=${allowed.join(
          ', ',
        )}`,
      );
    }
  }

  private isFinalState(state: SagaState): boolean {
    return (
      state === SagaState.COMPLETED ||
      state === SagaState.COMPENSATED ||
      state === SagaState.FAILED
    );
  }

  private isDuplicateEvent(context: SagaContext, eventKey: string): boolean {
    if (context.processedEvents.has(eventKey)) {
      this.logger.warn(`🔁 Evento duplicado ignorado: ${eventKey}`);
      return true;
    }
    context.processedEvents.add(eventKey);
    return false;
  }

  /* ------------------------------------------------------------------
   * Ejecución principal
   * ------------------------------------------------------------------ */

  async execute(command: CreateOrderCommand): Promise<string> {
    const orderId = command.orderId;

    const sagaContext: SagaContext = {
      orderId,
      state: SagaState.STARTED,
      startedAt: new Date(),
      updatedAt: new Date(),
      processedEvents: new Set(),
    };

    this.sagaContexts.set(orderId, sagaContext);
    this.logger.log(`🚀 Iniciando Saga para orden ${orderId}`);

    try {
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      this.natsClient.emit('order.created.v1', {
        orderId,
        customerId: order.customerId,
        items: order.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        totalAmount: order.totalAmount,
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        const ctx = this.sagaContexts.get(orderId);
        if (ctx && !this.isFinalState(ctx.state)) {
          this.logger.error(`⏰ Timeout de Saga para orden ${orderId}`);
          this.compensate(orderId, 'Saga Timeout');
        }
      }, this.SAGA_TIMEOUT);

      return orderId;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Error iniciando saga ${orderId}`, msg);
      await this.compensate(orderId, msg);
      throw error;
    }
  }

  /* ------------------------------------------------------------------
   * Handlers de eventos
   * ------------------------------------------------------------------ */

  async handleInventoryReserved(event: EventMessage): Promise<void> {
    const { orderId, reservationId } = event.data;
    const context = this.sagaContexts.get(orderId);
    if (!context || this.isFinalState(context.state)) return;

    this.assertState(context, [SagaState.STARTED], 'handleInventoryReserved');

    if (this.isDuplicateEvent(context, `inventory.reserved:${reservationId}`)) return;

    context.state = SagaState.STOCK_RESERVED;
    context.reservationId = reservationId;
    context.updatedAt = new Date();

    this.natsClient.emit('payment.initiate', {
      orderId,
      amount: event.data.totalAmount,
      customerId: event.data.customerId,
      timestamp: new Date().toISOString(),
    });

    context.state = SagaState.PAYMENT_PENDING;
  }

  async handleInventoryOutOfStock(event: EventMessage): Promise<void> {
    const { orderId } = event.data;
    await this.compensate(orderId, 'Stock insuficiente');
  }

  async handlePaymentSucceeded(event: EventMessage): Promise<void> {
    const { orderId, paymentIntentId } = event.data;
    const context = this.sagaContexts.get(orderId);
    if (!context || this.isFinalState(context.state)) return;

    this.assertState(context, [SagaState.PAYMENT_PENDING], 'handlePaymentSucceeded');

    if (this.isDuplicateEvent(context, `payment.succeeded:${paymentIntentId}`)) return;

    const order = await this.orderRepository.findById(orderId);
    if (order) {
      order.confirmPayment();
      await this.orderRepository.save(order);
    }

    context.state = SagaState.COMPLETED;
    context.paymentIntentId = paymentIntentId;

    this.natsClient.emit('order.completed.v1', {
      orderId,
      paymentIntentId,
      status: 'COMPLETED',
    });

    this.sagaContexts.delete(orderId);
  }

  async handlePaymentFailed(event: EventMessage): Promise<void> {
    const { orderId, reason } = event.data;
    await this.compensate(orderId, `Pago fallido: ${reason}`);
  }

  /* ------------------------------------------------------------------
   * Compensación
   * ------------------------------------------------------------------ */

  private async compensate(orderId: string, reason: string): Promise<void> {
    const context = this.sagaContexts.get(orderId);
    if (!context || this.isFinalState(context.state)) return;

    context.state = SagaState.COMPENSATING;
    context.error = reason;

    try {
      if (context.reservationId) {
        this.natsClient.emit('inventory.release', {
          orderId,
          reservationId: context.reservationId,
          reason: 'Saga Compensation',
        });
      }

      if (context.paymentIntentId) {
        this.natsClient.emit('payment.refund', {
          orderId,
          paymentIntentId: context.paymentIntentId,
          reason: 'Saga Compensation',
        });
      }

      const order = await this.orderRepository.findById(orderId);
      if (order) {
        order.cancel(reason);
        await this.orderRepository.save(order);
      }

      this.natsClient.emit('order.cancelled.v1', { orderId, reason });

      context.state = SagaState.COMPENSATED;
    } catch (error) {
      context.state = SagaState.FAILED;
      context.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.sagaContexts.delete(orderId);
    }
  }
}
