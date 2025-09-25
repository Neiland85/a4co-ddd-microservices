"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreationSagaOrchestrator = exports.SagaOrchestrator = void 0;
const uuid_1 = require("uuid");
const domain_events_1 = require("../events/domain-events");
const subjects_1 = require("../events/subjects");
class SagaOrchestrator {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    async completeSaga(sagaId, result) {
        const event = new domain_events_1.SagaCompletedEvent(sagaId, {
            result,
            completedAt: new Date(),
        });
        await this.eventBus.publish(subjects_1.EventSubjects.SAGA_COMPLETED, event);
    }
    async failSaga(sagaId, error, compensations) {
        const event = new domain_events_1.SagaFailedEvent(sagaId, {
            error: error.message,
            compensations,
            failedAt: new Date(),
        });
        await this.eventBus.publish(subjects_1.EventSubjects.SAGA_FAILED, event);
    }
}
exports.SagaOrchestrator = SagaOrchestrator;
class OrderCreationSagaOrchestrator extends SagaOrchestrator {
    constructor() {
        super(...arguments);
        this.sagaStates = new Map();
    }
    async startSaga(sagaId, initialData) {
        this.sagaStates.set(sagaId, {
            customerId: initialData.customerId,
            initialData,
        });
        const productInfoEvent = new domain_events_1.ProductInformationRequestedEvent(sagaId, {
            orderId: sagaId,
            productIds: initialData.items.map(item => item.productId),
            requestedAt: new Date(),
        });
        await this.eventBus.publish(subjects_1.EventSubjects.PRODUCT_INFORMATION_REQUESTED, productInfoEvent);
        const stockValidationEvent = new domain_events_1.StockValidationRequestedEvent(sagaId, {
            orderId: sagaId,
            items: initialData.items,
            requestedAt: new Date(),
        });
        await this.eventBus.publish(subjects_1.EventSubjects.STOCK_VALIDATION_REQUESTED, stockValidationEvent);
        const userInfoEvent = new domain_events_1.UserInformationRequestedEvent(sagaId, {
            userId: initialData.customerId,
            requestedFields: ['email', 'address', 'preferences'],
            requestedAt: new Date(),
        });
        await this.eventBus.publish(subjects_1.EventSubjects.USER_INFORMATION_REQUESTED, userInfoEvent);
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
        });
    }
    async handleSagaStep(sagaId, step, data) {
        const sagaState = this.sagaStates.get(sagaId);
        if (!sagaState) {
            throw new Error(`Saga ${sagaId} no encontrada`);
        }
        switch (step) {
            case 'PRODUCT_INFO_RECEIVED':
                await this.handleProductInfoReceived(sagaId, data);
                break;
            case 'STOCK_VALIDATED':
                await this.handleStockValidated(sagaId, data);
                break;
            case 'USER_INFO_RECEIVED':
                await this.handleUserInfoReceived(sagaId, data);
                break;
            case 'PAYMENT_PROCESSED':
                await this.handlePaymentProcessed(sagaId, data);
                break;
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
    async handleProductInfoReceived(sagaId, data) {
        console.log(`Product info received for saga ${sagaId}`);
    }
    async handleStockValidated(sagaId, data) {
        if (data.allItemsAvailable) {
            const sagaState = this.sagaStates.get(sagaId);
            if (!sagaState) {
                throw new Error(`Saga state not found for sagaId: ${sagaId}`);
            }
            const paymentInitiatedEvent = new domain_events_1.PaymentInitiatedEvent((0, uuid_1.v4)(), {
                orderId: sagaId,
                customerId: sagaState.customerId,
                amount: data.totalAmount,
                currency: data.currency,
                paymentMethod: 'credit_card',
                paymentGateway: 'stripe',
                initiatedAt: new Date(),
            });
            await this.eventBus.publish(subjects_1.EventSubjects.PAYMENT_INITIATED, paymentInitiatedEvent);
        }
        else {
            await this.failSaga(sagaId, new Error('Stock not available'), ['release_stock']);
        }
    }
    async handleUserInfoReceived(sagaId, data) {
        console.log(`User info received for saga ${sagaId}`);
    }
    async handlePaymentProcessed(sagaId, data) {
        if (data.success) {
            const sagaCompletedEvent = new domain_events_1.SagaCompletedEvent(sagaId, {
                result: {
                    orderId: sagaId,
                    paymentId: data.paymentId,
                    status: 'confirmed',
                },
                completedAt: new Date(),
            });
            await this.eventBus.publish(subjects_1.EventSubjects.SAGA_COMPLETED, sagaCompletedEvent);
        }
        else {
            await this.failSaga(sagaId, new Error('Payment failed'), ['release_stock']);
        }
    }
    async validateInventory(sagaId, data) {
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
        });
    }
    async createOrder(sagaId, data) {
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
        });
    }
    async processPayment(sagaId, data) {
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
        });
    }
    async confirmOrder(sagaId, data) {
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
        });
    }
}
exports.OrderCreationSagaOrchestrator = OrderCreationSagaOrchestrator;
//# sourceMappingURL=saga-orchestrator.js.map