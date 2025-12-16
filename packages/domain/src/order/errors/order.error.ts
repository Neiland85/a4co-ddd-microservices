import { BusinessRuleViolationError } from '../../common/errors/domain.error.js';

/**
 * Error thrown when order item operations fail
 */
export class OrderItemError extends BusinessRuleViolationError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, metadata);
    this.name = 'OrderItemError';
  }
}

/**
 * Error thrown when trying to modify a finalized order
 */
export class OrderAlreadyFinalizedError extends BusinessRuleViolationError {
  constructor(orderId: string, status: string) {
    super(
      `Cannot modify order ${orderId} in ${status} status`,
      { orderId, status },
    );
    this.name = 'OrderAlreadyFinalizedError';
  }
}

/**
 * Error thrown when order total is invalid
 */
export class InvalidOrderTotalError extends BusinessRuleViolationError {
  constructor(orderId: string, total: number) {
    super(
      `Invalid order total ${total} for order ${orderId}`,
      { orderId, total },
    );
    this.name = 'InvalidOrderTotalError';
  }
}

/**
 * Error thrown when order has no items
 */
export class EmptyOrderError extends BusinessRuleViolationError {
  constructor(orderId: string) {
    super(
      `Order ${orderId} must have at least one item`,
      { orderId },
    );
    this.name = 'EmptyOrderError';
  }
}
