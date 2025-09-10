export declare class PaymentController {
    private paymentService;
    processPayment(req: {
        orderId: string;
        amount: number;
    }): string;
    getPaymentStatus(req: {
        orderId: string;
    }): string;
}
//# sourceMappingURL=controller.d.ts.map