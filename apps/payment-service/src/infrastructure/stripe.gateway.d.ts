import Stripe from 'stripe';
import { Money } from '../domain/value-objects/money.vo';
export interface CreatePaymentIntentParams {
    amount: Money;
    orderId: string;
    customerId: string;
    paymentMethodId?: string;
    metadata?: Record<string, any>;
    idempotencyKey?: string;
}
export interface ConstructWebhookOptions {
    payload: Buffer | string;
    signature: string;
}
export declare class StripeGateway {
    private readonly stripe;
    private readonly logger;
    private readonly webhookSecret?;
    constructor();
    createPaymentIntent(params: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent>;
    confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    refundPayment(paymentIntentId: string, amount?: Money): Promise<Stripe.Refund>;
    constructWebhookEvent(payload: any, signature: string): Stripe.Event;
    private toMinorUnits;
}
//# sourceMappingURL=stripe.gateway.d.ts.map