import { Injectable, Inject } from '@nestjs/common';
import { Payment, PaymentProps } from '../../domain/entities';
import { PaymentId, Money, PaymentStatus, StripePaymentIntent } from '../../domain/value-objects';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(@Inject('PrismaService') private readonly prisma: any) {}

  async save(payment: Payment): Promise<void> {
    const paymentData = {
      id: payment.paymentId.value,
      orderId: payment.orderId,
      amount: payment.amount.amount,
      currency: payment.amount.currency,
      status: payment.status,
      customerId: payment.customerId,
      stripePaymentIntentId: payment.stripePaymentIntentId,
      stripeRefundId: payment.stripeRefundId,
      failureReason: payment.failureReason,
      metadata: payment.metadata,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };

    await this.prisma.payment.upsert({
      where: { id: payment.paymentId.value },
      create: paymentData,
      update: paymentData,
    });
  }

  async findById(id: PaymentId): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findUnique({
      where: { id: id.value },
    });

    if (!paymentData) {
      return null;
    }

    return this.toDomain(paymentData);
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!paymentData) {
      return null;
    }

    return this.toDomain(paymentData);
  }

  async findByStripeIntentId(intentId: string): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findFirst({
      where: { stripePaymentIntentId: intentId },
    });

    if (!paymentData) {
      return null;
    }

    return this.toDomain(paymentData);
  }

  async findAllByCustomerId(customerId: string): Promise<Payment[]> {
    const paymentsData = await this.prisma.payment.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });

    return paymentsData.map(data => this.toDomain(data));
  }

  private toDomain(paymentData: any): Payment {
    const props: PaymentProps = {
      paymentId: PaymentId.fromString(paymentData.id),
      orderId: paymentData.orderId,
      amount: new Money(paymentData.amount, paymentData.currency as any),
      customerId: paymentData.customerId,
      status: paymentData.status as PaymentStatus,
      stripePaymentIntentId: paymentData.stripePaymentIntentId,
      metadata: paymentData.metadata || {},
      createdAt: paymentData.createdAt,
      updatedAt: paymentData.updatedAt,
    };

    const payment = Payment.reconstitute(props);

    // Restaurar campos adicionales si existen
    if (paymentData.stripeRefundId) {
      (payment as any)._stripeRefundId = paymentData.stripeRefundId;
    }
    if (paymentData.failureReason) {
      (payment as any)._failureReason = paymentData.failureReason;
    }

    return payment;
  }
}
