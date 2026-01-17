import { Product } from '../domain/entities/product.entity';

export interface ProductRepositoryPort {
  save(product: Product): Promise<void>;
}
