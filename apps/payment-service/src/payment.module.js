"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const payment_controller_1 = require("./presentation/payment.controller");
const payment_service_1 = require("./application/services/payment.service");
const payment_event_publisher_1 = require("./application/services/payment-event.publisher");
const process_payment_use_case_1 = require("./application/use-cases/process-payment.use-case");
const refund_payment_use_case_1 = require("./application/use-cases/refund-payment.use-case");
const payment_domain_service_1 = require("./domain/services/payment-domain.service");
const prisma_payment_repository_1 = require("./infrastructure/repositories/prisma-payment.repository");
const stripe_gateway_1 = require("./infrastructure/stripe.gateway");
const prisma_service_1 = require("./infrastructure/prisma/prisma.service");
const order_events_handler_1 = require("./application/handlers/order-events.handler");
const application_constants_1 = require("./application/application.constants");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            microservices_1.ClientsModule.register([
                {
                    name: 'NATS_CLIENT',
                    transport: microservices_1.Transport.NATS,
                    options: {
                        servers: [process.env['NATS_URL'] || 'nats://localhost:4222'],
                        queue: 'payment-service-queue',
                    },
                },
            ]),
        ],
        controllers: [payment_controller_1.PaymentController, order_events_handler_1.OrderEventsHandler],
        providers: [
            payment_service_1.PaymentService,
            payment_domain_service_1.PaymentDomainService,
            stripe_gateway_1.StripeGateway,
            prisma_service_1.PrismaService,
            {
                provide: application_constants_1.PAYMENT_REPOSITORY_TOKEN,
                useFactory: (prisma) => {
                    return new prisma_payment_repository_1.PrismaPaymentRepository(prisma);
                },
                inject: [prisma_service_1.PrismaService],
            },
            {
                provide: 'NATS_EVENT_BUS',
                useFactory: () => {
                    return null;
                },
            },
            {
                provide: payment_event_publisher_1.PaymentEventPublisher,
                useFactory: (natsClient) => {
                    return new payment_event_publisher_1.PaymentEventPublisher(natsClient);
                },
                inject: ['NATS_CLIENT'],
            },
            process_payment_use_case_1.ProcessPaymentUseCase,
            refund_payment_use_case_1.RefundPaymentUseCase,
        ],
        exports: [payment_service_1.PaymentService, process_payment_use_case_1.ProcessPaymentUseCase, refund_payment_use_case_1.RefundPaymentUseCase, microservices_1.ClientsModule],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map