import { Injectable } from '@nestjs/common';
import { Payment } from '../entities';
import { Money } from '../value-objects';

@Injectable()
export class PaymentDomainService {
  private static readonly MIN_PAYMENT_AMOUNT = 0.5; // $0.50
  private static readonly MAX_PAYMENT_AMOUNT = 100000; // $100,000
  private static readonly MAX_DAILY_PAYMENT_LIMIT = 50000; // $50,000 per day per customer
  private static readonly MAX_MONTHLY_PAYMENT_LIMIT = 200000; // $200,000 per month per customer

  /**
   * Valida si un pago puede ser procesado
   */
  canProcessPayment(payment: Payment): boolean {
    // Validar que el pago esté en estado válido
    if (!payment.canBeProcessed()) {
      return false;
    }

    // Validar límites de monto
    try {
      this.validatePaymentLimits(payment.amount);
    } catch {
      return false;
    }

    return true;
  }

  /**
   * Valida los límites de monto de un pago
   */
  validatePaymentLimits(amount: Money): void {
    const amountValue = amount.amount;

    if (amountValue < PaymentDomainService.MIN_PAYMENT_AMOUNT) {
      throw new Error(
        `Payment amount ${amountValue} ${amount.currency} is below minimum ${PaymentDomainService.MIN_PAYMENT_AMOUNT} ${amount.currency}`
      );
    }

    if (amountValue > PaymentDomainService.MAX_PAYMENT_AMOUNT) {
      throw new Error(
        `Payment amount ${amountValue} ${amount.currency} exceeds maximum ${PaymentDomainService.MAX_PAYMENT_AMOUNT} ${amount.currency}`
      );
    }
  }

  /**
   * Calcula el monto de reembolso
   * Por ahora, reembolso completo. En el futuro se puede implementar reembolsos parciales
   */
  calculateRefundAmount(payment: Payment, partialAmount?: Money): Money {
    if (!payment.canBeRefunded()) {
      throw new Error(`Payment cannot be refunded. Current status: ${payment.status}`);
    }

    if (partialAmount) {
      // Validar que el monto parcial no exceda el monto original
      if (partialAmount.isGreaterThan(payment.amount)) {
        throw new Error(
          `Refund amount ${partialAmount.amount} ${partialAmount.currency} cannot exceed payment amount ${payment.amount.amount} ${payment.currency}`
        );
      }

      // Validar misma moneda
      if (partialAmount.currency !== payment.amount.currency) {
        throw new Error(
          `Refund currency ${partialAmount.currency} must match payment currency ${payment.amount.currency}`
        );
      }

      return partialAmount;
    }

    // Reembolso completo
    return payment.amount;
  }

  /**
   * Valida límites diarios de pago por cliente
   * Nota: Esto requeriría acceso al repositorio para consultar pagos del día
   * Por ahora, solo valida el monto individual
   */
  validateDailyPaymentLimit(amount: Money): void {
    // Esta validación completa requeriría consultar el repositorio
    // Por ahora, solo validamos el monto individual
    if (amount.amount > PaymentDomainService.MAX_DAILY_PAYMENT_LIMIT) {
      throw new Error(
        `Payment amount ${amount.amount} ${amount.currency} exceeds daily limit ${PaymentDomainService.MAX_DAILY_PAYMENT_LIMIT} ${amount.currency}`
      );
    }
  }

  /**
   * Valida límites mensuales de pago por cliente
   * Nota: Esto requeriría acceso al repositorio para consultar pagos del mes
   */
  validateMonthlyPaymentLimit(amount: Money): void {
    // Esta validación completa requeriría consultar el repositorio
    // Por ahora, solo validamos el monto individual
    if (amount.amount > PaymentDomainService.MAX_MONTHLY_PAYMENT_LIMIT) {
      throw new Error(
        `Payment amount ${amount.amount} ${amount.currency} exceeds monthly limit ${PaymentDomainService.MAX_MONTHLY_PAYMENT_LIMIT} ${amount.currency}`
      );
    }
  }

  /**
   * Determina si un pago puede ser reembolsado
   */
  canRefundPayment(payment: Payment): boolean {
    return payment.canBeRefunded();
  }

  /**
   * Calcula la comisión de Stripe (aproximada)
   * Stripe cobra 2.9% + $0.30 por transacción
   */
  calculateStripeFee(amount: Money): Money {
    const feePercentage = 0.029; // 2.9%
    const fixedFee = 0.3; // $0.30

    const percentageFee = amount.amount * feePercentage;
    const totalFee = percentageFee + fixedFee;

    return new Money(totalFee, amount.currency);
  }

  /**
   * Calcula el monto neto después de comisiones
   */
  calculateNetAmount(amount: Money): Money {
    const fee = this.calculateStripeFee(amount);
    return amount.subtract(fee);
  }
}
