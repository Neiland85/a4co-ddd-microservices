import { Order, OrderId, IOrderRepository } from '../../domain';

export class InMemoryOrderRepository implements IOrderRepository {
    private orders = new Map<string, Order>();

    async save(order: Order): Promise<void> {
        this.orders.set(order.id, order);
    }

    async findById(orderId: OrderId): Promise<Order | null> {
        return this.orders.get(orderId.value) || null;
    }

    async findAll(): Promise<Order[]> {
        return Array.from(this.orders.values());
    }
}