import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderId, OrderItem, IOrderRepository } from '../../domain';
import { ClientProxy } from '@nestjs/microservices';
import { OrderCreatedEvent } from '../../domain/aggregates/order.aggregate';

export interface CreateOrderDTO {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    currency?: string;
  }[];
}

@Injectable()
export class CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCase.name);

  constructor(
    @Inject('IOrderRepository') private readonly orderRepository: IOrderRepository,
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {}

  async execute(dto: CreateOrderDTO): Promise<string> {
    // Validar input
    if (!dto.customerId || dto.customerId.trim().length === 0) {
      throw new Error('CustomerId is required');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    // Crear order items
    const items: OrderItem[] = dto.items.map(
      item =>
        new OrderItem(
          item.productId,
          item.quantity,
          item.unitPrice,
          item.currency || 'EUR',
        ),
    );

    // Crear aggregate Order
    const orderId = uuidv4();
    const order = new Order(orderId, dto.customerId, items);

    // Guardar en repository
    await this.orderRepository.save(order);

    // Obtener eventos de dominio y publicarlos
    const domainEvents = order.domainEvents;
    order.clearDomainEvents();

    // Publicar OrderCreatedEvent a NATS
    const orderCreatedEvent = domainEvents.find(
      event => event.eventType === 'OrderCreatedEvent',
    ) as OrderCreatedEvent | undefined;

    if (orderCreatedEvent) {
      this.natsClient.emit('order.created', {
        orderId: orderCreatedEvent.aggregateId,
        customerId: orderCreatedEvent.eventData.customerId,
        items: orderCreatedEvent.eventData.items,
        totalAmount: orderCreatedEvent.eventData.totalAmount,
        currency: orderCreatedEvent.eventData.currency,
        timestamp: orderCreatedEvent.occurredOn,
      });

      this.logger.log(`Order created event published for order ${orderId}`);
    }

    // Publicar evento para iniciar el proceso de pago
    this.natsClient.emit('payment.request', {
      orderId: order.id,
      customerId: order.customerId,
      amount: order.totalAmount,
      currency: order.currency,
      timestamp: new Date(),
    });

    this.logger.log(`Payment request published for order ${orderId}`);

    return orderId;
  }
}
