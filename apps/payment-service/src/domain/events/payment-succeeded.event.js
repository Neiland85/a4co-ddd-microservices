"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSucceededEvent = void 0;
const payment_event_base_1 = require("./payment-event.base");
const payment_status_vo_1 = require("../value-objects/payment-status.vo");
class PaymentSucceededEvent extends payment_event_base_1.PaymentDomainEvent {
    constructor(params) {
        if (!params.stripePaymentIntentId) {
            throw new Error('PaymentSucceededEvent requires a Stripe payment intent id');
        }
        super(params.paymentId, {
            paymentId: params.paymentId,
            orderId: params.orderId,
            customerId: params.customerId,
            amount: params.amount,
            currency: params.amount.currency,
            metadata: params.metadata ?? {},
            stripePaymentIntentId: params.stripePaymentIntentId,
            status: payment_status_vo_1.PaymentStatusValue.SUCCEEDED,
            timestamp: params.timestamp ?? new Date(),
        }, 1, params.sagaId);
    }
}
exports.PaymentSucceededEvent = PaymentSucceededEvent;
//# sourceMappingURL=payment-succeeded.event.js.map