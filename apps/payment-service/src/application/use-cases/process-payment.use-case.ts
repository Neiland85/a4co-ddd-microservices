import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaymentDomainService } from '../../domain/services/payment-domain.service';
import { Payment } from '../../domain/entities/payment.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentStatusValue } from '../../domain/value-objects/payment-status.vo';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { PaymentEventPublisher } from '../services/payment-event.publisher';
import { PAYMENT_REPOSITORY_TOKEN } from '../application.constants';

export interface ProcessPaymentCommand {
  orderId: string;
  amount: Money;
  customerId: string;
  metadata?: Record<string, any>;
  paymentMethodId?: string;
  idempotencyKey?: string;
  sagaId?: string;
}

@Injectable()
export class ProcessPaymentUseCase {
  private readonly logger = new Logger(ProcessPaymentUseCase.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentDomainService: PaymentDomainService,
    private readonly stripeGateway: StripeGateway,
    private readonly eventPublisher: PaymentEventPublisher,
  ) { }

  public async execute(command: ProcessPaymentCommand): Promise<Payment> {
    this.paymentDomainService.validatePaymentLimits(command.amount);

    const existingPayment = await this.paymentRepository.findByOrderId(command.orderId);

    if (existingPayment) {
      // Idempotent behavior: if already succeeded or refunded, return existing state
      if ([PaymentStatusValue.SUCCEEDED, PaymentStatusValue.REFUNDED].includes(existingPayment.status.value)) {
        this.logger.log(`Payment for order ${command.orderId} already processed with status ${existingPayment.status.value}`);
        return existingPayment;
      }

      if (existingPayment.status.value === PaymentStatusValue.PROCESSING) {
        this.logger.log(`Payment for order ${command.orderId} is already processing`);
        return existingPayment;
      }
    }

    const payment = existingPayment ??
      Payment.create({
        orderId: command.orderId,
        amount: command.amount,
        customerId: command.customerId,
        metadata: command.metadata,
      });

    if (!this.paymentDomainService.canProcessPayment(payment)) {
      throw new Error(`Payment ${payment.paymentId.value} cannot be processed from status ${payment.status.value}`);
    }

    payment.process();
    await this.persist(payment);

    try {
      const intent = await this.stripeGateway.createPaymentIntent({
        amount: command.amount,
        orderId: command.orderId,
        customerId: command.customerId,
        metadata: command.metadata,
        paymentMethodId: command.paymentMethodId,
        idempotencyKey: command.idempotencyKey,
      });

      if (intent.status === 'succeeded') {
        payment.markAsSucceeded(intent.id);
      } else if (intent.status === 'processing') {
        this.logger.log(`Stripe payment intent ${intent.id} is processing for order ${command.orderId}`);
      } else {
        payment.markAsFailed(`Stripe payment intent status: ${intent.status}`);
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unknown payment processing error';
      payment.markAsFailed(reason);
      await this.persist(payment);
      throw error;
    }

    await this.persist(payment);
    return payment;
  }

  private async persist(payment: Payment): Promise<void> {
    await this.paymentRepository.save(payment);
    await this.eventPublisher.publishPaymentEvents(payment);
  }
}

