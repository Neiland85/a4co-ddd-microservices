import { ValueObject } from '@a4co/shared-utils';

export enum PaymentStatusValue {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

const ALLOWED_TRANSITIONS: Record<PaymentStatusValue, PaymentStatusValue[]> = {
  [PaymentStatusValue.PENDING]: [PaymentStatusValue.PROCESSING, PaymentStatusValue.FAILED],
  [PaymentStatusValue.PROCESSING]: [PaymentStatusValue.SUCCEEDED, PaymentStatusValue.FAILED],
  [PaymentStatusValue.SUCCEEDED]: [PaymentStatusValue.REFUNDED],
  [PaymentStatusValue.FAILED]: [],
  [PaymentStatusValue.REFUNDED]: [],
};

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
    return ALLOWED_TRANSITIONS[this.value].includes(nextStatus);
  }

  public transitionTo(nextStatus: PaymentStatusValue): PaymentStatus {
    if (this.value === nextStatus) {
      return this;
    }

    if (!this.canTransitionTo(nextStatus)) {
      throw new Error(`Cannot transition payment status from ${this.value} to ${nextStatus}`);
    }

    return PaymentStatus.create(nextStatus);
  }

  public isFinal(): boolean {
    return [PaymentStatusValue.FAILED, PaymentStatusValue.REFUNDED].includes(this.value);
  }

  public isProcessing(): boolean {
    return this.value === PaymentStatusValue.PROCESSING;
  }

  public isSucceeded(): boolean {
    return this.value === PaymentStatusValue.SUCCEEDED;
  }

  public isPending(): boolean {
    return this.value === PaymentStatusValue.PENDING;
  }
}

