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

// ========================================
// DTOs (Data Transfer Objects)
// ========================================

export interface CreateProductDTO {
  name: string;
  description: string;
  sku: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  artisanId: string;
  categoryId: string;
  slug: string;
  isHandmade?: boolean;
  isCustomizable?: boolean;
  isDigital?: boolean;
  requiresShipping?: boolean;
  tags?: string[];
  keywords?: string[];
  metaTitle?: string;
  metaDescription?: string;
  featured?: boolean;
}

export interface UpdateProductDTO {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  tags?: string[];
  keywords?: string[];
  metaTitle?: string;
  metaDescription?: string;
  featured?: boolean;
}

export interface AddVariantDTO {
  productId: string;
  name: string;
  sku: string;
  price: number;
  attributes: Record<string, any>;
  stockQuantity?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit?: string;
  };
  isDefault?: boolean;
}

export interface AddImageDTO {
  productId: string;
  url: string;
  altText?: string;
  type?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface AddSpecificationDTO {
  productId: string;
  name: string;
  value: string;
  type?: string;
  unit?: string;
  category?: string;
}

export interface ProductSearchDTO {
  query?: string;
  categoryId?: string;
  artisanId?: string;
  priceMin?: number;
  priceMax?: number;
  featured?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
}

// ========================================
// PRODUCT APPLICATION SERVICE
// ========================================

export class ProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly eventBus: IEventBus
  ) {}

  // ========================================
  // CRUD OPERATIONS
  // ========================================

  async createProduct(dto: CreateProductDTO): Promise<Product> {
    // Verificar que el SKU no exista
    const existingProduct = await this.productRepository.findBySku(dto.sku);
    if (existingProduct) {
      throw new Error(`Product with SKU '${dto.sku}' already exists`);
    }

    // Verificar que el slug no exista
    const existingSlug = await this.productRepository.findBySlug(dto.slug);
    if (existingSlug) {
      throw new Error(`Product with slug '${dto.slug}' already exists`);
    }

    // Crear el objeto Money
    const price = new Money(dto.price, dto.currency || 'EUR');
    const originalPrice = dto.originalPrice
      ? new Money(dto.originalPrice, dto.currency || 'EUR')
      : undefined;

    // Crear el producto
    const product = new Product(
      this.generateId(),
      dto.name,
      dto.description,
      dto.sku,
      price,
      dto.artisanId,
      dto.categoryId,
      dto.slug,
      originalPrice,
      dto.isHandmade ?? true,
      dto.isCustomizable ?? false,
      dto.isDigital ?? false,
      dto.requiresShipping ?? true,
      dto.tags ?? [],
      dto.keywords ?? [],
      dto.metaTitle,
      dto.metaDescription,
      dto.featured ?? false
    );

    // Guardar en repositorio
    await this.productRepository.save(product);

    // Publicar eventos de dominio
    await this.publishDomainEvents(product);

    return product;
  }

  async updateProduct(dto: UpdateProductDTO): Promise<Product> {
    const product = await this.productRepository.findById(dto.id);
    if (!product) {
      throw new Error(`Product with ID '${dto.id}' not found`);
    }

    let hasChanges = false;

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

    // Actualizar otros campos (usaríamos reflexión o métodos específicos)
    // Por simplicidad, asumimos que tenemos métodos de actualización
    if (hasChanges) {
      await this.productRepository.update(product);
      await this.publishDomainEvents(product);
    }

    return product;
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  async getProductBySku(sku: string): Promise<Product | null> {
    return await this.productRepository.findBySku(sku);
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return await this.productRepository.findBySlug(slug);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with ID '${id}' not found`);
    }

    await this.productRepository.delete(id);
  }

  // ========================================
  // BUSINESS OPERATIONS
  // ========================================

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
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with ID '${productId}' not found`);
    }

    product.removeVariant(variantId);

    await this.productRepository.update(product);
  }

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
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with ID '${productId}' not found`);
    }

    product.removeImage(imageUrl);

    await this.productRepository.update(product);
  }

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
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with ID '${productId}' not found`);
    }

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

  // ========================================
  // RATING MANAGEMENT
  // ========================================

  async updateProductRating(
    productId: string,
    averageRating: number,
    reviewCount: number
  ): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with ID '${productId}' not found`);
    }

    product.updateRating(averageRating, reviewCount);

    await this.productRepository.update(product);
  }

  async incrementSoldCount(productId: string, quantity: number = 1): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with ID '${productId}' not found`);
    }

    product.incrementSoldCount(quantity);

    await this.productRepository.update(product);
  }

  // ========================================
  // PRIVATE METHODS
  // ========================================

  private async publishDomainEvents(product: Product): Promise<void> {
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
