"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
class PaymentService {
    processPayment(orderId, amount) {
        return `Pago de ${amount} procesado para la orden ${orderId}.`;
    }
    getPaymentStatus(orderId) {
        return `Estado del pago para la orden ${orderId}.`;
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=service.js.map