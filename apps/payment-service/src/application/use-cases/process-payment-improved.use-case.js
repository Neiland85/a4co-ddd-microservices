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
const stripe_gateway_1 = require("../../infrastructure/stripe.gateway");
const payment_event_publisher_1 = require("../services/payment-event.publisher");
const payment_entity_1 = require("../../domain/entities/payment.entity");
const money_vo_1 = require("../../domain/value-objects/money.vo");
let ProcessPaymentUseCase = ProcessPaymentUseCase_1 = class ProcessPaymentUseCase {
    constructor(paymentRepository, stripeGateway, eventPublisher) {
        this.paymentRepository = paymentRepository;
        this.stripeGateway = stripeGateway;
        this.eventPublisher = eventPublisher;
        this.logger = new common_1.Logger(ProcessPaymentUseCase_1.name);
    }
    async execute(command) {
        this.logger.log(`Procesando pago para orden ${command.orderId}`);
        try {
            const existingPayment = await this.paymentRepository.findByOrderId(command.orderId);
            if (existingPayment) {
                this.logger.log(`Pago ya existe para orden ${command.orderId}, estado: ${existingPayment.status}`);
                return;
            }
            const payment = payment_entity_1.Payment.create({
                orderId: command.orderId,
                customerId: command.customerId,
                amount: money_vo_1.Money.create(command.amount, command.currency),
                metadata: command.metadata ?? {},
            });
            await this.paymentRepository.save(payment);
            const stripeParams = {
                amount: money_vo_1.Money.create(command.amount, command.currency),
                orderId: command.orderId,
                customerId: command.customerId,
                metadata: { ...command.metadata, orderId: command.orderId },
            };
            if (command.paymentMethodId) {
                stripeParams.paymentMethodId = command.paymentMethodId;
            }
            if (command.idempotencyKey) {
                stripeParams.idempotencyKey = command.idempotencyKey;
            }
            const paymentIntent = await this.stripeGateway.createPaymentIntent(stripeParams);
            if (paymentIntent.status === 'succeeded') {
                payment.markAsSucceeded(paymentIntent.id);
            }
            else {
                payment.process();
            }
            await this.paymentRepository.save(payment);
            this.logger.log(`PaymentIntent creado: ${paymentIntent.id}`);
        }
        catch (error) {
            this.logger.error(`Error procesando pago para orden ${command.orderId}`, error);
            try {
                const failedPayment = await this.paymentRepository.findByOrderId(command.orderId);
                if (failedPayment) {
                    failedPayment.markAsFailed(error.message || 'Unknown error');
                    await this.paymentRepository.save(failedPayment);
                    await this.eventPublisher.publishPaymentEvents(failedPayment);
                }
            }
            catch (innerError) {
                this.logger.error('Error crítico al registrar fallo de pago', innerError);
            }
            throw error;
        }
    }
};
exports.ProcessPaymentUseCase = ProcessPaymentUseCase;
exports.ProcessPaymentUseCase = ProcessPaymentUseCase = ProcessPaymentUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PAYMENT_REPOSITORY')),
    __metadata("design:paramtypes", [Object, stripe_gateway_1.StripeGateway,
        payment_event_publisher_1.PaymentEventPublisher])
], ProcessPaymentUseCase);
//# sourceMappingURL=process-payment-improved.use-case.js.map