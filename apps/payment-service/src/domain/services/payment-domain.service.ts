import { Injectable } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import { Money } from '../value-objects/money.vo';
import { PaymentStatus } from '../value-objects/payment-status.vo';

@Injectable()
export class PaymentDomainService {
  // Límites de pago por transacción (en centavos/euros)
  private readonly MIN_PAYMENT_AMOUNT = 0.01; // Mínimo 1 céntimo
  private readonly MAX_PAYMENT_AMOUNT = 100000; // Máximo 100,000 EUR

  /**
   * Valida si un pago puede ser procesado
   */
  canProcessPayment(payment: Payment): boolean {
    // Verificar que el pago no esté en estado final
    if (payment.isFinal()) {
      return false;
    }

    // Verificar que el estado permita procesamiento
    if (!payment.status.isPending() && !payment.status.isProcessing()) {
      return false;
    }

    // Validar límites de pago
    try {
      this.validatePaymentLimits(payment.amount);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Calcula el monto de reembolso
   * Por ahora, siempre reembolsamos el monto completo
   * En el futuro se puede agregar lógica para reembolsos parciales
   */
  calculateRefundAmount(payment: Payment): Money {
    if (!payment.canBeRefunded()) {
      throw new Error('Payment cannot be refunded');
    }

    // Por ahora, siempre reembolsamos el monto completo
    return payment.amount;
  }

  /**
   * Valida los límites de pago por transacción
   */
  validatePaymentLimits(amount: Money): void {
    if (amount.amount < this.MIN_PAYMENT_AMOUNT) {
      throw new Error(
        `Payment amount must be at least ${this.MIN_PAYMENT_AMOUNT} ${amount.currency}`
      );
    }

    if (amount.amount > this.MAX_PAYMENT_AMOUNT) {
      throw new Error(
        `Payment amount cannot exceed ${this.MAX_PAYMENT_AMOUNT} ${amount.currency}`
      );
    }
  }

  /**
   * Valida si un pago puede ser reembolsado
   */
  canRefundPayment(payment: Payment): boolean {
    return payment.canBeRefunded();
  }

  /**
   * Valida la transición de estado
   */
  validateStatusTransition(
    currentStatus: PaymentStatus,
    newStatus: PaymentStatus
  ): boolean {
    const statusVO = PaymentStatusVO.fromString(currentStatus);
    return statusVO.canTransitionTo(newStatus);
  }
}
