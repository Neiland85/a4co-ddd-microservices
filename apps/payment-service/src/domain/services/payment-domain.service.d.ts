import { Payment } from '../entities/payment.entity';
import { Money } from '../value-objects/money.vo';
export interface PaymentLimitsConfig {
    minAmount: number;
    maxAmount: number;
    supportedCurrencies?: string[];
}
export declare class PaymentDomainService {
    private readonly limits;
    constructor(limits?: PaymentLimitsConfig);
    canProcessPayment(payment: Payment): boolean;
    calculateRefundAmount(payment: Payment): Money;
    validatePaymentLimits(amount: Money): void;
}
//# sourceMappingURL=payment-domain.service.d.ts.map