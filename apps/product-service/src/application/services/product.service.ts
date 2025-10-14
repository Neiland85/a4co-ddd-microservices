<<<<<<< HEAD
import { Product } from '../../domain/aggregates/product.aggregate';
import { EventSubjects, IEventBus } from '../../domain/event-bus';
import { IProductRepository } from '../../infrastructure/repositories/product.repository';
=======
import {
  Product,
  ProductVariant,
  ProductImage,
  ProductSpecification,
  Money,
  ProductCreatedEvent,
  ProductPublishedEvent,
  ProductPriceChangedEvent,
  ProductDiscontinuedEvent,
} from '../../domain/entities/product.entity';
import {
  IProductRepository,
  SearchFilters,
} from '../../infrastructure/repositories/product.repository';
import { IEventBus } from '@a4co/shared-utils/events/event-bus';
import { EventSubjects } from '@a4co/shared-utils/events/subjects';
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

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
    private readonly eventBus: IEventBus,
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

<<<<<<< HEAD
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
=======
    // Crear el objeto Money
    const price = new Money(dto.price, dto.currency || 'EUR');
    const originalPrice = dto.originalPrice
      ? new Money(dto.originalPrice, dto.currency || 'EUR')
      : undefined;
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

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

<<<<<<< HEAD
    // Reconstruct product with updated data
    const updatedProduct = Product.reconstruct(updatedData);
=======
    // Actualizar precio si ha cambiado
    if (dto.price !== undefined) {
      const newPrice = new Money(dto.price, product.price.currency);
      const newOriginalPrice = dto.originalPrice
        ? new Money(dto.originalPrice, product.price.currency)
        : undefined;

      if (!newPrice.equals(product.price)) {
        product.updatePrice(newPrice, newOriginalPrice);
        hasChanges = true;
      }
    }
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

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

<<<<<<< HEAD
  async addStockToProduct(productId: string, quantity: number): Promise<Product> {
=======
  async publishProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with ID '${id}' not found`);
    }

    product.publish();

    await this.productRepository.update(product);
    await this.publishDomainEvents(product);
  }

  async archiveProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with ID '${id}' not found`);
    }

    product.archive();

    await this.productRepository.update(product);
    await this.publishDomainEvents(product);
  }

  async discontinueProduct(id: string, reason: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with ID '${id}' not found`);
    }

    product.discontinue(reason);

    await this.productRepository.update(product);
    await this.publishDomainEvents(product);
  }

  async markProductOutOfStock(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with ID '${id}' not found`);
    }

    product.markAsOutOfStock();

    await this.productRepository.update(product);
  }

  async markProductAvailable(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with ID '${id}' not found`);
    }

    product.markAsAvailable();

    await this.productRepository.update(product);
  }

  // ========================================
  // VARIANT MANAGEMENT
  // ========================================

  async addVariant(dto: AddVariantDTO): Promise<void> {
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new Error(`Product with ID '${dto.productId}' not found`);
    }

    // Verificar que el SKU del variant no exista
    const existingVariant = product.getVariantBySku(dto.sku);
    if (existingVariant) {
      throw new Error(`Variant with SKU '${dto.sku}' already exists`);
    }

    const variant = new ProductVariant(
      this.generateId(),
      dto.name,
      dto.sku,
      new Money(dto.price, product.price.currency),
      dto.attributes,
      dto.stockQuantity ?? 0,
      dto.weight,
      dto.dimensions
        ? ({
            length: dto.dimensions.length,
            width: dto.dimensions.width,
            height: dto.dimensions.height,
            unit: dto.dimensions.unit ?? 'cm',
          } as any)
        : undefined,
      true,
      dto.isDefault ?? false
    );

    product.addVariant(variant);

    await this.productRepository.update(product);
  }

  async removeVariant(productId: string, variantId: string): Promise<void> {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

<<<<<<< HEAD
    product.addStock(quantity);
=======
    product.removeVariant(variantId);

>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

<<<<<<< HEAD
  async removeStockFromProduct(productId: string, quantity: number): Promise<Product> {
=======
  // ========================================
  // IMAGE MANAGEMENT
  // ========================================

  async addImage(dto: AddImageDTO): Promise<void> {
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new Error(`Product with ID '${dto.productId}' not found`);
    }

    const image = new ProductImage(
      dto.url,
      dto.altText,
      (dto.type as any) ?? ('GALLERY' as any),
      dto.isPrimary ?? false,
      dto.sortOrder ?? 0
    );

    product.addImage(image);

    await this.productRepository.update(product);
  }

  async removeImage(productId: string, imageUrl: string): Promise<void> {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

<<<<<<< HEAD
    product.removeStock(quantity);
=======
    product.removeImage(imageUrl);

>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

<<<<<<< HEAD
  async getProductStock(
    productId: string,
  ): Promise<{ stock: number; isInStock: boolean; isLowStock: boolean }> {
=======
  // ========================================
  // SPECIFICATION MANAGEMENT
  // ========================================

  async addSpecification(dto: AddSpecificationDTO): Promise<void> {
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new Error(`Product with ID '${dto.productId}' not found`);
    }

    const specification = new ProductSpecification(
      dto.name,
      dto.value,
      (dto.type as any) ?? ('TEXT' as any),
      dto.unit,
      dto.category
    );

    product.addSpecification(specification);

    await this.productRepository.update(product);
  }

  async removeSpecification(productId: string, specificationName: string): Promise<void> {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

<<<<<<< HEAD
    return {
      stock: product.stock,
      isInStock: product.isInStock(),
      isLowStock: product.isLowStock(),
    };
  }

=======
    product.removeSpecification(specificationName);

    await this.productRepository.update(product);
  }

  // ========================================
  // SEARCH AND FILTERING
  // ========================================

  async searchProducts(dto: ProductSearchDTO): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    const filters: SearchFilters = {
      categoryId: dto.categoryId,
      artisanId: dto.artisanId,
      priceMin: dto.priceMin,
      priceMax: dto.priceMax,
      featured: dto.featured,
      tags: dto.tags,
    };

    const [products, total] = await Promise.all([
      dto.query
        ? this.productRepository.search(dto.query, filters)
        : this.productRepository.findPublished(page, limit),
      this.productRepository.count(filters),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return await this.productRepository.findFeatured(limit);
  }

  async getProductsByArtisan(
    artisanId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Product[]> {
    return await this.productRepository.findByArtisan(artisanId, page, limit);
  }

  async getProductsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Product[]> {
    return await this.productRepository.findByCategory(categoryId, page, limit);
  }

>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  // ========================================
  // PRODUCT STATUS MANAGEMENT
  // ========================================

<<<<<<< HEAD
  async publishProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
=======
  async updateProductRating(
    productId: string,
    averageRating: number,
    reviewCount: number
  ): Promise<void> {
    const product = await this.productRepository.findById(productId);
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

<<<<<<< HEAD
    // TODO: Add domain method to change status to ACTIVE
    // For now, we'll handle it through reconstruction or direct update
=======
    product.updateRating(averageRating, reviewCount);
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

  async archiveProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

<<<<<<< HEAD
    // TODO: Add domain method to change status to INACTIVE
    // For now, we'll handle it through reconstruction or direct update
=======
    product.incrementSoldCount(quantity);

    await this.productRepository.update(product);
  }
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

  private async publishDomainEvents(product: Product): Promise<void> {
<<<<<<< HEAD
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
=======
    const events = product.domainEvents;

    for (const event of events) {
      if (event instanceof ProductCreatedEvent) {
        await this.eventBus.publish(EventSubjects.PRODUCT_CREATED, event);
      } else if (event instanceof ProductPublishedEvent) {
        await this.eventBus.publish(EventSubjects.PRODUCT_PUBLISHED, event);
      } else if (event instanceof ProductPriceChangedEvent) {
        await this.eventBus.publish(EventSubjects.PRODUCT_PRICE_CHANGED, event);
      } else if (event instanceof ProductDiscontinuedEvent) {
        await this.eventBus.publish(EventSubjects.PRODUCT_DISCONTINUED, event);
      }
    }

    // Limpiar eventos después de publicar
    product.clearDomainEvents();
  }

  private generateId(): string {
    // En un entorno real, usarías un generador de IDs más robusto
    return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ========================================
// EXAMPLE USAGE AND INTEGRATION
// ========================================

/**
 * Ejemplo de uso del ProductService con eventos de dominio:
 *
 * ```typescript
 * // Configuración
 * const prisma = new PrismaClient();
 * const eventBus = new NatsEventBus('product-service');
 * const productRepository = new PrismaProductRepository(prisma);
 * const productService = new ProductService(productRepository, eventBus);
 *
 * // Crear un producto
 * const product = await productService.createProduct({
 *   name: "Cerámica Artesanal de Jaén",
 *   description: "Hermosa pieza de cerámica hecha a mano por artesanos locales",
 *   sku: "CER-001",
 *   price: 45.99,
 *   artisanId: "artisan_123",
 *   categoryId: "ceramica",
 *   slug: "ceramica-artesanal-jaen"
 * });
 *
 * // Agregar variantes
 * await productService.addVariant({
 *   productId: product.id,
 *   name: "Tamaño Grande",
 *   sku: "CER-001-L",
 *   price: 65.99,
 *   attributes: { size: "Large", color: "Azul" }
 * });
 *
 * // Agregar imágenes
 * await productService.addImage({
 *   productId: product.id,
 *   url: "https://storage.example.com/ceramica-001-main.jpg",
 *   isPrimary: true,
 *   altText: "Cerámica artesanal azul"
 * });
 *
 * // Publicar producto
 * await productService.publishProduct(product.id);
 *
 * // Los eventos de dominio se publican automáticamente:
 * // - ProductCreatedEvent → inventory-service, analytics-service
 * // - ProductPublishedEvent → notification-service, search-service
 * ```
 */
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
