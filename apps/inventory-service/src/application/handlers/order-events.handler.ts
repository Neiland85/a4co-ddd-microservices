import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, NatsContext } from '@nestjs/microservices';
import { ReserveStockUseCase } from '../../application/use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from '../../application/use-cases/release-stock.use-case';
import { ConfirmStockUseCase } from '../../application/use-cases/confirm-stock.use-case';
import { EventPublisherService } from '../events/event-publisher.service';
import {
  InventoryReservedEvent,
  InventoryOutOfStockEvent,
} from '../../domain/events';

interface PaymentSucceededEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  eventData: {
    orderId: string;
    paymentId: string;
    amount: number;
    items: Array<{ productId: string; quantity: number }>;
    timestamp: Date;
  };
  sagaId?: string;
}

interface OrderCancelledEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  eventData: {
    orderId: string;
    reason: string;
    items: Array<{ productId: string; quantity: number }>;
    timestamp: Date;
  };
  sagaId?: string;
}

interface OrderCompletedEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  eventData: {
    orderId: string;
    items: Array<{ productId: string; quantity: number }>;
    timestamp: Date;
  };
  sagaId?: string;
}

@Controller()
export class OrderEventsHandler {
  private readonly logger = new Logger(OrderEventsHandler.name);

  constructor(
    private readonly reserveStockUseCase: ReserveStockUseCase,
    private readonly releaseStockUseCase: ReleaseStockUseCase,
    private readonly confirmStockUseCase: ConfirmStockUseCase,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  @EventPattern('payment.succeeded')
  async handlePaymentSucceeded(
    @Payload() event: PaymentSucceededEvent,
    @Ctx() context: NatsContext,
  ) {
    this.logger.log(`Received payment.succeeded event for order: ${event.eventData.orderId}`);

    const { orderId, items, sagaId } = event.eventData;
    const results: Array<{ productId: string; success: boolean; error?: string }> = [];

    try {
      // Process each item in the order
      for (const item of items) {
        try {
          const result = await this.reserveStockUseCase.execute({
            productId: item.productId,
            quantity: item.quantity,
            orderId,
            customerId: '', // Not needed for reservation
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            sagaId,
          });

          results.push({
            productId: item.productId,
            success: result.success,
            error: result.message,
          });

          if (!result.success) {
            this.logger.warn(
              `Failed to reserve stock for product ${item.productId}: ${result.message}`,
            );
          }
        } catch (error: any) {
          this.logger.error(
            `Error reserving stock for product ${item.productId}`,
            error.stack,
          );
          results.push({
            productId: item.productId,
            success: false,
            error: error.message,
          });
        }
      }

      // Check if all reservations succeeded
      const allSucceeded = results.every(r => r.success);
      const failedProducts = results.filter(r => !r.success);

      if (allSucceeded) {
        // Publish InventoryReservedEvent for the entire order
        const reservedEvent = new InventoryReservedEvent(
          orderId,
          {
            orderId,
            quantity: items.reduce((sum, item) => sum + item.quantity, 0),
            currentStock: 0, // Will be updated by individual product events
            reservedStock: 0,
            availableStock: 0,
            timestamp: new Date(),
          },
          sagaId,
        );
        await this.eventPublisher.publish(reservedEvent);
        this.logger.log(`All stock reserved successfully for order: ${orderId}`);
      } else {
        // Publish InventoryOutOfStockEvent for failed products
        for (const failed of failedProducts) {
          const outOfStockEvent = new InventoryOutOfStockEvent(
            failed.productId,
            {
              orderId,
              requestedQuantity: items.find(i => i.productId === failed.productId)?.quantity || 0,
              availableStock: 0, // Will be updated by individual product events
              timestamp: new Date(),
            },
            sagaId,
          );
          await this.eventPublisher.publish(outOfStockEvent);
        }
        this.logger.warn(
          `Some products out of stock for order: ${orderId}. Failed: ${failedProducts.length}`,
        );
      }
    } catch (error: any) {
      this.logger.error(`Error processing payment.succeeded event`, error.stack);
      throw error;
    }
  }

  @EventPattern('order.cancelled')
  async handleOrderCancelled(
    @Payload() event: OrderCancelledEvent,
    @Ctx() context: NatsContext,
  ) {
    this.logger.log(`Received order.cancelled event for order: ${event.eventData.orderId}`);

    const { orderId, items, reason, sagaId } = event.eventData;

    try {
      // Release stock for each item (compensation)
      for (const item of items) {
        try {
          await this.releaseStockUseCase.execute({
            productId: item.productId,
            quantity: item.quantity,
            orderId,
            reason: `Order cancelled: ${reason}`,
            sagaId,
          });
          this.logger.log(
            `Released ${item.quantity} units of product ${item.productId} for cancelled order ${orderId}`,
          );
        } catch (error: any) {
          this.logger.error(
            `Error releasing stock for product ${item.productId}`,
            error.stack,
          );
          // Continue with other items even if one fails
        }
      }

      this.logger.log(`Stock released successfully for cancelled order: ${orderId}`);
    } catch (error: any) {
      this.logger.error(`Error processing order.cancelled event`, error.stack);
      throw error;
    }
  }

  @EventPattern('order.completed')
  async handleOrderCompleted(
    @Payload() event: OrderCompletedEvent,
    @Ctx() context: NatsContext,
  ) {
    this.logger.log(`Received order.completed event for order: ${event.eventData.orderId}`);

    const { orderId, items, sagaId } = event.eventData;

    try {
      // Confirm stock deduction for each item
      for (const item of items) {
        try {
          await this.confirmStockUseCase.execute({
            productId: item.productId,
            quantity: item.quantity,
            orderId,
            sagaId,
          });
          this.logger.log(
            `Confirmed stock deduction for ${item.quantity} units of product ${item.productId} for order ${orderId}`,
          );
        } catch (error: any) {
          this.logger.error(
            `Error confirming stock for product ${item.productId}`,
            error.stack,
          );
          // Continue with other items even if one fails
        }
      }

      this.logger.log(`Stock confirmed successfully for completed order: ${orderId}`);
    } catch (error: any) {
      this.logger.error(`Error processing order.completed event`, error.stack);
      throw error;
    }
  }
}
