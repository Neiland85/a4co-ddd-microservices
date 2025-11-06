import { Payment } from '../entities';
import { PaymentId } from '../value-objects';

export interface IPaymentRepository {
  save(payment: Payment): Promise<void>;
  findById(id: PaymentId): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  findByStripeIntentId(intentId: string): Promise<Payment | null>;
  findAllByCustomerId(customerId: string): Promise<Payment[]>;
}
