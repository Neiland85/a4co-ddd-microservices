import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';
export interface PaymentCreatedEventPayload extends PaymentEventPayload {
    status: PaymentStatusValue.PENDING;
}
export declare class PaymentCreatedEvent extends PaymentDomainEvent<PaymentCreatedEventPayload> {
    constructor(params: {
        paymentId: string;
        orderId: string;
        customerId: string;
        amount: MoneyPrimitives;
        metadata?: Record<string, any>;
        stripePaymentIntentId?: string | null;
        timestamp?: Date;
        sagaId?: string;
    });
}
//# sourceMappingURL=payment-created.event.d.ts.map