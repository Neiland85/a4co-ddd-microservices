"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProductRepository = void 0;
const product_entity_1 = require("../../domain/entities/product.entity");
class PrismaProductRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const productData = await this.prisma.product.findUnique({
            where: { id },
            include: {
                variants: {
                    include: {
                        images: true,
                    },
                },
                images: true,
                specifications: true,
                category: true,
                artisan: true,
                inventory: true,
            },
        });
        if (!productData) {
            return null;
        }
        return this.mapToDomainEntity(productData);
    }
    async findByIds(ids) {
        const productsData = await this.prisma.product.findMany({
            where: { id: { in: ids } },
            include: {
                variants: {
                    include: {
                        images: true,
                    },
                },
                images: true,
                specifications: true,
                category: true,
                artisan: true,
                inventory: true,
            },
        });
        return productsData.map(productData => this.mapToDomainEntity(productData));
    }
    async findBySku(sku) {
        const productData = await this.prisma.product.findUnique({
            where: { sku },
            include: {
                variants: {
                    include: {
                        images: true,
                    },
                },
                images: true,
                specifications: true,
                category: true,
                artisan: true,
                inventory: true,
            },
        });
        if (!productData) {
            return null;
        }
        return this.mapToDomainEntity(productData);
    }
    async findBySlug(slug) {
        const productData = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                variants: {
                    include: {
                        images: true,
                    },
                },
                images: true,
                specifications: true,
                category: true,
                artisan: true,
                inventory: true,
            },
        });
        if (!productData) {
            return null;
        }
        return this.mapToDomainEntity(productData);
    }
    async findByArtisan(artisanId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const productsData = await this.prisma.product.findMany({
            where: { artisanId },
            include: {
                variants: {
                    include: {
                        images: true,
                    },
                },
                images: true,
                specifications: true,
                category: true,
                artisan: true,
                inventory: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return productsData.map(productData => this.mapToDomainEntity(productData));
    }
    async findByCategory(categoryId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const productsData = await this.prisma.product.findMany({
            where: {
                OR: [{ categoryId }, { categories: { some: { categoryId } } }],
            },
            include: {
                variants: {
                    include: {
                        images: true,
                    },
                },
                images: true,
                specifications: true,
                category: true,
                artisan: true,
                inventory: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return productsData.map(productData => this.mapToDomainEntity(productData));
    }
    async findFeatured(limit = 10) {
        const productsData = await this.prisma.product.findMany({
            where: {
                featured: true,
                status: 'PUBLISHED',
                availability: 'AVAILABLE',
            },
            include: {
                variants: {
                    include: {
                        images: true,
                    },
                },
                images: true,
                specifications: true,
                category: true,
                artisan: true,
                inventory: true,
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return productsData.map(productData => this.mapToDomainEntity(productData));
    }
    async findPublished(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const productsData = await this.prisma.product.findMany({
            where: {
                status: 'PUBLISHED',
                availability: 'AVAILABLE',
            },
            include: {
                variants: {
                    include: {
                        images: true,
                    },
                },
                images: true,
                specifications: true,
                category: true,
                artisan: true,
                inventory: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return productsData.map(productData => this.mapToDomainEntity(productData));
    }
    async search(query, filters) {
        const where = {
            AND: [
                {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { tags: { hasSome: [query] } },
                        { keywords: { hasSome: [query] } },
                    ],
                },
            ],
        };
        if (filters) {
            if (filters.categoryId) {
                where.AND.push({ categoryId: filters.categoryId });
            }
            if (filters.artisanId) {
                where.AND.push({ artisanId: filters.artisanId });
            }
            if (filters.status) {
                where.AND.push({ status: filters.status });
            }
            if (filters.availability) {
                where.AND.push({ availability: filters.availability });
            }
            if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
                const priceFilter = {};
                if (filters.priceMin !== undefined) {
                    priceFilter.gte = filters.priceMin;
                }
                if (filters.priceMax !== undefined) {
                    priceFilter.lte = filters.priceMax;
                }
                where.AND.push({ price: priceFilter });
            }
            if (filters.featured !== undefined) {
                where.AND.push({ featured: filters.featured });
            }
            if (filters.tags && filters.tags.length > 0) {
                where.AND.push({ tags: { hasSome: filters.tags } });
            }
        }
        const productsData = await this.prisma.product.findMany({
            where,
            include: {
                variants: {
                    include: {
                        images: true,
                    },
                },
                images: true,
                specifications: true,
                category: true,
                artisan: true,
                inventory: true,
            },
            orderBy: [{ featured: 'desc' }, { averageRating: 'desc' }, { createdAt: 'desc' }],
        });
        return productsData.map(productData => this.mapToDomainEntity(productData));
    }
    async save(product) {
        await this.prisma.$transaction(async (tx) => {
            await tx.product.create({
                data: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    sku: product.sku,
                    price: product.price.amount,
                    originalPrice: product.originalPrice?.amount,
                    currency: product.price.currency,
                    categoryId: product.categoryId,
                    artisanId: product.artisanId,
                    slug: product.slug,
                    status: product.status,
                    availability: product.availability,
                    isHandmade: product.isHandmade,
                    isCustomizable: product.isCustomizable,
                    isDigital: product.isDigital,
                    requiresShipping: product.requiresShipping,
                    tags: product.tags,
                    keywords: product.keywords,
                    metaTitle: product.metaTitle,
                    metaDescription: product.metaDescription,
                    featured: product.featured,
                    averageRating: product.averageRating,
                    reviewCount: product.reviewCount,
                    totalSold: product.totalSold,
                },
            });
            if (product.variants.length > 0) {
                await tx.productVariant.createMany({
                    data: product.variants.map(variant => ({
                        id: variant.id,
                        productId: product.id,
                        name: variant.name,
                        sku: variant.sku,
                        price: variant.price.amount,
                        originalPrice: variant.price.amount,
                        attributes: variant.attributes,
                        stockQuantity: variant.stockQuantity,
                        weight: variant.weight,
                        dimensions: variant.dimensions
                            ? {
                                length: variant.dimensions.length,
                                width: variant.dimensions.width,
                                height: variant.dimensions.height,
                                unit: variant.dimensions.unit,
                            }
                            : undefined,
                        isActive: variant.isActive,
                        isDefault: variant.isDefault,
                    })),
                });
            }
            if (product.images.length > 0) {
                await tx.productImage.createMany({
                    data: product.images.map((image, index) => ({
                        productId: product.id,
                        url: image.url,
                        altText: image.altText,
                        type: image.type,
                        isPrimary: image.isPrimary,
                        sortOrder: image.sortOrder || index,
                    })),
                });
            }
            if (product.specifications.length > 0) {
                await tx.productSpecification.createMany({
                    data: product.specifications.map(spec => ({
                        productId: product.id,
                        name: spec.name,
                        value: spec.value,
                        type: spec.type,
                        unit: spec.unit,
                        category: spec.category,
                    })),
                });
            }
        });
    }
    async update(product) {
        await this.prisma.$transaction(async (tx) => {
            await tx.product.update({
                where: { id: product.id },
                data: {
                    name: product.name,
                    description: product.description,
                    price: product.price.amount,
                    originalPrice: product.originalPrice?.amount,
                    currency: product.price.currency,
                    status: product.status,
                    availability: product.availability,
                    tags: product.tags,
                    keywords: product.keywords,
                    metaTitle: product.metaTitle,
                    metaDescription: product.metaDescription,
                    featured: product.featured,
                    averageRating: product.averageRating,
                    reviewCount: product.reviewCount,
                    totalSold: product.totalSold,
                },
            });
            await tx.productVariant.deleteMany({
                where: { productId: product.id },
            });
            if (product.variants.length > 0) {
                await tx.productVariant.createMany({
                    data: product.variants.map(variant => ({
                        id: variant.id,
                        productId: product.id,
                        name: variant.name,
                        sku: variant.sku,
                        price: variant.price.amount,
                        attributes: variant.attributes,
                        stockQuantity: variant.stockQuantity,
                        weight: variant.weight,
                        dimensions: variant.dimensions
                            ? {
                                length: variant.dimensions.length,
                                width: variant.dimensions.width,
                                height: variant.dimensions.height,
                                unit: variant.dimensions.unit,
                            }
                            : undefined,
                        isActive: variant.isActive,
                        isDefault: variant.isDefault,
                    })),
                });
            }
            await tx.productImage.deleteMany({
                where: { productId: product.id },
            });
            if (product.images.length > 0) {
                await tx.productImage.createMany({
                    data: product.images.map((image, index) => ({
                        productId: product.id,
                        url: image.url,
                        altText: image.altText,
                        type: image.type,
                        isPrimary: image.isPrimary,
                        sortOrder: image.sortOrder || index,
                    })),
                });
            }
            await tx.productSpecification.deleteMany({
                where: { productId: product.id },
            });
            if (product.specifications.length > 0) {
                await tx.productSpecification.createMany({
                    data: product.specifications.map(spec => ({
                        productId: product.id,
                        name: spec.name,
                        value: spec.value,
                        type: spec.type,
                        unit: spec.unit,
                        category: spec.category,
                    })),
                });
            }
        });
    }
    async delete(id) {
        await this.prisma.product.delete({
            where: { id },
        });
    }
    async count(filters) {
        const where = {};
        if (filters) {
            if (filters.categoryId) {
                where.categoryId = filters.categoryId;
            }
            if (filters.artisanId) {
                where.artisanId = filters.artisanId;
            }
            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.availability) {
                where.availability = filters.availability;
            }
            if (filters.featured !== undefined) {
                where.featured = filters.featured;
            }
        }
        return await this.prisma.product.count({ where });
    }
    mapToDomainEntity(productData) {
        const price = new product_entity_1.Money(productData.price.toNumber(), productData.currency);
        const originalPrice = productData.originalPrice
            ? new product_entity_1.Money(productData.originalPrice.toNumber(), productData.currency)
            : undefined;
        const product = new product_entity_1.Product(productData.id, productData.name, productData.description, productData.sku, price, productData.artisanId, productData.categoryId, productData.slug, originalPrice, productData.isHandmade, productData.isCustomizable, productData.isDigital, productData.requiresShipping, productData.tags, productData.keywords, productData.metaTitle, productData.metaDescription, productData.featured);
        product._status = productData.status;
        product._availability = productData.availability;
        product._averageRating = productData.averageRating;
        product._reviewCount = productData.reviewCount;
        product._totalSold = productData.totalSold;
        if (productData.variants) {
            productData.variants.forEach((variantData) => {
                const variant = new product_entity_1.ProductVariant(variantData.id, variantData.name, variantData.sku, new product_entity_1.Money(variantData.price.toNumber(), productData.currency), variantData.attributes, variantData.stockQuantity, variantData.weight, variantData.dimensions
                    ? new product_entity_1.Dimensions(variantData.dimensions.length, variantData.dimensions.width, variantData.dimensions.height, variantData.dimensions.unit)
                    : undefined, variantData.isActive, variantData.isDefault);
                product.addVariant(variant);
            });
        }
        if (productData.images) {
            productData.images.forEach((imageData) => {
                const image = new product_entity_1.ProductImage(imageData.url, imageData.altText, imageData.type, imageData.isPrimary, imageData.sortOrder);
                product.addImage(image);
            });
        }
        if (productData.specifications) {
            productData.specifications.forEach((specData) => {
                const specification = new product_entity_1.ProductSpecification(specData.name, specData.value, specData.type, specData.unit, specData.category);
                product.addSpecification(specification);
            });
        }
        return product;
    }
}
exports.PrismaProductRepository = PrismaProductRepository;
//# sourceMappingURL=product.repository.js.map