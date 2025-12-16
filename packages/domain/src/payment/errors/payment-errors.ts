/**
 * Base error for Payment domain
 */
export class PaymentDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentDomainError';
  }
}

/**
 * Error when payment is not found
 */
export class PaymentNotFoundError extends PaymentDomainError {
  constructor(paymentId: string) {
    super(`Payment with ID ${paymentId} not found`);
    this.name = 'PaymentNotFoundError';
  }
}

/**
 * Error when payment operation is invalid
 */
export class InvalidPaymentOperationError extends PaymentDomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPaymentOperationError';
  }
}

/**
 * Error when payment status transition is invalid
 */
export class InvalidPaymentStatusTransitionError extends PaymentDomainError {
  constructor(from: string, to: string) {
    super(`Invalid payment status transition from ${from} to ${to}`);
    this.name = 'InvalidPaymentStatusTransitionError';
  }
}
