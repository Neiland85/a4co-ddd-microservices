import { Injectable, Logger } from '@nestjs/common';
import { PaymentSucceededEvent, PaymentFailedEvent } from '../../domain/events';
import { PaymentStatusValue } from '../../domain/value-objects/payment-status.vo';

export interface ProcessPaymentCommand {
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
}

export interface ProcessPaymentResult {
  paymentId: string;
  status: PaymentStatusValue;
  stripePaymentIntentId?: string;
}

@Injectable()
export class ProcessPaymentUseCase {
  private readonly logger = new Logger(ProcessPaymentUseCase.name);

  constructor(
    private readonly paymentRepository: any,
    private readonly stripeGateway: any,
    private readonly eventBus: any,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<ProcessPaymentResult> {
    this.logger.log(`💳 Procesando pago para orden ${command.orderId}, monto: ${command.amount} ${command.currency}`);

    try {
      // Paso 1: Crear Payment Intent en Stripe
      const paymentIntent = await this.stripeGateway.createPaymentIntent({
        amount: command.amount * 100, // Stripe usa centavos
        currency: command.currency.toLowerCase(),
        metadata: {
          orderId: command.orderId,
          customerId: command.customerId,
        },
      });

      this.logger.log(`Stripe Payment Intent creado: ${paymentIntent.id}`);

      // Paso 2: Guardar el pago en la base de datos
      const payment = await this.paymentRepository.create({
        orderId: command.orderId,
        customerId: command.customerId,
        amount: command.amount,
        currency: command.currency,
        status: PaymentStatusValue.PROCESSING,
        stripePaymentIntentId: paymentIntent.id,
      });

      // Paso 3: Simular procesamiento del pago
      // En producción, esto se manejaría via Stripe webhook
      // Para desarrollo, simulamos un pago exitoso
      const isSuccess = await this.simulatePaymentProcessing(paymentIntent.id);

      if (isSuccess) {
        // Actualizar estado del pago
        await this.paymentRepository.updateStatus(payment.paymentId, PaymentStatusValue.SUCCEEDED);

        // Publicar evento de pago exitoso
        const event = new PaymentSucceededEvent({
          paymentId: payment.paymentId,
          orderId: command.orderId,
          customerId: command.customerId,
          amount: { value: command.amount, currency: command.currency },
          stripePaymentIntentId: paymentIntent.id,
        });

        await this.eventBus.publish('payments.succeeded', event.toJSON());

        this.logger.log(`✅ Pago exitoso para orden ${command.orderId}`);

        return {
          paymentId: payment.paymentId,
          status: PaymentStatusValue.SUCCEEDED,
          stripePaymentIntentId: paymentIntent.id,
        };
      } else {
        throw new Error('Payment processing failed in Stripe');
      }
    } catch (error) {
      this.logger.error(`❌ Error procesando pago para orden ${command.orderId}:`, error);

      // Publicar evento de pago fallido
      const failedEvent = new PaymentFailedEvent({
        paymentId: 'unknown',
        orderId: command.orderId,
        customerId: command.customerId,
        amount: { value: command.amount, currency: command.currency },
        reason: error.message,
      });

      await this.eventBus.publish('payments.failed', failedEvent.toJSON());

      throw error;
    }
  }

  /**
   * Simula el procesamiento de pago en Stripe
   * En producción, esto sería manejado por el webhook de Stripe
   */
  private async simulatePaymentProcessing(paymentIntentId: string): Promise<boolean> {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 95% de éxito para simulación
    return Math.random() > 0.05;
  }
}
