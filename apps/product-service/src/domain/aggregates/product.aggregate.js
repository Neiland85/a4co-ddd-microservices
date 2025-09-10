"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.ProductAvailability = exports.ProductStatus = void 0;
const shared_utils_1 = require("@a4co/shared-utils");
const product_value_objects_1 = require("../value-objects/product-value-objects");
const product_variant_entity_1 = require("../entities/product-variant.entity");
const product_image_entity_1 = require("../entities/product-image.entity");
const product_tag_entity_1 = require("../entities/product-tag.entity");
const product_events_1 = require("../events/product-events");
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "draft";
    ProductStatus["ACTIVE"] = "active";
    ProductStatus["INACTIVE"] = "inactive";
    ProductStatus["DISCONTINUED"] = "discontinued";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var ProductAvailability;
(function (ProductAvailability) {
    ProductAvailability["IN_STOCK"] = "in_stock";
    ProductAvailability["OUT_OF_STOCK"] = "out_of_stock";
    ProductAvailability["MADE_TO_ORDER"] = "made_to_order";
    ProductAvailability["SEASONAL"] = "seasonal";
})(ProductAvailability || (exports.ProductAvailability = ProductAvailability = {}));
class Product extends shared_utils_1.AggregateRoot {
    _productId;
    _name;
    _description;
    _price;
    _categoryId;
    _artisanId;
    _status;
    _availability;
    _variants;
    _images;
    _tags;
    _craftingTimeHours;
    _sustainabilityScore;
    _isCustomizable;
    _materials;
    _dimensions;
    constructor(id, _productId, _name, _description, _price, _categoryId, _artisanId, _status = ProductStatus.DRAFT, _availability = ProductAvailability.IN_STOCK, _variants = [], _images = [], _tags = [], _craftingTimeHours = 0, _sustainabilityScore, _isCustomizable = false, _materials = [], _dimensions, createdAt, updatedAt) {
        super(id);
        this._productId = _productId;
        this._name = _name;
        this._description = _description;
        this._price = _price;
        this._categoryId = _categoryId;
        this._artisanId = _artisanId;
        this._status = _status;
        this._availability = _availability;
        this._variants = _variants;
        this._images = _images;
        this._tags = _tags;
        this._craftingTimeHours = _craftingTimeHours;
        this._sustainabilityScore = _sustainabilityScore;
        this._isCustomizable = _isCustomizable;
        this._materials = _materials;
        this._dimensions = _dimensions;
        if (createdAt)
            this.createdAt = createdAt;
        if (updatedAt)
            this.updatedAt = updatedAt;
    }
    // Factory method para crear nuevo producto
    static create(data) {
        const productId = new product_value_objects_1.ProductId();
        const name = new product_value_objects_1.ProductName(data.name);
        const description = new product_value_objects_1.ProductDescription(data.description);
        const price = new product_value_objects_1.Price(data.price, data.currency);
        const categoryId = new product_value_objects_1.CategoryId(data.categoryId);
        const product = new Product(productId.value, productId, name, description, price, categoryId, data.artisanId, ProductStatus.DRAFT, ProductAvailability.IN_STOCK, [], [], [], data.craftingTimeHours, data.sustainabilityScore, data.isCustomizable || false, data.materials, data.dimensions);
        // Emitir evento de dominio
        product.addDomainEvent(new product_events_1.ProductCreatedEvent(product.id, {
            productId: productId.value,
            name: name.value,
            description: description.value,
            price: price.amount,
            currency: price.currency,
            categoryId: categoryId.value,
            artisanId: data.artisanId,
            craftingTimeHours: data.craftingTimeHours,
            materials: data.materials,
            isCustomizable: data.isCustomizable || false,
            createdAt: product.createdAt,
        }));
        return product;
    }
    // Factory method para reconstruir desde persistencia
    static reconstruct(data) {
        return new Product(data.id, new product_value_objects_1.ProductId(data.productId), new product_value_objects_1.ProductName(data.name), new product_value_objects_1.ProductDescription(data.description), new product_value_objects_1.Price(data.price, data.currency), new product_value_objects_1.CategoryId(data.categoryId), data.artisanId, data.status, data.availability, data.variants.map(v => product_variant_entity_1.ProductVariant.reconstruct(v)), data.images.map(i => product_image_entity_1.ProductImage.reconstruct(i)), data.tags.map(t => product_tag_entity_1.ProductTag.reconstruct(t)), data.craftingTimeHours, data.sustainabilityScore, data.isCustomizable, data.materials, data.dimensions, data.createdAt, data.updatedAt);
    }
    // Getters
    get productId() {
        return this._productId.value;
    }
    get name() {
        return this._name.value;
    }
    get description() {
        return this._description.value;
    }
    get price() {
        return {
            amount: this._price.amount,
            currency: this._price.currency,
        };
    }
    get categoryId() {
        return this._categoryId.value;
    }
    get artisanId() {
        return this._artisanId;
    }
    get status() {
        return this._status;
    }
    get availability() {
        return this._availability;
    }
    get variants() {
        return [...this._variants];
    }
    get images() {
        return [...this._images];
    }
    get tags() {
        return [...this._tags];
    }
    get craftingTimeHours() {
        return this._craftingTimeHours;
    }
    get sustainabilityScore() {
        return this._sustainabilityScore;
    }
    get isCustomizable() {
        return this._isCustomizable;
    }
    get materials() {
        return [...this._materials];
    }
    get dimensions() {
        return this._dimensions ? { ...this._dimensions } : undefined;
    }
    // Métodos de negocio
    updateBasicInfo(data) {
        const oldData = {
            name: this._name.value,
            description: this._description.value,
            price: this._price.amount,
            currency: this._price.currency,
        };
        if (data.name) {
            this._name = new product_value_objects_1.ProductName(data.name);
        }
        if (data.description) {
            this._description = new product_value_objects_1.ProductDescription(data.description);
        }
        if (data.price && data.currency) {
            this._price = new product_value_objects_1.Price(data.price, data.currency);
        }
        this.touch();
        this.addDomainEvent(new product_events_1.ProductUpdatedEvent(this.id, {
            productId: this._productId.value,
            changedFields: Object.keys(data),
            oldValues: oldData,
            newValues: {
                name: this._name.value,
                description: this._description.value,
                price: this._price.amount,
                currency: this._price.currency,
            },
            updatedAt: this.updatedAt,
        }));
    }
    addVariant(variantData) {
        const variant = product_variant_entity_1.ProductVariant.create({
            productId: this.id,
            name: variantData.name,
            description: variantData.description,
            price: variantData.price || this._price.amount,
            currency: variantData.currency || this._price.currency,
            sku: variantData.sku,
            attributes: variantData.attributes,
        });
        this._variants.push(variant);
        this.touch();
        this.addDomainEvent(new product_events_1.ProductVariantAddedEvent(this.id, {
            productId: this._productId.value,
            variantId: variant.id,
            variantName: variant.name,
            variantPrice: variant.price,
            attributes: variant.attributes,
            addedAt: new Date(),
        }));
    }
    addImage(imageData) {
        // Si es imagen primaria, quitar primary de las demás
        if (imageData.isPrimary) {
            this._images.forEach(img => img.setPrimary(false));
        }
        const image = product_image_entity_1.ProductImage.create({
            productId: this.id,
            url: imageData.url,
            altText: imageData.altText || this._name.value,
            isPrimary: imageData.isPrimary || this._images.length === 0,
            sortOrder: imageData.sortOrder || this._images.length,
        });
        this._images.push(image);
        this.touch();
    }
    addTag(tagName) {
        // Verificar que el tag no existe ya
        const existingTag = this._tags.find(tag => tag.name === tagName);
        if (existingTag)
            return;
        const tag = product_tag_entity_1.ProductTag.create({
            productId: this.id,
            name: tagName,
        });
        this._tags.push(tag);
        this.touch();
    }
    activate() {
        if (this._status === ProductStatus.ACTIVE) {
            throw new Error('Product is already active');
        }
        this._status = ProductStatus.ACTIVE;
        this.touch();
    }
    deactivate(reason) {
        if (this._status === ProductStatus.INACTIVE) {
            throw new Error('Product is already inactive');
        }
        this._status = ProductStatus.INACTIVE;
        this.touch();
        this.addDomainEvent(new product_events_1.ProductDeactivatedEvent(this.id, {
            productId: this._productId.value,
            reason: reason || 'Manual deactivation',
            deactivatedAt: new Date(),
        }));
    }
    setAvailability(availability) {
        this._availability = availability;
        this.touch();
    }
    updateCraftingInfo(data) {
        if (data.craftingTimeHours !== undefined) {
            this._craftingTimeHours = data.craftingTimeHours;
        }
        if (data.materials) {
            this._materials = [...data.materials];
        }
        if (data.sustainabilityScore !== undefined) {
            this._sustainabilityScore = data.sustainabilityScore;
        }
        if (data.isCustomizable !== undefined) {
            this._isCustomizable = data.isCustomizable;
        }
        this.touch();
    }
    // Método para persistencia
    toPersistence() {
        return {
            id: this.id,
            productId: this._productId.value,
            name: this._name.value,
            description: this._description.value,
            price: this._price.amount,
            currency: this._price.currency,
            categoryId: this._categoryId.value,
            artisanId: this._artisanId,
            status: this._status,
            availability: this._availability,
            craftingTimeHours: this._craftingTimeHours,
            sustainabilityScore: this._sustainabilityScore,
            isCustomizable: this._isCustomizable,
            materials: this._materials,
            dimensions: this._dimensions,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.Product = Product;
//# sourceMappingURL=product.aggregate.js.map