"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripePaymentIntent = void 0;
const shared_utils_1 = require("@a4co/shared-utils");
const STRIPE_PAYMENT_INTENT_REGEX = /^pi_[A-Za-z0-9]{16,}$/;
class StripePaymentIntent extends shared_utils_1.ValueObject {
    constructor(value) {
        super(value);
    }
    static create(intentId) {
        if (!intentId || typeof intentId !== 'string') {
            throw new Error('Stripe payment intent id must be a non-empty string');
        }
        const normalized = intentId.trim();
        if (!STRIPE_PAYMENT_INTENT_REGEX.test(normalized)) {
            throw new Error('Invalid Stripe payment intent id format');
        }
        return new StripePaymentIntent(normalized);
    }
    static maybe(intentId) {
        if (!intentId) {
            return null;
        }
        return StripePaymentIntent.create(intentId);
    }
}
exports.StripePaymentIntent = StripePaymentIntent;
//# sourceMappingURL=stripe-payment-intent.vo.js.map