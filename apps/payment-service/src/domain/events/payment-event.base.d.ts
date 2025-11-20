import { DomainEvent } from '@a4co/shared-utils';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';
export interface PaymentEventPayload {
    paymentId: string;
    orderId: string;
    customerId: string;
    amount: MoneyPrimitives;
    currency: string;
    status: PaymentStatusValue;
    metadata: Record<string, any>;
    stripePaymentIntentId: string | null;
    timestamp: Date;
    reason?: string;
}
export declare abstract class PaymentDomainEvent<TPayload extends PaymentEventPayload> extends DomainEvent {
    readonly payload: TPayload;
    protected constructor(paymentId: string, payload: TPayload, eventVersion?: number, sagaId?: string);
}
//# sourceMappingURL=payment-event.base.d.ts.map