import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentId } from '../../domain/value-objects';

// Interface simple para el cliente Prisma
interface PrismaClientInterface {
  payment: {
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    findFirst: (args: any) => Promise<any>;
    count: (args?: any) => Promise<number>;
  };
}

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaClientInterface) {}

  async save(payment: Payment): Promise<void> {
    const paymentData = payment.toPersistence();

    const existing = await this.prisma.payment.findUnique({
      where: { id: paymentData.id },
    });

    if (existing) {
      await this.prisma.payment.update({
        where: { id: paymentData.id },
        data: {
          paymentId: paymentData.paymentId,
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          customerId: paymentData.customerId,
          status: paymentData.status,
          stripePaymentIntentId: paymentData.stripePaymentIntentId,
          metadata: paymentData.metadata,
          failureReason: paymentData.failureReason,
          updatedAt: paymentData.updatedAt,
        },
      });
    } else {
      await this.prisma.payment.create({
        data: {
          id: paymentData.id,
          paymentId: paymentData.paymentId,
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          customerId: paymentData.customerId,
          status: paymentData.status,
          stripePaymentIntentId: paymentData.stripePaymentIntentId,
          metadata: paymentData.metadata,
          failureReason: paymentData.failureReason,
          createdAt: paymentData.createdAt,
          updatedAt: paymentData.updatedAt,
        },
      });
    }
  }

  async findById(id: PaymentId): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findUnique({
      where: { paymentId: id.value },
    });

    if (!paymentData) {
      return null;
    }

    return this.mapToDomain(paymentData);
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
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

  async exists(orderId: string): Promise<boolean> {
    const count = await this.prisma.payment.count({
      where: { orderId },
    });
    return count > 0;
  }

  private mapToDomain(paymentData: any): Payment {
    return Payment.reconstruct(
      paymentData.id,
      paymentData.paymentId,
      paymentData.orderId,
      paymentData.amount,
      paymentData.currency,
      paymentData.customerId,
      paymentData.status,
      paymentData.stripePaymentIntentId,
      paymentData.metadata || {},
      paymentData.failureReason,
      paymentData.createdAt,
      paymentData.updatedAt
    );
  }
}
