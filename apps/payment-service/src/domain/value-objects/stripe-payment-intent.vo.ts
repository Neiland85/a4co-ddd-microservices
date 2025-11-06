export class StripePaymentIntent {
  private constructor(private readonly value: string) {
    // Stripe Payment Intent IDs tienen formato: pi_xxxxxxxxxxxxx
    if (!this.isValidStripePaymentIntentId(value)) {
      throw new Error(`Invalid Stripe Payment Intent ID format: ${value}`);
    }
  }

  static create(value: string): StripePaymentIntent {
    return new StripePaymentIntent(value);
  }

  static fromString(value: string): StripePaymentIntent {
    return new StripePaymentIntent(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: StripePaymentIntent): boolean {
    return this.value === other.value;
  }

  private isValidStripePaymentIntentId(id: string): boolean {
    // Stripe Payment Intent ID format: pi_[a-zA-Z0-9]{24,}
    const stripePaymentIntentRegex = /^pi_[a-zA-Z0-9]{24,}$/;
    return stripePaymentIntentRegex.test(id);
  }
}
