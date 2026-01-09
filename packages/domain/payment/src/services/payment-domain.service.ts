import { Injectable } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import { Money } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentLimitsConfig {
  minAmount: number;
  maxAmount: number;
  supportedCurrencies?: string[];
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
    return payment.status.value === PaymentStatusValue.PENDING;
  }

  public calculateRefundAmount(payment: Payment): Money {
    // En esta versión asumimos reembolso completo. En el futuro se podrá agregar lógica parcial.
    return payment.amount;
  }

  public validatePaymentLimits(amount: Money): void {
    if (amount.amount < this.limits.minAmount) {
      throw new Error(`Payment amount must be at least ${this.limits.minAmount}`);
    }

    if (amount.amount > this.limits.maxAmount) {
      throw new Error(`Payment amount exceeds the maximum limit of ${this.limits.maxAmount}`);
    }

    if (
      this.limits.supportedCurrencies &&
      !this.limits.supportedCurrencies.includes(amount.currency)
    ) {
      throw new Error(`Unsupported currency: ${amount.currency}`);
    }
  }
}
