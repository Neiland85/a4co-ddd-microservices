import { Product } from '../../domain/aggregates/product.aggregate';
import { EventSubjects, IEventBus } from '../../domain/event-bus';
import { IProductRepository } from '../../infrastructure/repositories/product.repository';

// ========================================
// DTOs (Data Transfer Objects)
// ========================================

export interface CreateProductDTO {
  name: string;
  description: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  artisanId: string;
  categoryId: string;
  category?: string;
  stock?: number;
  slug?: string;
  isHandmade?: boolean;
  isCustomizable?: boolean;
  isDigital?: boolean;
  requiresShipping?: boolean;
  keywords?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateProductDTO {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  keywords?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

// ========================================
// PRODUCT APPLICATION SERVICE
// ========================================

export class ProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly eventBus: IEventBus
  ) {}

  async createProduct(dto: CreateProductDTO): Promise<Product> {
    // Check for existing SKU if provided
    if (dto.sku) {
      const existingProduct = await this.productRepository.findBySku(dto.sku);
      if (existingProduct) {
        throw new Error(`Product with SKU ${dto.sku} already exists`);
      }
    }

    // Check for existing slug if provided
    if (dto.slug) {
      const existingSlug = await this.productRepository.findBySlug(dto.slug);
      if (existingSlug) {
        throw new Error(`Product with slug ${dto.slug} already exists`);
      }
    }

    // Create product using the aggregate's create method
    const product = Product.create({
      name: dto.name,
      description: dto.description,
      sku: dto.sku || undefined,
      price: dto.price,
      originalPrice: dto.originalPrice || undefined,
      currency: dto.currency || 'EUR',
      artisanId: dto.artisanId,
      categoryId: dto.categoryId,
      category: dto.category,
      stock: dto.stock,
      slug: dto.slug || undefined,
      isHandmade: dto.isHandmade,
      isCustomizable: dto.isCustomizable,
      isDigital: dto.isDigital,
      requiresShipping: dto.requiresShipping,
      keywords: dto.keywords,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
    });

    // Save to repository
    await this.productRepository.save(product);

    // Publish domain events
    await this.publishDomainEvents(product);

    return product;
  }

  async updateProduct(dto: UpdateProductDTO): Promise<Product> {
    const product = await this.productRepository.findById(dto.id);
    if (!product) {
      throw new Error(`Product with id ${dto.id} not found`);
    }

    // For now, just update basic fields directly
    // In a full implementation, this would use domain methods
    const updatedData = {
      ...product.toPersistence(),
      ...(dto.name && { name: dto.name }),
      ...(dto.description && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.originalPrice !== undefined && { originalPrice: dto.originalPrice }),
      ...(dto.keywords && { keywords: dto.keywords }),
      ...(dto.metaTitle !== undefined && { metaTitle: dto.metaTitle }),
      ...(dto.metaDescription !== undefined && { metaDescription: dto.metaDescription }),
    };

    // Reconstruct product with updated data
    const updatedProduct = Product.reconstruct(updatedData);

    await this.productRepository.update(updatedProduct);
    await this.publishDomainEvents(updatedProduct);

    return updatedProduct;
  }

  async findById(id: string): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  async findBySku(sku: string): Promise<Product | null> {
    return await this.productRepository.findBySku(sku);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return await this.productRepository.findBySlug(slug);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    await this.productRepository.delete(id);
  }

  // ========================================
  // STOCK MANAGEMENT METHODS
  // ========================================

  async addStockToProduct(productId: string, quantity: number): Promise<Product> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    product.addStock(quantity);
    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

  async removeStockFromProduct(productId: string, quantity: number): Promise<Product> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    product.removeStock(quantity);
    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

  async getProductStock(
    productId: string
  ): Promise<{ stock: number; isInStock: boolean; isLowStock: boolean }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    return {
      stock: product.stock,
      isInStock: product.isInStock(),
      isLowStock: product.isLowStock(),
    };
  }

  // ========================================
  // PRODUCT STATUS MANAGEMENT
  // ========================================

  async publishProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    // TODO: Add domain method to change status to ACTIVE
    // For now, we'll handle it through reconstruction or direct update

    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

  async archiveProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    // TODO: Add domain method to change status to INACTIVE
    // For now, we'll handle it through reconstruction or direct update

    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

  private async publishDomainEvents(product: Product): Promise<void> {
    // For now, just publish a simple event
    // In a full implementation, this would collect all domain events
    await this.eventBus.publish(EventSubjects.PRODUCT_CREATED, {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
    });
  }
}
