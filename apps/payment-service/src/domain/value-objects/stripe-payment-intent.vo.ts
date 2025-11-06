import { ValueObject } from '../base-classes';

export class StripePaymentIntent extends ValueObject<string> {
  private static readonly STRIPE_INTENT_PREFIX = 'pi_';
  private static readonly STRIPE_INTENT_PATTERN = /^pi_[a-zA-Z0-9]{24,}$/;

  constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('StripePaymentIntent cannot be empty');
    }
    if (!value.startsWith(StripePaymentIntent.STRIPE_INTENT_PREFIX)) {
      throw new Error(
        `Invalid Stripe Payment Intent format. Must start with "${StripePaymentIntent.STRIPE_INTENT_PREFIX}"`
      );
    }
    if (!StripePaymentIntent.STRIPE_INTENT_PATTERN.test(value)) {
      throw new Error(
        `Invalid Stripe Payment Intent format. Expected pattern: ${StripePaymentIntent.STRIPE_INTENT_PATTERN}`
      );
    }
  }

  public static fromString(value: string): StripePaymentIntent {
    return new StripePaymentIntent(value);
  }

  toString(): string {
    return this.value;
  }
}
