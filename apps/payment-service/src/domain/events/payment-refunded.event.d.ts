import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';
export interface PaymentRefundedEventPayload extends PaymentEventPayload {
    status: PaymentStatusValue.REFUNDED;
    refundAmount: MoneyPrimitives;
}
export declare class PaymentRefundedEvent extends PaymentDomainEvent<PaymentRefundedEventPayload> {
    constructor(params: {
        paymentId: string;
        orderId: string;
        customerId: string;
        amount: MoneyPrimitives;
        refundAmount: MoneyPrimitives;
        metadata?: Record<string, any>;
        stripePaymentIntentId?: string | null;
        timestamp?: Date;
        sagaId?: string;
    });
}
//# sourceMappingURL=payment-refunded.event.d.ts.map