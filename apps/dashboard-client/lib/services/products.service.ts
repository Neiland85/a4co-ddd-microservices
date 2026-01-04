import { apiClient } from '../api-client';
import type { Product } from '../types';

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const response = await apiClient.getProducts();
    // Handle both array response and object with products array
    if (Array.isArray(response)) return response as Product[];
    const products = (response as { products?: Product[] }).products ?? [];
    return products;
  },

  async getProduct(id: string): Promise<Product> {
    return apiClient.getProduct(id);
  },

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getProducts();
    if (!query) return products;
    
    const lowerQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery),
    );
  },

  async getAvailableProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((product) => product.stock > 0);
  },
};
