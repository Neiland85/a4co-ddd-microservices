"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.ProductVariant = exports.ProductDiscontinuedEvent = exports.ProductPriceChangedEvent = exports.ProductPublishedEvent = exports.ProductCreatedEvent = exports.SpecificationType = exports.ImageType = exports.ProductAvailability = exports.ProductStatus = exports.Dimensions = exports.ProductSpecification = exports.ProductImage = exports.Money = void 0;
const aggregate_root_1 = require("@a4co/shared-utils/domain/aggregate-root");
const domain_event_1 = require("@a4co/shared-utils/domain/domain-event");
class Money {
    amount;
    currency;
    constructor(amount, currency = 'EUR') {
        this.amount = amount;
        this.currency = currency;
        if (amount < 0) {
            throw new Error('Money amount cannot be negative');
        }
        if (!currency || currency.length !== 3) {
            throw new Error('Currency must be a valid 3-letter code');
        }
    }
    equals(other) {
        return this.amount === other.amount && this.currency === other.currency;
    }
    add(other) {
        if (this.currency !== other.currency) {
            throw new Error('Cannot add different currencies');
        }
        return new Money(this.amount + other.amount, this.currency);
    }
    multiply(factor) {
        return new Money(this.amount * factor, this.currency);
    }
    isGreaterThan(other) {
        if (this.currency !== other.currency) {
            throw new Error('Cannot compare different currencies');
        }
        return this.amount > other.amount;
    }
}
exports.Money = Money;
class ProductImage {
    url;
    altText;
    type;
    isPrimary;
    sortOrder;
    constructor(url, altText, type = ImageType.GALLERY, isPrimary = false, sortOrder = 0) {
        this.url = url;
        this.altText = altText;
        this.type = type;
        this.isPrimary = isPrimary;
        this.sortOrder = sortOrder;
        if (!url || !this.isValidUrl(url)) {
            throw new Error('Invalid image URL');
        }
    }
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.ProductImage = ProductImage;
class ProductSpecification {
    name;
    value;
    type;
    unit;
    category;
    constructor(name, value, type = SpecificationType.TEXT, unit, category) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.unit = unit;
        this.category = category;
        if (!name.trim()) {
            throw new Error('Specification name cannot be empty');
        }
        if (!value.trim()) {
            throw new Error('Specification value cannot be empty');
        }
    }
}
exports.ProductSpecification = ProductSpecification;
class Dimensions {
    length;
    width;
    height;
    unit;
    constructor(length, width, height, unit = 'cm') {
        this.length = length;
        this.width = width;
        this.height = height;
        this.unit = unit;
        if (length <= 0 || width <= 0 || height <= 0) {
            throw new Error('Dimensions must be positive numbers');
        }
    }
    volume() {
        return this.length * this.width * this.height;
    }
}
exports.Dimensions = Dimensions;
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "DRAFT";
    ProductStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    ProductStatus["PUBLISHED"] = "PUBLISHED";
    ProductStatus["ARCHIVED"] = "ARCHIVED";
    ProductStatus["REJECTED"] = "REJECTED";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var ProductAvailability;
(function (ProductAvailability) {
    ProductAvailability["AVAILABLE"] = "AVAILABLE";
    ProductAvailability["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    ProductAvailability["DISCONTINUED"] = "DISCONTINUED";
    ProductAvailability["COMING_SOON"] = "COMING_SOON";
    ProductAvailability["PRE_ORDER"] = "PRE_ORDER";
})(ProductAvailability || (exports.ProductAvailability = ProductAvailability = {}));
var ImageType;
(function (ImageType) {
    ImageType["GALLERY"] = "GALLERY";
    ImageType["THUMBNAIL"] = "THUMBNAIL";
    ImageType["HERO"] = "HERO";
    ImageType["DETAIL"] = "DETAIL";
    ImageType["LIFESTYLE"] = "LIFESTYLE";
})(ImageType || (exports.ImageType = ImageType = {}));
var SpecificationType;
(function (SpecificationType) {
    SpecificationType["TEXT"] = "TEXT";
    SpecificationType["NUMBER"] = "NUMBER";
    SpecificationType["BOOLEAN"] = "BOOLEAN";
    SpecificationType["DATE"] = "DATE";
    SpecificationType["URL"] = "URL";
    SpecificationType["COLOR"] = "COLOR";
})(SpecificationType || (exports.SpecificationType = SpecificationType = {}));
class ProductCreatedEvent extends domain_event_1.DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.ProductCreatedEvent = ProductCreatedEvent;
class ProductPublishedEvent extends domain_event_1.DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.ProductPublishedEvent = ProductPublishedEvent;
class ProductPriceChangedEvent extends domain_event_1.DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.ProductPriceChangedEvent = ProductPriceChangedEvent;
class ProductDiscontinuedEvent extends domain_event_1.DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.ProductDiscontinuedEvent = ProductDiscontinuedEvent;
class ProductVariant {
    id;
    name;
    sku;
    _price;
    attributes;
    _stockQuantity;
    weight;
    dimensions;
    _isActive;
    isDefault;
    constructor(id, name, sku, _price, attributes, _stockQuantity = 0, weight, dimensions, _isActive = true, isDefault = false) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this._price = _price;
        this.attributes = attributes;
        this._stockQuantity = _stockQuantity;
        this.weight = weight;
        this.dimensions = dimensions;
        this._isActive = _isActive;
        this.isDefault = isDefault;
        if (!name.trim()) {
            throw new Error('Variant name cannot be empty');
        }
        if (!sku.trim()) {
            throw new Error('Variant SKU cannot be empty');
        }
        if (_stockQuantity < 0) {
            throw new Error('Stock quantity cannot be negative');
        }
    }
    get price() {
        return this._price;
    }
    get stockQuantity() {
        return this._stockQuantity;
    }
    get isActive() {
        return this._isActive;
    }
    updatePrice(newPrice) {
        this._price = newPrice;
    }
    updateStock(quantity) {
        if (quantity < 0) {
            throw new Error('Stock quantity cannot be negative');
        }
        this._stockQuantity = quantity;
    }
    activate() {
        this._isActive = true;
    }
    deactivate() {
        this._isActive = false;
    }
    isInStock() {
        return this._stockQuantity > 0 && this._isActive;
    }
}
exports.ProductVariant = ProductVariant;
class Product extends aggregate_root_1.AggregateRoot {
    name;
    description;
    sku;
    artisanId;
    categoryId;
    slug;
    isHandmade;
    isCustomizable;
    isDigital;
    requiresShipping;
    tags;
    keywords;
    metaTitle;
    metaDescription;
    featured;
    _status;
    _availability;
    _price;
    _originalPrice;
    _variants = [];
    _images = [];
    _specifications = [];
    _averageRating = 0;
    _reviewCount = 0;
    _totalSold = 0;
    constructor(id, name, description, sku, price, artisanId, categoryId, slug, originalPrice, isHandmade = true, isCustomizable = false, isDigital = false, requiresShipping = true, tags = [], keywords = [], metaTitle, metaDescription, featured = false) {
        super(id);
        this.name = name;
        this.description = description;
        this.sku = sku;
        this.artisanId = artisanId;
        this.categoryId = categoryId;
        this.slug = slug;
        this.isHandmade = isHandmade;
        this.isCustomizable = isCustomizable;
        this.isDigital = isDigital;
        this.requiresShipping = requiresShipping;
        this.tags = tags;
        this.keywords = keywords;
        this.metaTitle = metaTitle;
        this.metaDescription = metaDescription;
        this.featured = featured;
        if (!name.trim()) {
            throw new Error('Product name cannot be empty');
        }
        if (!sku.trim()) {
            throw new Error('Product SKU cannot be empty');
        }
        if (!artisanId.trim()) {
            throw new Error('Artisan ID cannot be empty');
        }
        if (!categoryId.trim()) {
            throw new Error('Category ID cannot be empty');
        }
        if (!slug.trim()) {
            throw new Error('Product slug cannot be empty');
        }
        this._price = price;
        this._originalPrice = originalPrice;
        this._status = ProductStatus.DRAFT;
        this._availability = ProductAvailability.AVAILABLE;
        this.addDomainEvent(new ProductCreatedEvent(id, {
            name,
            price,
            artisanId,
            categoryId,
            createdAt: new Date(),
        }));
    }
    get status() {
        return this._status;
    }
    get availability() {
        return this._availability;
    }
    get price() {
        return this._price;
    }
    get originalPrice() {
        return this._originalPrice;
    }
    get variants() {
        return this._variants;
    }
    get images() {
        return this._images;
    }
    get specifications() {
        return this._specifications;
    }
    get averageRating() {
        return this._averageRating;
    }
    get reviewCount() {
        return this._reviewCount;
    }
    get totalSold() {
        return this._totalSold;
    }
    publish() {
        if (this._status === ProductStatus.PUBLISHED) {
            throw new Error('Product is already published');
        }
        if (this._images.length === 0) {
            throw new Error('Product must have at least one image to be published');
        }
        this._status = ProductStatus.PUBLISHED;
        this.addDomainEvent(new ProductPublishedEvent(this.id, {
            name: this.name,
            price: this._price,
            artisanId: this.artisanId,
            publishedAt: new Date(),
        }));
    }
    archive() {
        if (this._status === ProductStatus.ARCHIVED) {
            throw new Error('Product is already archived');
        }
        this._status = ProductStatus.ARCHIVED;
        this._availability = ProductAvailability.DISCONTINUED;
    }
    updatePrice(newPrice, originalPrice) {
        const previousPrice = this._price;
        this._price = newPrice;
        this._originalPrice = originalPrice;
        this.addDomainEvent(new ProductPriceChangedEvent(this.id, {
            previousPrice,
            newPrice,
            changedAt: new Date(),
        }));
    }
    discontinue(reason) {
        this._availability = ProductAvailability.DISCONTINUED;
        this.addDomainEvent(new ProductDiscontinuedEvent(this.id, {
            reason,
            discontinuedAt: new Date(),
        }));
    }
    markAsOutOfStock() {
        this._availability = ProductAvailability.OUT_OF_STOCK;
    }
    markAsAvailable() {
        this._availability = ProductAvailability.AVAILABLE;
    }
    addVariant(variant) {
        if (this._variants.some(v => v.sku === variant.sku)) {
            throw new Error('A variant with this SKU already exists');
        }
        if (variant.isDefault || !this._variants.some(v => v.isDefault)) {
            this._variants = this._variants.map(v => new ProductVariant(v.id, v.name, v.sku, v.price, v.attributes, v.stockQuantity, v.weight, v.dimensions, v.isActive, false));
        }
        this._variants.push(variant);
    }
    removeVariant(variantId) {
        const index = this._variants.findIndex(v => v.id === variantId);
        if (index === -1) {
            throw new Error('Variant not found');
        }
        this._variants.splice(index, 1);
    }
    addImage(image) {
        if (image.isPrimary || this._images.length === 0) {
            this._images = this._images.map(img => new ProductImage(img.url, img.altText, img.type, false, img.sortOrder));
        }
        this._images.push(image);
        this._images.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    removeImage(imageUrl) {
        const index = this._images.findIndex(img => img.url === imageUrl);
        if (index === -1) {
            throw new Error('Image not found');
        }
        this._images.splice(index, 1);
    }
    addSpecification(specification) {
        if (this._specifications.some(spec => spec.name === specification.name)) {
            throw new Error('A specification with this name already exists');
        }
        this._specifications.push(specification);
    }
    removeSpecification(name) {
        const index = this._specifications.findIndex(spec => spec.name === name);
        if (index === -1) {
            throw new Error('Specification not found');
        }
        this._specifications.splice(index, 1);
    }
    updateRating(averageRating, reviewCount) {
        if (averageRating < 0 || averageRating > 5) {
            throw new Error('Rating must be between 0 and 5');
        }
        if (reviewCount < 0) {
            throw new Error('Review count cannot be negative');
        }
        this._averageRating = averageRating;
        this._reviewCount = reviewCount;
    }
    incrementSoldCount(quantity = 1) {
        if (quantity <= 0) {
            throw new Error('Sold quantity must be positive');
        }
        this._totalSold += quantity;
    }
    hasDiscount() {
        return this._originalPrice !== undefined && this._originalPrice.isGreaterThan(this._price);
    }
    getDiscountPercentage() {
        if (!this.hasDiscount() || !this._originalPrice) {
            return 0;
        }
        return Math.round(((this._originalPrice.amount - this._price.amount) / this._originalPrice.amount) * 100);
    }
    isPublished() {
        return this._status === ProductStatus.PUBLISHED;
    }
    isAvailable() {
        return this._availability === ProductAvailability.AVAILABLE && this.isPublished();
    }
    canBePurchased() {
        return (this.isAvailable() && (this._variants.length === 0 || this._variants.some(v => v.isInStock())));
    }
    getPrimaryImage() {
        return this._images.find(img => img.isPrimary) || this._images[0];
    }
    getVariantBySku(sku) {
        return this._variants.find(v => v.sku === sku);
    }
    getSpecificationsByCategory(category) {
        return this._specifications.filter(spec => spec.category === category);
    }
}
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map