export * from './base-classes.js';
export * from './aggregates/order.aggregate.js';

// Need to import for the interface
import { Order, OrderId } from './aggregates/order.aggregate.js';

// PORTS/INTERFACES

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(orderId: OrderId): Promise<Order | null>;
  findAll(): Promise<Order[]>;
}
