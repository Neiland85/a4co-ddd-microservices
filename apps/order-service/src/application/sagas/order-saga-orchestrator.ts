import { Injectable } from '@nestjs/common';
import { getLogger, ObservabilityLogger } from '@a4co/observability';
import {
  OrderCreatedEvent,
  OrderConfirmedEvent,
  OrderCancelledEvent,
} from '../../domain/events/index.js';

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
  private readonly logger: ObservabilityLogger = getLogger().withContext({
    context: OrderSagaOrchestrator.name,
  });
  private readonly sagas = new Map<string, SagaState>();
  private readonly SAGA_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos

  constructor(
    // Usamos 'any' temporalmente para evitar errores de tipos si las interfaces no coinciden exactamente,
    // pero idealmente deberías usar las interfaces reales (OrderRepository, EventBus).
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

    this.logger.info(`🚀 Iniciando saga`, { sagaId, orderId: command.orderId });

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

      this.logger.info(`✅ Evento orders.created publicado`, { orderId: command.orderId });
    } catch (error: unknown) {
      this.logger.error(`❌ Error iniciando saga`, { sagaId, error });
      const message = error instanceof Error ? error.message : 'Unknown error';
      await this.handleSagaFailure(sagaId, 'initialization', message);
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
      this.logger.warn(`Saga no encontrada para evento`, {
        sagaId,
        eventName: 'inventory.reserved',
      });
      return;
    }

    this.logger.info(`📦 Inventario reservado`, {
      orderId: event.orderId,
      reservationId: event.reservationId,
    });

    // Actualizar estado de la saga
    saga.status = SagaStatus.INVENTORY_RESERVED;
    saga.reservationId = event.reservationId;

    // Actualizar orden en BD
    await this.orderRepository.updateStatus(event.orderId, 'INVENTORY_RESERVED');

    // Paso 3: Iniciar procesamiento de pago
    const amount = await this.getOrderAmount(event.orderId);
    await this.eventBus.publish('payments.process_request', {
      orderId: event.orderId,
      customerId: saga.customerId,
      amount: amount,
    });

    saga.status = SagaStatus.PAYMENT_PROCESSING;
    this.logger.info(`💳 Iniciando procesamiento de pago`, { orderId: event.orderId });
  }

  /**
   * Handler: Inventario sin stock
   */
  private async handleInventoryOutOfStock(event: InventoryOutOfStockEvent): Promise<void> {
    const sagaId = `saga-${event.orderId}`;

    this.logger.warn(`⚠️ Stock insuficiente`, {
      orderId: event.orderId,
      unavailableItems: event.unavailableItems,
    });

    const reason = `Productos sin stock: ${event.unavailableItems
      .map(
        (i) =>
          `${i.productId} (solicitado: ${i.requestedQuantity}, disponible: ${i.availableQuantity})`,
      )
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
      this.logger.warn(`Saga no encontrada para evento`, {
        sagaId,
        eventName: 'payments.succeeded',
      });
      return;
    }

    this.logger.info(`✅ Pago exitoso`, { orderId: event.orderId, paymentId: event.paymentId });

    // Actualizar estado de la saga
    saga.status = SagaStatus.PAYMENT_SUCCEEDED;
    saga.paymentId = event.paymentId;

    // Actualizar orden a CONFIRMED
    await this.orderRepository.updateStatus(event.orderId, 'CONFIRMED');

    // Publicar evento OrderConfirmed
    const items = await this.getOrderItems(event.orderId);
    const confirmedEvent = new OrderConfirmedEvent(
      event.orderId,
      saga.customerId,
      event.amount.value,
      items,
      event.paymentId,
    );

    await this.eventBus.publish('orders.confirmed', confirmedEvent.toJSON());

    // Completar saga
    saga.status = SagaStatus.COMPLETED;
    saga.completedAt = new Date();

    this.logger.info(`🎉 Saga completada exitosamente`, { sagaId });

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
      this.logger.warn(`Saga no encontrada para evento`, { sagaId, eventName: 'payments.failed' });
      return;
    }

    this.logger.error(`❌ Pago fallido`, { orderId: event.orderId, reason: event.reason });

    // Iniciar compensación
    await this.compensateSaga(saga, event.reason);
  }

  /**
   * Maneja fallos generales de la saga
   */
  private async handleSagaFailure(sagaId: string, stage: string, reason: string): Promise<void> {
    const saga = this.sagas.get(sagaId);
    if (saga) {
      await this.compensateSaga(saga, reason);
    } else {
      this.logger.error('Saga falló pero no se encontró contexto para compensar', {
        sagaId,
        stage,
        reason,
      });
    }
  }

  /**
   * Compensa una saga fallida (rollback)
   */
  private async compensateSaga(saga: SagaState, reason: string): Promise<void> {
    this.logger.warn(`🔄 Iniciando compensación`, { sagaId: saga.sagaId, reason });

    saga.status = SagaStatus.COMPENSATING;
    saga.compensationReason = reason;

    try {
      // 1. Si hay reserva de inventario, liberarla
      if (saga.reservationId) {
        this.logger.info('Liberando inventario...', {
          orderId: saga.orderId,
          reservationId: saga.reservationId,
        });
        await this.eventBus.publish('inventory.release', {
          orderId: saga.orderId,
          reservationId: saga.reservationId,
          reason: 'Saga Compensation',
        });
      }

      // 2. Actualizar estado de la orden a CANCELLED
      await this.orderRepository.updateStatus(saga.orderId, 'CANCELLED');

      // 3. Publicar evento de cancelación
      const cancelledEvent = new OrderCancelledEvent(saga.orderId, reason);
      await this.eventBus.publish('orders.cancelled', cancelledEvent.toJSON());

      saga.status = SagaStatus.COMPENSATED;
      saga.completedAt = new Date();

      this.logger.info('🏁 Saga compensada y finalizada', { sagaId: saga.sagaId });
    } catch (error) {
      this.logger.error('💀 Error crítico durante la compensación', { sagaId: saga.sagaId, error });
      saga.status = SagaStatus.FAILED;
      saga.error = error instanceof Error ? error.message : String(error);
    } finally {
      // Limpiar memoria eventualmente
      setTimeout(() => this.sagas.delete(saga.sagaId), 60000);
    }
  }

  /**
   * Helpers para obtener datos (Simulados o conectados al repo)
   */
  private async getOrderAmount(orderId: string): Promise<number> {
    const order = await this.orderRepository.findById(orderId);
    return order ? order.totalAmount : 0;
  }

  private async getOrderItems(orderId: string): Promise<any[]> {
    const order = await this.orderRepository.findById(orderId);
    return order ? order.items : [];
  }

  /**
   * Revisa sagas expiradas (Timeout)
   */
  private startTimeoutChecker() {
    setInterval(() => {
      const now = new Date().getTime();
      this.sagas.forEach((saga, key) => {
        if (
          saga.status !== SagaStatus.COMPLETED &&
          saga.status !== SagaStatus.COMPENSATED &&
          saga.status !== SagaStatus.FAILED &&
          now - saga.startedAt.getTime() > this.SAGA_TIMEOUT_MS
        ) {
          this.logger.warn('⏰ Saga Timeout - Iniciando compensación', { sagaId: key });
          this.compensateSaga(saga, 'Saga Timeout');
        }
      });
    }, 60000); // Revisar cada minuto
  }
}
