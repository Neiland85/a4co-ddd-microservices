import { Injectable } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import { Money } from '../value-objects';

@Injectable()
export class PaymentDomainService {
  // Límites de transacción
  private readonly MIN_AMOUNT = 0.50; // Mínimo 50 céntimos
  private readonly MAX_AMOUNT = 10000; // Máximo 10,000 EUR

  /**
   * Valida si un pago puede ser procesado
   */
  canProcessPayment(payment: Payment): boolean {
    // Verificar que el pago no esté en estado final
    if (payment.isFinal()) {
      return false;
    }

    // Verificar que el estado permita procesamiento
    if (payment.status !== 'PENDING' && payment.status !== 'PROCESSING') {
      return false;
    }

    return true;
  }

  /**
   * Calcula el monto de reembolso
   * Por ahora, reembolsamos el monto completo
   * En el futuro se puede agregar lógica para reembolsos parciales
   */
  calculateRefundAmount(payment: Payment): Money {
    if (!payment.canBeRefunded()) {
      throw new Error('Payment cannot be refunded');
    }

    // Por ahora, reembolsamos el monto completo
    return payment.amount;
  }

  /**
   * Valida los límites de transacción
   */
  validatePaymentLimits(amount: Money): void {
    if (amount.currency !== 'EUR' && amount.currency !== 'USD') {
      throw new Error(`Currency ${amount.currency} is not supported`);
    }

    if (amount.amount < this.MIN_AMOUNT) {
      throw new Error(`Payment amount must be at least ${this.MIN_AMOUNT} ${amount.currency}`);
    }

    if (amount.amount > this.MAX_AMOUNT) {
      throw new Error(`Payment amount cannot exceed ${this.MAX_AMOUNT} ${amount.currency}`);
    }
  }

  /**
   * Valida que el monto de reembolso no exceda el monto del pago
   */
  validateRefundAmount(payment: Payment, refundAmount: Money): void {
    if (refundAmount.currency !== payment.amount.currency) {
      throw new Error('Refund currency must match payment currency');
    }

    if (refundAmount.isGreaterThan(payment.amount)) {
      throw new Error('Refund amount cannot exceed payment amount');
    }

    if (refundAmount.amount <= 0) {
      throw new Error('Refund amount must be positive');
    }
  }

  /**
   * Verifica si un pago puede ser reembolsado
   */
  canRefundPayment(payment: Payment): boolean {
    return payment.canBeRefunded();
  }
}
