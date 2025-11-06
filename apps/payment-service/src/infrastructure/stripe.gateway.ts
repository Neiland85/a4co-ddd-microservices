import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';
import { getLogger } from '@a4co/observability';

export interface CreatePaymentIntentParams {
  amount: number; // en centavos
  currency: string;
  customer: string;
  metadata?: Record<string, any>;
  paymentMethodId?: string;
  description?: string;
}

export interface RefundPaymentParams {
  amount?: number; // en centavos, opcional para reembolso completo
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  metadata?: Record<string, any>;
}

@Injectable()
export class StripeGateway implements OnModuleInit {
  private readonly stripe: Stripe;
  private readonly logger = getLogger(StripeGateway.name);

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    });

    this.logger.info('Stripe gateway initialized', {
      mode: stripeSecretKey.startsWith('sk_test_') ? 'test' : 'live',
    });
  }

  async onModuleInit() {
    // Verificar conexión con Stripe
    try {
      await this.stripe.balance.retrieve();
      this.logger.info('Stripe connection verified');
    } catch (error) {
      this.logger.error('Failed to verify Stripe connection', {
        error: error.message,
      });
    }
  }

  /**
   * Crea un Payment Intent en Stripe
   */
  async createPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<Stripe.PaymentIntent> {
    this.logger.debug('Creating payment intent', {
      amount: params.amount,
      currency: params.currency,
      customer: params.customer,
    });

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency.toLowerCase(),
        customer: params.customer,
        metadata: params.metadata || {},
        description: params.description,
        payment_method: params.paymentMethodId,
        confirmation_method: 'manual',
        confirm: false,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      this.logger.info('Payment intent created', {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      });

      return paymentIntent;
    } catch (error) {
      this.logger.error('Failed to create payment intent', {
        error: error.message,
        stack: error.stack,
      });
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  /**
   * Confirma un Payment Intent
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<Stripe.PaymentIntent> {
    this.logger.debug('Confirming payment intent', { paymentIntentId });

    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
        }
      );

      this.logger.info('Payment intent confirmed', {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      });

      return paymentIntent;
    } catch (error) {
      this.logger.error('Failed to confirm payment intent', {
        error: error.message,
        paymentIntentId,
      });
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  /**
   * Obtiene un Payment Intent por ID
   */
  async getPaymentIntent(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent> {
    this.logger.debug('Retrieving payment intent', { paymentIntentId });

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      return paymentIntent;
    } catch (error) {
      this.logger.error('Failed to retrieve payment intent', {
        error: error.message,
        paymentIntentId,
      });
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  /**
   * Procesa un reembolso
   */
  async refundPayment(
    paymentIntentId: string,
    params?: RefundPaymentParams
  ): Promise<Stripe.Refund> {
    this.logger.info('Processing refund', {
      paymentIntentId,
      amount: params?.amount,
      reason: params?.reason,
    });

    try {
      // Primero obtener el Payment Intent para obtener el charge ID
      const paymentIntent = await this.getPaymentIntent(paymentIntentId);
      
      if (!paymentIntent.latest_charge) {
        throw new Error('Payment intent does not have a charge');
      }

      const refundParams: Stripe.RefundCreateParams = {
        charge: paymentIntent.latest_charge as string,
        amount: params?.amount,
        reason: params?.reason,
        metadata: params?.metadata || {},
      };

      const refund = await this.stripe.refunds.create(refundParams);

      this.logger.info('Refund processed successfully', {
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status,
      });

      return refund;
    } catch (error) {
      this.logger.error('Failed to process refund', {
        error: error.message,
        paymentIntentId,
        stack: error.stack,
      });
      throw new Error(`Stripe refund error: ${error.message}`);
    }
  }

  /**
   * Cancela un Payment Intent
   */
  async cancelPaymentIntent(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent> {
    this.logger.info('Cancelling payment intent', { paymentIntentId });

    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(
        paymentIntentId
      );

      this.logger.info('Payment intent cancelled', {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      });

      return paymentIntent;
    } catch (error) {
      this.logger.error('Failed to cancel payment intent', {
        error: error.message,
        paymentIntentId,
      });
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  /**
   * Verifica un webhook de Stripe
   */
  verifyWebhook(
    payload: string | Buffer,
    signature: string
  ): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );

      this.logger.debug('Webhook verified', {
        eventId: event.id,
        eventType: event.type,
      });

      return event;
    } catch (error) {
      this.logger.error('Webhook verification failed', {
        error: error.message,
      });
      throw new Error(`Webhook verification failed: ${error.message}`);
    }
  }
}
