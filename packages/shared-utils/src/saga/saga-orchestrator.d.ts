import { IEventBus } from '../events';
/**
 * Orquestador de Sagas - Elimina dependencias directas entre servicios
 * Cada servicio solo se comunica con el orquestador, no con otros servicios
 */
export declare abstract class SagaOrchestrator {
    protected eventBus: IEventBus;
    constructor(eventBus: IEventBus);
    /**
     * Inicia una saga específica
     */
    abstract startSaga(sagaId: string, initialData: any): Promise<void>;
    /**
     * Maneja el siguiente paso de la saga
     */
    abstract handleSagaStep(sagaId: string, step: string, data: any): Promise<void>;
    /**
     * Completa la saga exitosamente
     */
    protected completeSaga(sagaId: string, result: any): Promise<void>;
    /**
     * Falla la saga y ejecuta compensaciones
     */
    protected failSaga(sagaId: string, error: any): Promise<void>;
}
/**
 * Orquestador específico para la saga de creación de órdenes
 */
export declare class OrderCreationSagaOrchestrator extends SagaOrchestrator {
    private sagaStates;
    startSaga(sagaId: string, initialData: {
        customerId: string;
        items: any[];
    }): Promise<void>;
    handleSagaStep(sagaId: string, step: string, data: any): Promise<void>;
    private validateInventory;
    private createOrder;
    private processPayment;
    private confirmOrder;
}
//# sourceMappingURL=saga-orchestrator.d.ts.map