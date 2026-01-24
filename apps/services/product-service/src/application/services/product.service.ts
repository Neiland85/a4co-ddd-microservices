import {
  CategoryId,
  Price,
  ProductDescription,
  ProductId,
  ProductName,
  SKU,
  Slug,
  Stock,
} from '../../domain/value-objects/product-value-objects';
import { EventSubjects, IEventBus } from '../../domain/event-bus';
import { IProductRepository } from '../../infrastructure/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

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
  featured?: boolean;
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
  currency?: string;
  slug?: string;
  isCustomizable?: boolean;
  isDigital?: boolean;
  requiresShipping?: boolean;
  featured?: boolean;
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
    const productId = ProductId.create();
    const price = Price.create(dto.price, dto.currency ?? 'EUR');
    const stock = Stock.create(dto.stock ?? 0);
    const sku = dto.sku ? SKU.create(dto.sku) : SKU.generate(productId.value);
    const slug = dto.slug ? Slug.create(dto.slug) : Slug.generateFromName(dto.name);

    const product = Product.create({
      id: productId,
      name: ProductName.create(dto.name),
      description: ProductDescription.create(dto.description),
      price,
      stock,
      sku,
      slug,
      artisanId: dto.artisanId,
      categoryId: CategoryId.create(dto.categoryId),
      isCustomizable: dto.isCustomizable ?? false,
      isDigital: dto.isDigital ?? false,
      requiresShipping: dto.requiresShipping ?? true,
      featured: dto.featured ?? false,
    });

    await this.productRepository.save(product);
    await this.publishDomainEvents(product);

    return product;
  }

  async updateProduct(dto: UpdateProductDTO): Promise<Product> {
    const product = await this.productRepository.findById(dto.id);
    if (!product) {
      throw new Error(`Product with id ${dto.id} not found`);
    }

    if (dto.name) {
      product.rename(ProductName.create(dto.name));
    }

    if (dto.description) {
      product.updateDescription(ProductDescription.create(dto.description));
    }

    if (dto.slug) {
      product.changeSlug(Slug.create(dto.slug));
    }

    if (dto.price !== undefined) {
      const currency = dto.currency ?? product.price.currency;
      product.changePrice(Price.create(dto.price, currency));
    }

    if (dto.isCustomizable !== undefined) {
      product.setCustomization(dto.isCustomizable);
    }

    if (dto.isDigital !== undefined) {
      product.setDigital(dto.isDigital);
    }

    if (dto.requiresShipping !== undefined) {
      product.setRequiresShipping(dto.requiresShipping);
    }

    if (dto.featured !== undefined) {
      product.setFeatured(dto.featured);
    }

    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
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

    product.increaseStock(quantity);
    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

  async removeStockFromProduct(productId: string, quantity: number): Promise<Product> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    product.decreaseStock(quantity);
    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

  async getProductStock(
    productId: string,
  ): Promise<{ stock: number; isInStock: boolean; isLowStock: boolean }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    return {
      stock: product.stock,
      isInStock: product.stock > 0,
      isLowStock: product.stock < 10,
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

    product.publish();

    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

  async archiveProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    product.archive();

    await this.productRepository.update(product);
    await this.publishDomainEvents(product);

    return product;
  }

  private async publishDomainEvents(product: Product): Promise<void> {
    const events = product.domainEvents;

    for (const event of events) {
      let subject: string | null = null;

      if (event instanceof ProductCreatedEvent) {
        subject = EventSubjects.PRODUCT_CREATED;
      } else if (event instanceof ProductPublishedEvent) {
        subject = EventSubjects.PRODUCT_PUBLISHED;
      } else if (event instanceof ProductPriceChangedEvent) {
        subject = EventSubjects.PRODUCT_PRICE_CHANGED;
      } else if (event instanceof ProductArchivedEvent) {
        subject = EventSubjects.PRODUCT_ARCHIVED;
      }

      if (!subject) {
        continue;
      }

      await this.eventBus.publish(subject, {
        aggregateId: event.aggregateId,
        eventId: event.eventId,
        occurredOn: event.occurredOn.toISOString(),
        payload: event.eventData,
      });
    }

    product.clearDomainEvents();
  }
}
