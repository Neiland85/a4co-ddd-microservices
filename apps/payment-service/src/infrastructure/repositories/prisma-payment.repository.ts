import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentId } from '../../domain/value-objects/payment-id.vo';
import { Money } from '../../domain/value-objects/money.vo';
import { StripePaymentIntent } from '../../domain/value-objects/stripe-payment-intent.vo';
import { PaymentStatus, PaymentStatusVO } from '../../domain/value-objects/payment-status.vo';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(@Inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async save(payment: Payment): Promise<void> {
    const paymentData = {
      id: payment.paymentId.toString(),
      orderId: payment.orderId,
      amount: payment.amount.amount,
      currency: payment.amount.currency,
      status: payment.status.toString(),
      stripePaymentIntentId: payment.stripePaymentIntentId?.toString() || null,
      customerId: payment.customerId,
      metadata: payment.metadata,
      failureReason: payment.failureReason || null,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };

    await this.prisma.payment.upsert({
      where: { id: payment.paymentId.toString() },
      create: paymentData,
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

    return this.toDomain(paymentData);
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    if (!paymentData) {
      return null;
    }

    return this.toDomain(paymentData);
  }

  async findByStripeIntentId(intentId: string): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findUnique({
      where: { stripePaymentIntentId: intentId },
    });

    if (!paymentData) {
      return null;
    }

    return this.toDomain(paymentData);
  }

  private toDomain(paymentData: any): Payment {
    const paymentId = PaymentId.fromString(paymentData.id);
    const amount = new Money(paymentData.amount, paymentData.currency);
    const status = PaymentStatusVO.fromString(paymentData.status);
    const stripePaymentIntentId = paymentData.stripePaymentIntentId
      ? StripePaymentIntent.fromString(paymentData.stripePaymentIntentId)
      : null;

    return Payment.reconstitute({
      paymentId,
      orderId: paymentData.orderId,
      amount,
      status,
      stripePaymentIntentId,
      customerId: paymentData.customerId,
      metadata: paymentData.metadata || {},
      failureReason: paymentData.failureReason,
      createdAt: paymentData.createdAt,
      updatedAt: paymentData.updatedAt,
    });
  }
}
