import { Controller, Inject, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentRepository } from '../../domain/repositories/payment.repository.js';
import { PAYMENT_REPOSITORY_TOKEN } from '../application.constants.js';
import {
  ProcessPaymentUseCase,
} from '../use-cases/process-payment.use-case.js';
import { RefundPaymentUseCase } from '../use-cases/refund-payment.use-case.js';

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
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
  ) { }

  @EventPattern('order.created.v1')
  public async handleOrderCreated(@Payload() event: OrderCreatedEventPayload): Promise<void> {
    this.logger.log(`Received order.created event for order ${event.orderId}`);

    try {
      const command: any = {
        orderId: event.orderId,
        amount: event.totalAmount,
        currency: event.currency,
        customerId: event.customerId,
        metadata: event.metadata ?? {},
      };

      if (event.paymentMethodId) {
        command.paymentMethodId = event.paymentMethodId;
      }

      if (event.idempotencyKey) {
        command.idempotencyKey = event.idempotencyKey;
      }

      if (event.sagaId) {
        command.sagaId = event.sagaId;
      }

      await this.processPaymentUseCase.execute(command);
    } catch (error) {
      this.logger.error(`Failed to process payment for order ${event.orderId}:`, error);
      throw error;
    }
  }

  @EventPattern('order.cancelled.v1')
  public async handleOrderCancelled(@Payload() event: OrderCancelledEventPayload): Promise<void> {
    this.logger.log(`Received order.cancelled event for order ${event.orderId}`);

    try {
      // Buscar el pago por orderId
      const payment = await this.paymentRepository.findByOrderId(event.orderId);

      if (!payment) {
        this.logger.warn(`No payment found for order ${event.orderId}`);
        return;
      }

      // Procesar reembolso
      await this.refundPaymentUseCase.execute(
        payment.paymentId.value,
        undefined,
        event.reason || 'Order cancelled',
      );
    } catch (error) {
      this.logger.error(`Failed to refund payment for order ${event.orderId}:`, error);
      throw error;
    }
  }
}
