import { Controller, Get, Post, Headers, RawBodyRequest, Req, Logger } from '@nestjs/common';
import { PaymentService } from '../application/services/payment.service';
import { StripeGateway } from '../infrastructure/stripe.gateway';
import { PaymentEventPublisher } from '../application/services/payment-event.publisher';
import { PaymentRepository } from '../domain/repositories/payment.repository';

@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeGateway: StripeGateway,
    private readonly eventPublisher: PaymentEventPublisher,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  @Get('health')
  getHealth() {
    return this.paymentService.getHealth();
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    this.logger.log('📥 Recibiendo webhook de Stripe');

    if (!signature) {
      this.logger.error('❌ Firma de Stripe no proporcionada');
      throw new Error('Missing stripe-signature header');
    }

    try {
      const event = this.stripeGateway.constructWebhookEvent({
        payload: req.rawBody as Buffer,
        signature,
      });

      this.logger.log(`📨 Evento de Stripe recibido: ${event.type}`);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event);
          break;

        case 'payment_intent.canceled':
          await this.handlePaymentIntentCanceled(event);
          break;

        default:
          this.logger.log(`⚠️  Tipo de evento no manejado: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error('❌ Error procesando webhook de Stripe:', error);
      throw error;
    }
  }

  private async handlePaymentIntentSucceeded(event: any): Promise<void> {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      this.logger.warn('⚠️  PaymentIntent sin orderId en metadata');
      return;
    }

    this.logger.log(`✅ Pago exitoso para orden ${orderId}, PaymentIntent: ${paymentIntent.id}`);

    try {
      // Buscar payment en la base de datos
      const payment = await this.paymentRepository.findByOrderId(orderId);
      
      if (payment) {
        // Actualizar estado del pago
        payment.markAsSucceeded(paymentIntent.id);
        await this.paymentRepository.save(payment);
        
        // Publicar eventos de dominio
        await this.eventPublisher.publishPaymentEvents(payment);
      } else {
        this.logger.warn(`⚠️  Payment no encontrado para orden ${orderId}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error procesando pago exitoso para orden ${orderId}:`, error);
      throw error;
    }
  }

  private async handlePaymentIntentFailed(event: any): Promise<void> {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;
    const failureReason = paymentIntent.last_payment_error?.message || 'Unknown error';

    if (!orderId) {
      this.logger.warn('⚠️  PaymentIntent sin orderId en metadata');
      return;
    }

    this.logger.error(`❌ Pago fallido para orden ${orderId}: ${failureReason}`);

    try {
      const payment = await this.paymentRepository.findByOrderId(orderId);
      
      if (payment) {
        payment.markAsFailed(failureReason);
        await this.paymentRepository.save(payment);
        
        await this.eventPublisher.publishPaymentEvents(payment);
      } else {
        this.logger.warn(`⚠️  Payment no encontrado para orden ${orderId}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error procesando pago fallido para orden ${orderId}:`, error);
      throw error;
    }
  }

  private async handlePaymentIntentCanceled(event: any): Promise<void> {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      this.logger.warn('⚠️  PaymentIntent sin orderId en metadata');
      return;
    }

    this.logger.log(`🔄 Pago cancelado para orden ${orderId}`);

    try {
      const payment = await this.paymentRepository.findByOrderId(orderId);
      
      if (payment) {
        payment.cancel('Cancelado desde Stripe');
        await this.paymentRepository.save(payment);
        
        await this.eventPublisher.publishPaymentEvents(payment);
      }
    } catch (error) {
      this.logger.error(`❌ Error procesando pago cancelado para orden ${orderId}:`, error);
      throw error;
    }
  }
}
