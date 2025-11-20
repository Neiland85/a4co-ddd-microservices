"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentFailedEvent = void 0;
const payment_event_base_1 = require("./payment-event.base");
const payment_status_vo_1 = require("../value-objects/payment-status.vo");
class PaymentFailedEvent extends payment_event_base_1.PaymentDomainEvent {
    constructor(params) {
        if (!params.reason) {
            throw new Error('PaymentFailedEvent requires a failure reason');
        }
        super(params.paymentId, {
            paymentId: params.paymentId,
            orderId: params.orderId,
            customerId: params.customerId,
            amount: params.amount,
            currency: params.amount.currency,
            metadata: params.metadata ?? {},
            stripePaymentIntentId: params.stripePaymentIntentId ?? null,
            status: payment_status_vo_1.PaymentStatusValue.FAILED,
            timestamp: params.timestamp ?? new Date(),
            reason: params.reason,
        }, 1, params.sagaId);
    }
}
exports.PaymentFailedEvent = PaymentFailedEvent;
//# sourceMappingURL=payment-failed.event.js.map