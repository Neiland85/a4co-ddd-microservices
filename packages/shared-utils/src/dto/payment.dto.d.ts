export declare enum PaymentMethodType {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    BANK_TRANSFER = "bank_transfer",
    DIGITAL_WALLET = "digital_wallet",
    CASH_ON_DELIVERY = "cash_on_delivery"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare class ValidatePaymentMethodRequestDto {
    paymentMethodType: PaymentMethodType;
    paymentMethodId: string;
    customerId: string;
    amount: number;
    currency: string;
    orderId?: string;
}
export declare class ValidatePaymentMethodResponseDto {
    valid: boolean;
    paymentMethodType: PaymentMethodType;
    paymentMethodId: string;
    customerId: string;
    availableBalance: number;
    dailyLimit: number;
    monthlyLimit: number;
    message?: string;
    errorCode?: string;
}
export declare class ProcessPaymentRequestDto {
    orderId: string;
    customerId: string;
    paymentMethodType: PaymentMethodType;
    paymentMethodId: string;
    amount: number;
    currency: string;
    description: string;
    customerEmail?: string;
    customerPhone?: string;
    billingAddress?: string;
}
export declare class ProcessPaymentResponseDto {
    success: boolean;
    paymentId: string;
    orderId: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    transactionId: string;
    message?: string;
    errorCode?: string;
    redirectUrl?: string;
}
export declare class PaymentMethodDto {
    id: string;
    customerId: string;
    type: PaymentMethodType;
    name: string;
    maskedNumber: string;
    expiryDate: string;
    isDefault: boolean;
    isActive: boolean;
    brand?: string;
    lastFourDigits?: string;
}
export declare class GetCustomerPaymentMethodsRequestDto {
    customerId: string;
    activeOnly?: boolean;
}
export declare class GetCustomerPaymentMethodsResponseDto {
    customerId: string;
    totalMethods: number;
    paymentMethods: PaymentMethodDto[];
    message?: string;
}
export declare class RefundPaymentRequestDto {
    paymentId: string;
    orderId: string;
    refundAmount: number;
    reason: string;
    customerId?: string;
}
export declare class RefundPaymentResponseDto {
    success: boolean;
    refundId: string;
    paymentId: string;
    orderId: string;
    refundAmount: number;
    status: PaymentStatus;
    message?: string;
    errorCode?: string;
}
//# sourceMappingURL=payment.dto.d.ts.map