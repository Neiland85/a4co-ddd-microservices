/**
 * Base error for Order domain
 */
export class OrderDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderDomainError';
  }
}

/**
 * Error when order is not found
 */
export class OrderNotFoundError extends OrderDomainError {
  constructor(orderId: string) {
    super(`Order with ID ${orderId} not found`);
    this.name = 'OrderNotFoundError';
  }
}

/**
 * Error when order operation is invalid
 */
export class InvalidOrderOperationError extends OrderDomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOrderOperationError';
  }
}

/**
 * Error when order status transition is invalid
 */
export class InvalidOrderStatusTransitionError extends OrderDomainError {
  constructor(from: string, to: string) {
    super(`Invalid order status transition from ${from} to ${to}`);
    this.name = 'InvalidOrderStatusTransitionError';
  }
}

/**
 * Error when order item is invalid
 */
export class InvalidOrderItemError extends OrderDomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOrderItemError';
  }
}
