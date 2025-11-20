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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDomainService = void 0;
const common_1 = require("@nestjs/common");
const payment_status_vo_1 = require("../value-objects/payment-status.vo");
const DEFAULT_LIMITS = {
    minAmount: 0.01,
    maxAmount: 100_000,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'MXN'],
};
let PaymentDomainService = class PaymentDomainService {
    constructor(limits = DEFAULT_LIMITS) {
        this.limits = limits;
    }
    canProcessPayment(payment) {
        return payment.status.value === payment_status_vo_1.PaymentStatusValue.PENDING;
    }
    calculateRefundAmount(payment) {
        return payment.amount;
    }
    validatePaymentLimits(amount) {
        if (amount.amount < this.limits.minAmount) {
            throw new Error(`Payment amount must be at least ${this.limits.minAmount}`);
        }
        if (amount.amount > this.limits.maxAmount) {
            throw new Error(`Payment amount exceeds the maximum limit of ${this.limits.maxAmount}`);
        }
        if (this.limits.supportedCurrencies && !this.limits.supportedCurrencies.includes(amount.currency)) {
            throw new Error(`Unsupported currency: ${amount.currency}`);
        }
    }
};
exports.PaymentDomainService = PaymentDomainService;
exports.PaymentDomainService = PaymentDomainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], PaymentDomainService);
//# sourceMappingURL=payment-domain.service.js.map