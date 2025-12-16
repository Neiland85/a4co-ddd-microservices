import { v4 as uuidv4 } from 'uuid';

/**
 * PaymentId Value Object
 * Unique identifier for a Payment aggregate
 * 
 * @invariant value must be a valid UUID or non-empty string
 */
export class PaymentId {
  private constructor(public readonly value: string) {
    this.validate();
  }

  /**
   * Create a PaymentId from a string
   */
  static create(value: string): PaymentId {
    return new PaymentId(value);
  }

  /**
   * Generate a new PaymentId
   */
  static generate(): PaymentId {
    return new PaymentId(uuidv4());
  }

  /**
   * Validate the payment ID
   */
  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('PaymentId cannot be empty');
    }
  }

  /**
   * Check if this PaymentId equals another
   */
  equals(other: PaymentId): boolean {
    return this.value === other.value;
  }

  /**
   * Convert to string
   */
  toString(): string {
    return this.value;
  }
}
