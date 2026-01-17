import { ProductCachePort } from '../ports/product-cache.port';

export class GetCachedProductsUseCase {
  constructor(private readonly cache: ProductCachePort) {}

  async execute() {<
    return this.cache.getCachedProducts();
  }
}
