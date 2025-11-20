import { Injectable, Inject } from '@nestjs/common';
import { Order, OrderItem } from '../../domain/aggregates/order.aggregate.js';
import { IOrderRepository } from '../../domain/index.js';
import { CreateOrderCommand } from '../commands/create-order.command.js';
import { ClientProxy } from '@nestjs/microservices';

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

    // 5. Publicar eventos de dominio
    const events = order.domainEvents;
    for (const event of events) {
      await this.eventBus.emit(event.eventName, event).toPromise();
    }

    // 6. Limpiar eventos
    order.clearDomainEvents();

    return orderId;
  }

  private generateOrderId(): string {
    return `order-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}
