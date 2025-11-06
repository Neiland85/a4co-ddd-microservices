import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, NatsContext } from '@nestjs/microservices';
import { ReserveStockUseCase } from '../../application/use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from '../../application/use-cases/release-stock.use-case';
import { ConfirmStockUseCase } from '../../application/use-cases/confirm-stock.use-case';

interface PaymentSucceededEvent {
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  timestamp: Date;
  sagaId?: string;
}

interface OrderCancelledEvent {
  orderId: string;
  reason: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  timestamp: Date;
  sagaId?: string;
}

interface OrderCompletedEvent {
  orderId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  timestamp: Date;
  sagaId?: string;
}

@Controller()
export class OrderEventsHandler {
  private readonly logger = new Logger(OrderEventsHandler.name);

  constructor(
    private readonly reserveStockUseCase: ReserveStockUseCase,
    private readonly releaseStockUseCase: ReleaseStockUseCase,
    private readonly confirmStockUseCase: ConfirmStockUseCase,
  ) {}

  @EventPattern('payment.succeeded')
  async handlePaymentSucceeded(
    @Payload() event: PaymentSucceededEvent,
    @Ctx() context: NatsContext,
  ) {
    this.logger.log(`Received payment.succeeded event for order ${event.orderId}`);

    try {
      const { orderId, items, sagaId } = event;
      const results = [];

      // Reservar stock para cada item del pedido
      for (const item of items) {
        try {
          const result = await this.reserveStockUseCase.execute({
            productId: item.productId,
            quantity: item.quantity,
            orderId,
            customerId: event.customerId,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
            sagaId,
          });

          results.push({
            productId: item.productId,
            success: result.success,
            message: result.message,
          });

          if (!result.success) {
            this.logger.warn(
              `Failed to reserve stock for product ${item.productId}: ${result.message}`,
            );
          }
        } catch (error: any) {
          this.logger.error(
            `Error reserving stock for product ${item.productId}:`,
            error,
          );
          results.push({
            productId: item.productId,
            success: false,
            message: error.message,
          });
        }
      }

      // Verificar si todas las reservas fueron exitosas
      const allSuccessful = results.every(r => r.success);
      if (!allSuccessful) {
        this.logger.warn(
          `Some stock reservations failed for order ${orderId}. Results:`,
          results,
        );
      } else {
        this.logger.log(`All stock reservations successful for order ${orderId}`);
      }
    } catch (error: any) {
      this.logger.error(`Error handling payment.succeeded event:`, error);
      throw error;
    }
  }

  @EventPattern('order.cancelled')
  async handleOrderCancelled(
    @Payload() event: OrderCancelledEvent,
    @Ctx() context: NatsContext,
  ) {
    this.logger.log(`Received order.cancelled event for order ${event.orderId}`);

    try {
      const { orderId, items, reason, sagaId } = event;

      // Liberar stock reservado para cada item (compensación)
      for (const item of items) {
        try {
          const result = await this.releaseStockUseCase.execute({
            productId: item.productId,
            quantity: item.quantity,
            orderId,
            reason: `Order cancelled: ${reason}`,
            sagaId,
          });

          if (!result.success) {
            this.logger.warn(
              `Failed to release stock for product ${item.productId}: ${result.message}`,
            );
          } else {
            this.logger.log(
              `Released ${item.quantity} units of product ${item.productId}`,
            );
          }
        } catch (error: any) {
          this.logger.error(
            `Error releasing stock for product ${item.productId}:`,
            error,
          );
          // Continuar con otros productos aunque uno falle
        }
      }

      this.logger.log(`Stock release completed for order ${orderId}`);
    } catch (error: any) {
      this.logger.error(`Error handling order.cancelled event:`, error);
      throw error;
    }
  }

  @EventPattern('order.completed')
  async handleOrderCompleted(
    @Payload() event: OrderCompletedEvent,
    @Ctx() context: NatsContext,
  ) {
    this.logger.log(`Received order.completed event for order ${event.orderId}`);

    try {
      const { orderId, items, sagaId } = event;

      // Confirmar deducción de stock para cada item
      for (const item of items) {
        try {
          const result = await this.confirmStockUseCase.execute({
            productId: item.productId,
            quantity: item.quantity,
            orderId,
            sagaId,
          });

          if (result.success) {
            this.logger.log(
              `Confirmed stock deduction for product ${item.productId}: ${item.quantity} units`,
            );
          }
        } catch (error: any) {
          this.logger.error(
            `Error confirming stock for product ${item.productId}:`,
            error,
          );
          // Continuar con otros productos aunque uno falle
        }
      }

      this.logger.log(`Stock confirmation completed for order ${orderId}`);
    } catch (error: any) {
      this.logger.error(`Error handling order.completed event:`, error);
      throw error;
    }
  }
}
