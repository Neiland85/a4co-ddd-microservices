import { IEventBus } from '../events';
import { EventSubjects } from '../events/subjects';
import { SagaCompletedEvent, SagaFailedEvent } from '../events/domain-events';

/**
 * Orquestador de Sagas - Elimina dependencias directas entre servicios
 * Cada servicio solo se comunica con el orquestador, no con otros servicios
 */
export abstract class SagaOrchestrator {
  protected eventBus: IEventBus;

  constructor(eventBus: IEventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Inicia una saga específica
   */
  abstract startSaga(sagaId: string, initialData: any): Promise<void>;

  /**
   * Maneja el siguiente paso de la saga
   */
  abstract handleSagaStep(
    sagaId: string,
    step: string,
    data: any
  ): Promise<void>;

  /**
   * Completa la saga exitosamente
   */
  protected async completeSaga(sagaId: string, result: any): Promise<void> {
    const event = new SagaCompletedEvent(sagaId, {
      result,
      completedAt: new Date()
    });
    await this.eventBus.publish(EventSubjects.SAGA_COMPLETED, event);
  }

  /**
   * Falla la saga y ejecuta compensaciones
   */
  protected async failSaga(sagaId: string, error: any): Promise<void> {
    const event = new SagaFailedEvent(sagaId, {
      error: error.message || error.toString(),
      compensations: [],
      failedAt: new Date()
    });
    await this.eventBus.publish(EventSubjects.SAGA_FAILED, event);
  }
}

/**
 * Orquestador específico para la saga de creación de órdenes
 */
export class OrderCreationSagaOrchestrator extends SagaOrchestrator {
  private sagaStates: Map<string, { customerId: string; initialData: any }> =
    new Map(); // Almacenar estado por sagaId

  async startSaga(
    sagaId: string,
    initialData: { customerId: string; items: any[] }
  ): Promise<void> {
    // Almacenar estado inicial
    this.sagaStates.set(sagaId, {
      customerId: initialData.customerId,
      initialData
    });

    // Publicar evento de inicio de saga usando SAGA_STARTED
    await this.eventBus.publish(EventSubjects.SAGA_STARTED, {
      eventId: sagaId,
      eventType: 'OrderCreationSagaStarted',
      aggregateId: sagaId,
      eventVersion: 1,
      occurredOn: new Date(),
      eventData: {
        sagaId,
        customerId: initialData.customerId,
        items: initialData.items
      },
      sagaId
    });
  }

  async handleSagaStep(
    sagaId: string,
    step: string,
    data: any
  ): Promise<void> {
    const sagaState = this.sagaStates.get(sagaId);
    if (!sagaState) {
      throw new Error(`Saga ${sagaId} no encontrada`);
    }

    switch (step) {
      case 'VALIDATE_INVENTORY':
        await this.validateInventory(sagaId, data);
        break;
      case 'CREATE_ORDER':
        await this.createOrder(sagaId, data);
        break;
      case 'PROCESS_PAYMENT':
        await this.processPayment(sagaId, data);
        break;
      case 'CONFIRM_ORDER':
        await this.confirmOrder(sagaId, data);
        break;
      default:
        throw new Error(`Paso de saga desconocido: ${step}`);
    }
  }

  private async validateInventory(sagaId: string, data: any): Promise<void> {
    // Usar STOCK_VALIDATION_REQUESTED que sí existe
    await this.eventBus.publish(EventSubjects.STOCK_VALIDATION_REQUESTED, {
      eventId: `inventory-${sagaId}`,
      eventType: 'InventoryValidationRequested',
      aggregateId: sagaId,
      eventVersion: 1,
      occurredOn: new Date(),
      eventData: {
        sagaId,
        items: data.items
      },
      sagaId
    });
  }

  private async createOrder(sagaId: string, data: any): Promise<void> {
    // Usar ORDER_CREATED que sí existe
    await this.eventBus.publish(EventSubjects.ORDER_CREATED, {
      eventId: `order-${sagaId}`,
      eventType: 'OrderCreationRequested',
      aggregateId: sagaId,
      eventVersion: 1,
      occurredOn: new Date(),
      eventData: {
        sagaId,
        customerId: data.customerId,
        items: data.items
      },
      sagaId
    });
  }

  private async processPayment(sagaId: string, data: any): Promise<void> {
    // Usar PAYMENT_INITIATED que sí existe
    await this.eventBus.publish(EventSubjects.PAYMENT_INITIATED, {
      eventId: `payment-${sagaId}`,
      eventType: 'PaymentProcessingRequested',
      aggregateId: sagaId,
      eventVersion: 1,
      occurredOn: new Date(),
      eventData: {
        sagaId,
        orderId: data.orderId,
        amount: data.amount
      },
      sagaId
    });
  }

  private async confirmOrder(sagaId: string, data: any): Promise<void> {
    // Usar ORDER_CONFIRMED que sí existe
    await this.eventBus.publish(EventSubjects.ORDER_CONFIRMED, {
      eventId: `confirmation-${sagaId}`,
      eventType: 'OrderConfirmationRequested',
      aggregateId: sagaId,
      eventVersion: 1,
      occurredOn: new Date(),
      eventData: {
        sagaId,
        orderId: data.orderId
      },
      sagaId
    });
  }
}
