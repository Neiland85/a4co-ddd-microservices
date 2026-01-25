import { Controller, Inject, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentRepository } from '@a4co/domain-payment';
import { PAYMENT_REPOSITORY_TOKEN } from '../application.constants';
import { ProcessPaymentUseCase } from '../use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from '../use-cases/refund-payment.use-case';

/**
 * 🔒 Anti-corruption handler
 * No depende de shared-events ni de DomainEvent shape externo
 */
@Controller()
export class OrderEventsHandler {
  private readonly logger = new Logger(OrderEventsHandler.name);

  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  /**
   * ORDER CREATED
   */
  @EventPattern('order.created.v1')
  async handleOrderCreated(@Payload() data: any): Promise<void> {
    const payload = data?.payload ?? data;

    if (!payload?.orderId) {
      this.logger.warn('Received order.created.v1 without orderId');
      return;
    }

    this.logger.log(`📥 Received order.created.v1 for order ${payload.orderId}`);

    const command = {
      orderId: payload.orderId,
      amount: payload.totalAmount,
      currency: payload.currency,
      customerId: payload.customerId,
      metadata: {},
    };

    await this.processPaymentUseCase.execute(command);
  }

  /**
   * ORDER CANCELLED
   */
  @EventPattern('order.cancelled.v1')
  async handleOrderCancelled(@Payload() data: any): Promise<void> {
    const payload = data?.payload ?? data;

    if (!payload?.orderId) {
      this.logger.warn('Received order.cancelled.v1 without orderId');
      return;
    }

    this.logger.log(`📥 Received order.cancelled.v1 for order ${payload.orderId}`);

    const payment = await this.paymentRepository.findByOrderId(payload.orderId);

    if (!payment) {
      this.logger.warn(`No payment found for order ${payload.orderId}`);
      return;
    }

    await this.refundPaymentUseCase.execute(
      payment.id,
      undefined,
      payload.reason ?? 'Order cancelled',
    );
  }
}
