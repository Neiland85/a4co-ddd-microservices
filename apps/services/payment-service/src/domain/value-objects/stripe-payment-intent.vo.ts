import { ValueObject } from '@a4co/shared-utils';

const STRIPE_PAYMENT_INTENT_REGEX = /^pi_[A-Za-z0-9]{16,}$/;

export class StripePaymentIntent extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(intentId: string): StripePaymentIntent {
    if (!intentId || typeof intentId !== 'string') {
      throw new Error('Stripe payment intent id must be a non-empty string');
    }

    const normalized = intentId.trim();

    if (!STRIPE_PAYMENT_INTENT_REGEX.test(normalized)) {
      throw new Error('Invalid Stripe payment intent id format');
    }

    return new StripePaymentIntent(normalized);
  }

  public static maybe(intentId?: string | null): StripePaymentIntent | null {
    if (!intentId) {
      return null;
    }

    return StripePaymentIntent.create(intentId);
  }
}

