import { Inject, Injectable, Logger } from '@nestjs/common';
import { PAYMENT_REPOSITORY_TOKEN } from '../application.constants';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { PaymentEventPublisher } from '../services/payment-event.publisher';
import {
  PaymentRepository,
  Payment,
  PaymentDomainService,
  PaymentStatusValue,
  PaymentId,
  Money,
} from '@a4co/domain-payment';

@Injectable()
export class RefundPaymentUseCase {
  private readonly logger = new Logger(RefundPaymentUseCase.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentDomainService: PaymentDomainService,
    private readonly stripeGateway: StripeGateway,
    private readonly eventPublisher: PaymentEventPublisher,
  ) {}

  public async execute(paymentId: string, amount?: number, reason?: string): Promise<Payment> {
    const id = PaymentId.create(paymentId);
    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new Error(`Payment not found with id ${paymentId}`);
    }

    const stripeIntentId = payment.stripePaymentIntentId;
    if (!stripeIntentId) {
      throw new Error(`Payment ${payment.paymentId.value} has no Stripe payment intent associated`);
    }

    if (payment.status.value !== PaymentStatusValue.SUCCEEDED) {
      throw new Error(
        `Only succeeded payments can be refunded. Current status: ${payment.status.value}`,
      );
    }

    // Si se proporciona un monto, usarlo, sino calcular el reembolso completo
    let refundAmount: Money;
    if (amount !== undefined) {
      refundAmount = Money.create(amount / 100, payment.amount.currency);
      // Validar que el monto no exceda el pago original
      if (refundAmount.amount > payment.amount.amount) {
        throw new Error(`Refund amount exceeds original payment amount`);
      }
    } else {
      refundAmount = this.paymentDomainService.calculateRefundAmount(payment);
    }

    await this.stripeGateway.refundPayment(stripeIntentId, refundAmount);

    payment.refund(refundAmount, reason);
    await this.persist(payment);

    this.logger.log(
      `Refund processed for payment ${paymentId} - Amount: ${refundAmount.amount} ${refundAmount.currency}`,
    );
    return payment;
  }

  private async persist(payment: Payment): Promise<void> {
    await this.paymentRepository.save(payment);
    await this.eventPublisher.publishPaymentEvents(payment);
  }
}
