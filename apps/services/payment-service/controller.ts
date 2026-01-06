import { PaymentService } from './service';

export class PaymentController {
  private paymentService = new PaymentService();

  processPayment(req: { orderId: string; amount: number }): string {
    return this.paymentService.processPayment(req.orderId, req.amount);
  }

  getPaymentStatus(req: { orderId: string }): string {
    return this.paymentService.getPaymentStatus(req.orderId);
  }
}
