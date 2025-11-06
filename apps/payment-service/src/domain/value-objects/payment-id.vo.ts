import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class PaymentId {
  private constructor(private readonly value: string) {
    if (!uuidValidate(value)) {
      throw new Error(`Invalid PaymentId format: ${value}`);
    }
  }

  static create(value?: string): PaymentId {
    return new PaymentId(value || uuidv4());
  }

  static fromString(value: string): PaymentId {
    return new PaymentId(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: PaymentId): boolean {
    return this.value === other.value;
  }
}
