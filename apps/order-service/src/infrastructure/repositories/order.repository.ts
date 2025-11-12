import { IOrderRepository, Order, OrderId } from '../../domain';

export class InMemoryOrderRepository implements IOrderRepository {
  private readonly orders = new Map<string, Order>();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }

  async findById(id: OrderId | string): Promise<Order | null> {
    const key = typeof id === 'string' ? id : id.value;
    return this.orders.get(key) ?? null;
  }

  async findAll(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async delete(id: OrderId | string): Promise<void> {
    const key = typeof id === 'string' ? id : id.value;
    this.orders.delete(key);
  }
}
