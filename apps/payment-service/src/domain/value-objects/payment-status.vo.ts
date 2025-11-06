import { ValueObject } from '../base-classes';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export class PaymentStatusVO extends ValueObject<PaymentStatus> {
  private static readonly VALID_TRANSITIONS: Map<PaymentStatus, PaymentStatus[]> = new Map([
    [PaymentStatus.PENDING, [PaymentStatus.PROCESSING, PaymentStatus.CANCELLED]],
    [PaymentStatus.PROCESSING, [PaymentStatus.SUCCEEDED, PaymentStatus.FAILED]],
    [PaymentStatus.SUCCEEDED, [PaymentStatus.REFUNDED]],
    [PaymentStatus.FAILED, []],
    [PaymentStatus.REFUNDED, []],
    [PaymentStatus.CANCELLED, []],
  ]);

  constructor(value: PaymentStatus) {
    super(value);
    this.validate(value);
  }

  private validate(value: PaymentStatus): void {
    if (!Object.values(PaymentStatus).includes(value)) {
      throw new Error(`Invalid PaymentStatus: ${value}`);
    }
  }

  canTransitionTo(newStatus: PaymentStatus): boolean {
    const allowedTransitions = PaymentStatusVO.VALID_TRANSITIONS.get(this.value) || [];
    return allowedTransitions.includes(newStatus);
  }

  transitionTo(newStatus: PaymentStatus): PaymentStatusVO {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(
        `Invalid status transition from ${this.value} to ${newStatus}. Valid transitions: ${PaymentStatusVO.VALID_TRANSITIONS.get(this.value)?.join(', ') || 'none'}`
      );
    }
    return new PaymentStatusVO(newStatus);
  }

  isFinal(): boolean {
    return [
      PaymentStatus.SUCCEEDED,
      PaymentStatus.FAILED,
      PaymentStatus.REFUNDED,
      PaymentStatus.CANCELLED,
    ].includes(this.value);
  }

  isPending(): boolean {
    return this.value === PaymentStatus.PENDING;
  }

  isProcessing(): boolean {
    return this.value === PaymentStatus.PROCESSING;
  }

  isSucceeded(): boolean {
    return this.value === PaymentStatus.SUCCEEDED;
  }

  isFailed(): boolean {
    return this.value === PaymentStatus.FAILED;
  }

  isRefunded(): boolean {
    return this.value === PaymentStatus.REFUNDED;
  }

  toString(): string {
    return this.value;
  }
}
