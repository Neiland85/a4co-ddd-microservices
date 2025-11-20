"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.PaymentStatusValue = void 0;
const shared_utils_1 = require("@a4co/shared-utils");
var PaymentStatusValue;
(function (PaymentStatusValue) {
    PaymentStatusValue["PENDING"] = "PENDING";
    PaymentStatusValue["PROCESSING"] = "PROCESSING";
    PaymentStatusValue["SUCCEEDED"] = "SUCCEEDED";
    PaymentStatusValue["FAILED"] = "FAILED";
    PaymentStatusValue["REFUNDED"] = "REFUNDED";
})(PaymentStatusValue || (exports.PaymentStatusValue = PaymentStatusValue = {}));
const ALLOWED_TRANSITIONS = {
    [PaymentStatusValue.PENDING]: [PaymentStatusValue.PROCESSING, PaymentStatusValue.FAILED],
    [PaymentStatusValue.PROCESSING]: [PaymentStatusValue.SUCCEEDED, PaymentStatusValue.FAILED],
    [PaymentStatusValue.SUCCEEDED]: [PaymentStatusValue.REFUNDED],
    [PaymentStatusValue.FAILED]: [],
    [PaymentStatusValue.REFUNDED]: [],
};
class PaymentStatus extends shared_utils_1.ValueObject {
    constructor(value) {
        super(value);
    }
    static create(value = PaymentStatusValue.PENDING) {
        if (!Object.values(PaymentStatusValue).includes(value)) {
            throw new Error(`Invalid payment status: ${value}`);
        }
        return new PaymentStatus(value);
    }
    static from(value) {
        return PaymentStatus.create(value);
    }
    canTransitionTo(nextStatus) {
        return ALLOWED_TRANSITIONS[this.value].includes(nextStatus);
    }
    transitionTo(nextStatus) {
        if (this.value === nextStatus) {
            return this;
        }
        if (!this.canTransitionTo(nextStatus)) {
            throw new Error(`Cannot transition payment status from ${this.value} to ${nextStatus}`);
        }
        return PaymentStatus.create(nextStatus);
    }
    isFinal() {
        return [PaymentStatusValue.FAILED, PaymentStatusValue.REFUNDED].includes(this.value);
    }
    isProcessing() {
        return this.value === PaymentStatusValue.PROCESSING;
    }
    isSucceeded() {
        return this.value === PaymentStatusValue.SUCCEEDED;
    }
    isPending() {
        return this.value === PaymentStatusValue.PENDING;
    }
}
exports.PaymentStatus = PaymentStatus;
//# sourceMappingURL=payment-status.vo.js.map