import { IEventBus } from '../events';
export declare abstract class SagaOrchestrator {
    protected eventBus: IEventBus;
    constructor(eventBus: IEventBus);
    abstract startSaga(sagaId: string, initialData: any): Promise<void>;
    abstract handleSagaStep(sagaId: string, step: string, data: any): Promise<void>;
    protected completeSaga(sagaId: string, result: any): Promise<void>;
    protected failSaga(sagaId: string, error: Error, compensations: string[]): Promise<void>;
}
export declare class OrderCreationSagaOrchestrator extends SagaOrchestrator {
    private sagaStates;
    startSaga(sagaId: string, initialData: {
        customerId: string;
        customerEmail: string;
        items: Array<{
            productId: string;
            quantity: number;
        }>;
        deliveryAddress: any;
    }): Promise<void>;
    handleSagaStep(sagaId: string, step: string, data: any): Promise<void>;
    private handleProductInfoReceived;
    private handleStockValidated;
    private handleUserInfoReceived;
    private handlePaymentProcessed;
    private validateInventory;
    private createOrder;
    private processPayment;
    private confirmOrder;
}
//# sourceMappingURL=saga-orchestrator.d.ts.map