export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export class PaymentStatusVO {
  private constructor(private readonly value: PaymentStatus) {}

  static create(status: PaymentStatus): PaymentStatusVO {
    return new PaymentStatusVO(status);
  }

  static fromString(status: string): PaymentStatusVO {
    if (!Object.values(PaymentStatus).includes(status as PaymentStatus)) {
      throw new Error(`Invalid payment status: ${status}`);
    }
    return new PaymentStatusVO(status as PaymentStatus);
  }

  getValue(): PaymentStatus {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: PaymentStatusVO): boolean {
    return this.value === other.value;
  }

  canTransitionTo(newStatus: PaymentStatus): boolean {
    const validTransitions: Record<PaymentStatus, PaymentStatus[]> = {
      [PaymentStatus.PENDING]: [PaymentStatus.PROCESSING, PaymentStatus.CANCELLED],
      [PaymentStatus.PROCESSING]: [PaymentStatus.SUCCEEDED, PaymentStatus.FAILED],
      [PaymentStatus.SUCCEEDED]: [PaymentStatus.REFUNDED],
      [PaymentStatus.FAILED]: [],
      [PaymentStatus.REFUNDED]: [],
      [PaymentStatus.CANCELLED]: [],
    };

    return validTransitions[this.value]?.includes(newStatus) ?? false;
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
}
