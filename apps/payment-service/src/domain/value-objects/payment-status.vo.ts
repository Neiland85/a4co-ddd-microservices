export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class PaymentStatusVO {
  private readonly _value: PaymentStatus;

  constructor(value: PaymentStatus | string) {
    if (typeof value === 'string') {
      if (!Object.values(PaymentStatus).includes(value as PaymentStatus)) {
        throw new Error(`Invalid payment status: ${value}`);
      }
      this._value = value as PaymentStatus;
    } else {
      this._value = value;
    }
  }

  get value(): PaymentStatus {
    return this._value;
  }

  equals(other: PaymentStatusVO): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  canTransitionTo(newStatus: PaymentStatus): boolean {
    const validTransitions: Record<PaymentStatus, PaymentStatus[]> = {
      [PaymentStatus.PENDING]: [PaymentStatus.PROCESSING, PaymentStatus.FAILED],
      [PaymentStatus.PROCESSING]: [PaymentStatus.SUCCEEDED, PaymentStatus.FAILED],
      [PaymentStatus.SUCCEEDED]: [PaymentStatus.REFUNDED],
      [PaymentStatus.FAILED]: [],
      [PaymentStatus.REFUNDED]: [],
    };

    return validTransitions[this._value]?.includes(newStatus) ?? false;
  }

  isFinal(): boolean {
    return this._value === PaymentStatus.SUCCEEDED || 
           this._value === PaymentStatus.FAILED || 
           this._value === PaymentStatus.REFUNDED;
  }

  static fromString(value: string): PaymentStatusVO {
    return new PaymentStatusVO(value);
  }
}
