import { ProcessPaymentUseCase } from '../use-cases/process-payment.use-case';
export interface OrderCreatedEventPayload {
    orderId: string;
    customerId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    timestamp: Date;
}
export interface PaymentProcessRequest {
    orderId: string;
    customerId: string;
    amount: {
        value: number;
        currency: string;
    };
}
export declare class OrderEventsHandler {
    private readonly processPaymentUseCase;
    private readonly eventBus;
    private readonly logger;
    constructor(processPaymentUseCase: ProcessPaymentUseCase, eventBus: any);
    private setupEventHandlers;
    private handlePaymentProcessRequest;
}
//# sourceMappingURL=order-events-improved.handler.d.ts.map