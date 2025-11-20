import { RawBodyRequest } from '@nestjs/common';
import { PaymentService } from '../application/services/payment.service';
import { StripeGateway } from '../infrastructure/stripe.gateway';
import { PaymentEventPublisher } from '../application/services/payment-event.publisher';
import { PaymentRepository } from '../domain/repositories/payment.repository';
import { ProcessPaymentUseCase } from '../application/use-cases/process-payment.use-case';
export declare class PaymentController {
    private readonly paymentService;
    private readonly stripeGateway;
    private readonly eventPublisher;
    private readonly paymentRepository;
    private readonly processPaymentUseCase;
    private readonly logger;
    constructor(paymentService: PaymentService, stripeGateway: StripeGateway, eventPublisher: PaymentEventPublisher, paymentRepository: PaymentRepository, processPaymentUseCase: ProcessPaymentUseCase);
    getHealth(): {
        status: string;
        service: string;
        version: string;
        dependencies: {
            database: string;
            stripe: string;
            nats: string;
        };
    };
    handlePaymentInitiate(data: any): Promise<void>;
    handleStripeWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
    private handlePaymentIntentSucceeded;
    private handlePaymentIntentFailed;
    private handlePaymentIntentCanceled;
}
//# sourceMappingURL=payment.controller.d.ts.map