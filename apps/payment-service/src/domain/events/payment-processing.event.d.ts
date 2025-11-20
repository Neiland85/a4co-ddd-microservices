import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';
export interface PaymentProcessingEventPayload extends PaymentEventPayload {
    status: PaymentStatusValue.PROCESSING;
}
export declare class PaymentProcessingEvent extends PaymentDomainEvent<PaymentProcessingEventPayload> {
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
//# sourceMappingURL=payment-processing.event.d.ts.map