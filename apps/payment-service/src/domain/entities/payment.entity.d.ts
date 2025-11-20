import { AggregateRoot } from '@a4co/shared-utils';
import { PaymentId } from '../value-objects/payment-id.vo';
import { Money, MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatus, PaymentStatusValue } from '../value-objects/payment-status.vo';
import { StripePaymentIntent } from '../value-objects/stripe-payment-intent.vo';
export interface PaymentCreateProps {
    paymentId?: PaymentId;
    orderId: string;
    amount: Money;
    customerId: string;
    metadata?: Record<string, any>;
    stripePaymentIntentId?: StripePaymentIntent | string | null;
}
export interface PaymentPrimitives {
    id: string;
    orderId: string;
    amount: MoneyPrimitives;
    status: PaymentStatusValue;
    stripePaymentIntentId: string | null;
    customerId: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Payment extends AggregateRoot {
    private _paymentId;
    private _orderId;
    private _amount;
    private _status;
    private _stripePaymentIntentId;
    private _customerId;
    private _metadata;
    private constructor();
    static create(props: PaymentCreateProps): Payment;
    static rehydrate(primitives: PaymentPrimitives): Payment;
    process(): void;
    markAsSucceeded(stripePaymentIntentId: string): void;
    markAsFailed(reason: string): void;
    refund(refundAmount?: Money, reason?: string): void;
    updateMetadata(metadata: Record<string, any>): void;
    private recordDomainEvent;
    get paymentId(): PaymentId;
    get orderId(): string;
    get amount(): Money;
    get status(): PaymentStatus;
    get stripePaymentIntentId(): string | null;
    get customerId(): string;
    get metadata(): Record<string, any>;
    toPrimitives(): PaymentPrimitives;
    private static normalizeStripePaymentIntent;
    private static ensureOrderId;
    private static ensureCustomerId;
}
//# sourceMappingURL=payment.entity.d.ts.map