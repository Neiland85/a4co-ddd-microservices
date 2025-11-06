import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { Money } from '../../domain/value-objects';

export interface CreatePaymentIntentParams {
  amount: Money;
  customerId: string;
  orderId: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}

export interface RefundPaymentParams {
  paymentIntentId: string;
  amount?: Money;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  metadata?: Record<string, any>;
}

@Injectable()
export class StripeGateway {
  private readonly logger = new Logger(StripeGateway.name);
  private readonly stripe: Stripe;

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY_TEST;
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY or STRIPE_SECRET_KEY_TEST environment variable is required');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    });

    this.logger.log('Stripe gateway initialized');
  }

  /**
   * Crea un Payment Intent en Stripe
   */
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> {
    try {
      const options: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(params.amount.amount * 100), // Stripe usa centavos
        currency: params.amount.currency.toLowerCase(),
        customer: params.customerId,
        metadata: {
          orderId: params.orderId,
          ...params.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      };

      const requestOptions: Stripe.RequestOptions = {};
      if (params.idempotencyKey) {
        requestOptions.idempotencyKey = params.idempotencyKey;
      }

      const paymentIntent = await this.stripe.paymentIntents.create(options, requestOptions);

      this.logger.log(
        `Payment Intent created: ${paymentIntent.id} for order ${params.orderId}`
      );

      return paymentIntent;
    } catch (error) {
      this.logger.error(`Error creating payment intent: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error(
        `Failed to create payment intent: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Obtiene un Payment Intent por ID
   */
  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      this.logger.log(`Payment Intent retrieved: ${paymentIntentId}`);

      return paymentIntent;
    } catch (error) {
      this.logger.error(
        `Error retrieving payment intent ${paymentIntentId}: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new Error(
        `Failed to retrieve payment intent: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Confirma un Payment Intent
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const params: Stripe.PaymentIntentConfirmParams = {};
      if (paymentMethodId) {
        params.payment_method = paymentMethodId;
      }

      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, params);

      this.logger.log(`Payment Intent confirmed: ${paymentIntentId}`);

      return paymentIntent;
    } catch (error) {
      this.logger.error(
        `Error confirming payment intent ${paymentIntentId}: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new Error(
        `Failed to confirm payment intent: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Cancela un Payment Intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId);

      this.logger.log(`Payment Intent cancelled: ${paymentIntentId}`);

      return paymentIntent;
    } catch (error) {
      this.logger.error(
        `Error cancelling payment intent ${paymentIntentId}: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new Error(
        `Failed to cancel payment intent: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Reembolsa un pago
   */
  async refundPayment(params: RefundPaymentParams): Promise<Stripe.Refund> {
    try {
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: params.paymentIntentId,
        metadata: params.metadata,
      };

      if (params.amount) {
        refundParams.amount = Math.round(params.amount.amount * 100); // Stripe usa centavos
      }

      if (params.reason) {
        refundParams.reason = params.reason;
      }

      const refund = await this.stripe.refunds.create(refundParams);

      this.logger.log(
        `Refund created: ${refund.id} for payment intent ${params.paymentIntentId}`
      );

      return refund;
    } catch (error) {
      this.logger.error(
        `Error creating refund: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new Error(
        `Failed to create refund: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Obtiene un reembolso por ID
   */
  async getRefund(refundId: string): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.retrieve(refundId);

      this.logger.log(`Refund retrieved: ${refundId}`);

      return refund;
    } catch (error) {
      this.logger.error(
        `Error retrieving refund ${refundId}: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new Error(
        `Failed to retrieve refund: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Maneja webhooks de Stripe
   */
  async handleWebhook(
    payload: string | Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      this.logger.log(`Webhook received: ${event.type}`);

      return event;
    } catch (error) {
      this.logger.error(
        `Webhook signature verification failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new Error(
        `Webhook signature verification failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Verifica el estado de un Payment Intent
   */
  isPaymentSucceeded(paymentIntent: Stripe.PaymentIntent): boolean {
    return paymentIntent.status === 'succeeded';
  }

  /**
   * Verifica si un Payment Intent falló
   */
  isPaymentFailed(paymentIntent: Stripe.PaymentIntent): boolean {
    return paymentIntent.status === 'canceled' || paymentIntent.status === 'requires_payment_method';
  }
}
