import { v4 as uuidv4 } from 'uuid';

export class PaymentId {
  private readonly _value: string;

  constructor(value?: string) {
    if (value) {
      if (!this.isValidUUID(value)) {
        throw new Error('PaymentId must be a valid UUID');
      }
      this._value = value;
    } else {
      this._value = uuidv4();
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: PaymentId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  static fromString(value: string): PaymentId {
    return new PaymentId(value);
  }
}
