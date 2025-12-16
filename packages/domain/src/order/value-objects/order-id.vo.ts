import { v4 as uuidv4 } from 'uuid';

/**
 * OrderId Value Object
 * Unique identifier for an Order aggregate
 * 
 * @invariant value must be a valid UUID or non-empty string
 */
export class OrderId {
  private constructor(public readonly value: string) {
    this.validate();
  }

  /**
   * Create an OrderId from a string
   */
  static create(value: string): OrderId {
    return new OrderId(value);
  }

  /**
   * Generate a new OrderId
   */
  static generate(): OrderId {
    return new OrderId(uuidv4());
  }

  /**
   * Validate the order ID
   */
  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('OrderId cannot be empty');
    }
  }

  /**
   * Check if this OrderId equals another
   */
  equals(other: OrderId): boolean {
    return this.value === other.value;
  }

  /**
   * Convert to string
   */
  toString(): string {
    return this.value;
  }
}
