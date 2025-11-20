import { ValueObject } from '@a4co/shared-utils';
export declare class StripePaymentIntent extends ValueObject<string> {
    private constructor();
    static create(intentId: string): StripePaymentIntent;
    static maybe(intentId?: string | null): StripePaymentIntent | null;
}
//# sourceMappingURL=stripe-payment-intent.vo.d.ts.map