import { Injectable } from '@nestjs/common';
import { Prisma, Payment as PrismaPaymentModel } from '@prisma/client';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentId } from '../../domain/value-objects/payment-id.vo';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatusValue } from '../../domain/value-objects/payment-status.vo';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) { }

  public async save(payment: Payment): Promise<void> {
    const data = this.mapToPersistence(payment);

    await this.prisma.payment.upsert({
      where: { id: data.id },
      create: data,
      update: {
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        stripePaymentIntentId: data.stripePaymentIntentId,
        customerId: data.customerId,
        metadata: data.metadata,
        updatedAt: data.updatedAt,
      },
    });
  }

  public async findById(id: PaymentId): Promise<Payment | null> {
    const record = await this.prisma.payment.findUnique({ where: { id: id.value } });
    return record ? this.mapToDomain(record) : null;
  }

  public async findByOrderId(orderId: string): Promise<Payment | null> {
    const record = await this.prisma.payment.findUnique({ where: { orderId } });
    return record ? this.mapToDomain(record) : null;
  }

  public async findByStripeIntentId(intentId: string): Promise<Payment | null> {
    const record = await this.prisma.payment.findUnique({ where: { stripePaymentIntentId: intentId } });
    return record ? this.mapToDomain(record) : null;
  }

  private mapToPersistence(payment: Payment): Prisma.PaymentUncheckedCreateInput {
    const primitives = payment.toPrimitives();

    return {
      id: primitives.id,
      orderId: primitives.orderId,
      amount: new Prisma.Decimal(primitives.amount.amount),
      currency: primitives.amount.currency,
      status: primitives.status,
      stripePaymentIntentId: primitives.stripePaymentIntentId,
      customerId: primitives.customerId,
      metadata: primitives.metadata,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }

  private mapToDomain(record: PrismaPaymentModel): Payment {
    return Payment.rehydrate({
      id: record.id,
      orderId: record.orderId,
      amount: {
        amount: Number(record.amount),
        currency: record.currency,
      },
      status: record.status as PaymentStatusValue,
      stripePaymentIntentId: record.stripePaymentIntentId ?? null,
      customerId: record.customerId,
      metadata: (record.metadata as Record<string, any>) ?? {},
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}

