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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StripeGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeGateway = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = __importDefault(require("stripe"));
let StripeGateway = StripeGateway_1 = class StripeGateway {
    constructor() {
        this.logger = new common_1.Logger(StripeGateway_1.name);
        const secretKey = process.env['STRIPE_SECRET_KEY'] ?? process.env['STRIPE_KEY'];
        if (!secretKey) {
            throw new Error('Stripe secret key is not configured');
        }
        this.webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'] ?? '';
        this.stripe = new stripe_1.default(secretKey, {
            apiVersion: '2023-10-16',
        });
    }
    async createPaymentIntent(params) {
        const amountInMinorUnits = this.toMinorUnits(params.amount);
        const metadata = {
            orderId: params.orderId,
            customerId: params.customerId,
            ...params.metadata,
        };
        const requestOptions = {
            idempotencyKey: params.idempotencyKey ?? `order-${params.orderId}`,
        };
        const payload = {
            amount: amountInMinorUnits,
            currency: params.amount.currency.toLowerCase(),
            customer: params.customerId,
            metadata,
            confirmation_method: 'automatic',
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        };
        if (params.paymentMethodId) {
            payload.payment_method = params.paymentMethodId;
            payload.use_stripe_sdk = false;
        }
        try {
            const intent = await this.stripe.paymentIntents.create(payload, requestOptions);
            this.logger.log(`Stripe payment intent ${intent.id} created for order ${params.orderId}`);
            return intent;
        }
        catch (error) {
            this.logger.error(`Failed to create Stripe payment intent for order ${params.orderId}`, error);
            throw error;
        }
    }
    async confirmPaymentIntent(paymentIntentId) {
        try {
            const intent = await this.stripe.paymentIntents.confirm(paymentIntentId);
            this.logger.log(`Stripe payment intent ${paymentIntentId} confirmed`);
            return intent;
        }
        catch (error) {
            this.logger.error(`Failed to confirm Stripe payment intent ${paymentIntentId}`, error);
            throw error;
        }
    }
    async getPaymentIntent(paymentIntentId) {
        try {
            return await this.stripe.paymentIntents.retrieve(paymentIntentId);
        }
        catch (error) {
            this.logger.error(`Failed to retrieve Stripe payment intent ${paymentIntentId}`, error);
            throw error;
        }
    }
    async refundPayment(paymentIntentId, amount) {
        const params = {
            payment_intent: paymentIntentId,
        };
        if (amount) {
            params.amount = this.toMinorUnits(amount);
        }
        try {
            const refund = await this.stripe.refunds.create(params);
            this.logger.log(`Stripe refund ${refund.id} created for payment intent ${paymentIntentId}`);
            return refund;
        }
        catch (error) {
            this.logger.error(`Failed to refund Stripe payment intent ${paymentIntentId}`, error);
            throw error;
        }
    }
    constructWebhookEvent(payload, signature) {
        if (!this.webhookSecret) {
            throw new Error('Stripe webhook secret is not configured');
        }
        try {
            return this.stripe.webhooks.constructEvent(JSON.stringify(payload), signature, this.webhookSecret);
        }
        catch (error) {
            this.logger.error('Failed to construct Stripe webhook event', error);
            throw error;
        }
    }
    toMinorUnits(amount) {
        return Math.round(amount.amount * 100);
    }
};
exports.StripeGateway = StripeGateway;
exports.StripeGateway = StripeGateway = StripeGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StripeGateway);
//# sourceMappingURL=stripe.gateway.js.map