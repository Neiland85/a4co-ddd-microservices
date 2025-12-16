import { ValueObject } from '@a4co/shared-utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Order ID Value Object
 * Represents a unique identifier for an order.
 */
export class OrderId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
    if (!value || value.trim().length === 0) {
      throw new Error('OrderId cannot be empty');
    }
  }

  public static create(value?: string): OrderId {
    return new OrderId(value || uuidv4());
  }



  public equals(other: OrderId): boolean {
    return this.value === other.value;
  }
}
