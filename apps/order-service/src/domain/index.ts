export * from './base-classes';
export * from './aggregates/order.aggregate';
export * from './value-objects';

// PORTS/INTERFACES

import { Order, OrderId } from './aggregates/order.aggregate';

export interface IOrderRepository {
    save(order: Order): Promise<void>;
    findById(orderId: OrderId): Promise<Order | null>;
    findByCustomerId(customerId: string): Promise<Order[]>;
    findAll(): Promise<Order[]>;
}

