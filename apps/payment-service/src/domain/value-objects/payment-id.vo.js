"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentId = void 0;
const uuid_1 = require("uuid");
const shared_utils_1 = require("@a4co/shared-utils");
class PaymentId extends shared_utils_1.ValueObject {
    constructor(value) {
        super(value);
    }
    static create(value) {
        const id = value ?? (0, uuid_1.v4)();
        if (!(0, uuid_1.validate)(id)) {
            throw new Error('PaymentId must be a valid UUID');
        }
        return new PaymentId(id);
    }
}
exports.PaymentId = PaymentId;
//# sourceMappingURL=payment-id.vo.js.map