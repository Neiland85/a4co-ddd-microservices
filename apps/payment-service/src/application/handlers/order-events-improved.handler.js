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
var OrderEventsHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEventsHandler = void 0;
const common_1 = require("@nestjs/common");
const process_payment_use_case_1 = require("../use-cases/process-payment.use-case");
let OrderEventsHandler = OrderEventsHandler_1 = class OrderEventsHandler {
    constructor(processPaymentUseCase, eventBus) {
        this.processPaymentUseCase = processPaymentUseCase;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(OrderEventsHandler_1.name);
        this.setupEventHandlers();
    }
    setupEventHandlers() {
        this.eventBus.subscribe('payments.process_request', async (event) => {
            await this.handlePaymentProcessRequest(event);
        });
        this.logger.log('✅ OrderEventsHandler configurado y escuchando eventos');
    }
    async handlePaymentProcessRequest(event) {
        this.logger.log(`💳 Recibida solicitud de pago para orden ${event.orderId}`);
        try {
            const result = await this.processPaymentUseCase.execute({
                orderId: event.orderId,
                customerId: event.customerId,
                amount: event.amount.value,
                currency: event.amount.currency,
            });
            this.logger.log(`✅ Pago procesado exitosamente para orden ${event.orderId}: ${result.paymentId}`);
        }
        catch (error) {
            this.logger.error(`❌ Error procesando pago para orden ${event.orderId}:`, error);
            await this.eventBus.publish('payments.failed', {
                orderId: event.orderId,
                reason: error instanceof Error ? error.message : String(error),
                timestamp: new Date(),
            });
        }
    }
};
exports.OrderEventsHandler = OrderEventsHandler;
exports.OrderEventsHandler = OrderEventsHandler = OrderEventsHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [process_payment_use_case_1.ProcessPaymentUseCase, Object])
], OrderEventsHandler);
//# sourceMappingURL=order-events-improved.handler.js.map