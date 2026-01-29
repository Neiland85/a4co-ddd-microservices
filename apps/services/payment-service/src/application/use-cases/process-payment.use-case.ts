import { Injectable, Inject, Logger } from '@nestjs/common';
import { PaymentRepository, Payment, Money } from '@a4co/domain-payment';
import { PAYMENT_REPOSITORY_TOKEN } from '../application.constants';

export interface ProcessPaymentCommand {
  orderId: string;
  amount: number;
  currency: string;
  customerId: string;
  metadata?: Record<string, unknown>;
  stripePaymentIntentId?: string | null;
}

@Injectable()
export class ProcessPaymentUseCase {
  private readonly logger = new Logger(ProcessPaymentUseCase.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<Payment> {
    this.logger.log(`Processing payment for order ${command.orderId}`);

    const amount = Money.create(command.amount, command.currency);

    const payment = Payment.create({
      orderId: command.orderId,
      amount,
      customerId: command.customerId,
      metadata: command.metadata ?? {},
      stripePaymentIntentId: command.stripePaymentIntentId ?? null,
    });

    await this.paymentRepository.save(payment);
    return payment;
  }
}
