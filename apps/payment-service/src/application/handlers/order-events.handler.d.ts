import { ProcessPaymentUseCase } from '../use-cases/process-payment.use-case.js';
import { RefundPaymentUseCase } from '../use-cases/refund-payment.use-case.js';
import { PaymentRepository } from '../../domain/repositories/payment.repository.js';
export interface OrderCreatedEventPayload {
    orderId: string;
    customerId: string;
    totalAmount: number;
    currency: string;
    metadata?: Record<string, any>;
    paymentMethodId?: string;
    idempotencyKey?: string;
    sagaId?: string;
}
export interface OrderCancelledEventPayload {
    orderId: string;
    reason?: string;
    metadata?: Record<string, any>;
    sagaId?: string;
}
export declare class OrderEventsHandler {
    private readonly processPaymentUseCase;
    private readonly refundPaymentUseCase;
    private readonly paymentRepository;
    private readonly logger;
    constructor(processPaymentUseCase: ProcessPaymentUseCase, refundPaymentUseCase: RefundPaymentUseCase, paymentRepository: PaymentRepository);
    handleOrderCreated(event: OrderCreatedEventPayload): Promise<void>;
    handleOrderCancelled(event: OrderCancelledEventPayload): Promise<void>;
}
//# sourceMappingURL=order-events.handler.d.ts.map