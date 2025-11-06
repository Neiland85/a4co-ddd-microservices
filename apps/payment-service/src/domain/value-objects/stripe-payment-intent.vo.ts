export class StripePaymentIntent {
  private static readonly STRIPE_INTENT_PREFIX = 'pi_';
  private static readonly STRIPE_INTENT_REGEX = /^pi_[a-zA-Z0-9]{24,}$/;

  constructor(private readonly value: string) {
    if (!value || !value.trim()) {
      throw new Error('Stripe Payment Intent ID cannot be empty');
    }
    if (!value.startsWith(StripePaymentIntent.STRIPE_INTENT_PREFIX)) {
      throw new Error(`Invalid Stripe Payment Intent format: must start with ${StripePaymentIntent.STRIPE_INTENT_PREFIX}`);
    }
    if (!StripePaymentIntent.STRIPE_INTENT_REGEX.test(value)) {
      throw new Error(`Invalid Stripe Payment Intent format: ${value}`);
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: StripePaymentIntent): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): StripePaymentIntent {
    return new StripePaymentIntent(value);
  }

  static isValid(value: string): boolean {
    try {
      new StripePaymentIntent(value);
      return true;
    } catch {
      return false;
    }
  }
}
