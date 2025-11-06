import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { Money } from '../domain/value-objects';

@Injectable()
export class StripeGateway {
  private readonly logger = new Logger(StripeGateway.name);
  private readonly stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-11-20.acacia',
    });

    this.logger.log('Stripe gateway initialized');
  }

  /**
   * Crea un Payment Intent en Stripe
   */
  async createPaymentIntent(
    amount: Money,
    customerId: string,
    orderId: string,
    metadata: Record<string, any> = {}
  ): Promise<Stripe.PaymentIntent> {
    try {
      // Convertir amount a centavos (Stripe usa centavos)
      const amountInCents = Math.round(amount.amount * 100);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency: amount.currency.toLowerCase(),
        customer: customerId,
        metadata: {
          orderId,
          ...metadata,
        },
        // Configuración de idempotencia usando orderId
        idempotencyKey: `order_${orderId}_${Date.now()}`,
      });

      this.logger.log(`Payment Intent created: ${paymentIntent.id} for order ${orderId}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Error creating payment intent: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error(`Failed to create payment intent: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Confirma un Payment Intent
   */
  async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
      this.logger.log(`Payment Intent confirmed: ${paymentIntentId}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Error confirming payment intent: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error(`Failed to confirm payment intent: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Obtiene un Payment Intent por ID
   */
  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Error retrieving payment intent: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error(`Failed to retrieve payment intent: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Reembolsa un pago
   */
  async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: Stripe.RefundCreateParams.Reason
  ): Promise<Stripe.Refund> {
    try {
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        // Stripe espera el monto en centavos
        refundParams.amount = Math.round(amount * 100);
      }

      if (reason) {
        refundParams.reason = reason;
      }

      const refund = await this.stripe.refunds.create(refundParams);
      this.logger.log(`Refund created: ${refund.id} for payment intent ${paymentIntentId}`);
      return refund;
    } catch (error) {
      this.logger.error(`Error creating refund: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error(`Failed to create refund: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Maneja webhooks de Stripe
   */
  async handleWebhook(payload: string | Buffer, signature: string): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      this.logger.log(`Webhook received: ${event.type}`);
      return event;
    } catch (error) {
      this.logger.error(`Webhook signature verification failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error(`Webhook verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
