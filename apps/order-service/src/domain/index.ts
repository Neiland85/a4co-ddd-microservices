export * from './base-classes';
export * from './aggregates/order.aggregate';

// Need to import for the interface
import { Order, OrderId } from './aggregates/order.aggregate';

// PORTS/INTERFACES

export interface IOrderRepository {
    save(order: Order): Promise<void>;
    findById(orderId: OrderId): Promise<Order | null>;
    findAll(): Promise<Order[]>;
}
