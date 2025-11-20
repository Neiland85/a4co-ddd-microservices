export declare class PaymentResponseDto {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: string;
    stripePaymentIntentId?: string;
    customerId: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=payment-response.dto.d.ts.map