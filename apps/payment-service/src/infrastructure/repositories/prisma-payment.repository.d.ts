import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentId } from '../../domain/value-objects/payment-id.vo';
import { PrismaService } from '../prisma/prisma.service';
export declare class PrismaPaymentRepository implements PaymentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(payment: Payment): Promise<void>;
    findById(id: PaymentId): Promise<Payment | null>;
    findByOrderId(orderId: string): Promise<Payment | null>;
    findByStripeIntentId(intentId: string): Promise<Payment | null>;
    private mapToPersistence;
    private mapToDomain;
}
//# sourceMappingURL=prisma-payment.repository.d.ts.map