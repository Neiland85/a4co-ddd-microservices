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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const payment_entity_1 = require("../../domain/entities/payment.entity");
const prisma_service_1 = require("../prisma/prisma.service");
let PrismaPaymentRepository = class PrismaPaymentRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(payment) {
        const data = this.mapToPersistence(payment);
        await this.prisma.payment.upsert({
            where: { id: data.id },
            create: data,
            update: {
                orderId: data.orderId,
                amount: data.amount,
                currency: data.currency,
                status: data.status,
                stripePaymentIntentId: data.stripePaymentIntentId ?? null,
                customerId: data.customerId,
                metadata: data.metadata ?? {},
                updatedAt: data.updatedAt,
            },
        });
    }
    async findById(id) {
        const record = await this.prisma.payment.findUnique({ where: { id: id.value } });
        return record ? this.mapToDomain(record) : null;
    }
    async findByOrderId(orderId) {
        const record = await this.prisma.payment.findUnique({ where: { orderId } });
        return record ? this.mapToDomain(record) : null;
    }
    async findByStripeIntentId(intentId) {
        const record = await this.prisma.payment.findUnique({
            where: { stripePaymentIntentId: intentId },
        });
        return record ? this.mapToDomain(record) : null;
    }
    mapToPersistence(payment) {
        const primitives = payment.toPrimitives();
        return {
            id: primitives.id,
            orderId: primitives.orderId,
            amount: new client_1.Prisma.Decimal(primitives.amount.amount),
            currency: primitives.amount.currency,
            status: primitives.status,
            stripePaymentIntentId: primitives.stripePaymentIntentId,
            customerId: primitives.customerId,
            metadata: primitives.metadata,
            createdAt: primitives.createdAt,
            updatedAt: primitives.updatedAt,
        };
    }
    mapToDomain(record) {
        return payment_entity_1.Payment.rehydrate({
            id: record.id,
            orderId: record.orderId,
            amount: {
                amount: Number(record.amount),
                currency: record.currency,
            },
            status: record.status,
            stripePaymentIntentId: record.stripePaymentIntentId ?? null,
            customerId: record.customerId,
            metadata: record.metadata ?? {},
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        });
    }
};
exports.PrismaPaymentRepository = PrismaPaymentRepository;
exports.PrismaPaymentRepository = PrismaPaymentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaPaymentRepository);
//# sourceMappingURL=prisma-payment.repository.js.map