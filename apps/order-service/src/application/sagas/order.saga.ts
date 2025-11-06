import { Injectable, Inject, Logger, Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { OrderId, IOrderRepository } from '../../domain';
import { OrderStatusEnum } from '../../domain/value-objects/order-status.vo';

// Eventos de integración esperados de otros servicios
export interface PaymentSucceededEvent {
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  timestamp: Date;
}

export interface PaymentFailedEvent {
  orderId: string;
  paymentId: string;
  reason: string;
  timestamp: Date;
}

export interface InventoryReservedEvent {
  orderId: string;
  reservationId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  timestamp: Date;
}

export interface InventoryOutOfStockEvent {
  orderId: string;
  items: Array<{
    productId: string;
    requestedQuantity: number;
    availableQuantity: number;
  }>;
  timestamp: Date;
}

@Controller()
@Injectable()
export class OrderSaga {
  private readonly logger = new Logger(OrderSaga.name);

  constructor(
    @Inject('IOrderRepository') private readonly orderRepository: IOrderRepository,
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {}

  @EventPattern('payment.succeeded')
  async handlePaymentSucceeded(@Payload() data: PaymentSucceededEvent) {
    this.logger.log(`Received payment.succeeded event for order ${data.orderId}`);

    try {
      const orderId = new OrderId(data.orderId);
      const order = await this.orderRepository.findById(orderId);

      if (!order) {
        this.logger.error(`Order ${data.orderId} not found`);
        return;
      }

      // Confirmar pago en el aggregate
      order.confirmPayment();

      // Guardar cambios
      await this.orderRepository.save(order);

      // Publicar evento para solicitar reserva de inventario
      this.natsClient.emit('inventory.reserve', {
        orderId: order.id,
        items: order.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        timestamp: new Date(),
      });

      this.logger.log(`Order ${data.orderId} payment confirmed, inventory reservation requested`);
    } catch (error) {
      this.logger.error(`Error handling payment.succeeded for order ${data.orderId}:`, error);
      // En caso de error, cancelar la orden
      await this.compensateOrder(data.orderId, `Error processing payment: ${error.message}`);
    }
  }

  @EventPattern('payment.failed')
  async handlePaymentFailed(@Payload() data: PaymentFailedEvent) {
    this.logger.log(`Received payment.failed event for order ${data.orderId}`);

    try {
      const orderId = new OrderId(data.orderId);
      const order = await this.orderRepository.findById(orderId);

      if (!order) {
        this.logger.error(`Order ${data.orderId} not found`);
        return;
      }

      // Compensación: cancelar orden
      order.cancel(`Payment failed: ${data.reason}`);
      await this.orderRepository.save(order);

      this.logger.log(`Order ${data.orderId} cancelled due to payment failure`);
    } catch (error) {
      this.logger.error(`Error handling payment.failed for order ${data.orderId}:`, error);
    }
  }

  @EventPattern('inventory.reserved')
  async handleInventoryReserved(@Payload() data: InventoryReservedEvent) {
    this.logger.log(`Received inventory.reserved event for order ${data.orderId}`);

    try {
      const orderId = new OrderId(data.orderId);
      const order = await this.orderRepository.findById(orderId);

      if (!order) {
        this.logger.error(`Order ${data.orderId} not found`);
        return;
      }

      // Marcar inventario como reservado
      order.reserveInventory();
      await this.orderRepository.save(order);

      // Completar la orden
      order.complete();
      await this.orderRepository.save(order);

      // Publicar evento de orden completada
      this.natsClient.emit('order.completed', {
        orderId: order.id,
        customerId: order.customerId,
        totalAmount: order.totalAmount,
        currency: order.currency,
        timestamp: new Date(),
      });

      this.logger.log(`Order ${data.orderId} completed successfully`);
    } catch (error) {
      this.logger.error(`Error handling inventory.reserved for order ${data.orderId}:`, error);
      // Compensación: solicitar reembolso y cancelar orden
      await this.compensateOrder(data.orderId, `Error processing inventory reservation: ${error.message}`);
    }
  }

  @EventPattern('inventory.out_of_stock')
  async handleInventoryOutOfStock(@Payload() data: InventoryOutOfStockEvent) {
    this.logger.log(`Received inventory.out_of_stock event for order ${data.orderId}`);

    try {
      const orderId = new OrderId(data.orderId);
      const order = await this.orderRepository.findById(orderId);

      if (!order) {
        this.logger.error(`Order ${data.orderId} not found`);
        return;
      }

      // Compensación: solicitar reembolso de pago
      this.natsClient.emit('payment.refund', {
        orderId: order.id,
        paymentId: '', // Se debe obtener del contexto de la saga
        amount: order.totalAmount,
        currency: order.currency,
        reason: 'Inventory out of stock',
        timestamp: new Date(),
      });

      // Cancelar orden
      const unavailableItems = data.items
        .map(item => `${item.productId} (requested: ${item.requestedQuantity}, available: ${item.availableQuantity})`)
        .join(', ');
      order.cancel(`Inventory out of stock: ${unavailableItems}`);
      await this.orderRepository.save(order);

      this.logger.log(`Order ${data.orderId} cancelled due to inventory out of stock, refund requested`);
    } catch (error) {
      this.logger.error(`Error handling inventory.out_of_stock for order ${data.orderId}:`, error);
    }
  }

  private async compensateOrder(orderId: string, reason: string): Promise<void> {
    try {
      const order = await this.orderRepository.findById(new OrderId(orderId));
      if (order && order.status !== OrderStatusEnum.CANCELLED && order.status !== OrderStatusEnum.FAILED) {
        // Si el pago ya fue confirmado, solicitar reembolso
        if (order.status === OrderStatusEnum.PAYMENT_CONFIRMED || order.status === OrderStatusEnum.INVENTORY_RESERVED) {
          this.natsClient.emit('payment.refund', {
            orderId: order.id,
            paymentId: '', // Se debe obtener del contexto de la saga
            amount: order.totalAmount,
            currency: order.currency,
            reason,
            timestamp: new Date(),
          });
        }

        order.markAsFailed(reason);
        await this.orderRepository.save(order);
      }
    } catch (error) {
      this.logger.error(`Error compensating order ${orderId}:`, error);
    }
  }
}
