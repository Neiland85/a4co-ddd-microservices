import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Order, OrderItem } from '../../domain/aggregates/order.aggregate';
import { IOrderRepository } from '../../domain';

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
        item =>
          new OrderItem(
            item.productId,
            item.quantity,
            item.unitPrice,
            'EUR', // TODO: Get from config or request
          ),
      );

    // 3. Crear aggregate
      const orderId = this.generateOrderId();
      const order = new Order({
        id: orderId,
        customerId: dto.customerId,
        items: orderItems,
      });

    // 4. Guardar en repository
    await this.orderRepository.save(order);

    // 5. Publicar eventos de dominio
    const events = order.pullDomainEvents();
    for (const event of events) {
      const payload =
        'toJSON' in event && typeof (event as { toJSON?: unknown }).toJSON === 'function'
          ? (event as { toJSON: () => unknown }).toJSON()
          : event;
      await lastValueFrom(this.eventBus.emit(event.eventName, payload));
    }

    return orderId;
  }

  private generateOrderId(): string {
    return `order-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}
