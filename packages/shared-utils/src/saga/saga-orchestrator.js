"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SagaOrchestrator = void 0;
class SagaOrchestrator {
    async executeStep(step, sagaId, data) {
        switch (step) {
            case 'PROCESS_PAYMENT':
                await this.processPayment(sagaId, data);
                break;
            case 'CONFIRM_ORDER':
                await this.confirmOrder(sagaId, data);
                break;
            default:
                throw new Error(`Paso de saga desconocido: ${step}`);
        }
    }
    async processPayment(sagaId, data) {
        console.log(`Processing payment for saga ${sagaId}`, data);
    }
    async confirmOrder(sagaId, data) {
        console.log(`Confirming order for saga ${sagaId}`, data);
    }
}
exports.SagaOrchestrator = SagaOrchestrator;
//# sourceMappingURL=saga-orchestrator.js.map