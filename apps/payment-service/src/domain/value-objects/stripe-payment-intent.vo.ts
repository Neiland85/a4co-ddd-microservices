export class StripePaymentIntent {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('StripePaymentIntent cannot be empty');
    }
    // Stripe Payment Intent IDs start with 'pi_' followed by 24 characters
    if (!value.startsWith('pi_') || value.length !== 27) {
      throw new Error('Invalid Stripe Payment Intent ID format');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: StripePaymentIntent): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static fromString(value: string): StripePaymentIntent {
    return new StripePaymentIntent(value);
  }
}
