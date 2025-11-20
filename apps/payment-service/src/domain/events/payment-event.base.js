"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDomainEvent = void 0;
const shared_utils_1 = require("@a4co/shared-utils");
class PaymentDomainEvent extends shared_utils_1.DomainEvent {
    constructor(paymentId, payload, eventVersion, sagaId) {
        super(paymentId, { ...payload, timestamp: payload.timestamp.toISOString() }, eventVersion, sagaId);
        this.payload = payload;
    }
}
exports.PaymentDomainEvent = PaymentDomainEvent;
//# sourceMappingURL=payment-event.base.js.map