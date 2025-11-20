import { ProcessPaymentUseCase, ProcessPaymentCommand } from '../use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from '../use-cases/refund-payment.use-case';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
export declare class PaymentService {
    private readonly processPaymentUseCase;
    private readonly refundPaymentUseCase;
    private readonly paymentRepository;
    constructor(processPaymentUseCase: ProcessPaymentUseCase, refundPaymentUseCase: RefundPaymentUseCase, paymentRepository: PaymentRepository);
    processPayment(command: ProcessPaymentCommand): Promise<import("../../domain/entities/payment.entity").Payment>;
    refundPayment(paymentId: string, amount?: number, reason?: string): Promise<import("../../domain/entities/payment.entity").Payment>;
    getPaymentById(paymentId: string): Promise<import("../../domain/entities/payment.entity").Payment | null>;
    getPaymentByOrderId(orderId: string): Promise<import("../../domain/entities/payment.entity").Payment | null>;
    getHealth(): {
        status: string;
        service: string;
        version: string;
        dependencies: {
            database: string;
            stripe: string;
            nats: string;
        };
    };
}
//# sourceMappingURL=payment.service.d.ts.map