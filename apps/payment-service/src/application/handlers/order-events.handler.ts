import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { ProcessPaymentUseCase } from '../application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from '../application/use-cases/refund-payment.use-case';
import { Money } from '../domain/value-objects/money.vo';
import { getLogger } from '@a4co/observability';

interface OrderCreatedEvent {
  orderId: string;
  customerId: string;
  totalAmount: number;
  currency?: string;
  items?: Array<{ productId: string; quantity: number; price: number }>;
  metadata?: Record<string, any>;
  sagaId?: string;
}

interface OrderCancelledEvent {
  orderId: string;
  reason?: string;
  cancelledAt?: Date;
  sagaId?: string;
}

@Controller()
export class OrderEventsHandler {
  private readonly logger = getLogger(OrderEventsHandler.name);

  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase
  ) {}

  @EventPattern('order.created')
  async handleOrderCreated(
    @Payload() event: OrderCreatedEvent,
    @Ctx() context: any
  ) {
    this.logger.info('Received order.created event', {
      orderId: event.orderId,
      customerId: event.customerId,
      totalAmount: event.totalAmount,
      sagaId: event.sagaId,
    });

    try {
      // Validar datos del evento
      if (!event.orderId || !event.customerId || !event.totalAmount) {
        throw new Error('Missing required fields in order.created event');
      }

      const amount = new Money(
        event.totalAmount,
        event.currency?.toUpperCase() || 'USD'
      );

      // Procesar pago
      const payment = await this.processPaymentUseCase.execute(
        event.orderId,
        amount,
        event.customerId,
        {
          ...event.metadata,
          sagaId: event.sagaId,
          source: 'order.created',
        }
      );

      this.logger.info('Payment processed successfully from order.created', {
        orderId: event.orderId,
        paymentId: payment.paymentId.toString(),
        status: payment.status,
      });

      return {
        success: true,
        paymentId: payment.paymentId.toString(),
        status: payment.status,
      };
    } catch (error) {
      this.logger.error('Failed to process payment from order.created event', {
        orderId: event.orderId,
        error: error.message,
        stack: error.stack,
      });

      // Re-lanzar el error para que NATS pueda manejarlo
      throw error;
    }
  }

  @EventPattern('order.cancelled')
  async handleOrderCancelled(
    @Payload() event: OrderCancelledEvent,
    @Ctx() context: any
  ) {
    this.logger.info('Received order.cancelled event', {
      orderId: event.orderId,
      reason: event.reason,
      sagaId: event.sagaId,
    });

    try {
      // Validar datos del evento
      if (!event.orderId) {
        throw new Error('Missing orderId in order.cancelled event');
      }

      // Procesar reembolso (compensación)
      await this.refundPaymentUseCase.execute(
        event.orderId,
        undefined, // Reembolso completo
        event.reason || 'Order cancelled'
      );

      this.logger.info('Refund processed successfully from order.cancelled', {
        orderId: event.orderId,
      });

      return {
        success: true,
        orderId: event.orderId,
      };
    } catch (error) {
      this.logger.error(
        'Failed to process refund from order.cancelled event',
        {
          orderId: event.orderId,
          error: error.message,
          stack: error.stack,
        }
      );

      // Si el pago no existe o ya fue reembolsado, no es un error crítico
      if (error.message?.includes('not found') || error.message?.includes('cannot be refunded')) {
        this.logger.warn('Refund skipped (payment not found or already refunded)', {
          orderId: event.orderId,
        });
        return {
          success: true,
          skipped: true,
          reason: error.message,
        };
      }

      // Re-lanzar el error para otros casos
      throw error;
    }
  }
}
