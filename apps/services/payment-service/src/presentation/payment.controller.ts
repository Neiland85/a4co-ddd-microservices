import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { PAYMENT_REPOSITORY_TOKEN } from '../application/application.constants';
import { PaymentEventPublisher } from '../application/services/payment-event.publisher';
import { PaymentService } from '../application/services/payment.service';
import { ProcessPaymentUseCase } from '../application/use-cases/process-payment.use-case';
import { PaymentRepository } from '@a4co/domain-payment';
import { StripeGateway } from '../infrastructure/stripe.gateway';

@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeGateway: StripeGateway,
    private readonly eventPublisher: PaymentEventPublisher,
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
    private readonly processPaymentUseCase: ProcessPaymentUseCase, // Inyectamos el caso de uso
  ) {}

  @Get('health')
  getHealth() {
    return this.paymentService.getHealth();
  }

  // --- REST API: Handle Webhook ---
  @Post('webhook')
  async handleWebhook(@Body() body: any, @Headers('stripe-signature') signature: string) {
    this.logger.log('📥 Recibiendo webhook de Stripe');

    if (!signature) {
      this.logger.error('❌ Firma de Stripe no proporcionada');
      throw new Error('Missing stripe-signature header');
    }

    try {
      const event = this.stripeGateway.constructWebhookEvent(body, signature);

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

  // --- REST API: Create Payment ---
  @Post()
  async createPayment(@Body() dto: any) {
    this.logger.log(`💳 Creating payment for order ${dto.orderId}`);
    const payment = await this.paymentService.processPayment({
      orderId: dto.orderId,
      amount: dto.amount,
      currency: dto.currency,
      customerId: dto.customerId,
      description: dto.description,
      metadata: dto.metadata,
    });
    return payment.toPrimitives();
  }

  // --- REST API: Get Payment by Order ID ---
  @Get('order/:orderId')
  async getPaymentByOrder(@Param('orderId') orderId: string) {
    this.logger.log(`🔍 Fetching payment for order ${orderId}`);
    const payment = await this.paymentService.getPaymentByOrderId(orderId);
    if (!payment) {
      throw new NotFoundException('Pago no encontrado para esta orden');
    }
    return payment.toPrimitives();
  }

  // --- REST API: Refund Payment ---
  @Post(':paymentId/refund')
  async refundPayment(@Param('paymentId') paymentId: string, @Body() dto: any) {
    this.logger.log(`💰 Processing refund for payment ${paymentId}`);
    const refunded = await this.paymentService.refundPayment(paymentId, dto.amount, dto.reason);
    return refunded;
  }

  // --- REST API: Get Payment by ID ---
  @Get(':paymentId')
  async getPayment(@Param('paymentId') paymentId: string) {
    this.logger.log(`🔍 Fetching payment ${paymentId}`);
    const payment = await this.paymentService.getPaymentById(paymentId);
    if (!payment) {
      throw new NotFoundException('Pago no encontrado');
    }
    return payment.toPrimitives();
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
      const payment = await this.paymentRepository.findByOrderId(orderId);

      if (payment) {
        payment.markAsSucceeded(paymentIntent.id);
        await this.paymentRepository.save(payment);
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
        payment.markAsFailed('Cancelado desde Stripe');
        await this.paymentRepository.save(payment);
        await this.eventPublisher.publishPaymentEvents(payment);
      }
    } catch (error) {
      this.logger.error(`❌ Error procesando pago cancelado para orden ${orderId}:`, error);
      throw error;
    }
  }
}
