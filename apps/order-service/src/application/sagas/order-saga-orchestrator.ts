import { Injectable, Logger } from '@nestjs/common';
import { OrderCreatedEvent, OrderConfirmedEvent, OrderFailedEvent, OrderCancelledEvent } from '../../domain/events';

// Tipos para el Saga
export enum SagaStatus {
  STARTED = 'STARTED',
  INVENTORY_RESERVED = 'INVENTORY_RESERVED',
  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
  PAYMENT_SUCCEEDED = 'PAYMENT_SUCCEEDED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
}

export interface SagaState {
  sagaId: string;
  orderId: string;
  customerId: string;
  status: SagaStatus;
  reservationId?: string;
  paymentId?: string;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  compensationReason?: string;
}

export interface InventoryReservedEvent {
  orderId: string;
  reservationId: string;
  items: Array<{ productId: string; quantity: number }>;
  expiresAt: Date;
}

export interface InventoryOutOfStockEvent {
  orderId: string;
  unavailableItems: Array<{
    productId: string;
    requestedQuantity: number;
    availableQuantity: number;
  }>;
}

export interface PaymentSucceededEvent {
  orderId: string;
  paymentId: string;
  amount: { value: number; currency: string };
}

export interface PaymentFailedEvent {
  orderId: string;
  reason: string;
}

@Injectable()
export class OrderSagaOrchestrator {
  private readonly logger = new Logger(OrderSagaOrchestrator.name);
  private readonly sagas = new Map<string, SagaState>();
  private readonly SAGA_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos

  constructor(
    private readonly orderRepository: any,
    private readonly eventBus: any,
  ) {
    this.setupEventHandlers();
    this.startTimeoutChecker();
  }

  /**
   * Inicia una nueva saga para procesar una orden
   */
  async startOrderSaga(command: {
    orderId: string;
    customerId: string;
    items: Array<{ productId: string; quantity: number; price: number }>;
    totalAmount: number;
  }): Promise<void> {
    const sagaId = `saga-${command.orderId}`;
    
    this.logger.log(`🚀 Iniciando saga ${sagaId} para orden ${command.orderId}`);

    // Crear estado inicial de la saga
    const sagaState: SagaState = {
      sagaId,
      orderId: command.orderId,
      customerId: command.customerId,
      status: SagaStatus.STARTED,
      startedAt: new Date(),
    };

    this.sagas.set(sagaId, sagaState);

    try {
      // Paso 1: Crear la orden en estado PENDING
      await this.orderRepository.create({
        ...command,
        status: 'PENDING',
      });

      // Paso 2: Publicar evento OrderCreated para disparar reserva de inventario
      const event = new OrderCreatedEvent(
        command.orderId,
        command.customerId,
        command.items,
        command.totalAmount,
      );

      await this.eventBus.publish('orders.created', event.toJSON());
      
      this.logger.log(`✅ Evento orders.created publicado para orden ${command.orderId}`);
    } catch (error: unknown) {
      this.logger.error(`❌ Error iniciando saga ${sagaId}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      await this.handleSagaFailure(sagaId, 'inventory_check', message);
    } catch (error) {
      this.logger.error(`❌ Error iniciando saga ${sagaId}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.handleSagaFailure(sagaId, 'inventory_check', errorMessage);
    }
  }

  /**
   * Configura los handlers para los eventos del saga
   */
  private setupEventHandlers(): void {
    // Handler: Inventory Reserved
    this.eventBus.subscribe('inventory.reserved', async (event: InventoryReservedEvent) => {
      await this.handleInventoryReserved(event);
    });

    // Handler: Inventory Out of Stock
    this.eventBus.subscribe('inventory.out_of_stock', async (event: InventoryOutOfStockEvent) => {
      await this.handleInventoryOutOfStock(event);
    });

    // Handler: Payment Succeeded
    this.eventBus.subscribe('payments.succeeded', async (event: PaymentSucceededEvent) => {
      await this.handlePaymentSucceeded(event);
    });

    // Handler: Payment Failed
    this.eventBus.subscribe('payments.failed', async (event: PaymentFailedEvent) => {
      await this.handlePaymentFailed(event);
    });
  }

  /**
   * Handler: Inventario reservado exitosamente
   */
  private async handleInventoryReserved(event: InventoryReservedEvent): Promise<void> {
    const sagaId = `saga-${event.orderId}`;
    const saga = this.sagas.get(sagaId);

    if (!saga) {
      this.logger.warn(`Saga ${sagaId} no encontrada para evento inventory.reserved`);
      return;
    }

    this.logger.log(`📦 Inventario reservado para orden ${event.orderId}, reservationId: ${event.reservationId}`);

    // Actualizar estado de la saga
    saga.status = SagaStatus.INVENTORY_RESERVED;
    saga.reservationId = event.reservationId;

    // Actualizar orden en BD
    await this.orderRepository.updateStatus(event.orderId, 'INVENTORY_RESERVED');

    // Paso 3: Iniciar procesamiento de pago
    await this.eventBus.publish('payments.process_request', {
      orderId: event.orderId,
      customerId: saga.customerId,
      amount: await this.getOrderAmount(event.orderId),
    });

    saga.status = SagaStatus.PAYMENT_PROCESSING;
    this.logger.log(`💳 Iniciando procesamiento de pago para orden ${event.orderId}`);
  }

  /**
   * Handler: Inventario sin stock
   */
  private async handleInventoryOutOfStock(event: InventoryOutOfStockEvent): Promise<void> {
    const sagaId = `saga-${event.orderId}`;
    
    this.logger.warn(`⚠️ Stock insuficiente para orden ${event.orderId}`);
    
    const reason = `Productos sin stock: ${event.unavailableItems
      .map(i => `${i.productId} (solicitado: ${i.requestedQuantity}, disponible: ${i.availableQuantity})`)
      .join(', ')}`;

    await this.handleSagaFailure(sagaId, 'stock_reservation', reason);
  }

  /**
   * Handler: Pago exitoso
   */
  private async handlePaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    const sagaId = `saga-${event.orderId}`;
    const saga = this.sagas.get(sagaId);

    if (!saga) {
      this.logger.warn(`Saga ${sagaId} no encontrada para evento payments.succeeded`);
      return;
    }

    this.logger.log(`✅ Pago exitoso para orden ${event.orderId}, paymentId: ${event.paymentId}`);

    // Actualizar estado de la saga
    saga.status = SagaStatus.PAYMENT_SUCCEEDED;
    saga.paymentId = event.paymentId;

    // Actualizar orden a CONFIRMED
    await this.orderRepository.updateStatus(event.orderId, 'CONFIRMED');

    // Publicar evento OrderConfirmed
    const confirmedEvent = new OrderConfirmedEvent(
      event.orderId,
      saga.customerId,
      event.amount.value,
      await this.getOrderItems(event.orderId),
      event.paymentId,
    );

    await this.eventBus.publish('orders.confirmed', confirmedEvent.toJSON());

    // Completar saga
    saga.status = SagaStatus.COMPLETED;
    saga.completedAt = new Date();

    this.logger.log(`🎉 Saga ${sagaId} completada exitosamente`);
    
    // Limpiar saga después de un tiempo
    setTimeout(() => this.sagas.delete(sagaId), 60000); // 1 minuto
  }

  /**
   * Handler: Pago fallido
   */
  private async handlePaymentFailed(event: PaymentFailedEvent): Promise<void> {
    const sagaId = `saga-${event.orderId}`;
    const saga = this.sagas.get(sagaId);

    if (!saga) {
      this.logger.warn(`Saga ${sagaId} no encontrada para evento payments.failed`);
      return;
    }

    this.logger.error(`❌ Pago fallido para orden ${event.orderId}: ${event.reason}`);

    // Iniciar compensación
    await this.compensateSaga(saga, event.reason);
  }

  /**
   * Compensa una saga fallida (rollback)
   */
  private async compensateSaga(saga: SagaState, reason: string): Promise<void> {
    this.logger.warn(`🔄 Iniciando compensación para saga ${saga.sagaId}`);

    saga.status = SagaStatus.COMPENSATING;
    saga.compensationReason = reason;

    try {
      // Paso 1: Liberar reserva de inventario si existe
      if (saga.reservationId) {
        await this.eventBus.publish('inventory.release_request', {
          orderId: saga.orderId,
          reservationId: saga.reservationId,
          reason: 'payment_failed',
        });
        this.logger.log(`📦 Solicitud de liberación de inventario enviada para ${saga.orderId}`);
      }

      // Paso 2: Cancelar orden
      await this.orderRepository.updateStatus(saga.orderId, 'CANCELLED');

      // Paso 3: Publicar evento OrderCancelled
      const cancelledEvent = new OrderCancelledEvent(saga.orderId, reason);
      await this.eventBus.publish('orders.cancelled', cancelledEvent.toJSON());

      saga.status = SagaStatus.COMPENSATED;
      saga.completedAt = new Date();

      this.logger.log(`✅ Compensación completada para saga ${saga.sagaId}`);
    } catch (error: unknown) {
      this.logger.error(`❌ Error en compensación de saga ${saga.sagaId}:`, error);
      saga.error = error instanceof Error ? error.message : 'Unknown error';
    } catch (error) {
      this.logger.error(`❌ Error en compensación de saga ${saga.sagaId}:`, error);
      saga.error = error instanceof Error ? error.message : String(error);
    }
  }

  /**
   * Maneja fallos en la saga
   */
  private async handleSagaFailure(sagaId: string, stage: string, reason: string): Promise<void> {
    const saga = this.sagas.get(sagaId);

    if (!saga) {
      this.logger.error(`Saga ${sagaId} no encontrada al intentar manejar fallo`);
      return;
    }

    saga.status = SagaStatus.FAILED;
    saga.error = reason;
    saga.completedAt = new Date();

    // Actualizar orden
    await this.orderRepository.updateStatus(saga.orderId, 'FAILED');

    // Publicar evento OrderFailed
    const failedEvent = new OrderFailedEvent(
      saga.orderId,
      saga.customerId,
      reason,
      stage as any,
      saga.reservationId !== undefined, // compensationRequired
    );

    await this.eventBus.publish('orders.failed', failedEvent.toJSON());

    // Si hay reserva, compensar
    if (saga.reservationId) {
      await this.compensateSaga(saga, reason);
    }

    this.logger.error(`❌ Saga ${sagaId} falló en etapa ${stage}: ${reason}`);
  }

  /**
   * Checker de timeouts para sagas
   */
  private startTimeoutChecker(): void {
    setInterval(() => {
      const now = Date.now();

      for (const [sagaId, saga] of this.sagas.entries()) {
        const elapsed = now - saga.startedAt.getTime();

        if (elapsed > this.SAGA_TIMEOUT_MS && saga.status !== SagaStatus.COMPLETED && saga.status !== SagaStatus.COMPENSATED) {
          this.logger.warn(`⏱️ Saga ${sagaId} excedió timeout de ${this.SAGA_TIMEOUT_MS}ms`);
          this.handleSagaFailure(sagaId, 'timeout', `Saga timeout after ${elapsed}ms`);
        }
      }
    }, 30000); // Check cada 30 segundos
  }

  /**
   * Obtiene el monto total de una orden
   */
  private async getOrderAmount(orderId: string): Promise<{ value: number; currency: string }> {
    const order = await this.orderRepository.findById(orderId);
    return {
      value: order.totalAmount,
      currency: 'EUR',
    };
  }

  /**
   * Obtiene los items de una orden
   */
  private async getOrderItems(orderId: string): Promise<Array<{ productId: string; quantity: number; price: number }>> {
    const order = await this.orderRepository.findById(orderId);
    return order.items;
  }

  /**
   * Obtiene el estado de una saga
   */
  getSagaState(orderId: string): SagaState | undefined {
    return this.sagas.get(`saga-${orderId}`);
  }

  /**
   * Obtiene todas las sagas activas
   */
  getActiveSagas(): SagaState[] {
    return Array.from(this.sagas.values()).filter(
      s => s.status !== SagaStatus.COMPLETED && s.status !== SagaStatus.COMPENSATED
    );
  }
}
