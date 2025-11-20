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
var ProcessPaymentUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentUseCase = void 0;
const common_1 = require("@nestjs/common");
const payment_domain_service_1 = require("../../domain/services/payment-domain.service");
const payment_entity_1 = require("../../domain/entities/payment.entity");
const money_vo_1 = require("../../domain/value-objects/money.vo");
const payment_status_vo_1 = require("../../domain/value-objects/payment-status.vo");
const stripe_gateway_1 = require("../../infrastructure/stripe.gateway");
const payment_event_publisher_1 = require("../services/payment-event.publisher");
const application_constants_1 = require("../application.constants");
let ProcessPaymentUseCase = ProcessPaymentUseCase_1 = class ProcessPaymentUseCase {
    constructor(paymentRepository, paymentDomainService, stripeGateway, eventPublisher) {
        this.paymentRepository = paymentRepository;
        this.paymentDomainService = paymentDomainService;
        this.stripeGateway = stripeGateway;
        this.eventPublisher = eventPublisher;
        this.logger = new common_1.Logger(ProcessPaymentUseCase_1.name);
    }
    async execute(command) {
        const money = money_vo_1.Money.create(command.amount / 100, command.currency);
        this.paymentDomainService.validatePaymentLimits(money);
        const existingPayment = await this.paymentRepository.findByOrderId(command.orderId);
        if (existingPayment) {
            const statusValue = existingPayment.status.value;
            if ([payment_status_vo_1.PaymentStatusValue.SUCCEEDED, payment_status_vo_1.PaymentStatusValue.REFUNDED].includes(statusValue)) {
                this.logger.log(`Payment for order ${command.orderId} already processed with status ${statusValue}`);
                return existingPayment;
            }
            if (statusValue === payment_status_vo_1.PaymentStatusValue.PROCESSING) {
                this.logger.log(`Payment for order ${command.orderId} is already processing`);
                return existingPayment;
            }
        }
        const payment = existingPayment ??
            payment_entity_1.Payment.create({
                orderId: command.orderId,
                amount: money,
                customerId: command.customerId,
                metadata: command.metadata ?? {},
            });
        if (!this.paymentDomainService.canProcessPayment(payment)) {
            throw new Error(`Payment ${payment.paymentId.value} cannot be processed from status ${payment.status.value}`);
        }
        payment.process();
        await this.persist(payment);
        try {
            const stripeParams = {
                amount: money,
                orderId: command.orderId,
                customerId: command.customerId,
                metadata: command.metadata ?? {},
            };
            if (command.paymentMethodId) {
                stripeParams.paymentMethodId = command.paymentMethodId;
            }
            if (command.idempotencyKey) {
                stripeParams.idempotencyKey = command.idempotencyKey;
            }
            const intent = await this.stripeGateway.createPaymentIntent(stripeParams);
            if (intent.status === 'succeeded') {
                payment.markAsSucceeded(intent.id);
            }
            else if (intent.status === 'processing') {
                this.logger.log(`Stripe payment intent ${intent.id} is processing for order ${command.orderId}`);
            }
            else {
                payment.markAsFailed(`Stripe payment intent status: ${intent.status}`);
            }
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : 'Unknown payment processing error';
            payment.markAsFailed(reason);
            await this.persist(payment);
            throw error;
        }
        await this.persist(payment);
        return payment;
    }
    async persist(payment) {
        await this.paymentRepository.save(payment);
        await this.eventPublisher.publishPaymentEvents(payment);
    }
};
exports.ProcessPaymentUseCase = ProcessPaymentUseCase;
exports.ProcessPaymentUseCase = ProcessPaymentUseCase = ProcessPaymentUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(application_constants_1.PAYMENT_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object, payment_domain_service_1.PaymentDomainService,
        stripe_gateway_1.StripeGateway,
        payment_event_publisher_1.PaymentEventPublisher])
], ProcessPaymentUseCase);
//# sourceMappingURL=process-payment.use-case.js.map