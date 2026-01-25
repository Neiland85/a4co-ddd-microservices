import { Injectable, Inject, Logger } from '@nestjs/common';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { PaymentRepository, Payment, Money } from '@a4co/domain-payment';
import { PAYMENT_REPOSITORY_TOKEN } from '../application.constants';
import { PaymentEventPublisher } from '../services/payment-event.publisher';

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
    this.logger.log(`Processing payment (improved) for order ${command.orderId}`);

    // 1️⃣ Idempotencia: ¿ya existe pago?
    const existingPayment = await this.paymentRepository.findByOrderId(command.orderId);
    if (existingPayment) {
      this.logger.log(`Payment already exists for order ${command.orderId}`);
      return;
    }

    // 2️⃣ Crear Payment agregado
    const amount = Money.create(command.amount, command.currency);

    const payment = Payment.create({
      orderId: command.orderId,
      amount,
      customerId: command.customerId,
      metadata: command.metadata ?? {},
    });

    await this.paymentRepository.save(payment);

    try {
      // 3️⃣ Crear PaymentIntent en Stripe
      const paymentIntent = await this.stripeGateway.createPaymentIntent({
        amount: command.amount,
        currency: command.currency,
        paymentMethodId: command.paymentMethodId,
        idempotencyKey: command.idempotencyKey,
        metadata: {
          orderId: command.orderId,
        },
      });

      // 4️⃣ Transiciones de dominio
      if (paymentIntent.status === 'succeeded') {
        payment.succeed(paymentIntent.id);
      } else {
        payment.process();
      }

      await this.paymentRepository.save(payment);

      // 5️⃣ Publicar eventos
      await this.eventPublisher.publishPaymentEvents(payment);
    } catch (error) {
      this.logger.error(`Payment failed for order ${command.orderId}`, error);

      // 6️⃣ Registrar fallo de dominio (si el pago existe)
      const failedPayment = await this.paymentRepository.findByOrderId(command.orderId);
      if (failedPayment) {
        failedPayment.fail(error instanceof Error ? error.message : 'Unknown payment error');
        await this.paymentRepository.save(failedPayment);
        await this.eventPublisher.publishPaymentEvents(failedPayment);
      }

      throw error;
    }
  }
}
