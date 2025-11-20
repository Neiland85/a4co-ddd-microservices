import { ValueObject } from '@a4co/shared-utils';
export declare enum PaymentStatusValue {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare class PaymentStatus extends ValueObject<PaymentStatusValue> {
    private constructor();
    static create(value?: PaymentStatusValue): PaymentStatus;
    static from(value: string): PaymentStatus;
    canTransitionTo(nextStatus: PaymentStatusValue): boolean;
    transitionTo(nextStatus: PaymentStatusValue): PaymentStatus;
    isFinal(): boolean;
    isProcessing(): boolean;
    isSucceeded(): boolean;
    isPending(): boolean;
}
//# sourceMappingURL=payment-status.vo.d.ts.map