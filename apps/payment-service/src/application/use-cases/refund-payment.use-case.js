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
var RefundPaymentUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundPaymentUseCase = void 0;
const common_1 = require("@nestjs/common");
const application_constants_1 = require("../application.constants");
const payment_domain_service_1 = require("../../domain/services/payment-domain.service");
const payment_status_vo_1 = require("../../domain/value-objects/payment-status.vo");
const payment_id_vo_1 = require("../../domain/value-objects/payment-id.vo");
const money_vo_1 = require("../../domain/value-objects/money.vo");
const stripe_gateway_1 = require("../../infrastructure/stripe.gateway");
const payment_event_publisher_1 = require("../services/payment-event.publisher");
let RefundPaymentUseCase = RefundPaymentUseCase_1 = class RefundPaymentUseCase {
    constructor(paymentRepository, paymentDomainService, stripeGateway, eventPublisher) {
        this.paymentRepository = paymentRepository;
        this.paymentDomainService = paymentDomainService;
        this.stripeGateway = stripeGateway;
        this.eventPublisher = eventPublisher;
        this.logger = new common_1.Logger(RefundPaymentUseCase_1.name);
    }
    async execute(paymentId, amount, reason) {
        const id = payment_id_vo_1.PaymentId.create(paymentId);
        const payment = await this.paymentRepository.findById(id);
        if (!payment) {
            throw new Error(`Payment not found with id ${paymentId}`);
        }
        const stripeIntentId = payment.stripePaymentIntentId;
        if (!stripeIntentId) {
            throw new Error(`Payment ${payment.paymentId.value} has no Stripe payment intent associated`);
        }
        if (payment.status.value !== payment_status_vo_1.PaymentStatusValue.SUCCEEDED) {
            throw new Error(`Only succeeded payments can be refunded. Current status: ${payment.status.value}`);
        }
        let refundAmount;
        if (amount !== undefined) {
            refundAmount = money_vo_1.Money.create(amount / 100, payment.amount.currency);
            if (refundAmount.amount > payment.amount.amount) {
                throw new Error(`Refund amount exceeds original payment amount`);
            }
        }
        else {
            refundAmount = this.paymentDomainService.calculateRefundAmount(payment);
        }
        await this.stripeGateway.refundPayment(stripeIntentId, refundAmount);
        payment.refund(refundAmount, reason);
        await this.persist(payment);
        this.logger.log(`Refund processed for payment ${paymentId} - Amount: ${refundAmount.amount} ${refundAmount.currency}`);
        return payment;
    }
    async persist(payment) {
        await this.paymentRepository.save(payment);
        await this.eventPublisher.publishPaymentEvents(payment);
    }
};
exports.RefundPaymentUseCase = RefundPaymentUseCase;
exports.RefundPaymentUseCase = RefundPaymentUseCase = RefundPaymentUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(application_constants_1.PAYMENT_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object, payment_domain_service_1.PaymentDomainService,
        stripe_gateway_1.StripeGateway,
        payment_event_publisher_1.PaymentEventPublisher])
], RefundPaymentUseCase);
//# sourceMappingURL=refund-payment.use-case.js.map