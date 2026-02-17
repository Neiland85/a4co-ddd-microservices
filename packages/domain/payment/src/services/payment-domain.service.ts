// packages/domain/payment/src/services/payment-domain.service.ts

import { Injectable } from '@nestjs/common';
import { Payment, Money, PaymentStatusValue } from '../index';
export interface PaymentLimitsConfig {
  minAmount: number;
  maxAmount: number;
  supportedCurrencies: string[];
}

const DEFAULT_LIMITS: PaymentLimitsConfig = {
  minAmount: 0.01,
  maxAmount: 100_000,
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'MXN'],
};

@Injectable()
export class PaymentDomainService {
  constructor(private readonly limits: PaymentLimitsConfig = DEFAULT_LIMITS) {}

  public canProcessPayment(payment: Payment): boolean {
    return payment.status === PaymentStatusValue.PENDING;
  }

  public calculateRefundAmount(payment: Payment): Money {
    return payment.amount;
  }

  public validatePaymentLimits(amount: Money): void {
    if (amount.amount < this.limits.minAmount) {
      throw new Error(`Payment amount must be at least ${this.limits.minAmount}`);
    }

    if (amount.amount > this.limits.maxAmount) {
      throw new Error(`Payment amount exceeds maximum limit of ${this.limits.maxAmount}`);
    }

    if (!this.limits.supportedCurrencies.includes(amount.currency)) {
      throw new Error(`Unsupported currency: ${amount.currency}`);
    }
  }
}
