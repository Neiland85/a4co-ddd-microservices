import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { PAYMENT_REPOSITORY_TOKEN } from '../application.constants';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentDomainService } from '../../domain/services/payment-domain.service';
import { PaymentStatusValue } from '../../domain/value-objects/payment-status.vo';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { PaymentEventPublisher } from '../services/payment-event.publisher';

@Injectable()
export class RefundPaymentUseCase {
  private readonly logger = new Logger(RefundPaymentUseCase.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentDomainService: PaymentDomainService,
    private readonly stripeGateway: StripeGateway,
    private readonly eventPublisher: PaymentEventPublisher,
  ) { }

  public async execute(orderId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findByOrderId(orderId);

    if (!payment) {
      throw new Error(`Payment not found for order ${orderId}`);
    }

    if (!payment.stripePaymentIntentId) {
      throw new Error(`Payment ${payment.paymentId.value} has no Stripe payment intent associated`);
    }

    if (payment.status.value !== PaymentStatusValue.SUCCEEDED) {
      throw new Error(`Only succeeded payments can be refunded. Current status: ${payment.status.value}`);
    }

    const refundAmount = this.paymentDomainService.calculateRefundAmount(payment);

    await this.stripeGateway.refundPayment(payment.stripePaymentIntentId, refundAmount);

    payment.refund(refundAmount);
    await this.persist(payment);

    this.logger.log(`Refund processed for order ${orderId}`);
    return payment;
  }

  private async persist(payment: Payment): Promise<void> {
    await this.paymentRepository.save(payment);
    await this.eventPublisher.publishPaymentEvents(payment);
  }
}

