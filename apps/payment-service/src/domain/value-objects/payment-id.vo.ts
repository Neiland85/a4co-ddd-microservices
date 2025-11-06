import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class PaymentId {
  private readonly value: string;

  constructor(value?: string) {
    if (value) {
      if (!uuidValidate(value)) {
        throw new Error(`Invalid PaymentId format: ${value}`);
      }
      this.value = value;
    } else {
      this.value = uuidv4();
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: PaymentId): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): PaymentId {
    return new PaymentId(value);
  }

  static generate(): PaymentId {
    return new PaymentId();
  }
}
