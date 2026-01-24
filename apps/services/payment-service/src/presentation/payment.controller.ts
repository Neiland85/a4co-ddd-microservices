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
import { PaymentRepository, PaymentId } from '@a4co/domain-payment';
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
  ) {}

  @Get('health')
  getHealth() {
    return this.paymentService.getHealth();
  }

  @Post()
  async createPayment(@Body() dto: any) {
    this.logger.log(`💳 Creating payment for order ${dto.orderId}`);

    const payment = await this.paymentService.processPayment({
      orderId: dto.orderId,
      amount: dto.amount,
      currency: dto.currency,
      customerId: dto.customerId,
      metadata: dto.metadata,
      stripePaymentIntentId: dto.stripePaymentIntentId ?? null,
    });

    await this.eventPublisher.publishPaymentEvents(payment);
    return (payment as any).toPrimitives?.() ?? { status: 'ok' };
  }

  @Get('order/:orderId')
  async getPaymentByOrder(@Param('orderId') orderId: string) {
    const payment = await this.paymentService.getPaymentByOrderId(orderId);
    if (!payment) throw new NotFoundException('Pago no encontrado para esta orden');
    return (payment as any).toPrimitives?.() ?? { status: 'ok' };
  }

  @Get(':paymentId')
  async getPayment(@Param('paymentId') paymentId: string) {
    const payment = await this.paymentService.getPaymentById(paymentId);
    if (!payment) throw new NotFoundException('Pago no encontrado');
    return (payment as any).toPrimitives?.() ?? { status: 'ok' };
  }

  @Post(':paymentId/refund')
  async refundPayment(@Param('paymentId') paymentId: string, @Body() dto: any) {
    const payment = await this.paymentService.refundPayment(paymentId, dto?.amount, dto?.reason);
    await this.eventPublisher.publishPaymentEvents(payment);
    return { status: 'ok', paymentId };
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Headers('stripe-signature') signature: string) {
    if (!signature) throw new Error('Missing stripe-signature header');

    const event = this.stripeGateway.constructWebhookEvent(body, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled':
        // estabilización: no aplicamos lógica aquí todavía
        break;
      default:
        break;
    }

    return { received: true };
  }
}
