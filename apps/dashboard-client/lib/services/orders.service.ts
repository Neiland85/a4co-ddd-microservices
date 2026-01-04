import { apiClient } from '../api-client';
import type { Order, CreateOrderRequest, CreateOrderResponse } from '../types';

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    const response = await apiClient.getOrders();
    if (Array.isArray(response)) return response as Order[];
    const orders = (response as { orders?: Order[] }).orders ?? [];
    return orders;
  },

  async getMyOrders(): Promise<Order[]> {
    const response = await apiClient.getMyOrders();
    // Handle both array response and object with orders array
    if (Array.isArray(response)) return response as Order[];
    const orders = (response as { orders?: Order[] }).orders ?? [];
    return orders;
  },

  async getOrder(id: string): Promise<Order> {
    return apiClient.getOrder(id);
  },

  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    return apiClient.createOrder(orderData);
  },

  async cancelOrder(id: string): Promise<void> {
    return apiClient.cancelOrder(id);
  },
};
