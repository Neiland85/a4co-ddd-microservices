import { Injectable, Logger } from '@nestjs/common';
import { Money } from '../domain/value-objects/money.vo';

export interface CreatePaymentIntentParams {
  amount: Money;
  orderId: string;
  customerId: string;
  paymentMethodId?: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}

export interface SimulatedPaymentIntent {
  id: string;
  status: 'succeeded' | 'failed' | 'processing';
  amount: number;
  currency: string;
  orderId: string;
  customerId: string;
  created: number;
}

/**
 * Simulated Payment Gateway for Testing
 * 
 * This gateway simulates payment processing with a configurable success rate.
 * Default is 90% success rate for testing saga compensations.
 * 
 * Usage: Set SIMULATED_PAYMENT=true in environment to use this instead of Stripe
 */
@Injectable()
export class SimulatedPaymentGateway {
  private readonly logger = new Logger(SimulatedPaymentGateway.name);
  private readonly successRate: number;

  constructor() {
    // Read success rate from environment, default to 90%
    const envSuccessRate = process.env['PAYMENT_SUCCESS_RATE'];
    this.successRate = envSuccessRate ? parseFloat(envSuccessRate) : 0.9;
    
    this.logger.log(`💳 Simulated Payment Gateway initialized with ${this.successRate * 100}% success rate`);
  }

  public async createPaymentIntent(
    params: CreatePaymentIntentParams,
  ): Promise<SimulatedPaymentIntent> {
    const amountInMinorUnits = Math.round(params.amount.amount * 100);

    // Simulate processing delay
    await this.simulateDelay(500, 1500);

    // Random success/failure based on success rate
    const random = Math.random();
    const isSuccess = random < this.successRate;

    const intent: SimulatedPaymentIntent = {
      id: `pi_simulated_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      status: isSuccess ? 'succeeded' : 'failed',
      amount: amountInMinorUnits,
      currency: params.amount.currency.toLowerCase(),
      orderId: params.orderId,
      customerId: params.customerId,
      created: Date.now(),
    };

    if (isSuccess) {
      this.logger.log(
        `✅ Simulated payment intent ${intent.id} SUCCEEDED for order ${params.orderId} (${random.toFixed(3)} < ${this.successRate})`
      );
    } else {
      this.logger.warn(
        `❌ Simulated payment intent ${intent.id} FAILED for order ${params.orderId} (${random.toFixed(3)} >= ${this.successRate})`
      );
    }

    return intent;
  }

  public async refundPayment(paymentIntentId: string, amount?: Money): Promise<any> {
    // Simulate processing delay
    await this.simulateDelay(300, 800);

    const refund = {
      id: `re_simulated_${Date.now()}`,
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount.amount * 100) : undefined,
      status: 'succeeded',
      created: Date.now(),
    };

    this.logger.log(`💰 Simulated refund ${refund.id} created for payment ${paymentIntentId}`);

    return refund;
  }

  private async simulateDelay(minMs: number, maxMs: number): Promise<void> {
    const delay = Math.random() * (maxMs - minMs) + minMs;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
