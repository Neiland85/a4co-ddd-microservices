import { Product } from '../entities/Product';

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByCategory(category: string): Promise<Product[]>;
  findBySeasonal(seasonal: boolean): Promise<Product[]>;
  findByAvailable(available: boolean): Promise<Product[]>;
  update(id: string, product: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
  search(query: string): Promise<Product[]>;
} 