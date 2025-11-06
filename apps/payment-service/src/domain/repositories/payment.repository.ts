import { Payment } from '../entities/payment.entity';
import { PaymentId } from '../value-objects/payment-id.vo';

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findById(id: PaymentId): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  findByStripeIntentId(intentId: string): Promise<Payment | null>;
  exists(id: PaymentId): Promise<boolean>;
}
