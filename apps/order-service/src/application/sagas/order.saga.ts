import { Controller, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  IOrderRepository,
  OrderId,
  OrderReservation,
  OrderStatusEnum,
} from '../../domain';

interface InventoryReservationItem {
  reservationId: string;
  productId: string;
  quantity: number;
}

interface InventoryReservedEventPayload {
  orderId: string;
  customerId: string;
  reservations: InventoryReservationItem[];
  totalAmount: number;
  timestamp: string;
}

interface InventoryOutOfStockEventPayload {
  orderId: string;
  customerId: string;
  unavailableItems: Array<{
    productId: string;
    requestedQuantity: number;
    availableQuantity: number;
  }>;
  timestamp: string;
}

interface PaymentSucceededEventPayload {
  orderId: string;
  paymentId: string;
  amount: {
    value: number;
    currency: string;
  };
  customerId?: string;
  timestamp: string;
}

interface PaymentFailedEventPayload {
  orderId: string;
  paymentId?: string;
  reason: string;
  timestamp: string;
}

@Controller()
@Injectable()
export class OrderSaga {
  private readonly logger = new Logger(OrderSaga.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('NATS_CLIENT')
    private readonly eventBus: ClientProxy,
  ) {}

  @EventPattern('inventory.reserved')
  async onInventoryReserved(@Payload() payload: InventoryReservedEventPayload): Promise<void> {
    try {
      this.logger.log(
        `📦 Inventory reserved for order ${payload.orderId}: ${payload.reservations.length} reservation(s)`,
      );
      const order = await this.requireOrder(payload.orderId);

      order.recordInventoryReservations(
        payload.reservations.map<OrderReservation>(reservation => ({
          reservationId: reservation.reservationId,
          productId: reservation.productId,
          quantity: reservation.quantity,
        })),
      );

      await this.orderRepository.save(order);

      await this.emit('payments.process_request', {
        orderId: payload.orderId,
        customerId: order.customerId,
        amount: {
          value: order.totalAmount,
          currency: 'EUR',
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(
        `❌ Failed handling inventory.reserved for order ${payload.orderId}:`,
        error,
      );
      await this.failOrder(payload.orderId, 'Inventory reservation handling failed');
    }
  }

  @EventPattern('inventory.out_of_stock')
  async onInventoryOutOfStock(@Payload() payload: InventoryOutOfStockEventPayload): Promise<void> {
    this.logger.warn(`⚠️ Inventory out of stock for order ${payload.orderId}`);

    const reason =
      payload.unavailableItems?.length
        ? payload.unavailableItems
            .map(
              item =>
                `${item.productId} requested ${item.requestedQuantity}, available ${item.availableQuantity}`,
            )
            .join('; ')
        : 'Inventory out of stock';

    await this.failOrder(payload.orderId, reason);
  }

  @EventPattern('payments.succeeded')
  async onPaymentSucceeded(@Payload() payload: PaymentSucceededEventPayload): Promise<void> {
    try {
      this.logger.log(`✅ Payment succeeded for order ${payload.orderId}`);
      const order = await this.requireOrder(payload.orderId);

      order.confirmPayment(payload.paymentId);

      if (order.status === OrderStatusEnum.PAYMENT_CONFIRMED) {
        order.complete();
      }

      await this.orderRepository.save(order);

      await this.emit('orders.completed', {
        orderId: order.id,
        customerId: order.customerId,
        paymentId: order.paymentId,
        totalAmount: order.totalAmount,
        reservations: order.reservations,
        items: order.items.map(item => item.toJSON()),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(
        `❌ Failed handling payments.succeeded for order ${payload.orderId}:`,
        error,
      );
      await this.failOrder(
        payload.orderId,
        error instanceof Error ? error.message : 'Unknown payment handling error',
      );
    }
  }

  @EventPattern('payments.failed')
  async onPaymentFailed(@Payload() payload: PaymentFailedEventPayload): Promise<void> {
    this.logger.error(`❌ Payment failed for order ${payload.orderId}: ${payload.reason}`);
    await this.compensateOrder(payload.orderId, payload.reason, payload.paymentId);
  }

  private async requireOrder(orderId: string) {
    const order = await this.orderRepository.findById(new OrderId(orderId));
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    return order;
  }

  private async compensateOrder(orderId: string, reason: string, paymentId?: string): Promise<void> {
    const order = await this.requireOrder(orderId);

    if (order.status === OrderStatusEnum.COMPLETED || order.status === OrderStatusEnum.CANCELLED) {
      this.logger.warn(`🔁 Compensation ignored for order ${orderId} in status ${order.status}`);
      return;
    }

    order.markAsFailed(reason);
    await this.orderRepository.save(order);

    // Release inventory reservations
    await Promise.all(
      order.reservations.map(reservation =>
        this.emit('inventory.release', {
          orderId,
          reservationId: reservation.reservationId,
          productId: reservation.productId,
          quantity: reservation.quantity,
          reason,
          timestamp: new Date().toISOString(),
        }),
      ),
    );

    // Trigger refund if we have a payment identifier
    const refundPaymentId = paymentId ?? order.paymentId;
    if (refundPaymentId) {
      await this.emit('payment.refund', {
        orderId,
        paymentId: refundPaymentId,
        reason,
        timestamp: new Date().toISOString(),
      });
    }

    await this.emit('orders.failed', {
      orderId,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  private async failOrder(orderId: string, reason: string): Promise<void> {
    const order = await this.requireOrder(orderId);
    order.markAsFailed(reason);
    await this.orderRepository.save(order);

    await this.emit('orders.failed', {
      orderId,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  private async emit(subject: string, payload: unknown): Promise<void> {
    try {
      await lastValueFrom(this.eventBus.emit(subject, payload));
      this.logger.debug(`📤 Event emitted: ${subject}`);
    } catch (error) {
      this.logger.error(`❌ Error emitting ${subject}`, error);
      throw error;
    }
  }
}
