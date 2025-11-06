import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, NatsContext } from '@nestjs/microservices';
import { ReserveStockUseCase } from '../application/use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from '../application/use-cases/release-stock.use-case';
import { ConfirmStockUseCase } from '../application/use-cases/confirm-stock.use-case';
import { StockQuantity } from '../domain/value-objects/stock-quantity.vo';

interface PaymentSucceededEvent {
  orderId: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentId: string;
  timestamp: Date;
  sagaId?: string;
}

interface OrderCancelledEvent {
  orderId: string;
  customerId: string;
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
  customerId: string;
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
    private readonly confirmStockUseCase: ConfirmStockUseCase
  ) {}

  @EventPattern('payment.succeeded')
  async handlePaymentSucceeded(
    @Payload() event: PaymentSucceededEvent,
    @Ctx() context: NatsContext
  ): Promise<void> {
    this.logger.log(`Received payment.succeeded event for order ${event.orderId}`, {
      orderId: event.orderId,
      sagaId: event.sagaId,
    });

    try {
      const reservationResults = await Promise.allSettled(
        event.items.map(item =>
          this.reserveStockUseCase.execute({
            productId: item.productId,
            quantity: item.quantity,
            orderId: event.orderId,
            customerId: event.customerId,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
            sagaId: event.sagaId,
          })
        )
      );

      const failures = reservationResults.filter(
        result => result.status === 'rejected' || !result.value.success
      );

      if (failures.length > 0) {
        this.logger.warn(
          `Some products could not be reserved for order ${event.orderId}`,
          {
            failures: failures.length,
            total: event.items.length,
          }
        );
        // InventoryOutOfStockEvent will be published automatically by the aggregate
      } else {
        this.logger.log(`Successfully reserved stock for all items in order ${event.orderId}`);
        // InventoryReservedEvent will be published automatically by the aggregate
      }
    } catch (error) {
      this.logger.error(`Error processing payment.succeeded event for order ${event.orderId}`, error);
      throw error;
    }
  }

  @EventPattern('order.cancelled')
  async handleOrderCancelled(
    @Payload() event: OrderCancelledEvent,
    @Ctx() context: NatsContext
  ): Promise<void> {
    this.logger.log(`Received order.cancelled event for order ${event.orderId}`, {
      orderId: event.orderId,
      reason: event.reason,
      sagaId: event.sagaId,
    });

    try {
      // Release stock for all items in the order
      await Promise.allSettled(
        event.items.map(item =>
          this.releaseStockUseCase.execute({
            productId: item.productId,
            quantity: item.quantity,
            orderId: event.orderId,
            reason: `Order cancelled: ${event.reason}`,
            sagaId: event.sagaId,
          })
        )
      );

      this.logger.log(`Successfully released stock for cancelled order ${event.orderId}`);
      // InventoryReleasedEvent will be published automatically by the aggregate
    } catch (error) {
      this.logger.error(`Error processing order.cancelled event for order ${event.orderId}`, error);
      throw error;
    }
  }

  @EventPattern('order.completed')
  async handleOrderCompleted(
    @Payload() event: OrderCompletedEvent,
    @Ctx() context: NatsContext
  ): Promise<void> {
    this.logger.log(`Received order.completed event for order ${event.orderId}`, {
      orderId: event.orderId,
      sagaId: event.sagaId,
    });

    try {
      // Confirm stock deduction for all items in the order
      await Promise.allSettled(
        event.items.map(item =>
          this.confirmStockUseCase.execute({
            productId: item.productId,
            quantity: item.quantity,
            orderId: event.orderId,
            sagaId: event.sagaId,
          })
        )
      );

      this.logger.log(`Successfully confirmed stock deduction for order ${event.orderId}`);
      // StockDeductedEvent will be published automatically by the aggregate
    } catch (error) {
      this.logger.error(`Error processing order.completed event for order ${event.orderId}`, error);
      throw error;
    }
  }
}
