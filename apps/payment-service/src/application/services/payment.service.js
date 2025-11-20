"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const process_payment_use_case_1 = require("../use-cases/process-payment.use-case");
const refund_payment_use_case_1 = require("../use-cases/refund-payment.use-case");
const application_constants_1 = require("../application.constants");
const payment_id_vo_1 = require("../../domain/value-objects/payment-id.vo");
let PaymentService = class PaymentService {
    constructor(processPaymentUseCase, refundPaymentUseCase, paymentRepository) {
        this.processPaymentUseCase = processPaymentUseCase;
        this.refundPaymentUseCase = refundPaymentUseCase;
        this.paymentRepository = paymentRepository;
    }
    async processPayment(command) {
        return await this.processPaymentUseCase.execute(command);
    }
    async refundPayment(paymentId, amount, reason) {
        return await this.refundPaymentUseCase.execute(paymentId, amount, reason);
    }
    async getPaymentById(paymentId) {
        const id = payment_id_vo_1.PaymentId.create(paymentId);
        return await this.paymentRepository.findById(id);
    }
    async getPaymentByOrderId(orderId) {
        return await this.paymentRepository.findByOrderId(orderId);
    }
    getHealth() {
        return {
            status: 'ok',
            service: 'payment-service',
            version: '1.0.0',
            dependencies: {
                database: 'connected',
                stripe: 'configured',
                nats: 'connected'
            }
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(application_constants_1.PAYMENT_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [process_payment_use_case_1.ProcessPaymentUseCase,
        refund_payment_use_case_1.RefundPaymentUseCase, Object])
], PaymentService);
//# sourceMappingURL=payment.service.js.map