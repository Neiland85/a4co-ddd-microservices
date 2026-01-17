import { Product } from '../../domain/entities/product.entity';

export interface ProductCachePort {
  getCachedProducts(): Promise<Product[]>;
}
