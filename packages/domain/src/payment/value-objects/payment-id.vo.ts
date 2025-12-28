import { ValueObject } from '@a4co/shared-utils';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

/**
 * Payment ID Value Object
 * Represents a unique identifier for a payment.
 */
export class PaymentId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value?: string): PaymentId {
    const id = value ?? uuidv4();

    if (!uuidValidate(id)) {
      throw new Error('PaymentId must be a valid UUID');
    }

    return new PaymentId(id);
  }
}
