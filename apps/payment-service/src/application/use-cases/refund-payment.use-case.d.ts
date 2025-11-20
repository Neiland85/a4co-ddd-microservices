import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentDomainService } from '../../domain/services/payment-domain.service';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { PaymentEventPublisher } from '../services/payment-event.publisher';
export declare class RefundPaymentUseCase {
    private readonly paymentRepository;
    private readonly paymentDomainService;
    private readonly stripeGateway;
    private readonly eventPublisher;
    private readonly logger;
    constructor(paymentRepository: PaymentRepository, paymentDomainService: PaymentDomainService, stripeGateway: StripeGateway, eventPublisher: PaymentEventPublisher);
    execute(paymentId: string, amount?: number, reason?: string): Promise<Payment>;
    private persist;
}
//# sourceMappingURL=refund-payment.use-case.d.ts.map