import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NatsEventBus } from "@a4co/shared-utils";
import { CreateOrderCommand } from "../commands/create-order.command";
import { OrderCreatedEvent, OrderCancelledEvent, OrderStatusChangedEvent } from "../../domain/events";
import { OrderStatus } from "../../domain/aggregates/order.aggregate";
import { OrderRepository } from "../../domain/repositories/order.repository";

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
}

@Injectable()
export class OrderSaga {
  private readonly logger = new Logger(OrderSaga.name);
  private readonly sagaContexts = new Map<string, SagaContext>();
  private readonly SAGA_TIMEOUT = 30000; // 30 segundos

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('NATS_CLIENT')
    private readonly natsClient: ClientProxy,
  ) {
    this.setupEventHandlers();
  }

  async execute(command: CreateOrderCommand): Promise<string> {
    const orderId = command.orderId || this.generateOrderId();
    const sagaContext: SagaContext = {
      orderId,
      state: SagaState.STARTED,
      startedAt: new Date(),
      updatedAt: new Date(),
    };

    this.sagaContexts.set(orderId, sagaContext);
    this.logger.log(`🚀 Iniciando Saga para orden ${orderId}`);

    try {
      // 1. Crear orden
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      // 2. Publicar evento OrderCreated para que Inventory reserve stock
      await this.publishEvent('order.created', {
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

      // 3. Configurar timeout
      this.setupTimeout(orderId);

      this.logger.log(`✅ Saga iniciada para orden ${orderId}`);
      return orderId;
    } catch (error) {
      this.logger.error(`❌ Error iniciando saga para orden ${orderId}:`, error);
      await this.compensate(orderId, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  private async handleInventoryReserved(event: EventMessage): Promise<void> {
    const { orderId, reservationId } = event.data;
    const context = this.sagaContexts.get(orderId);

    if (!context) {
      this.logger.warn(`⚠️  Contexto de saga no encontrado para orden ${orderId}`);
      return;
    }

    if (context.state !== SagaState.STARTED) {
      this.logger.warn(`⚠️  Estado inválido para InventoryReserved: ${context.state}`);
      return;
    }

    context.state = SagaState.STOCK_RESERVED;
    context.reservationId = reservationId;
    context.updatedAt = new Date();
    this.logger.log(`📦 Stock reservado para orden ${orderId}, reservationId: ${reservationId}`);

    // Publicar evento para que Payment Service procese el pago
    await this.publishEvent('payment.initiate', {
      orderId,
      amount: event.data.totalAmount,
      customerId: event.data.customerId,
      timestamp: new Date().toISOString(),
    });

    context.state = SagaState.PAYMENT_PENDING;
    context.updatedAt = new Date();
  }

  private async handleInventoryOutOfStock(event: EventMessage): Promise<void> {
    const { orderId } = event.data;
    this.logger.error(`❌ Stock insuficiente para orden ${orderId}`);
    await this.compensate(orderId, 'Stock insuficiente');
  }

  private async handlePaymentSucceeded(event: EventMessage): Promise<void> {
    const { orderId, paymentIntentId } = event.data;
    const context = this.sagaContexts.get(orderId);

    if (!context) {
      this.logger.warn(`⚠️  Contexto de saga no encontrado para orden ${orderId}`);
      return;
    }

    if (context.state !== SagaState.PAYMENT_PENDING) {
      this.logger.warn(`⚠️  Estado inválido para PaymentSucceeded: ${context.state}`);
      return;
    }

    try {
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      order.confirmPayment();
      await this.orderRepository.save(order);

      context.state = SagaState.COMPLETED;
      context.paymentIntentId = paymentIntentId;
      context.updatedAt = new Date();

      this.logger.log(`✅ Pago confirmado para orden ${orderId}`);

      // Publicar evento de orden completada
      await this.publishEvent('order.completed', {
        orderId,
        paymentIntentId,
        timestamp: new Date().toISOString(),
      });

      // Limpiar contexto después de un tiempo
      setTimeout(() => this.sagaContexts.delete(orderId), 60000);
    } catch (error) {
      this.logger.error(`❌ Error procesando pago exitoso para orden ${orderId}:`, error);
      await this.compensate(orderId, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async handlePaymentFailed(event: EventMessage): Promise<void> {
    const { orderId, reason } = event.data;
    this.logger.error(`❌ Pago fallido para orden ${orderId}: ${reason}`);
    await this.compensate(orderId, `Pago fallido: ${reason}`);
  }

  private async compensate(orderId: string, reason: string): Promise<void> {
    const context = this.sagaContexts.get(orderId);
    if (!context) {
      this.logger.warn(`⚠️  Contexto de saga no encontrado para compensación de orden ${orderId}`);
      return;
    }

    if (context.state === SagaState.COMPENSATING || context.state === SagaState.COMPENSATED) {
      this.logger.warn(`⚠️  Compensación ya en proceso o completada para orden ${orderId}`);
      return;
    }

    context.state = SagaState.COMPENSATING;
    context.error = reason;
    context.updatedAt = new Date();

    this.logger.log(`🔄 Iniciando compensación para orden ${orderId}: ${reason}`);

    try {
      // 1. Liberar reserva de stock si existe
      if (context.reservationId) {
        await this.publishEvent('inventory.release', {
          orderId,
          reservationId: context.reservationId,
          reason: 'Compensación de saga',
          timestamp: new Date().toISOString(),
        });
        this.logger.log(`📦 Liberando reserva ${context.reservationId} para orden ${orderId}`);
      }

      // 2. Cancelar pago si existe
      if (context.paymentIntentId) {
        await this.publishEvent('payment.cancel', {
          orderId,
          paymentIntentId: context.paymentIntentId,
          reason: 'Compensación de saga',
          timestamp: new Date().toISOString(),
        });
        this.logger.log(`💳 Cancelando pago ${context.paymentIntentId} para orden ${orderId}`);
      }

      // 3. Actualizar estado de orden
      const order = await this.orderRepository.findById(orderId);
      if (order) {
        order.cancel(reason);
        await this.orderRepository.save(order);
      }

      // 4. Publicar evento de orden cancelada
      await this.publishEvent('order.cancelled', {
        orderId,
        reason,
        timestamp: new Date().toISOString(),
      });

      context.state = SagaState.COMPENSATED;
      context.updatedAt = new Date();

      this.logger.log(`✅ Compensación completada para orden ${orderId}`);

      // Limpiar contexto después de un tiempo
      setTimeout(() => this.sagaContexts.delete(orderId), 60000);
    } catch (error) {
      this.logger.error(`❌ Error en compensación para orden ${orderId}:`, error);
      context.state = SagaState.FAILED;
      context.error = `Compensación falló: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private setupEventHandlers(): void {
    // Estos handlers se registrarán cuando NATS esté conectado
    // Por ahora usamos el patrón de suscripción de NestJS
    this.logger.log('📥 Configurando handlers de eventos de saga');
  }

  private setupTimeout(orderId: string): void {
    setTimeout(async () => {
      const context = this.sagaContexts.get(orderId);
      if (context && context.state !== SagaState.COMPLETED && context.state !== SagaState.COMPENSATED) {
        this.logger.warn(`⏱️  Timeout de saga para orden ${orderId}`);
        await this.compensate(orderId, 'Timeout de saga');
      }
    }, this.SAGA_TIMEOUT);
  }

  private async publishEvent(subject: string, data: any): Promise<void> {
    try {
      await this.natsClient.emit(subject, data).toPromise();
      this.logger.log(`📤 Evento publicado: ${subject}`);
    } catch (error) {
      this.logger.error(`❌ Error publicando evento ${subject}:`, error);
      throw error;
    }
  }

  private generateOrderId(): string {
    return `order-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  getSagaContext(orderId: string): SagaContext | undefined {
    return this.sagaContexts.get(orderId);
  }
}
