import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';
export interface PaymentSucceededEventPayload extends PaymentEventPayload {
    status: PaymentStatusValue.SUCCEEDED;
    stripePaymentIntentId: string;
}
export declare class PaymentSucceededEvent extends PaymentDomainEvent<PaymentSucceededEventPayload> {
    constructor(params: {
        paymentId: string;
        orderId: string;
        customerId: string;
        amount: MoneyPrimitives;
        metadata?: Record<string, any>;
        stripePaymentIntentId: string;
        timestamp?: Date;
        sagaId?: string;
    });
}
//# sourceMappingURL=payment-succeeded.event.d.ts.map