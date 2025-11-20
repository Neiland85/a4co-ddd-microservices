import { PaymentDomainService } from '../../domain/services/payment-domain.service';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { PaymentEventPublisher } from '../services/payment-event.publisher';
export interface ProcessPaymentCommand {
    orderId: string;
    amount: number;
    currency: string;
    customerId: string;
    description?: string;
    metadata?: Record<string, any>;
    paymentMethodId?: string;
    idempotencyKey?: string;
    sagaId?: string;
}
export declare class ProcessPaymentUseCase {
    private readonly paymentRepository;
    private readonly paymentDomainService;
    private readonly stripeGateway;
    private readonly eventPublisher;
    private readonly logger;
    constructor(paymentRepository: PaymentRepository, paymentDomainService: PaymentDomainService, stripeGateway: StripeGateway, eventPublisher: PaymentEventPublisher);
    execute(command: ProcessPaymentCommand): Promise<Payment>;
    private persist;
}
//# sourceMappingURL=process-payment.use-case.d.ts.map