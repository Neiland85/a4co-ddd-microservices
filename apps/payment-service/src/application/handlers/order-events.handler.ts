import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProcessPaymentCommand, ProcessPaymentUseCase } from '../use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from '../use-cases/refund-payment.use-case';
import { Money } from '../../domain/value-objects/money.vo';

export interface OrderCreatedEventPayload {
  orderId: string;
  customerId: string;
  totalAmount: number;
  currency: string;
  metadata?: Record<string, any>;
  paymentMethodId?: string;
  idempotencyKey?: string;
  sagaId?: string;
}

export interface OrderCancelledEventPayload {
  orderId: string;
  reason?: string;
  metadata?: Record<string, any>;
  sagaId?: string;
}

@Controller()
export class OrderEventsHandler {
  private readonly logger = new Logger(OrderEventsHandler.name);

  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
  ) { }

  @EventPattern('order.created.v1')
  public async handleOrderCreated(@Payload() event: OrderCreatedEventPayload): Promise<void> {
    this.logger.log(`Received order.created event for order ${event.orderId}`);

    const amount = Money.create(event.totalAmount, event.currency);

    const command: ProcessPaymentCommand = {
      orderId: event.orderId,
      amount,
      customerId: event.customerId,
    };

    if (event.metadata !== undefined) {
      command.metadata = event.metadata;
    }

    if (event.paymentMethodId !== undefined) {
      command.paymentMethodId = event.paymentMethodId;
    }

    if (event.idempotencyKey !== undefined) {
      command.idempotencyKey = event.idempotencyKey;
    }

    if (event.sagaId !== undefined) {
      command.sagaId = event.sagaId;
    }

    await this.processPaymentUseCase.execute(command);
  }

  @EventPattern('order.cancelled.v1')
  public async handleOrderCancelled(@Payload() event: OrderCancelledEventPayload): Promise<void> {
    this.logger.log(`Received order.cancelled event for order ${event.orderId}`);

    await this.refundPaymentUseCase.execute(event.orderId);
  }
}

