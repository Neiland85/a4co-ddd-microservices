"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreationSagaOrchestrator = exports.SagaOrchestrator = void 0;
const subjects_1 = require("../events/subjects");
const domain_events_1 = require("../events/domain-events");
/**
 * Orquestador de Sagas - Elimina dependencias directas entre servicios
 * Cada servicio solo se comunica con el orquestador, no con otros servicios
 */
class SagaOrchestrator {
    eventBus;
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    /**
     * Completa la saga exitosamente
     */
    async completeSaga(sagaId, result) {
        const event = new domain_events_1.SagaCompletedEvent(sagaId, {
            result,
            completedAt: new Date(),
        });
        await this.eventBus.publish(subjects_1.EventSubjects.SAGA_COMPLETED, event);
    }
    /**
     * Falla la saga y ejecuta compensaciones
     */
    async failSaga(sagaId, error) {
        const event = new domain_events_1.SagaFailedEvent(sagaId, {
            error: error.message || error.toString(),
            compensations: [],
            failedAt: new Date(),
        });
        await this.eventBus.publish(subjects_1.EventSubjects.SAGA_FAILED, event);
    }
}
exports.SagaOrchestrator = SagaOrchestrator;
/**
 * Orquestador específico para la saga de creación de órdenes
 */
class OrderCreationSagaOrchestrator extends SagaOrchestrator {
    sagaStates = new Map(); // Almacenar estado por sagaId
    async startSaga(sagaId, initialData) {
        // Almacenar estado inicial
        this.sagaStates.set(sagaId, {
            customerId: initialData.customerId,
            initialData,
        });
        // Publicar evento de inicio de saga usando SAGA_STARTED
        await this.eventBus.publish(subjects_1.EventSubjects.SAGA_STARTED, {
            eventId: sagaId,
            eventType: 'OrderCreationSagaStarted',
            aggregateId: sagaId,
            eventVersion: 1,
            occurredOn: new Date(),
            eventData: {
                sagaId,
                customerId: initialData.customerId,
                items: initialData.items,
            },
            sagaId,
        });
    }
    async handleSagaStep(sagaId, step, data) {
        const sagaState = this.sagaStates.get(sagaId);
        if (!sagaState) {
            throw new Error(`Saga ${sagaId} no encontrada`);
        }
        switch (step) {
            case 'VALIDATE_INVENTORY':
                await this.validateInventory(sagaId, data);
                break;
            case 'CREATE_ORDER':
                await this.createOrder(sagaId, data);
                break;
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
    async validateInventory(sagaId, data) {
        // Usar STOCK_VALIDATION_REQUESTED que sí existe
        await this.eventBus.publish(subjects_1.EventSubjects.STOCK_VALIDATION_REQUESTED, {
            eventId: `inventory-${sagaId}`,
            eventType: 'InventoryValidationRequested',
            aggregateId: sagaId,
            eventVersion: 1,
            occurredOn: new Date(),
            eventData: {
                sagaId,
                items: data.items,
            },
            sagaId,
        });
    }
    async createOrder(sagaId, data) {
        // Usar ORDER_CREATED que sí existe
        await this.eventBus.publish(subjects_1.EventSubjects.ORDER_CREATED, {
            eventId: `order-${sagaId}`,
            eventType: 'OrderCreationRequested',
            aggregateId: sagaId,
            eventVersion: 1,
            occurredOn: new Date(),
            eventData: {
                sagaId,
                customerId: data.customerId,
                items: data.items,
            },
            sagaId,
        });
    }
    async processPayment(sagaId, data) {
        // Usar PAYMENT_INITIATED que sí existe
        await this.eventBus.publish(subjects_1.EventSubjects.PAYMENT_INITIATED, {
            eventId: `payment-${sagaId}`,
            eventType: 'PaymentProcessingRequested',
            aggregateId: sagaId,
            eventVersion: 1,
            occurredOn: new Date(),
            eventData: {
                sagaId,
                orderId: data.orderId,
                amount: data.amount,
            },
            sagaId,
        });
    }
    async confirmOrder(sagaId, data) {
        // Usar ORDER_CONFIRMED que sí existe
        await this.eventBus.publish(subjects_1.EventSubjects.ORDER_CONFIRMED, {
            eventId: `confirmation-${sagaId}`,
            eventType: 'OrderConfirmationRequested',
            aggregateId: sagaId,
            eventVersion: 1,
            occurredOn: new Date(),
            eventData: {
                sagaId,
                orderId: data.orderId,
            },
            sagaId,
        });
    }
}
exports.OrderCreationSagaOrchestrator = OrderCreationSagaOrchestrator;
//# sourceMappingURL=saga-orchestrator.js.map