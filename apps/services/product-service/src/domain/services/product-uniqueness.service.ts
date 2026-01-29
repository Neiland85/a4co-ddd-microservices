import { Injectable } from '@nestjs/common';
import { SKU, Slug } from '../value-objects/product-value-objects';

export interface IProductUniquenessChecker {
  isSkuUnique(sku: string, excludeProductId?: string): Promise<boolean>;
  isSlugUnique(slug: string, excludeProductId?: string): Promise<boolean>;
}

@Injectable()
export class ProductUniquenessService {
  constructor(private readonly uniquenessChecker: IProductUniquenessChecker) {}

  async ensureSkuIsUnique(sku: SKU, excludeProductId?: string): Promise<void> {
    const value = sku.value; // público en VO
    const isUnique = await this.uniquenessChecker.isSkuUnique(value, excludeProductId);

    if (!isUnique) {
      throw new Error(`Product with SKU ${value} already exists`);
    }
  }

  async ensureSlugIsUnique(slug: Slug, excludeProductId?: string): Promise<void> {
    const value = slug.value;
    const isUnique = await this.uniquenessChecker.isSlugUnique(value, excludeProductId);

    if (!isUnique) {
      throw new Error(`Product with slug ${value} already exists`);
    }
  }

  async generateUniqueSlug(baseName: string, excludeProductId?: string): Promise<Slug> {
    const baseSlug = Slug.generateFromName(baseName).value;
    let candidate = baseSlug;
    let counter = 1;

    while (!(await this.uniquenessChecker.isSlugUnique(candidate, excludeProductId))) {
      candidate = `${baseSlug}-${counter++}`;
    }

    return Slug.create(candidate);
  }
}
