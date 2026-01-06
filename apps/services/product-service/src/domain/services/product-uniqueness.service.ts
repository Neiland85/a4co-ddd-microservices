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
    const isUnique = await this.uniquenessChecker.isSkuUnique(sku.value, excludeProductId);
    if (!isUnique) {
      throw new Error(`Product with SKU ${sku.value} already exists`);
    }
  }

  async ensureSlugIsUnique(slug: Slug, excludeProductId?: string): Promise<void> {
    const isUnique = await this.uniquenessChecker.isSlugUnique(slug.value, excludeProductId);
    if (!isUnique) {
      throw new Error(`Product with slug ${slug.value} already exists`);
    }
  }

  async generateUniqueSlug(baseName: string, excludeProductId?: string): Promise<Slug> {
    let slug = Slug.generateFromName(baseName);
    let counter = 1;

    while (!(await this.uniquenessChecker.isSlugUnique(slug.value, excludeProductId))) {
      slug = new Slug(`${slug.value}-${counter}`);
      counter++;
    }

    return slug;
  }
}
