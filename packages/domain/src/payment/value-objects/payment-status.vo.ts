import { InvalidStateTransitionError } from '../../common/errors/domain.error.js';

/**
 * Valid payment status values
 */
export enum PaymentStatusValue {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/**
 * PaymentStatus Value Object
 * Represents the current status of a payment
 * 
 * @invariant status must be a valid PaymentStatusValue
 */
export class PaymentStatus {
  private static readonly VALID_TRANSITIONS: Map<PaymentStatusValue, Set<PaymentStatusValue>> = new Map([
    [PaymentStatusValue.PENDING, new Set([PaymentStatusValue.PROCESSING, PaymentStatusValue.FAILED])],
    [PaymentStatusValue.PROCESSING, new Set([PaymentStatusValue.SUCCEEDED, PaymentStatusValue.FAILED])],
    [PaymentStatusValue.SUCCEEDED, new Set([PaymentStatusValue.REFUNDED])],
    [PaymentStatusValue.FAILED, new Set()],
    [PaymentStatusValue.REFUNDED, new Set()],
  ]);

  private constructor(public readonly value: PaymentStatusValue) {
  }

  /**
   * Create a PaymentStatus
   */
  static create(value: PaymentStatusValue): PaymentStatus {
    return new PaymentStatus(value);
  }

  /**
   * Create a PENDING status
   */
  static pending(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.PENDING);
  }

  /**
   * Check if transition to new status is valid
   */
  canTransitionTo(newStatus: PaymentStatus): boolean {
    const validTransitions = PaymentStatus.VALID_TRANSITIONS.get(this.value);
    return validTransitions ? validTransitions.has(newStatus.value) : false;
  }

  /**
   * Transition to new status with validation
   */
  transitionTo(newStatus: PaymentStatus): PaymentStatus {
    if (!this.canTransitionTo(newStatus)) {
      throw new InvalidStateTransitionError(
        this.value,
        newStatus.value,
        'Payment',
      );
    }
    return newStatus;
  }

  /**
   * Check if payment is in a final state
   */
  isFinal(): boolean {
    return (
      this.value === PaymentStatusValue.SUCCEEDED ||
      this.value === PaymentStatusValue.FAILED ||
      this.value === PaymentStatusValue.REFUNDED
    );
  }

  /**
   * Check if payment succeeded
   */
  isSucceeded(): boolean {
    return this.value === PaymentStatusValue.SUCCEEDED;
  }

  /**
   * Check if payment can be refunded
   */
  canBeRefunded(): boolean {
    return this.value === PaymentStatusValue.SUCCEEDED;
  }

  /**
   * Check if this status equals another
   */
  equals(other: PaymentStatus): boolean {
    return this.value === other.value;
  }

  /**
   * Convert to string
   */
  toString(): string {
    return this.value;
  }
}
