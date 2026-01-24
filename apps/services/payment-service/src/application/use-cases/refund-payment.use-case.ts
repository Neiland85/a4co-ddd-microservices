import { Injectable } from '@nestjs/common';
import { PaymentRepository, PaymentId, Money } from '@a4co/domain-payment';

@Injectable()
export class RefundPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(paymentId: string, amount?: number, reason?: string) {
    const payment = await this.paymentRepository.findById(PaymentId.create(paymentId));

    if (!payment) {
      throw new Error('Payment not found');
    }

    const refundAmount = amount
      ? Money.fromPrimitives({
          amount,
          currency: (payment as any).amount.currency,
        } as any)
      : undefined;

    (payment as any).refund(refundAmount, reason);

    await this.paymentRepository.save(payment);
    return payment;
  }
}
