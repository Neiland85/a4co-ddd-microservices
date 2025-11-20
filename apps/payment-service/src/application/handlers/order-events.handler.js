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
var OrderEventsHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEventsHandler = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const subjects_1 = require("../../../../../packages/shared-utils/src/events/subjects");
const process_payment_use_case_js_1 = require("../use-cases/process-payment.use-case.js");
const refund_payment_use_case_js_1 = require("../use-cases/refund-payment.use-case.js");
const application_constants_js_1 = require("../application.constants.js");
let OrderEventsHandler = OrderEventsHandler_1 = class OrderEventsHandler {
    constructor(processPaymentUseCase, refundPaymentUseCase, paymentRepository) {
        this.processPaymentUseCase = processPaymentUseCase;
        this.refundPaymentUseCase = refundPaymentUseCase;
        this.paymentRepository = paymentRepository;
        this.logger = new common_1.Logger(OrderEventsHandler_1.name);
    }
    async handleOrderCreated(event) {
        this.logger.log(`Received order.created event for order ${event.orderId}`);
        try {
            const command = {
                orderId: event.orderId,
                amount: event.totalAmount,
                currency: event.currency,
                customerId: event.customerId,
                metadata: event.metadata ?? {},
            };
            if (event.paymentMethodId) {
                command.paymentMethodId = event.paymentMethodId;
            }
            if (event.idempotencyKey) {
                command.idempotencyKey = event.idempotencyKey;
            }
            if (event.sagaId) {
                command.sagaId = event.sagaId;
            }
            await this.processPaymentUseCase.execute(command);
        }
        catch (error) {
            this.logger.error(`Failed to process payment for order ${event.orderId}:`, error);
            throw error;
        }
    }
    async handleOrderCancelled(event) {
        this.logger.log(`Received order.cancelled event for order ${event.orderId}`);
        try {
            const payment = await this.paymentRepository.findByOrderId(event.orderId);
            if (!payment) {
                this.logger.warn(`No payment found for order ${event.orderId}`);
                return;
            }
            await this.refundPaymentUseCase.execute(payment.paymentId.value, undefined, event.reason || 'Order cancelled');
        }
        catch (error) {
            this.logger.error(`Failed to refund payment for order ${event.orderId}:`, error);
            throw error;
        }
    }
};
exports.OrderEventsHandler = OrderEventsHandler;
__decorate([
    (0, microservices_1.EventPattern)(subjects_1.EventSubjects.ORDER_CREATED),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderEventsHandler.prototype, "handleOrderCreated", null);
__decorate([
    (0, microservices_1.EventPattern)(subjects_1.EventSubjects.ORDER_CANCELLED),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderEventsHandler.prototype, "handleOrderCancelled", null);
exports.OrderEventsHandler = OrderEventsHandler = OrderEventsHandler_1 = __decorate([
    (0, common_1.Controller)(),
    __param(2, (0, common_1.Inject)(application_constants_js_1.PAYMENT_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [process_payment_use_case_js_1.ProcessPaymentUseCase,
        refund_payment_use_case_js_1.RefundPaymentUseCase, Object])
], OrderEventsHandler);
//# sourceMappingURL=order-events.handler.js.map