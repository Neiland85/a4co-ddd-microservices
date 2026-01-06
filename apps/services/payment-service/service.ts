export class PaymentService {
  processPayment(orderId: string, amount: number): string {
    return `Pago de ${amount} procesado para la orden ${orderId}.`;
  }

  getPaymentStatus(orderId: string): string {
    return `Estado del pago para la orden ${orderId}.`;
  }
}
