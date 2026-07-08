export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface OrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderEvent {
  id: string;
  type: string;
  timestamp: string;
  data?: unknown;
}

export interface Order {
  id: string;
  orderId?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  shippingAddress?: string;
  events?: OrderEvent[];
}

export interface CreateOrderInput {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: string;
}

export interface CreateOrderResult {
  orderId: string;
  order: Order;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}
