"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreationSagaOrchestrator = exports.SagaOrchestrator = void 0;
const subjects_1 = require("../events/subjects");
const domain_event_1 = require("../domain/domain-event");
class SagaCompletedEvent extends domain_event_1.DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data);
    }
}
class SagaFailedEvent extends domain_event_1.DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data);
    }
}
class ProductInformationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data);
    }
}
class StockValidationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data);
    }
}
class UserInformationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data);
    }
}
class PaymentInitiatedEvent extends domain_event_1.DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data);
    }
}
class SagaOrchestrator {
    eventBus;
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    async completeSaga(sagaId, result) {
        const event = new SagaCompletedEvent(sagaId, {
            sagaId,
            result,
            completedAt: new Date()
        });
        await this.eventBus.publish(subjects_1.EventSubjects.SAGA_COMPLETED, event);
    }
    async failSaga(sagaId, error, compensations) {
        const event = new SagaFailedEvent(sagaId, {
            sagaId,
            error: error.message,
            compensations,
            failedAt: new Date()
        });
        await this.eventBus.publish(subjects_1.EventSubjects.SAGA_FAILED, event);
    }
}
exports.SagaOrchestrator = SagaOrchestrator;
class OrderCreationSagaOrchestrator extends SagaOrchestrator {
    async startSaga(sagaId, initialData) {
        const productInfoEvent = new ProductInformationRequestedEvent(sagaId, {
            sagaId,
            orderId: sagaId,
            productIds: initialData.items.map(item => item.productId),
            requestedAt: new Date()
        });
        await this.eventBus.publish(subjects_1.EventSubjects.PRODUCT_INFORMATION_REQUESTED, productInfoEvent);
        const stockValidationEvent = new StockValidationRequestedEvent(sagaId, {
            sagaId,
            orderId: sagaId,
            items: initialData.items,
            requestedAt: new Date()
        });
        await this.eventBus.publish(subjects_1.EventSubjects.STOCK_VALIDATION_REQUESTED, stockValidationEvent);
        const userInfoEvent = new UserInformationRequestedEvent(sagaId, {
            sagaId,
            userId: initialData.customerId,
            requestedFields: ['email', 'address', 'preferences'],
            requestedAt: new Date()
        });
        await this.eventBus.publish(subjects_1.EventSubjects.USER_INFORMATION_REQUESTED, userInfoEvent);
    }
    async handleSagaStep(sagaId, step, data) {
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
            default:
                throw new Error(`Unknown saga step: ${step}`);
        }
    }
    async handleProductInfoReceived(sagaId, data) {
        console.log(`Product info received for saga ${sagaId}`);
    }
    async handleStockValidated(sagaId, data) {
        if (data.allItemsAvailable) {
            const paymentEvent = new PaymentInitiatedEvent(sagaId, {
                sagaId,
                orderId: sagaId,
                amount: data.totalAmount,
                currency: data.currency,
                initiatedAt: new Date()
            });
            await this.eventBus.publish(subjects_1.EventSubjects.PAYMENT_INITIATED, paymentEvent);
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
            await this.completeSaga(sagaId, {
                orderId: sagaId,
                paymentId: data.paymentId,
                status: 'confirmed'
            });
        }
        else {
            await this.failSaga(sagaId, new Error('Payment failed'), ['release_stock']);
        }
    }
}
exports.OrderCreationSagaOrchestrator = OrderCreationSagaOrchestrator;
//# sourceMappingURL=saga-orchestrator.js.map