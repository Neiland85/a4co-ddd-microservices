import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Order, OrderId, OrderItem, OrderStatusEnum, IOrderRepository } from '../../domain';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async save(order: Order): Promise<void> {
    const persistence = order.toPersistence();
    const existingOrder = await this.prisma.order.findUnique({
      where: { id: order.id },
    });

    if (existingOrder) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          customerId: persistence.customerId,
          status: persistence.status,
          totalAmount: persistence.totalAmount,
          currency: persistence.currency,
          items: persistence.items,
          cancelledAt: persistence.cancelledAt,
          cancelledReason: persistence.cancelledReason,
          updatedAt: persistence.updatedAt,
        },
      });
    } else {
      await this.prisma.order.create({
        data: {
          id: persistence.id,
          customerId: persistence.customerId,
          status: persistence.status,
          totalAmount: persistence.totalAmount,
          currency: persistence.currency,
          items: persistence.items,
          cancelledAt: persistence.cancelledAt,
          cancelledReason: persistence.cancelledReason,
          createdAt: persistence.createdAt,
          updatedAt: persistence.updatedAt,
        },
      });
    }
  }

  async findById(orderId: OrderId): Promise<Order | null> {
    const orderData = await this.prisma.order.findUnique({
      where: { id: orderId.value },
    });

    if (!orderData) {
      return null;
    }

    return this.mapToDomain(orderData);
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const ordersData = await this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });

    return ordersData.map(orderData => this.mapToDomain(orderData));
  }

  async findAll(): Promise<Order[]> {
    const ordersData = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return ordersData.map(orderData => this.mapToDomain(orderData));
  }

  private mapToDomain(orderData: any): Order {
    const items: OrderItem[] = (orderData.items as any[]).map(
      (item: any) =>
        new OrderItem(
          item.productId,
          item.quantity,
          item.unitPrice,
          item.currency || 'EUR',
        ),
    );

    return Order.reconstruct(
      orderData.id,
      orderData.customerId,
      items,
      orderData.status as OrderStatusEnum,
      orderData.totalAmount,
      orderData.currency || 'EUR',
      orderData.cancelledAt ? new Date(orderData.cancelledAt) : undefined,
      orderData.cancelledReason || undefined,
      orderData.createdAt,
      orderData.updatedAt,
    );
  }
}
