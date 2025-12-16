import { ValueObject } from '@a4co/shared-utils';

/**
 * Payment Status Enumeration
 * Represents the lifecycle states of a payment.
 */
export enum PaymentStatusValue {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/**
 * Valid payment status transitions
 */
const ALLOWED_TRANSITIONS: Record<PaymentStatusValue, PaymentStatusValue[]> = {
  [PaymentStatusValue.PENDING]: [PaymentStatusValue.PROCESSING, PaymentStatusValue.FAILED],
  [PaymentStatusValue.PROCESSING]: [PaymentStatusValue.SUCCEEDED, PaymentStatusValue.FAILED],
  [PaymentStatusValue.SUCCEEDED]: [PaymentStatusValue.REFUNDED],
  [PaymentStatusValue.FAILED]: [],
  [PaymentStatusValue.REFUNDED]: [],
};

/**
 * Payment Status Value Object
 * Encapsulates payment status with transition validation.
 */
export class PaymentStatus extends ValueObject<PaymentStatusValue> {
  private constructor(value: PaymentStatusValue) {
    super(value);
  }

  public static create(value: PaymentStatusValue = PaymentStatusValue.PENDING): PaymentStatus {
    if (!Object.values(PaymentStatusValue).includes(value)) {
      throw new Error(`Invalid payment status: ${value}`);
    }

    return new PaymentStatus(value);
  }

  public static from(value: string): PaymentStatus {
    return PaymentStatus.create(value as PaymentStatusValue);
  }

  public canTransitionTo(nextStatus: PaymentStatusValue): boolean {
    return ALLOWED_TRANSITIONS[this._value].includes(nextStatus);
  }

  public transitionTo(nextStatus: PaymentStatusValue): PaymentStatus {
    if (this._value === nextStatus) {
      return this;
    }

    if (!this.canTransitionTo(nextStatus)) {
      throw new Error(`Cannot transition payment status from ${this._value} to ${nextStatus}`);
    }

    return PaymentStatus.create(nextStatus);
  }

  public isFinal(): boolean {
    return [PaymentStatusValue.FAILED, PaymentStatusValue.REFUNDED].includes(this._value);
  }

  public isProcessing(): boolean {
    return this._value === PaymentStatusValue.PROCESSING;
  }

  public isSucceeded(): boolean {
    return this._value === PaymentStatusValue.SUCCEEDED;
  }

  public isPending(): boolean {
    return this._value === PaymentStatusValue.PENDING;
  }
}
