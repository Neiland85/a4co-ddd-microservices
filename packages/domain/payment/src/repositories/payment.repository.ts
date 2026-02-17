import { Payment } from '../entities/payment.entity';
import { PaymentId } from '../value-objects/payment-id.vo';
import { Money } from '../value-objects/money.vo';

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;

  findById(id: PaymentId): Promise<Payment | null>;

  findByOrderId(orderId: string): Promise<Payment | null>;

  refund(paymentId: PaymentId, amount?: Money, reason?: string): Promise<void>;
}
