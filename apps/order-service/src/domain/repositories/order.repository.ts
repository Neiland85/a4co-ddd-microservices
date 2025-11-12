import { Order, OrderId } from '../aggregates/order.aggregate';

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: OrderId | string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  delete(id: OrderId | string): Promise<void>;
}
