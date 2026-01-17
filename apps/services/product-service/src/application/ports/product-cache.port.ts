import { Product } from '../../domain/entities/product.entity';

// Port para el caché de productos
export interface ProductCachePort {
  getProductFromCache(productId: string): Promise<any>;
  setProductInCache(productId: string, productData: any): Promise<void>;
  invalidateProductCache(productId: string): Promise<void>;
}
