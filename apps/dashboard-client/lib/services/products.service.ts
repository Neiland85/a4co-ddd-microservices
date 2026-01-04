import { apiClient } from '../api-client';
import type { Product } from '../types';

const isProductsEnvelope = (value: unknown): value is { products: Product[] } => {
  return Array.isArray((value as { products?: unknown })?.products);
};

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const response = (await apiClient.getProducts()) as Product[] | { products?: Product[] };
    // Handle both array response and object with products array
    if (Array.isArray(response)) return response;
    if (isProductsEnvelope(response)) return response.products;
    return [];
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
