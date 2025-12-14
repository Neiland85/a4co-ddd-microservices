import { apiClient } from '../api-client';
import type { Order, CreateOrderRequest, CreateOrderResponse } from '../types';

const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4000';

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    const response = await apiClient.getOrders();
    // Handle both array response and object with orders array
    return Array.isArray(response) ? response : response.orders || [];
  },

  async getMyOrders(): Promise<Order[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.orders || [];
  },

  async getOrder(id: string): Promise<Order> {
    return apiClient.getOrder(id);
  },

  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create order' }));
      throw new Error(error.message || 'Failed to create order');
    }

    return response.json();
  },

  async cancelOrder(id: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to cancel order');
    }
  },
};
