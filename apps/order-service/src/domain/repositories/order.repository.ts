import { Order } from '../aggregates/order.aggregate.js';

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  update(order: Order): Promise<void>;
  delete(id: string): Promise<void>;
}

// Export alias for backward compatibility
export type OrderRepository = IOrderRepository;
