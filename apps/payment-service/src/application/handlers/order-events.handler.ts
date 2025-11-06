import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { ProcessPaymentUseCase } from '../application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from '../application/use-cases/refund-payment.use-case';
import { Money } from '../domain/value-objects/money.vo';

interface OrderCreatedEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  eventData: {
    orderId: string;
    customerId: string;
    totalAmount: number;
    currency: string;
    items: Array<{ productId: string; quantity: number }>;
    createdAt: Date;
  };
  sagaId?: string;
}

interface OrderCancelledEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  eventData: {
    orderId: string;
    reason: string;
    cancelledAt: Date;
  };
  sagaId?: string;
}

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
    @Ctx() context: any
  ) {
    this.logger.log(
      `Received OrderCreated event for order ${event.eventData.orderId}`
    );

    try {
      const amount = new Money(
        event.eventData.totalAmount,
        event.eventData.currency || 'EUR'
      );

      await this.processPaymentUseCase.execute({
        orderId: event.eventData.orderId,
        amount,
        customerId: event.eventData.customerId,
        metadata: {
          orderItems: event.eventData.items,
          orderCreatedAt: event.eventData.createdAt,
        },
        sagaId: event.sagaId,
      });

      this.logger.log(
        `Payment processing initiated for order ${event.eventData.orderId}`
      );
    } catch (error) {
      this.logger.error(
        `Error processing payment for order ${event.eventData.orderId}:`,
        error
      );
      throw error;
    }
  }

  @EventPattern('order.cancelled')
  async handleOrderCancelled(
    @Payload() event: OrderCancelledEvent,
    @Ctx() context: any
  ) {
    this.logger.log(
      `Received OrderCancelled event for order ${event.eventData.orderId}`
    );

    try {
      await this.refundPaymentUseCase.execute({
        orderId: event.eventData.orderId,
        reason: event.eventData.reason || 'Order cancelled',
        sagaId: event.sagaId,
      });

      this.logger.log(
        `Refund processed for order ${event.eventData.orderId}`
      );
    } catch (error) {
      this.logger.error(
        `Error processing refund for order ${event.eventData.orderId}:`,
        error
      );
      // No lanzamos el error para evitar que se propague y rompa la saga
      // En producción, deberíamos tener un mecanismo de retry o dead letter queue
      this.logger.warn(
        `Refund failed for order ${event.eventData.orderId}, but continuing saga compensation`
      );
    }
  }
}
