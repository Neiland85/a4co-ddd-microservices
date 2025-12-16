import { BusinessRuleViolationError } from '../../common/errors/domain.error.js';

/**
 * Error thrown when payment processing fails
 */
export class PaymentProcessingError extends BusinessRuleViolationError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, metadata);
    this.name = 'PaymentProcessingError';
  }
}

/**
 * Error thrown when payment amount is invalid
 */
export class InvalidPaymentAmountError extends BusinessRuleViolationError {
  constructor(paymentId: string, amount: number) {
    super(
      `Invalid payment amount ${amount} for payment ${paymentId}`,
      { paymentId, amount },
    );
    this.name = 'InvalidPaymentAmountError';
  }
}

/**
 * Error thrown when refund is not allowed
 */
export class RefundNotAllowedError extends BusinessRuleViolationError {
  constructor(paymentId: string, status: string) {
    super(
      `Cannot refund payment ${paymentId} in ${status} status`,
      { paymentId, status },
    );
    this.name = 'RefundNotAllowedError';
  }
}
