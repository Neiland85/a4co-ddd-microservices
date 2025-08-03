import { IEventBus } from '../events/event-bus';
import { EventSubjects } from '../events/subjects';

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
  abstract handleSagaStep(sagaId: string, step: string, data: any): Promise<void>;

  /**
   * Completa la saga exitosamente
   */
  protected async completeSaga(sagaId: string, result: any): Promise<void> {
    await this.eventBus.publish(EventSubjects.SAGA_COMPLETED, {
      sagaId,
      result,
      completedAt: new Date()
    });
  }

  /**
   * Falla la saga y ejecuta compensaciones
   */
  protected async failSaga(sagaId: string, error: Error, compensations: string[]): Promise<void> {
    await this.eventBus.publish(EventSubjects.SAGA_FAILED, {
      sagaId,
      error: error.message,
      compensations,
      failedAt: new Date()
    });
  }
}

/**
 * Orquestador específico para la saga de creación de órdenes
 */
export class OrderCreationSagaOrchestrator extends SagaOrchestrator {
  
  async startSaga(sagaId: string, initialData: {
    customerId: string;
    customerEmail: string;
    items: Array<{ productId: string; quantity: number }>;
    deliveryAddress: any;
  }): Promise<void> {
    
    // Paso 1: Solicitar información de productos
    await this.eventBus.publish(EventSubjects.PRODUCT_INFORMATION_REQUESTED, {
      sagaId,
      orderId: sagaId,
      productIds: initialData.items.map(item => item.productId),
      requestedAt: new Date()
    });

    // Paso 2: Solicitar validación de stock
    await this.eventBus.publish(EventSubjects.STOCK_VALIDATION_REQUESTED, {
      sagaId,
      orderId: sagaId,
      items: initialData.items,
      requestedAt: new Date()
    });

    // Paso 3: Solicitar información del usuario
    await this.eventBus.publish(EventSubjects.USER_INFORMATION_REQUESTED, {
      sagaId,
      userId: initialData.customerId,
      requestedFields: ['email', 'address', 'preferences'],
      requestedAt: new Date()
    });
  }

  async handleSagaStep(sagaId: string, step: string, data: any): Promise<void> {
    switch (step) {
      case 'PRODUCT_INFO_RECEIVED':
        await this.handleProductInfoReceived(sagaId, data);
        break;
      case 'STOCK_VALIDATED':
        await this.handleStockValidated(sagaId, data);
        break;
      case 'USER_INFO_RECEIVED':
        await this.handleUserInfoReceived(sagaId, data);
        break;
      case 'PAYMENT_PROCESSED':
        await this.handlePaymentProcessed(sagaId, data);
        break;
      default:
        throw new Error(`Unknown saga step: ${step}`);
    }
  }

  private async handleProductInfoReceived(sagaId: string, data: any): Promise<void> {
    // Lógica para manejar información de productos recibida
    console.log(`Product info received for saga ${sagaId}`);
  }

  private async handleStockValidated(sagaId: string, data: any): Promise<void> {
    if (data.allItemsAvailable) {
      // Continuar con el proceso de pago
      await this.eventBus.publish(EventSubjects.PAYMENT_INITIATED, {
        sagaId,
        orderId: sagaId,
        amount: data.totalAmount,
        currency: data.currency,
        initiatedAt: new Date()
      });
    } else {
      // Fallar la saga
      await this.failSaga(sagaId, new Error('Stock not available'), ['release_stock']);
    }
  }

  private async handleUserInfoReceived(sagaId: string, data: any): Promise<void> {
    // Lógica para manejar información de usuario recibida
    console.log(`User info received for saga ${sagaId}`);
  }

  private async handlePaymentProcessed(sagaId: string, data: any): Promise<void> {
    if (data.success) {
      // Completar la saga exitosamente
      await this.completeSaga(sagaId, {
        orderId: sagaId,
        paymentId: data.paymentId,
        status: 'confirmed'
      });
    } else {
      // Fallar la saga y liberar stock
      await this.failSaga(sagaId, new Error('Payment failed'), ['release_stock']);
    }
  }
}