import { Order } from '../entities/order.aggregate.js';
import { OrderId } from '../value-objects/order-id.vo.js';
import { OrderStatus } from '../value-objects/order-status.vo.js';

/**
 * Order Repository Interface (Port)
 * Defines the contract for order persistence.
 * Implementations should be in the infrastructure layer.
 */
export interface IOrderRepository {
  /**
   * Save an order (create or update)
   */
  save(order: Order): Promise<void>;

  /**
   * Find an order by ID
   */
  findById(orderId: OrderId): Promise<Order | null>;

  /**
   * Find orders by customer ID
   */
  findByCustomerId(customerId: string): Promise<Order[]>;

  /**
   * Find orders by status
   */
  findByStatus(status: OrderStatus): Promise<Order[]>;

  /**
   * Delete an order by ID
   */
  delete(orderId: OrderId): Promise<void>;

  /**
   * Check if an order exists
   */
  exists(orderId: OrderId): Promise<boolean>;
}
