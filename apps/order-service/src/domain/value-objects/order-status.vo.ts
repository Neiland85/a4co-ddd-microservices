import { ValueObject } from '../base-classes';
import { OrderStatus } from '../aggregates/order.aggregate';

/**
 * Value Object para OrderStatus con validación de transiciones
 */
export class OrderStatusVO extends ValueObject<OrderStatus> {
    constructor(value: OrderStatus) {
        super(value);
        if (!Object.values(OrderStatus).includes(value)) {
            throw new Error(`Invalid order status: ${value}`);
        }
    }

    /**
     * Valida si una transición de estado es permitida
     */
    canTransitionTo(newStatus: OrderStatus): boolean {
        const transitions: Record<OrderStatus, OrderStatus[]> = {
            [OrderStatus.PENDING]: [
                OrderStatus.PAYMENT_CONFIRMED,
                OrderStatus.CANCELLED,
                OrderStatus.FAILED,
            ],
            [OrderStatus.PAYMENT_CONFIRMED]: [
                OrderStatus.INVENTORY_RESERVED,
                OrderStatus.CANCELLED,
                OrderStatus.FAILED,
            ],
            [OrderStatus.INVENTORY_RESERVED]: [
                OrderStatus.COMPLETED,
                OrderStatus.CANCELLED,
                OrderStatus.FAILED,
            ],
            [OrderStatus.COMPLETED]: [], // Estado final, no transiciones permitidas
            [OrderStatus.CANCELLED]: [], // Estado final, no transiciones permitidas
            [OrderStatus.FAILED]: [], // Estado final, no transiciones permitidas
        };

        return transitions[this.value].includes(newStatus);
    }

    /**
     * Verifica si el estado es un estado final
     */
    isFinal(): boolean {
        return [
            OrderStatus.COMPLETED,
            OrderStatus.CANCELLED,
            OrderStatus.FAILED,
        ].includes(this.value);
    }

    /**
     * Verifica si el estado permite cancelación
     */
    canBeCancelled(): boolean {
        return this.value !== OrderStatus.COMPLETED && this.value !== OrderStatus.CANCELLED;
    }
}
