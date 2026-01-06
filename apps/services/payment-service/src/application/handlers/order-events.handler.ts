import { Controller, Inject, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentRepository } from '../../domain/repositories/payment.repository.js';
import { PAYMENT_REPOSITORY_TOKEN } from '../application.constants.js';
import {
  ProcessPaymentUseCase,
} from '../use-cases/process-payment.use-case.js';
import { RefundPaymentUseCase } from '../use-cases/refund-payment.use-case.js';
import {
  ORDER_CREATED_V1,
  ORDER_CANCELLED_V1,
  OrderCreatedV1Payload,
  OrderCancelledV1Payload,
} from '@a4co/shared-events';

@Controller()
export class OrderEventsHandler {
  private readonly logger = new Logger(OrderEventsHandler.name);

  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
  ) { }

  @EventPattern(ORDER_CREATED_V1)
  public async handleOrderCreated(@Payload() data: any): Promise<void> {
    const event = data.payload as OrderCreatedV1Payload;
    this.logger.log(`📥 Received ${ORDER_CREATED_V1} for order ${event.orderId}`);

    try {
      const command: any = {
        orderId: event.orderId,
        amount: event.totalAmount,
        currency: event.currency,
        customerId: event.customerId,
        metadata: {},
      };

      await this.processPaymentUseCase.execute(command);
    } catch (error) {
      this.logger.error(`Failed to process payment for order ${event.orderId}:`, error);
      throw error;
    }
  }

  @EventPattern(ORDER_CANCELLED_V1)
  public async handleOrderCancelled(@Payload() data: any): Promise<void> {
    const event = data.payload as OrderCancelledV1Payload;
    this.logger.log(`📥 Received ${ORDER_CANCELLED_V1} for order ${event.orderId}`);

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
