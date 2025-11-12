import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Headers,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from '../application/services/payment.service';
import { ProcessPaymentCommand } from '../application/use-cases/process-payment.use-case';
import { CreatePaymentDto, RefundPaymentDto, WebhookEventDto } from './dtos';
import { StripeGateway } from '../infrastructure/stripe.gateway';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeGateway: StripeGateway,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio funcionando correctamente' })
  getHealth() {
    return this.paymentService.getHealth();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Procesar un nuevo pago' })
  @ApiResponse({ status: 201, description: 'Pago procesado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createPayment(@Body() dto: CreatePaymentDto) {
    const command: ProcessPaymentCommand = {
      orderId: dto.orderId,
      amount: dto.amount,
      currency: dto.currency,
      customerId: dto.customerId,
      description: dto.description,
      metadata: dto.metadata,
    };

    const payment = await this.paymentService.processPayment(command);
    return payment.toPrimitives();
  }

  @Get('order/:orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener pago por ID de orden' })
  @ApiResponse({ status: 200, description: 'Pago encontrado' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async getPaymentByOrder(@Param('orderId') orderId: string) {
    const payment = await this.paymentService.getPaymentByOrderId(orderId);
    if (!payment) {
      throw new NotFoundException('Pago no encontrado para esta orden');
    }
    return payment.toPrimitives();
  }

  @Get(':paymentId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener detalles de un pago' })
  @ApiResponse({ status: 200, description: 'Pago encontrado' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async getPayment(@Param('paymentId') paymentId: string) {
    const payment = await this.paymentService.getPaymentById(paymentId);
    if (!payment) {
      throw new NotFoundException('Pago no encontrado');
    }
    return payment.toPrimitives();
  }

  @Post(':paymentId/refund')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Procesar un reembolso' })
  @ApiResponse({ status: 200, description: 'Reembolso procesado exitosamente' })
  @ApiResponse({ status: 400, description: 'No se puede procesar el reembolso' })
  async refundPayment(
    @Param('paymentId') paymentId: string,
    @Body() dto: RefundPaymentDto,
  ) {
    return await this.paymentService.refundPayment(
      paymentId,
      dto.amount,
      dto.reason,
    );
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook para eventos de Stripe' })
  @ApiResponse({ status: 200, description: 'Webhook procesado' })
  @ApiResponse({ status: 400, description: 'Error en el webhook' })
  async handleWebhook(
    @Body() rawBody: any,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      const event = this.stripeGateway.constructWebhookEvent(rawBody, signature);
      this.logger.log(`Webhook recibido: ${event.type}`);
      
      // TODO: Implementar manejo de eventos específicos
      switch (event.type) {
        case 'payment_intent.succeeded':
          // Manejar pago exitoso
          break;
        case 'payment_intent.payment_failed':
          // Manejar pago fallido
          break;
        case 'charge.refunded':
          // Manejar reembolso
          break;
        default:
          this.logger.warn(`Evento no manejado: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error('Error procesando webhook:', error);
      throw new BadRequestException('Webhook signature verification failed');
    }
  }
}
