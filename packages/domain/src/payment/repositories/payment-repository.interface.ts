import { Payment } from '../entities/payment.entity.js';
import { PaymentId } from '../value-objects/payment-id.vo.js';
import { PaymentStatusValue } from '../value-objects/payment-status.vo.js';

/**
 * Payment Repository Interface (Port)
 * Defines the contract for payment persistence.
 */
export interface IPaymentRepository {
  /**
   * Save a payment (create or update)
   */
  save(payment: Payment): Promise<void>;

  /**
   * Find a payment by ID
   */
  findById(paymentId: PaymentId): Promise<Payment | null>;

  /**
   * Find a payment by order ID
   */
  findByOrderId(orderId: string): Promise<Payment | null>;

  /**
   * Find payments by customer ID
   */
  findByCustomerId(customerId: string): Promise<Payment[]>;

  /**
   * Find payments by status
   */
  findByStatus(status: PaymentStatusValue): Promise<Payment[]>;

  /**
   * Check if a payment exists
   */
  exists(paymentId: PaymentId): Promise<boolean>;
}
