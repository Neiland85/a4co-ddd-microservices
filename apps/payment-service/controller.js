"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const service_1 = require("./service");
class PaymentController {
    paymentService = new service_1.PaymentService();
    processPayment(req) {
        return this.paymentService.processPayment(req.orderId, req.amount);
    }
    getPaymentStatus(req) {
        return this.paymentService.getPaymentStatus(req.orderId);
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=controller.js.map