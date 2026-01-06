// Minimal exports for domain-order bounded context
export type OrderId = string;

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: OrderId;
  items: OrderItem[];
  total: number;
}

export const createEmptyOrder = (id: OrderId): Order => ({ id, items: [], total: 0 });
