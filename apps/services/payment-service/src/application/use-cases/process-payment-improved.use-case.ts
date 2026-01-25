import { Injectable, Inject, Logger } from '@nestjs/common';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { PaymentEventPublisher } from '../services/payment-event.publisher';
import { PaymentRepository, Payment, Money } from '@a4co/domain-payment';
import { PAYMENT_REPOSITORY_TOKEN } from '../application.constants';

export interface ProcessPaymentImprovedCommand {
  orderId: string;
  amount: number;
  currency: string;
  customerId: string;
  metadata?: Record<string, unknown>;
  paymentMethodId?: string;
  idempotencyKey?: string;
}

@Injectable()
export class ProcessPaymentImprovedUseCase {
  private readonly logger = new Logger(ProcessPaymentImprovedUseCase.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
    private readonly stripeGateway: StripeGateway,
    private readonly eventPublisher: PaymentEventPublisher,
  ) {}

  async execute(command: ProcessPaymentImprovedCommand): Promise<void> {
    this.logger.log(`Processing payment for order ${command.orderId}`);

    const existing = await this.paymentRepository.findByOrderId(command.orderId);
    if (existing) return;

    const amount = Money.create(command.amount, command.currency);

    const payment = Payment.create({
      orderId: command.orderId,
      customerId: command.customerId,
      amount,
      metadata: command.metadata ?? {},
    });

    await this.paymentRepository.save(payment);

    try {
      const intent = await this.stripeGateway.createPaymentIntent({
        amount: command.amount,
        currency: command.currency,
        paymentMethodId: command.paymentMethodId,
        idempotencyKey: command.idempotencyKey,
        metadata: { orderId: command.orderId },
      });

      if (intent.status === 'succeeded') {
        payment.succeed(intent.id);
      } else {
        payment.process();
      }

      await this.paymentRepository.save(payment);
      await this.eventPublisher.publishPaymentEvents(payment);
    } catch (err) {
      const failed = await this.paymentRepository.findByOrderId(command.orderId);
      if (failed) {
        failed.fail(err instanceof Error ? err.message : 'Unknown error');
        await this.paymentRepository.save(failed);
        await this.eventPublisher.publishPaymentEvents(failed);
      }
      throw err;
    }
  }
}
