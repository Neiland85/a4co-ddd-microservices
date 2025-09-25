// ========================================
// API CONTRACTS - Version 1
// ========================================

export interface CreateOrderRequestV1 {
  orderId: string;
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    currency?: string;
  }[];
}

export interface GetOrderRequestV1 {
  orderId: string;
}

export interface OrderResponseV1 {
  orderId: string;
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    currency: string;
    totalPrice: number;
  }[];
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
