import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Order, OrderId, OrderItem, OrderStatus, IOrderRepository } from '../../domain';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async save(order: Order): Promise<void> {
        const orderData = this.mapToPersistence(order);

        // Verificar si la orden ya existe
        const existingOrder = await this.prisma.order.findUnique({
            where: { id: order.id },
        });

        if (existingOrder) {
            // Actualizar orden existente
            await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    customerId: orderData.customerId,
                    status: orderData.status,
                    totalAmount: orderData.totalAmount,
                    currency: orderData.currency,
                    items: orderData.items,
                    updatedAt: orderData.updatedAt,
                },
            });
        } else {
            // Crear nueva orden
            await this.prisma.order.create({
                data: {
                    id: orderData.id,
                    customerId: orderData.customerId,
                    status: orderData.status,
                    totalAmount: orderData.totalAmount,
                    currency: orderData.currency,
                    items: orderData.items,
                    createdAt: orderData.createdAt,
                    updatedAt: orderData.updatedAt,
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

        return ordersData.map((orderData) => this.mapToDomain(orderData));
    }

    async findAll(): Promise<Order[]> {
        const ordersData = await this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return ordersData.map((orderData) => this.mapToDomain(orderData));
    }

    private mapToPersistence(order: Order): {
        id: string;
        customerId: string;
        status: string;
        totalAmount: number;
        currency: string;
        items: Array<{
            productId: string;
            quantity: number;
            unitPrice: number;
            currency: string;
        }>;
        createdAt: Date;
        updatedAt: Date;
    } {
        const items = order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            currency: item.currency,
        }));

        // Determinar la moneda de la orden (tomar la primera del primer item o EUR por defecto)
        const currency = order.items.length > 0 ? order.items[0].currency : 'EUR';

        return {
            id: order.id,
            customerId: order.customerId,
            status: order.status,
            totalAmount: order.totalAmount,
            currency,
            items,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }

    private mapToDomain(orderData: any): Order {
        const items: OrderItem[] = (orderData.items as any[]).map(
            (item) =>
                new OrderItem(
                    item.productId,
                    item.quantity,
                    item.unitPrice,
                    item.currency || orderData.currency || 'EUR',
                ),
        );

        return Order.reconstruct(
            orderData.id,
            orderData.customerId,
            items,
            orderData.status as OrderStatus,
            orderData.createdAt,
            orderData.updatedAt,
        );
    }
}
