import { Order, Product } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Product Service
  async getProducts(): Promise<Product[]> {
    return this.request('/api/v1/products');
  }

  async getProductById(id: string): Promise<Product> {
    return this.request(`/api/v1/products/${id}`);
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return this.request('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return this.request(`/api/v1/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request(`/api/v1/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Order Service
  async getOrders(): Promise<Order[]> {
    return this.request('/api/v1/orders');
  }

  async getOrderById(id: string): Promise<Order> {
    return this.request(`/api/v1/orders/${id}`);
  }

  async createOrder(order: any): Promise<Order> {
    return this.request('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  // User Service
  async getUserProfile() {
    return this.request('/api/v1/users/profile');
  }

  async updateUserProfile(user: any) {
    return this.request('/api/v1/users/profile', {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
