import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentId } from '../../domain/value-objects/payment-id.vo';
import { Money } from '../../domain/value-objects/money.vo';
import { PaymentStatus } from '../../domain/value-objects/payment-status.vo';
import { PaymentRepository } from '../../domain/repositories/payment.repository';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(payment: Payment): Promise<void> {
    const paymentData = {
      id: payment.paymentId.toString(),
      orderId: payment.orderId,
      amount: payment.amount.amount,
      currency: payment.amount.currency,
      status: payment.status,
      customerId: payment.customerId,
      stripePaymentIntentId: payment.stripePaymentIntentId,
      stripeRefundId: payment.stripeRefundId,
      metadata: payment.metadata,
      updatedAt: new Date(),
    };

    await this.prisma.payment.upsert({
      where: { id: payment.paymentId.toString() },
      create: {
        ...paymentData,
        createdAt: new Date(),
      },
      update: paymentData,
    });
  }

  async findById(id: PaymentId): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findUnique({
      where: { id: id.toString() },
    });

    if (!paymentData) {
      return null;
    }

    return this.mapToDomain(paymentData);
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!paymentData) {
      return null;
    }

    return this.mapToDomain(paymentData);
  }

  async findByStripeIntentId(intentId: string): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findFirst({
      where: { stripePaymentIntentId: intentId },
    });

    if (!paymentData) {
      return null;
    }

    return this.mapToDomain(paymentData);
  }

  async exists(id: PaymentId): Promise<boolean> {
    const count = await this.prisma.payment.count({
      where: { id: id.toString() },
    });
    return count > 0;
  }

  private mapToDomain(paymentData: any): Payment {
    return Payment.reconstitute({
      paymentId: PaymentId.fromString(paymentData.id),
      orderId: paymentData.orderId,
      amount: new Money(paymentData.amount, paymentData.currency),
      customerId: paymentData.customerId,
      status: paymentData.status as PaymentStatus,
      stripePaymentIntentId: paymentData.stripePaymentIntentId,
      metadata: paymentData.metadata as Record<string, any>,
      createdAt: paymentData.createdAt,
      updatedAt: paymentData.updatedAt,
    });
  }
}
