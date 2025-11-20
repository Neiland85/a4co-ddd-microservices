"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentEventPublisher_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentEventPublisher = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const subjects_1 = require("../../../../../packages/shared-utils/src/events/subjects");
const events_1 = require("../../domain/events");
const PAYMENT_EVENT_SUBJECT_MAP = new Map([
    [events_1.PaymentCreatedEvent, subjects_1.EventSubjects.PAYMENT_INITIATED],
    [events_1.PaymentProcessingEvent, 'payment.processing.v1'],
    [events_1.PaymentSucceededEvent, subjects_1.EventSubjects.PAYMENT_SUCCEEDED],
    [events_1.PaymentFailedEvent, subjects_1.EventSubjects.PAYMENT_FAILED],
    [events_1.PaymentRefundedEvent, subjects_1.EventSubjects.REFUND_PROCESSED],
]);
let PaymentEventPublisher = PaymentEventPublisher_1 = class PaymentEventPublisher {
    constructor(natsClient) {
        this.natsClient = natsClient;
        this.logger = new common_1.Logger(PaymentEventPublisher_1.name);
    }
    async publishPaymentEvents(payment) {
        const events = payment.getUncommittedEvents();
        for (const event of events) {
            await this.publishEvent(event);
        }
        payment.clearEvents();
    }
    async publishEvent(event) {
        const subject = this.mapSubject(event);
        if (!subject) {
            this.logger.warn(`No NATS subject mapping found for event ${event.eventType}`);
            return;
        }
        const domainEvent = event;
        const payload = domainEvent.payload ?? event.eventData;
        const message = {
            eventId: event.eventId,
            eventType: event.eventType,
            aggregateId: event.aggregateId,
            timestamp: event.occurredOn.toISOString(),
            data: {
                paymentId: payload.paymentId,
                orderId: payload.orderId,
                amount: payload.amount,
                currency: payload.currency,
                status: payload.status,
                customerId: payload.customerId,
                stripePaymentIntentId: payload.stripePaymentIntentId,
                timestamp: payload.timestamp.toISOString(),
            },
            metadata: {
                eventVersion: event.eventVersion,
                sagaId: event.sagaId,
            },
        };
        this.natsClient.emit(subject, message);
        this.logger.log(`Published ${event.eventType} to ${subject}`);
    }
    mapSubject(event) {
        for (const [eventConstructor, subject] of PAYMENT_EVENT_SUBJECT_MAP.entries()) {
            if (event instanceof eventConstructor) {
                return subject;
            }
        }
        return undefined;
    }
};
exports.PaymentEventPublisher = PaymentEventPublisher;
exports.PaymentEventPublisher = PaymentEventPublisher = PaymentEventPublisher_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('NATS_CLIENT')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], PaymentEventPublisher);
//# sourceMappingURL=payment-event.publisher.js.map