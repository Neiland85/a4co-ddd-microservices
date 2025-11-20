import { Injectable, Logger } from '@nestjs/common';
import { ProcessPaymentUseCase } from '../use-cases/process-payment.use-case';

export interface OrderCreatedEventPayload {
  orderId: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  timestamp: Date;
}

export interface PaymentProcessRequest {
  orderId: string;
  customerId: string;
  amount: {
    value: number;
    currency: string;
  };
}

/**
 * Handler que escucha eventos de Order Service y dispara procesamiento de pagos
 */
@Injectable()
export class OrderEventsHandler {
  private readonly logger = new Logger(OrderEventsHandler.name);

  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly eventBus: any,
  ) {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Escuchar evento de solicitud de procesamiento de pago
    this.eventBus.subscribe('payments.process_request', async (event: PaymentProcessRequest) => {
      await this.handlePaymentProcessRequest(event);
    });

    this.logger.log('✅ OrderEventsHandler configurado y escuchando eventos');
  }

  /**
   * Handler: Solicitud de procesamiento de pago
   */
  private async handlePaymentProcessRequest(event: PaymentProcessRequest): Promise<void> {
    this.logger.log(`💳 Recibida solicitud de pago para orden ${event.orderId}`);

    try {
      // Ejecutar el caso de uso de procesamiento de pago
      const result = await this.processPaymentUseCase.execute({
        orderId: event.orderId,
        customerId: event.customerId,
        amount: event.amount.value,
        currency: event.amount.currency,
      });

      this.logger.log(
        `✅ Pago procesado exitosamente para orden ${event.orderId}: ${result.paymentId}`,
      );
    } catch (error) {
      this.logger.error(`❌ Error procesando pago para orden ${event.orderId}:`, error);

      // Publicar evento de pago fallido
      await this.eventBus.publish('payments.failed', {
        orderId: event.orderId,
        reason: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      });
    }
  }
}
