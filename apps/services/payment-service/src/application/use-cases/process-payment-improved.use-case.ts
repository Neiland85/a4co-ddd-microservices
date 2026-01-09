import { Injectable, Inject, Logger } from '@nestjs/common';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { PaymentEventPublisher } from '../services/payment-event.publisher';
import { PaymentRepository, Payment, Money } from '@a4co/domain-payment';

export interface ProcessPaymentCommand {
  orderId: string;
  amount: number;
  currency: string;
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
    @Inject('PAYMENT_REPOSITORY')
    private readonly paymentRepository: PaymentRepository,
    private readonly stripeGateway: StripeGateway,
    private readonly eventPublisher: PaymentEventPublisher,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<void> {
    this.logger.log(`Procesando pago para orden ${command.orderId}`);

    try {
      // 1. Verificar si ya existe un pago para esta orden (Idempotencia)
      const existingPayment = await this.paymentRepository.findByOrderId(command.orderId);
      if (existingPayment) {
        this.logger.log(
          `Pago ya existe para orden ${command.orderId}, estado: ${existingPayment.status}`,
        );
        return;
      }

      // 2. Crear entidad de pago inicial
      const payment = Payment.create({
        orderId: command.orderId,
        customerId: command.customerId,
        amount: Money.create(command.amount, command.currency),
        metadata: command.metadata ?? {},
      });

      await this.paymentRepository.save(payment);

      // 3. Interactuar con Stripe
      const stripeParams: any = {
        amount: Money.create(command.amount, command.currency),
        orderId: command.orderId,
        customerId: command.customerId,
        metadata: { ...command.metadata, orderId: command.orderId },
      };

      if (command.paymentMethodId) {
        stripeParams.paymentMethodId = command.paymentMethodId;
      }

      if (command.idempotencyKey) {
        stripeParams.idempotencyKey = command.idempotencyKey;
      }

      const paymentIntent = await this.stripeGateway.createPaymentIntent(stripeParams);

      // 4. Actualizar pago con ID de Stripe
      if (paymentIntent.status === 'succeeded') {
        payment.markAsSucceeded(paymentIntent.id);
      } else {
        payment.process();
      }
      await this.paymentRepository.save(payment);

      this.logger.log(`PaymentIntent creado: ${paymentIntent.id}`);
    } catch (error: any) {
      // <--- CORRECCIÓN AQUÍ: Añadido ': any'
      this.logger.error(`Error procesando pago para orden ${command.orderId}`, error);

      // Intentar registrar el fallo si es posible
      try {
        const failedPayment = await this.paymentRepository.findByOrderId(command.orderId);
        if (failedPayment) {
          failedPayment.markAsFailed(error.message || 'Unknown error');
          await this.paymentRepository.save(failedPayment);

          // Publicar evento de fallo
          await this.eventPublisher.publishPaymentEvents(failedPayment);
        }
      } catch (innerError) {
        this.logger.error('Error crítico al registrar fallo de pago', innerError);
      }

      throw error;
    }
  }
}
