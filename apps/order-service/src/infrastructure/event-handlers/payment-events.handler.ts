import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  PAYMENT_CONFIRMED_V1,
  PAYMENT_FAILED_V1,
  PaymentConfirmedV1Payload,
  PaymentFailedV1Payload,
} from '@a4co/shared-events';
import { OrderRepository } from '../../domain/repositories/order.repository.js';

/**
 * Payment Events Handler
 * Listens to payment-related events from Payment Service
 */
@Controller()
export class PaymentEventsHandler {
  private readonly logger = new Logger(PaymentEventsHandler.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  /**
   * Handle PaymentConfirmed event
   * Updates order status to CONFIRMED when payment succeeds
   */
  @EventPattern(PAYMENT_CONFIRMED_V1)
  async handlePaymentConfirmed(@Payload() data: any): Promise<void> {
    const payload = data.payload as PaymentConfirmedV1Payload;
    this.logger.log(`📥 Received ${PAYMENT_CONFIRMED_V1}`, {
      orderId: payload.orderId,
      paymentId: payload.paymentId,
    });

    try {
      // Find the order
      const order = await this.orderRepository.findById(payload.orderId);

      if (!order) {
        this.logger.warn(`Order ${payload.orderId} not found`);
        return;
      }

      // Update order status to CONFIRMED
      order.confirmPayment();
      await this.orderRepository.save(order);

      this.logger.log(`✅ Order ${payload.orderId} confirmed with payment ${payload.paymentId}`);
    } catch (error) {
      this.logger.error(`❌ Error handling payment confirmed for order ${payload.orderId}`, error);
      throw error;
    }
  }

  /**
   * Handle PaymentFailed event
   * Updates order status to CANCELLED when payment fails
   */
  @EventPattern(PAYMENT_FAILED_V1)
  async handlePaymentFailed(@Payload() data: any): Promise<void> {
    const payload = data.payload as PaymentFailedV1Payload;
    this.logger.log(`📥 Received ${PAYMENT_FAILED_V1}`, {
      orderId: payload.orderId,
      reason: payload.reason,
    });

    try {
      // Find the order
      const order = await this.orderRepository.findById(payload.orderId);

      if (!order) {
        this.logger.warn(`Order ${payload.orderId} not found`);
        return;
      }

      // Cancel the order
      order.cancel(payload.reason);
      await this.orderRepository.save(order);

      this.logger.log(`❌ Order ${payload.orderId} cancelled due to payment failure: ${payload.reason}`);
    } catch (error) {
      this.logger.error(`❌ Error handling payment failed for order ${payload.orderId}`, error);
      throw error;
    }
  }
}
