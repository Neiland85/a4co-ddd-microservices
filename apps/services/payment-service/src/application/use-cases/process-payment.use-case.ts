import { Injectable } from '@nestjs/common';
import { PaymentRepository, Payment, Money } from '@a4co/domain-payment';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(command: {
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
}
