export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export class PaymentStatusVO {
  private static readonly VALID_TRANSITIONS: Map<PaymentStatus, PaymentStatus[]> = new Map([
    [PaymentStatus.PENDING, [PaymentStatus.PROCESSING, PaymentStatus.CANCELLED]],
    [PaymentStatus.PROCESSING, [PaymentStatus.SUCCEEDED, PaymentStatus.FAILED]],
    [PaymentStatus.SUCCEEDED, [PaymentStatus.REFUNDED]],
    [PaymentStatus.FAILED, []],
    [PaymentStatus.REFUNDED, []],
    [PaymentStatus.CANCELLED, []],
  ]);

  constructor(private readonly value: PaymentStatus) {
    if (!Object.values(PaymentStatus).includes(value)) {
      throw new Error(`Invalid PaymentStatus: ${value}`);
    }
  }

  getValue(): PaymentStatus {
    return this.value;
  }

  equals(other: PaymentStatusVO): boolean {
    return this.value === other.value;
  }

  canTransitionTo(newStatus: PaymentStatus): boolean {
    const allowedTransitions = PaymentStatusVO.VALID_TRANSITIONS.get(this.value) || [];
    return allowedTransitions.includes(newStatus);
  }

  transitionTo(newStatus: PaymentStatus): PaymentStatusVO {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(
        `Invalid status transition from ${this.value} to ${newStatus}`
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

  static fromString(value: string): PaymentStatusVO {
    const status = Object.values(PaymentStatus).find(s => s === value);
    if (!status) {
      throw new Error(`Invalid PaymentStatus string: ${value}`);
    }
    return new PaymentStatusVO(status);
  }
}
