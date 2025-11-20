"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRefundedEvent = void 0;
const payment_event_base_1 = require("./payment-event.base");
const payment_status_vo_1 = require("../value-objects/payment-status.vo");
class PaymentRefundedEvent extends payment_event_base_1.PaymentDomainEvent {
    constructor(params) {
        super(params.paymentId, {
            paymentId: params.paymentId,
            orderId: params.orderId,
            customerId: params.customerId,
            amount: params.amount,
            currency: params.amount.currency,
            refundAmount: params.refundAmount,
            metadata: params.metadata ?? {},
            stripePaymentIntentId: params.stripePaymentIntentId ?? null,
            status: payment_status_vo_1.PaymentStatusValue.REFUNDED,
            timestamp: params.timestamp ?? new Date(),
        }, 1, params.sagaId);
    }
}
exports.PaymentRefundedEvent = PaymentRefundedEvent;
//# sourceMappingURL=payment-refunded.event.js.map