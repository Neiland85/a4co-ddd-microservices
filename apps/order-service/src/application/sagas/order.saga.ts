import { Injectable, Inject, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { OrderId, OrderStatus, IOrderRepository } from '../../domain';
import { EventSubjects } from '@a4co/shared-utils';

/**
 * Eventos de otros servicios que la saga escucha
 */
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
    productId: string;
    requestedQuantity: number;
    availableQuantity: number;
    timestamp: Date;
}

/**
 * OrderSaga - Orquesta el flujo Order → Payment → Inventory
 * Implementa el patrón Saga con transacciones compensatorias
 */
@Injectable()
export class OrderSaga {
    private readonly logger = new Logger(OrderSaga.name);

    constructor(
        @Inject('IOrderRepository') private readonly orderRepository: IOrderRepository,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {}

    /**
     * Maneja el evento PaymentSucceeded
     * Transición: PENDING -> PAYMENT_CONFIRMED
     * Siguiente paso: Solicitar reserva de inventario
     */
    @EventPattern(EventSubjects.PAYMENT_SUCCEEDED)
    async handlePaymentSucceeded(@Payload() data: PaymentSucceededEvent): Promise<void> {
        this.logger.log(`Processing PaymentSucceeded event for order ${data.orderId}`);

        try {
            const orderId = new OrderId(data.orderId);
            const order = await this.orderRepository.findById(orderId);

            if (!order) {
                this.logger.error(`Order ${data.orderId} not found`);
                return;
            }

            // Confirmar el pago en el aggregate
            order.confirmPayment();

            // Guardar cambios
            await this.orderRepository.save(order);

            // Publicar evento para solicitar reserva de inventario
            await this.requestInventoryReservation(order.id, order.items);

            this.logger.log(`Order ${data.orderId} payment confirmed, inventory reservation requested`);
        } catch (error) {
            this.logger.error(`Error processing PaymentSucceeded: ${error.message}`, error.stack);
            // En caso de error, marcar la orden como fallida
            await this.handleError(data.orderId, `Payment confirmation failed: ${error.message}`);
        }
    }

    /**
     * Maneja el evento PaymentFailed
     * Compensación: Cancelar la orden
     */
    @EventPattern(EventSubjects.PAYMENT_FAILED)
    async handlePaymentFailed(@Payload() data: PaymentFailedEvent): Promise<void> {
        this.logger.log(`Processing PaymentFailed event for order ${data.orderId}`);

        try {
            const orderId = new OrderId(data.orderId);
            const order = await this.orderRepository.findById(orderId);

            if (!order) {
                this.logger.error(`Order ${data.orderId} not found`);
                return;
            }

            // Cancelar la orden (compensación)
            order.cancel(`Payment failed: ${data.reason}`);

            // Guardar cambios
            await this.orderRepository.save(order);

            this.logger.log(`Order ${data.orderId} cancelled due to payment failure`);
        } catch (error) {
            this.logger.error(`Error processing PaymentFailed: ${error.message}`, error.stack);
        }
    }

    /**
     * Maneja el evento InventoryReserved
     * Transición: PAYMENT_CONFIRMED -> INVENTORY_RESERVED -> COMPLETED
     */
    @EventPattern(EventSubjects.STOCK_RESERVED)
    async handleInventoryReserved(@Payload() data: InventoryReservedEvent): Promise<void> {
        this.logger.log(`Processing InventoryReserved event for order ${data.orderId}`);

        try {
            const orderId = new OrderId(data.orderId);
            const order = await this.orderRepository.findById(orderId);

            if (!order) {
                this.logger.error(`Order ${data.orderId} not found`);
                return;
            }

            // Reservar inventario en el aggregate
            order.reserveInventory();

            // Completar la orden
            order.complete();

            // Guardar cambios
            await this.orderRepository.save(order);

            // Publicar evento de orden completada
            await this.publishOrderCompleted(order);

            this.logger.log(`Order ${data.orderId} completed successfully`);
        } catch (error) {
            this.logger.error(`Error processing InventoryReserved: ${error.message}`, error.stack);
            // En caso de error, solicitar reembolso y cancelar orden
            await this.handleInventoryError(data.orderId, `Inventory reservation failed: ${error.message}`);
        }
    }

    /**
     * Maneja el evento InventoryOutOfStock
     * Compensación: Solicitar reembolso del pago y cancelar orden
     */
    @EventPattern(EventSubjects.STOCK_DEPLETED)
    async handleInventoryOutOfStock(@Payload() data: InventoryOutOfStockEvent): Promise<void> {
        this.logger.log(`Processing InventoryOutOfStock event for order ${data.orderId}`);

        try {
            const orderId = new OrderId(data.orderId);
            const order = await this.orderRepository.findById(orderId);

            if (!order) {
                this.logger.error(`Order ${data.orderId} not found`);
                return;
            }

            // Solicitar reembolso del pago
            await this.requestPaymentRefund(order.id, order.totalAmount, order.items[0]?.currency || 'EUR');

            // Cancelar la orden
            order.cancel(`Inventory out of stock for product ${data.productId}`);

            // Guardar cambios
            await this.orderRepository.save(order);

            this.logger.log(`Order ${data.orderId} cancelled due to inventory out of stock`);
        } catch (error) {
            this.logger.error(`Error processing InventoryOutOfStock: ${error.message}`, error.stack);
        }
    }

    /**
     * Solicita la reserva de inventario
     */
    private async requestInventoryReservation(
        orderId: string,
        items: Array<{ productId: string; quantity: number }>,
    ): Promise<void> {
        const event = {
            orderId,
            items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            timestamp: new Date(),
        };

        this.natsClient.emit('inventory.reserve.requested.v1', event);
        this.logger.log(`Inventory reservation requested for order ${orderId}`);
    }

    /**
     * Publica evento de orden completada
     */
    private async publishOrderCompleted(order: any): Promise<void> {
        const event = {
            orderId: order.id,
            customerId: order.customerId,
            totalAmount: order.totalAmount,
            timestamp: new Date(),
        };

        this.natsClient.emit(EventSubjects.ORDER_CONFIRMED, event);
        this.logger.log(`OrderCompleted event published for order ${order.id}`);
    }

    /**
     * Solicita reembolso del pago
     */
    private async requestPaymentRefund(orderId: string, amount: number, currency: string): Promise<void> {
        const event = {
            orderId,
            amount,
            currency,
            reason: 'Inventory out of stock',
            timestamp: new Date(),
        };

        this.natsClient.emit(EventSubjects.REFUND_INITIATED, event);
        this.logger.log(`Payment refund requested for order ${orderId}`);
    }

    /**
     * Maneja errores generales
     */
    private async handleError(orderId: string, reason: string): Promise<void> {
        try {
            const order = await this.orderRepository.findById(new OrderId(orderId));
            if (order) {
                order.markAsFailed(reason);
                await this.orderRepository.save(order);
            }
        } catch (error) {
            this.logger.error(`Error handling error for order ${orderId}: ${error.message}`);
        }
    }

    /**
     * Maneja errores de inventario
     */
    private async handleInventoryError(orderId: string, reason: string): Promise<void> {
        try {
            const order = await this.orderRepository.findById(new OrderId(orderId));
            if (order && order.status === OrderStatus.PAYMENT_CONFIRMED) {
                // Solicitar reembolso
                await this.requestPaymentRefund(order.id, order.totalAmount, order.items[0]?.currency || 'EUR');
                // Cancelar orden
                order.cancel(reason);
                await this.orderRepository.save(order);
            }
        } catch (error) {
            this.logger.error(`Error handling inventory error for order ${orderId}: ${error.message}`);
        }
    }
}
