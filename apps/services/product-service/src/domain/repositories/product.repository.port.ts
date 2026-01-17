import { Product } from '../entities/product.entity';
import { ProductId } from '../value-objects/product-id.vo';
import { SKU } from '../value-objects/sku.value-object';
import { Slug } from '../value-objects/slug.vo';

export interface ProductRepository {
  save(product: Product): Promise<void>;

  findById(id: ProductId): Promise<Product | null>;

  findBySKU(sku: SKU): Promise<Product | null>;

  findBySlug(slug: Slug): Promise<Product | null>;

  existsBySKU(sku: SKU): Promise<boolean>;

  existsBySlug(slug: Slug): Promise<boolean>;
}
