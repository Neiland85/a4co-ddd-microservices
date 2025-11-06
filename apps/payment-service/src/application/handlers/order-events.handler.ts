import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, NatsContext } from '@nestjs/microservices';
import { ProcessPaymentUseCase } from '../use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from '../use-cases/refund-payment.use-case';
import { Money } from '../domain/value-objects';

interface OrderCreatedEvent {
  orderId: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    currency?: string;
  }>;
  totalAmount: number;
  currency?: string;
  sagaId?: string;
  timestamp?: Date;
}

interface OrderCancelledEvent {
  orderId: string;
  reason?: string;
  sagaId?: string;
  timestamp?: Date;
}

@Controller()
export class OrderEventsHandler {
  private readonly logger = new Logger(OrderEventsHandler.name);

  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase
  ) {}

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() event: OrderCreatedEvent, @Ctx() context: NatsContext) {
    this.logger.log(`Received order.created event for order ${event.orderId}`);

    try {
      // Validar datos del evento
      if (!event.orderId || !event.customerId || !event.totalAmount) {
        this.logger.error('Invalid order.created event: missing required fields');
        return;
      }

      // Crear Money value object
      const currency = event.currency || 'EUR';
      const amount = new Money(event.totalAmount, currency);

      // Ejecutar ProcessPaymentUseCase
      const payment = await this.processPaymentUseCase.execute(
        event.orderId,
        amount,
        event.customerId,
        {
          items: event.items,
          orderCreatedAt: event.timestamp || new Date(),
        },
        event.sagaId
      );

      this.logger.log(`Payment processed successfully for order ${event.orderId}: ${payment.paymentId.value}`);
    } catch (error) {
      this.logger.error(
        `Error processing payment for order ${event.orderId}: ${error instanceof Error ? error.message : String(error)}`
      );
      // En producción, aquí se podría publicar un evento de error o reintentar
    }
  }

  @EventPattern('order.cancelled')
  async handleOrderCancelled(@Payload() event: OrderCancelledEvent, @Ctx() context: NatsContext) {
    this.logger.log(`Received order.cancelled event for order ${event.orderId}`);

    try {
      // Validar datos del evento
      if (!event.orderId) {
        this.logger.error('Invalid order.cancelled event: missing orderId');
        return;
      }

      // Ejecutar RefundPaymentUseCase (compensación)
      const payment = await this.refundPaymentUseCase.execute(
        event.orderId,
        undefined, // Reembolso completo
        event.sagaId
      );

      this.logger.log(`Payment refunded successfully for order ${event.orderId}: ${payment.paymentId.value}`);
    } catch (error) {
      this.logger.error(
        `Error refunding payment for order ${event.orderId}: ${error instanceof Error ? error.message : String(error)}`
      );
      
      // Si el pago no existe o no se puede reembolsar, solo logueamos el error
      // No lanzamos excepción para evitar que el evento se reintente infinitamente
      if (error instanceof Error && error.message.includes('not found')) {
        this.logger.warn(`Payment not found for order ${event.orderId}, skipping refund`);
      }
    }
  }
}
