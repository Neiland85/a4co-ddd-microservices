import { ValueObject } from '../base-classes';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class PaymentId extends ValueObject<string> {
  constructor(value?: string) {
    const id = value || uuidv4();
    super(id);
    this.validate(id);
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('PaymentId cannot be empty');
    }
    if (!uuidValidate(value)) {
      throw new Error(`Invalid PaymentId format: ${value}. Must be a valid UUID.`);
    }
  }

  public static fromString(value: string): PaymentId {
    return new PaymentId(value);
  }

  public static generate(): PaymentId {
    return new PaymentId();
  }

  toString(): string {
    return this.value;
  }
}
