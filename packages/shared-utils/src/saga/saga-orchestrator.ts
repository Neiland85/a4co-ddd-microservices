import { IEventBus } from '../events';
import { EventSubjects } from '../events/subjects';
<<<<<<< Updated upstream
import { SagaCompletedEvent, SagaFailedEvent } from '../events/domain-events';
=======
import { v4 as uuidv4 } from 'uuid'; // Importar uuid
import {
  SagaCompletedEvent,
  SagaFailedEvent,
  ProductInformationRequestedEvent,
  StockValidationRequestedEvent,
  UserInformationRequestedEvent,
  PaymentInitiatedEvent,
} from '../events/domain-events';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    const event = new SagaCompletedEvent(sagaId, {
      result,
      completedAt: new Date(),
    });
=======
    const event = new SagaCompletedEvent(
      sagaId,
      {
        result,
        completedAt: new Date(),
      },
      sagaId
    ); // Pasar sagaId al constructor
>>>>>>> Stashed changes
    await this.eventBus.publish(EventSubjects.SAGA_COMPLETED, event);
  }

  /**
   * Falla la saga y ejecuta compensaciones
   */
<<<<<<< Updated upstream
  protected async failSaga(sagaId: string, error: any): Promise<void> {
    const event = new SagaFailedEvent(sagaId, {
      error: error.message || error.toString(),
      compensations: [],
      failedAt: new Date(),
    });
=======
  protected async failSaga(
    sagaId: string,
    error: Error,
    compensations: string[]
  ): Promise<void> {
    const event = new SagaFailedEvent(
      sagaId,
      {
        error: error.message,
        compensations,
        failedAt: new Date(),
      },
      sagaId
    ); // Pasar sagaId al constructor
>>>>>>> Stashed changes
    await this.eventBus.publish(EventSubjects.SAGA_FAILED, event);
  }
}

/**
 * Orquestador específico para la saga de creación de órdenes
 */
export class OrderCreationSagaOrchestrator extends SagaOrchestrator {
<<<<<<< Updated upstream
  private sagaStates: Map<string, { customerId: string; initialData: any }> = new Map(); // Almacenar estado por sagaId

  async startSaga(
    sagaId: string,
    initialData: { customerId: string; items: any[] }
  ): Promise<void> {
    // Almacenar estado inicial
    this.sagaStates.set(sagaId, {
      customerId: initialData.customerId,
      initialData,
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
        items: initialData.items,
      },
      sagaId,
    });
=======
  private sagaStates: Map<string, { customerId: string; initialData: any }> =
    new Map(); // Almacenar estado por sagaId

  async startSaga(
    sagaId: string,
    initialData: {
      customerId: string;
      customerEmail: string;
      items: Array<{ productId: string; quantity: number }>;
      deliveryAddress: any;
    }
  ): Promise<void> {
    this.sagaStates.set(sagaId, {
      customerId: initialData.customerId,
      initialData,
    }); // Almacenar initialData

    // Paso 1: Solicitar información de productos
    const productInfoEvent = new ProductInformationRequestedEvent(
      sagaId,
      {
        orderId: sagaId,
        productIds: initialData.items.map((item) => item.productId),
        requestedAt: new Date(),
      },
      sagaId
    ); // Pasar sagaId al constructor
    await this.eventBus.publish(
      EventSubjects.PRODUCT_INFORMATION_REQUESTED,
      productInfoEvent
    );

    // Paso 2: Solicitar validación de stock
    const stockValidationEvent = new StockValidationRequestedEvent(
      sagaId,
      {
        orderId: sagaId,
        items: initialData.items,
        requestedAt: new Date(),
      },
      sagaId
    ); // Pasar sagaId al constructor
    await this.eventBus.publish(
      EventSubjects.STOCK_VALIDATION_REQUESTED,
      stockValidationEvent
    );

    // Paso 3: Solicitar información del usuario
    const userInfoEvent = new UserInformationRequestedEvent(
      sagaId,
      {
        userId: initialData.customerId,
        requestedFields: ['email', 'address', 'preferences'],
        requestedAt: new Date(),
      },
      sagaId
    ); // Pasar sagaId al constructor
    await this.eventBus.publish(
      EventSubjects.USER_INFORMATION_REQUESTED,
      userInfoEvent
    );
>>>>>>> Stashed changes
  }

  async handleSagaStep(sagaId: string, step: string, data: any): Promise<void> {
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

<<<<<<< Updated upstream
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
        items: data.items,
      },
      sagaId,
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
        items: data.items,
      },
      sagaId,
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
        amount: data.amount,
      },
      sagaId,
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
        orderId: data.orderId,
      },
      sagaId,
    });
  }
=======
  private async handleProductInfoReceived(
    sagaId: string,
    data: any
  ): Promise<void> {
    // Lógica para manejar información de productos recibida
    console.log(`Product info received for saga ${sagaId}`);
  }

  private async handleStockValidated(sagaId: string, data: any): Promise<void> {
    if (data.allItemsAvailable) {
      const sagaState = this.sagaStates.get(sagaId); // Obtener el estado de la saga
      if (!sagaState) {
        throw new Error(`Saga state not found for sagaId: ${sagaId}`);
      }

      // Continuar con el proceso de pago
      const paymentInitiatedEvent = new PaymentInitiatedEvent(
        uuidv4(), // Generar un nuevo paymentId
        {
          orderId: sagaId,
          customerId: sagaState.customerId, // Usar customerId del estado de la saga
          amount: data.totalAmount,
          currency: data.currency,
          paymentMethod: 'credit_card', // Placeholder
          paymentGateway: 'stripe', // Placeholder
          initiatedAt: new Date(),
        },
        sagaId // Pasar sagaId al constructor
      );
      await this.eventBus.publish(
        EventSubjects.PAYMENT_INITIATED,
        paymentInitiatedEvent
      );
    } else {
      // Fallar la saga
      await this.failSaga(sagaId, new Error('Stock not available'), [
        'release_stock',
      ]);
    }
  }

  private async handleUserInfoReceived(
    sagaId: string,
    data: any
  ): Promise<void> {
    // Lógica para manejar información de usuario recibida
    console.log(`User info received for saga ${sagaId}`);
  }

  private async handlePaymentProcessed(
    sagaId: string,
    data: any
  ): Promise<void> {
    if (data.success) {
      // Completar la saga exitosamente
      const sagaCompletedEvent = new SagaCompletedEvent(
        sagaId,
        {
          orderId: sagaId,
          paymentId: data.paymentId,
          status: 'confirmed',
        },
        sagaId
      ); // Pasar sagaId al constructor
      await this.eventBus.publish(
        EventSubjects.SAGA_COMPLETED,
        sagaCompletedEvent
      );
    } else {
      // Fallar la saga y liberar stock
      await this.failSaga(sagaId, new Error('Payment failed'), [
        'release_stock',
      ]);
    }
  }
>>>>>>> Stashed changes
}
