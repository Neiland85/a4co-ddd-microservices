import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { PaymentEventPublisher } from '../services/payment-event.publisher';
export interface ProcessPaymentCommand {
    orderId: string;
    amount: number;
    currency: string;
    customerId: string;
    metadata?: Record<string, any>;
    paymentMethodId?: string;
    idempotencyKey?: string;
    sagaId?: string;
}
export declare class ProcessPaymentUseCase {
    private readonly paymentRepository;
    private readonly stripeGateway;
    private readonly eventPublisher;
    private readonly logger;
    constructor(paymentRepository: PaymentRepository, stripeGateway: StripeGateway, eventPublisher: PaymentEventPublisher);
    execute(command: ProcessPaymentCommand): Promise<void>;
}
//# sourceMappingURL=process-payment-improved.use-case.d.ts.map