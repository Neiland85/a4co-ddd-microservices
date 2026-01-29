import { Injectable } from '@nestjs/common';
import { PaymentRepository, Payment, PaymentId, Money } from '@a4co/domain-payment';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  getHealth() {
    return { status: 'ok' };
  }

  async processPayment(command: {
    orderId: string;
    amount: number;
    currency: string;
    customerId: string;
    metadata?: Record<string, any>;
    stripePaymentIntentId?: string | null;
  }): Promise<Payment> {
    const amount = Money.fromPrimitives({
      amount: command.amount,
      currency: command.currency,
    } as any);

    const payment = Payment.create({
      orderId: command.orderId,
      amount,
      customerId: command.customerId,
      metadata: command.metadata ?? {},
      stripePaymentIntentId: command.stripePaymentIntentId ?? null,
    } as any);

    await this.paymentRepository.save(payment);
    return payment;
  }

  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(PaymentId.create(paymentId));

    if (!payment) {
      throw new Error('Payment not found');
    }

    const refundAmount = amount
      ? Money.fromPrimitives({ amount, currency: (payment as any).amount?.currency } as any)
      : undefined;

    (payment as any).refund(refundAmount, reason);
    await this.paymentRepository.save(payment);

    return payment;
  }

  async getPaymentById(paymentId: string): Promise<Payment | null> {
    return this.paymentRepository.findById(PaymentId.create(paymentId));
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment | null> {
    return this.paymentRepository.findByOrderId(orderId);
  }
}
