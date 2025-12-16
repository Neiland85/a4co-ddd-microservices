import { InvalidStateTransitionError } from '../../common/errors/domain.error.js';

/**
 * Valid order status values
 */
export enum OrderStatusValue {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

/**
 * OrderStatus Value Object
 * Represents the current status of an order
 * 
 * @invariant status must be a valid OrderStatusValue
 */
export class OrderStatus {
  private static readonly VALID_TRANSITIONS: Map<OrderStatusValue, Set<OrderStatusValue>> = new Map([
    [OrderStatusValue.PENDING, new Set([OrderStatusValue.CONFIRMED, OrderStatusValue.CANCELLED, OrderStatusValue.FAILED])],
    [OrderStatusValue.CONFIRMED, new Set([OrderStatusValue.SHIPPED, OrderStatusValue.CANCELLED])],
    [OrderStatusValue.SHIPPED, new Set([OrderStatusValue.DELIVERED])],
    [OrderStatusValue.DELIVERED, new Set()],
    [OrderStatusValue.CANCELLED, new Set()],
    [OrderStatusValue.FAILED, new Set()],
  ]);

  private constructor(public readonly value: OrderStatusValue) {
  }

  /**
   * Create an OrderStatus
   */
  static create(value: OrderStatusValue): OrderStatus {
    return new OrderStatus(value);
  }

  /**
   * Create a PENDING status
   */
  static pending(): OrderStatus {
    return new OrderStatus(OrderStatusValue.PENDING);
  }

  /**
   * Check if transition to new status is valid
   */
  canTransitionTo(newStatus: OrderStatus): boolean {
    const validTransitions = OrderStatus.VALID_TRANSITIONS.get(this.value);
    return validTransitions ? validTransitions.has(newStatus.value) : false;
  }

  /**
   * Transition to new status with validation
   */
  transitionTo(newStatus: OrderStatus): OrderStatus {
    if (!this.canTransitionTo(newStatus)) {
      throw new InvalidStateTransitionError(
        this.value,
        newStatus.value,
        'Order',
      );
    }
    return newStatus;
  }

  /**
   * Check if order is in a final state
   */
  isFinal(): boolean {
    return (
      this.value === OrderStatusValue.DELIVERED ||
      this.value === OrderStatusValue.CANCELLED ||
      this.value === OrderStatusValue.FAILED
    );
  }

  /**
   * Check if order can be cancelled
   */
  canBeCancelled(): boolean {
    return this.value !== OrderStatusValue.DELIVERED;
  }

  /**
   * Check if this status equals another
   */
  equals(other: OrderStatus): boolean {
    return this.value === other.value;
  }

  /**
   * Convert to string
   */
  toString(): string {
    return this.value;
  }
}
