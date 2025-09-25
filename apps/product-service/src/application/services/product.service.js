"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_entity_1 = require("../../domain/entities/product.entity");
const subjects_1 = require("@a4co/shared-utils/events/subjects");
class ProductService {
    productRepository;
    eventBus;
    constructor(productRepository, eventBus) {
        this.productRepository = productRepository;
        this.eventBus = eventBus;
    }
    async createProduct(dto) {
        const existingProduct = await this.productRepository.findBySku(dto.sku);
        if (existingProduct) {
            throw new Error(`Product with SKU '${dto.sku}' already exists`);
        }
        const existingSlug = await this.productRepository.findBySlug(dto.slug);
        if (existingSlug) {
            throw new Error(`Product with slug '${dto.slug}' already exists`);
        }
        const price = new product_entity_1.Money(dto.price, dto.currency || 'EUR');
        const originalPrice = dto.originalPrice
            ? new product_entity_1.Money(dto.originalPrice, dto.currency || 'EUR')
            : undefined;
        const product = new product_entity_1.Product(this.generateId(), dto.name, dto.description, dto.sku, price, dto.artisanId, dto.categoryId, dto.slug, originalPrice, dto.isHandmade ?? true, dto.isCustomizable ?? false, dto.isDigital ?? false, dto.requiresShipping ?? true, dto.tags ?? [], dto.keywords ?? [], dto.metaTitle, dto.metaDescription, dto.featured ?? false);
        await this.productRepository.save(product);
        await this.publishDomainEvents(product);
        return product;
    }
    async updateProduct(dto) {
        const product = await this.productRepository.findById(dto.id);
        if (!product) {
            throw new Error(`Product with ID '${dto.id}' not found`);
        }
        let hasChanges = false;
        if (dto.price !== undefined) {
            const newPrice = new product_entity_1.Money(dto.price, product.price.currency);
            const newOriginalPrice = dto.originalPrice
                ? new product_entity_1.Money(dto.originalPrice, product.price.currency)
                : undefined;
            if (!newPrice.equals(product.price)) {
                product.updatePrice(newPrice, newOriginalPrice);
                hasChanges = true;
            }
        }
        if (hasChanges) {
            await this.productRepository.update(product);
            await this.publishDomainEvents(product);
        }
        return product;
    }
    async getProductById(id) {
        return await this.productRepository.findById(id);
    }
    async getProductBySku(sku) {
        return await this.productRepository.findBySku(sku);
    }
    async getProductBySlug(slug) {
        return await this.productRepository.findBySlug(slug);
    }
    async deleteProduct(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Product with ID '${id}' not found`);
        }
        await this.productRepository.delete(id);
    }
    async publishProduct(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Product with ID '${id}' not found`);
        }
        product.publish();
        await this.productRepository.update(product);
        await this.publishDomainEvents(product);
    }
    async archiveProduct(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Product with ID '${id}' not found`);
        }
        product.archive();
        await this.productRepository.update(product);
        await this.publishDomainEvents(product);
    }
    async discontinueProduct(id, reason) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Product with ID '${id}' not found`);
        }
        product.discontinue(reason);
        await this.productRepository.update(product);
        await this.publishDomainEvents(product);
    }
    async markProductOutOfStock(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Product with ID '${id}' not found`);
        }
        product.markAsOutOfStock();
        await this.productRepository.update(product);
    }
    async markProductAvailable(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error(`Product with ID '${id}' not found`);
        }
        product.markAsAvailable();
        await this.productRepository.update(product);
    }
    async addVariant(dto) {
        const product = await this.productRepository.findById(dto.productId);
        if (!product) {
            throw new Error(`Product with ID '${dto.productId}' not found`);
        }
        const existingVariant = product.getVariantBySku(dto.sku);
        if (existingVariant) {
            throw new Error(`Variant with SKU '${dto.sku}' already exists`);
        }
        const variant = new product_entity_1.ProductVariant(this.generateId(), dto.name, dto.sku, new product_entity_1.Money(dto.price, product.price.currency), dto.attributes, dto.stockQuantity ?? 0, dto.weight, dto.dimensions
            ? {
                length: dto.dimensions.length,
                width: dto.dimensions.width,
                height: dto.dimensions.height,
                unit: dto.dimensions.unit ?? 'cm',
            }
            : undefined, true, dto.isDefault ?? false);
        product.addVariant(variant);
        await this.productRepository.update(product);
    }
    async removeVariant(productId, variantId) {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID '${productId}' not found`);
        }
        product.removeVariant(variantId);
        await this.productRepository.update(product);
    }
    async addImage(dto) {
        const product = await this.productRepository.findById(dto.productId);
        if (!product) {
            throw new Error(`Product with ID '${dto.productId}' not found`);
        }
        const image = new product_entity_1.ProductImage(dto.url, dto.altText, dto.type ?? 'GALLERY', dto.isPrimary ?? false, dto.sortOrder ?? 0);
        product.addImage(image);
        await this.productRepository.update(product);
    }
    async removeImage(productId, imageUrl) {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID '${productId}' not found`);
        }
        product.removeImage(imageUrl);
        await this.productRepository.update(product);
    }
    async addSpecification(dto) {
        const product = await this.productRepository.findById(dto.productId);
        if (!product) {
            throw new Error(`Product with ID '${dto.productId}' not found`);
        }
        const specification = new product_entity_1.ProductSpecification(dto.name, dto.value, dto.type ?? 'TEXT', dto.unit, dto.category);
        product.addSpecification(specification);
        await this.productRepository.update(product);
    }
    async removeSpecification(productId, specificationName) {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID '${productId}' not found`);
        }
        product.removeSpecification(specificationName);
        await this.productRepository.update(product);
    }
    async searchProducts(dto) {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 10;
        const filters = {
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
    async getFeaturedProducts(limit = 10) {
        return await this.productRepository.findFeatured(limit);
    }
    async getProductsByArtisan(artisanId, page = 1, limit = 10) {
        return await this.productRepository.findByArtisan(artisanId, page, limit);
    }
    async getProductsByCategory(categoryId, page = 1, limit = 10) {
        return await this.productRepository.findByCategory(categoryId, page, limit);
    }
    async updateProductRating(productId, averageRating, reviewCount) {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID '${productId}' not found`);
        }
        product.updateRating(averageRating, reviewCount);
        await this.productRepository.update(product);
    }
    async incrementSoldCount(productId, quantity = 1) {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with ID '${productId}' not found`);
        }
        product.incrementSoldCount(quantity);
        await this.productRepository.update(product);
    }
    async publishDomainEvents(product) {
        const events = product.domainEvents;
        for (const event of events) {
            if (event instanceof product_entity_1.ProductCreatedEvent) {
                await this.eventBus.publish(subjects_1.EventSubjects.PRODUCT_CREATED, event);
            }
            else if (event instanceof product_entity_1.ProductPublishedEvent) {
                await this.eventBus.publish(subjects_1.EventSubjects.PRODUCT_PUBLISHED, event);
            }
            else if (event instanceof product_entity_1.ProductPriceChangedEvent) {
                await this.eventBus.publish(subjects_1.EventSubjects.PRODUCT_PRICE_CHANGED, event);
            }
            else if (event instanceof product_entity_1.ProductDiscontinuedEvent) {
                await this.eventBus.publish(subjects_1.EventSubjects.PRODUCT_DISCONTINUED, event);
            }
        }
        product.clearDomainEvents();
    }
    generateId() {
        return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map