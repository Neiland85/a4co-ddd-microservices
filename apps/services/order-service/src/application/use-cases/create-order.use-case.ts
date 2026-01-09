import { Injectable, Inject, Logger } from '@nestjs/common';
import { Order, OrderItem, IOrderRepository } from '@a4co/domain-order';
import { CreateOrderCommand } from '../commands/create-order.command.js';
import { ClientProxy } from '@nestjs/microservices';
import { OrderCreatedV1Event, ORDER_CREATED_V1 } from '@a4co/shared-events';

export interface CreateOrderDto {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

@Injectable()
export class CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('NATS_CLIENT')
    private readonly eventBus: ClientProxy,
  ) {}

  async execute(dto: CreateOrderDto): Promise<string> {
    // 1. Validar datos
    if (!dto.customerId || !dto.items || dto.items.length === 0) {
      throw new Error('Invalid order data');
    }

    // 2. Crear value objects
    const orderItems = dto.items.map(
      (item) =>
        new OrderItem(
          item.productId,
          item.quantity,
          item.unitPrice,
          'EUR', // TODO: Get from config or request
        ),
    );

    // 3. Crear aggregate
    const orderId = this.generateOrderId();
    const order = new Order(orderId, dto.customerId, orderItems);

    // 4. Guardar en repository
    await this.orderRepository.save(order);

    // 5. Publicar OrderCreated event usando shared-events
    const orderCreatedEvent = new OrderCreatedV1Event({
      orderId: order.id,
      customerId: order.customerId,
      items: dto.items,
      totalAmount: order.totalAmount,
      currency: 'EUR',
    });

    this.eventBus.emit(ORDER_CREATED_V1, orderCreatedEvent.toJSON());
    this.logger.log(`📤 Emitted ${ORDER_CREATED_V1} for order ${orderId}`);

    // 6. Limpiar eventos de dominio si hay
    order.clearDomainEvents();

    return orderId;
  }

  private generateOrderId(): string {
    return `order-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}
