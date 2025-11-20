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
var PaymentController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const payment_service_1 = require("../application/services/payment.service");
const stripe_gateway_1 = require("../infrastructure/stripe.gateway");
const payment_event_publisher_1 = require("../application/services/payment-event.publisher");
const process_payment_use_case_1 = require("../application/use-cases/process-payment.use-case");
let PaymentController = PaymentController_1 = class PaymentController {
    constructor(paymentService, stripeGateway, eventPublisher, paymentRepository, processPaymentUseCase) {
        this.paymentService = paymentService;
        this.stripeGateway = stripeGateway;
        this.eventPublisher = eventPublisher;
        this.paymentRepository = paymentRepository;
        this.processPaymentUseCase = processPaymentUseCase;
        this.logger = new common_1.Logger(PaymentController_1.name);
    }
    getHealth() {
        return this.paymentService.getHealth();
    }
    async handlePaymentInitiate(data) {
        this.logger.log(`🚀 Iniciando proceso de pago para orden: ${data.orderId}`);
        try {
            await this.processPaymentUseCase.execute({
                orderId: data.orderId,
                amount: data.amount,
                currency: 'usd',
                customerId: data.customerId,
            });
        }
        catch (error) {
            this.logger.error(`❌ Error iniciando pago para orden ${data.orderId}`, error);
        }
    }
    async handleStripeWebhook(req, signature) {
        this.logger.log('📥 Recibiendo webhook de Stripe');
        if (!signature) {
            this.logger.error('❌ Firma de Stripe no proporcionada');
            throw new Error('Missing stripe-signature header');
        }
        try {
            const event = this.stripeGateway.constructWebhookEvent(req.rawBody, signature);
            this.logger.log(`📨 Evento de Stripe recibido: ${event.type}`);
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentIntentSucceeded(event);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handlePaymentIntentFailed(event);
                    break;
                case 'payment_intent.canceled':
                    await this.handlePaymentIntentCanceled(event);
                    break;
                default:
                    this.logger.log(`⚠️  Tipo de evento no manejado: ${event.type}`);
            }
            return { received: true };
        }
        catch (error) {
            this.logger.error('❌ Error procesando webhook de Stripe:', error);
            throw error;
        }
    }
    async handlePaymentIntentSucceeded(event) {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) {
            this.logger.warn('⚠️  PaymentIntent sin orderId en metadata');
            return;
        }
        this.logger.log(`✅ Pago exitoso para orden ${orderId}, PaymentIntent: ${paymentIntent.id}`);
        try {
            const payment = await this.paymentRepository.findByOrderId(orderId);
            if (payment) {
                payment.markAsSucceeded(paymentIntent.id);
                await this.paymentRepository.save(payment);
                await this.eventPublisher.publishPaymentEvents(payment);
            }
            else {
                this.logger.warn(`⚠️  Payment no encontrado para orden ${orderId}`);
            }
        }
        catch (error) {
            this.logger.error(`❌ Error procesando pago exitoso para orden ${orderId}:`, error);
            throw error;
        }
    }
    async handlePaymentIntentFailed(event) {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;
        const failureReason = paymentIntent.last_payment_error?.message || 'Unknown error';
        if (!orderId) {
            this.logger.warn('⚠️  PaymentIntent sin orderId en metadata');
            return;
        }
        this.logger.error(`❌ Pago fallido para orden ${orderId}: ${failureReason}`);
        try {
            const payment = await this.paymentRepository.findByOrderId(orderId);
            if (payment) {
                payment.markAsFailed(failureReason);
                await this.paymentRepository.save(payment);
                await this.eventPublisher.publishPaymentEvents(payment);
            }
            else {
                this.logger.warn(`⚠️  Payment no encontrado para orden ${orderId}`);
            }
        }
        catch (error) {
            this.logger.error(`❌ Error procesando pago fallido para orden ${orderId}:`, error);
            throw error;
        }
    }
    async handlePaymentIntentCanceled(event) {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) {
            this.logger.warn('⚠️  PaymentIntent sin orderId en metadata');
            return;
        }
        this.logger.log(`🔄 Pago cancelado para orden ${orderId}`);
        try {
            const payment = await this.paymentRepository.findByOrderId(orderId);
            if (payment) {
                payment.markAsFailed('Cancelado desde Stripe');
                await this.paymentRepository.save(payment);
                await this.eventPublisher.publishPaymentEvents(payment);
            }
        }
        catch (error) {
            this.logger.error(`❌ Error procesando pago cancelado para orden ${orderId}:`, error);
            throw error;
        }
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getHealth", null);
__decorate([
    (0, microservices_1.EventPattern)('payment.initiate'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handlePaymentInitiate", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleStripeWebhook", null);
exports.PaymentController = PaymentController = PaymentController_1 = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        stripe_gateway_1.StripeGateway,
        payment_event_publisher_1.PaymentEventPublisher, Object, process_payment_use_case_1.ProcessPaymentUseCase])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map