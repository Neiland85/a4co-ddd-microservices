import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';
export interface PaymentFailedEventPayload extends PaymentEventPayload {
    status: PaymentStatusValue.FAILED;
    reason: string;
}
export declare class PaymentFailedEvent extends PaymentDomainEvent<PaymentFailedEventPayload> {
    constructor(params: {
        paymentId: string;
        orderId: string;
        customerId: string;
        amount: MoneyPrimitives;
        metadata?: Record<string, any>;
        reason: string;
        stripePaymentIntentId?: string | null;
        timestamp?: Date;
        sagaId?: string;
    });
}
//# sourceMappingURL=payment-failed.event.d.ts.map