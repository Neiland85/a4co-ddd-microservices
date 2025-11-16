import { Injectable, Inject } from '@nestjs/common';
import { ProcessPaymentUseCase, ProcessPaymentCommand } from '../use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from '../use-cases/refund-payment.use-case';
import { PAYMENT_REPOSITORY_TOKEN } from '../application.constants';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentId } from '../../domain/value-objects/payment-id.vo';

@Injectable()
export class PaymentService {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async processPayment(command: ProcessPaymentCommand) {
    return await this.processPaymentUseCase.execute(command);
  }

  async refundPayment(paymentId: string, amount?: number, reason?: string) {
    return await this.refundPaymentUseCase.execute(paymentId, amount, reason);
  }

  async getPaymentById(paymentId: string) {
    const id = PaymentId.create(paymentId);
    return await this.paymentRepository.findById(id);
  }

  async getPaymentByOrderId(orderId: string) {
    return await this.paymentRepository.findByOrderId(orderId);
  }

  getHealth() {
    return { 
      status: 'ok', 
      service: 'payment-service',
      version: '1.0.0',
      dependencies: {
        database: 'connected',
        stripe: 'configured',
        nats: 'connected'
      }
    };
  }
}
