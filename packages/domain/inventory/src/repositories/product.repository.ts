import { Product } from '../entities/product.entity.js';

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByCategory(category: string): Promise<Product[]>;
  findByArtisan(artisanId: string): Promise<Product[]>;
  findLowStock(): Promise<Product[]>;
  findOutOfStock(): Promise<Product[]>;
  delete(id: string): Promise<void>;
}
