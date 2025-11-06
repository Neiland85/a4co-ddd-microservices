import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderId, OrderItem, IOrderRepository } from '../../domain';
import { EventSubjects } from '@a4co/shared-utils';

// DTOs (Data Transfer Objects)

export interface CreateOrderDTO {
    orderId: string;
    customerId: string;
    items: {
        productId: string;
        quantity: number;
        unitPrice: number;
        currency?: string;
    }[];
}

export interface GetOrderDTO {
    orderId: string;
}

// APPLICATION SERVICE / USE CASE

@Injectable()
export class CreateOrderUseCase {
    private readonly logger = new Logger(CreateOrderUseCase.name);

    constructor(
        @Inject('IOrderRepository') private readonly orderRepository: IOrderRepository,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {}

    async execute(dto: CreateOrderDTO): Promise<Order> {
        this.logger.log(`Creating order ${dto.orderId} for customer ${dto.customerId}`);

        const orderId = new OrderId(dto.orderId);

        // Verificar si la orden ya existe
        const existingOrder = await this.orderRepository.findById(orderId);
        if (existingOrder) {
            throw new Error(`Order with id ${dto.orderId} already exists`);
        }

        // Crear order items
        const items = dto.items.map(
            (item) =>
                new OrderItem(
                    item.productId,
                    item.quantity,
                    item.unitPrice,
                    item.currency || 'EUR',
                ),
        );

        // Crear order aggregate
        const order = new Order(dto.orderId, dto.customerId, items);

        // Guardar orden
        await this.orderRepository.save(order);

        // Publicar evento OrderCreated a NATS
        await this.publishOrderCreated(order);

        this.logger.log(`Order ${dto.orderId} created successfully`);

        return order;
    }

    /**
     * Publica el evento OrderCreated a NATS
     */
    private async publishOrderCreated(order: Order): Promise<void> {
        const event = {
            orderId: order.id,
            customerId: order.customerId,
            items: order.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                currency: item.currency,
            })),
            totalAmount: order.totalAmount,
            timestamp: new Date(),
        };

        this.natsClient.emit(EventSubjects.ORDER_CREATED, event);
        this.logger.log(`OrderCreated event published for order ${order.id}`);
    }
}

@Injectable()
export class GetOrderUseCase {
    constructor(private readonly orderRepository: IOrderRepository) {}

    async execute(dto: GetOrderDTO): Promise<Order> {
        const orderId = new OrderId(dto.orderId);
        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            throw new Error(`Order with id ${dto.orderId} not found`);
        }

        return order;
    }
}

@Injectable()
export class GetAllOrdersUseCase {
    constructor(private readonly orderRepository: IOrderRepository) {}

    async execute(): Promise<Order[]> {
        return await this.orderRepository.findAll();
    }
}
