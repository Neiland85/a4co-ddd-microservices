import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class StripeGateway {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeGateway.name);
  private readonly webhookSecret?: string;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_KEY;

    if (!secretKey) {
      throw new Error('Stripe secret key is not configured');
    }

    this.webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"] ?? '';
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  public async createPaymentIntent(params: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> {
    const amountInMinorUnits = this.toMinorUnits(params.amount);

    const metadata = {
      orderId: params.orderId,
      customerId: params.customerId,
      ...params.metadata,
    };

    const requestOptions: Stripe.RequestOptions = {
      idempotencyKey: params.idempotencyKey ?? `order-${params.orderId}`,
    };

    const payload: Stripe.PaymentIntentCreateParams = {
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
    } catch (error) {
      this.logger.error(`Failed to create Stripe payment intent for order ${params.orderId}`, error as Error);
      throw error;
    }
  }

  public async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const intent = await this.stripe.paymentIntents.confirm(paymentIntentId);
      this.logger.log(`Stripe payment intent ${paymentIntentId} confirmed`);
      return intent;
    } catch (error) {
      this.logger.error(`Failed to confirm Stripe payment intent ${paymentIntentId}`, error as Error);
      throw error;
    }
  }

  public async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      this.logger.error(`Failed to retrieve Stripe payment intent ${paymentIntentId}`, error as Error);
      throw error;
    }
  }

  public async refundPayment(paymentIntentId: string, amount?: Money): Promise<Stripe.Refund> {
    const params: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      params.amount = this.toMinorUnits(amount);
    }

    try {
      const refund = await this.stripe.refunds.create(params);
      this.logger.log(`Stripe refund ${refund.id} created for payment intent ${paymentIntentId}`);
      return refund;
    } catch (error) {
      this.logger.error(`Failed to refund Stripe payment intent ${paymentIntentId}`, error as Error);
      throw error;
    }
  }

  public constructWebhookEvent(options: ConstructWebhookOptions): Stripe.Event {
    if (!this.webhookSecret) {
      throw new Error('Stripe webhook secret is not configured');
    }

    try {
      return this.stripe.webhooks.constructEvent(options.payload, options.signature, this.webhookSecret);
    } catch (error) {
      this.logger.error('Failed to construct Stripe webhook event', error as Error);
      throw error;
    }
  }

  private toMinorUnits(amount: Money): number {
    return Math.round(amount.amount * 100);
  }
}
