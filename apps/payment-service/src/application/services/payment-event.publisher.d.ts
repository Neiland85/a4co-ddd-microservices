import { ClientProxy } from '@nestjs/microservices';
import { Payment } from '../../domain/entities/payment.entity';
export declare class PaymentEventPublisher {
    private readonly natsClient;
    private readonly logger;
    constructor(natsClient: ClientProxy);
    publishPaymentEvents(payment: Payment): Promise<void>;
    private publishEvent;
    private mapSubject;
}
//# sourceMappingURL=payment-event.publisher.d.ts.map