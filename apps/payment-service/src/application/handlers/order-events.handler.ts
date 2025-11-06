import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, NatsContext } from '@nestjs/microservices';
import { ProcessPaymentUseCase } from '../use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from '../use-cases/refund-payment.use-case';
import { Money } from '../../domain/value-objects';
import { OrderCreatedEvent, OrderCancelledEvent } from '@a4co/shared-utils';

@Controller()
export class OrderEventsHandler {
  private readonly logger = new Logger(OrderEventsHandler.name);

  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase
  ) {}

  @EventPattern('order.created')
  async handleOrderCreated(
    @Payload() event: OrderCreatedEvent,
    @Ctx() context: NatsContext
  ): Promise<void> {
    this.logger.log(`Received order.created event for order ${event.aggregateId}`);

    try {
      // Extraer datos del evento
      const orderId = event.aggregateId;
      const eventData = event.eventData || {};

      // Validar datos requeridos
      if (!eventData.customerId) {
        throw new Error('customerId is required in order.created event');
      }
      if (!eventData.totalAmount || eventData.totalAmount <= 0) {
        throw new Error('totalAmount must be greater than 0');
      }

      // Crear Money value object
      const amount = new Money(
        eventData.totalAmount,
        (eventData.currency || 'USD').toUpperCase() as any
      );

      // Ejecutar use case
      await this.processPaymentUseCase.execute({
        orderId,
        amount,
        customerId: eventData.customerId,
        metadata: {
          ...eventData.metadata,
          orderCreatedAt: event.occurredOn?.toISOString() || new Date().toISOString(),
        },
        idempotencyKey: `order-${orderId}`,
      });

      this.logger.log(`Payment processing initiated for order ${orderId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error handling order.created event: ${errorMessage}`, error);
      // No relanzamos el error para evitar que el mensaje se reintente infinitamente
      // En producción, deberíamos implementar dead letter queue
    }
  }

  @EventPattern('order.cancelled')
  async handleOrderCancelled(
    @Payload() event: OrderCancelledEvent,
    @Ctx() context: NatsContext
  ): Promise<void> {
    this.logger.log(`Received order.cancelled event for order ${event.aggregateId}`);

    try {
      const orderId = event.aggregateId;
      const eventData = event.eventData || {};

      // Ejecutar refund use case (compensación)
      await this.refundPaymentUseCase.execute({
        orderId,
        reason: eventData.reason || 'requested_by_customer',
      });

      this.logger.log(`Refund processed for cancelled order ${orderId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error handling order.cancelled event: ${errorMessage}`, error);
      // No relanzamos el error para evitar que el mensaje se reintente infinitamente
    }
  }
}
