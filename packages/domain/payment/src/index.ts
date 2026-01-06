// Minimal exports for domain-payment bounded context
export type PaymentId = string;

export interface Payment {
  id: PaymentId;
  orderId: string;
  amount: number;
  succeeded: boolean;
}

export const createPayment = (id: PaymentId, orderId: string, amount: number): Payment => ({
  id,
  orderId,
  amount,
  succeeded: false
});
