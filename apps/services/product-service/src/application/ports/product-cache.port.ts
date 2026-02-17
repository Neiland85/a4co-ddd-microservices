// Port para el caché de productos
export interface ProductCachePort {
  getCachedProducts(): Promise<unknown[]>;
  getProductFromCache(productId: string): Promise<unknown>;
  setProductInCache(productId: string, productData: unknown): Promise<void>;
  invalidateProductCache(productId: string): Promise<void>;
}

export const PRODUCT_CACHE_PORT = 'ProductCachePort' as const;
