import { PaymentService } from './service';

describe('PaymentService', () => {
  let paymentService: PaymentService;;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  it('should process a payment', () => {
    const result = paymentService.processPayment('order123', 100);
    expect(result).toBe('Pago de 100 procesado para la orden order123.');
  });

  it('should get payment status', () => {
    const result = paymentService.getPaymentStatus('order123');
    expect(result).toBe('Estado del pago para la orden order123.');
  });
});
