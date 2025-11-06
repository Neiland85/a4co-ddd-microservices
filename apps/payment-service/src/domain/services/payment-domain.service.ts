import { Injectable } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import { Money } from '../value-objects/money.vo';

@Injectable()
export class PaymentDomainService {
  /**
   * Valida si un pago puede ser procesado
   */
  canProcessPayment(payment: Payment): boolean {
    // Validaciones de negocio
    if (payment.isFinal()) {
      return false;
    }

    if (payment.status !== 'PENDING') {
      return false;
    }

    // Validar que el monto sea válido
    if (payment.amount.amount <= 0) {
      return false;
    }

    return true;
  }

  /**
   * Calcula el monto de reembolso
   * Por defecto, reembolsa el monto completo
   */
  calculateRefundAmount(payment: Payment, partialAmount?: Money): Money {
    if (!payment.canBeRefunded()) {
      throw new Error('Payment cannot be refunded');
    }

    if (partialAmount) {
      if (partialAmount.isGreaterThan(payment.amount)) {
        throw new Error('Refund amount cannot exceed payment amount');
      }
      if (partialAmount.currency !== payment.amount.currency) {
        throw new Error('Refund currency must match payment currency');
      }
      return partialAmount;
    }

    return payment.amount;
  }

  /**
   * Valida límites de pago por transacción
   */
  validatePaymentLimits(amount: Money): void {
    const MAX_AMOUNT_USD = 100000; // $100,000 USD
    const MAX_AMOUNT_EUR = 90000;  // €90,000 EUR
    const MIN_AMOUNT = 0.50; // Mínimo $0.50

    if (amount.amount < MIN_AMOUNT) {
      throw new Error(`Payment amount must be at least ${MIN_AMOUNT} ${amount.currency}`);
    }

    const maxAmounts: Record<string, number> = {
      USD: MAX_AMOUNT_USD,
      EUR: MAX_AMOUNT_EUR,
      GBP: 80000,
      MXN: 2000000,
      COP: 400000000,
    };

    const maxAmount = maxAmounts[amount.currency] || MAX_AMOUNT_USD;
    if (amount.amount > maxAmount) {
      throw new Error(
        `Payment amount exceeds maximum limit of ${maxAmount} ${amount.currency}`
      );
    }
  }

  /**
   * Valida que el customerId tenga formato válido
   */
  validateCustomerId(customerId: string): void {
    if (!customerId || !customerId.trim()) {
      throw new Error('CustomerId is required');
    }
    // Validar formato UUID o Stripe customer ID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const stripeCustomerRegex = /^cus_[a-zA-Z0-9]{24,}$/;
    
    if (!uuidRegex.test(customerId) && !stripeCustomerRegex.test(customerId)) {
      throw new Error('Invalid customerId format');
    }
  }
}
