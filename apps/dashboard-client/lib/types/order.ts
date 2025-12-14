export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED' | 'PROCESSING' | 'COMPLETED';

export interface OrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderId?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress?: string;
  createdAt: string;
  updatedAt?: string;
  events?: OrderEvent[];
}

export interface OrderEvent {
  id: string;
  type: string;
  timestamp: string;
  data?: any;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: string;
}

export interface CreateOrderResponse {
  orderId: string;
  status: OrderStatus;
  totalAmount?: number;
}

export interface OrdersResponse {
  orders: Order[];
  total?: number;
  page?: number;
  limit?: number;
}
