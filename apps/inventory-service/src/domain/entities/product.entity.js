"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    _id;
    _name;
    _description;
    _sku;
    _category;
    _brand;
    _unitPrice;
    _currency;
    _currentStock;
    _reservedStock;
    _minimumStock;
    _maximumStock;
    _isActive;
    _artisanId;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._name = props.name;
        this._description = props.description;
        this._sku = props.sku;
        this._category = props.category;
        this._brand = props.brand;
        this._unitPrice = props.unitPrice;
        this._currency = props.currency;
        this._currentStock = props.currentStock;
        this._reservedStock = props.reservedStock;
        this._minimumStock = props.minimumStock;
        this._maximumStock = props.maximumStock;
        this._isActive = props.isActive;
        this._artisanId = props.artisanId;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    // Getters
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get sku() {
        return this._sku;
    }
    get category() {
        return this._category;
    }
    get brand() {
        return this._brand;
    }
    get unitPrice() {
        return this._unitPrice;
    }
    get currency() {
        return this._currency;
    }
    get currentStock() {
        return this._currentStock;
    }
    get reservedStock() {
        return this._reservedStock;
    }
    get minimumStock() {
        return this._minimumStock;
    }
    get maximumStock() {
        return this._maximumStock;
    }
    get isActive() {
        return this._isActive;
    }
    get artisanId() {
        return this._artisanId;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    // Computed properties
    get availableStock() {
        return this._currentStock - this._reservedStock;
    }
    get stockStatus() {
        if (!this._isActive)
            return 'discontinued';
        if (this.availableStock <= 0)
            return 'out_of_stock';
        if (this.availableStock <= this._minimumStock)
            return 'low_stock';
        return 'in_stock';
    }
    get needsRestock() {
        return this.availableStock <= this._minimumStock;
    }
    // Business logic methods
    canReserveStock(quantity) {
        return this._isActive && this.availableStock >= quantity;
    }
    reserveStock(quantity) {
        if (!this.canReserveStock(quantity)) {
            throw new Error(`Cannot reserve ${quantity} units. Available: ${this.availableStock}`);
        }
        this._reservedStock += quantity;
        this._updatedAt = new Date();
    }
    releaseStock(quantity) {
        if (this._reservedStock < quantity) {
            throw new Error(`Cannot release ${quantity} units. Reserved: ${this._reservedStock}`);
        }
        this._reservedStock -= quantity;
        this._updatedAt = new Date();
    }
    updateStock(newStock, reason) {
        if (newStock < 0) {
            throw new Error('Stock cannot be negative');
        }
        this._currentStock = newStock;
        this._updatedAt = new Date();
    }
    adjustStock(adjustment, reason) {
        const newStock = this._currentStock + adjustment;
        this.updateStock(newStock, reason);
    }
    deactivate() {
        this._isActive = false;
        this._updatedAt = new Date();
    }
    activate() {
        this._isActive = true;
        this._updatedAt = new Date();
    }
    updatePricing(newPrice, newCurrency) {
        if (newPrice < 0) {
            throw new Error('Price cannot be negative');
        }
        this._unitPrice = newPrice;
        if (newCurrency) {
            this._currency = newCurrency;
        }
        this._updatedAt = new Date();
    }
    // Static factory methods
    static create(props) {
        const now = new Date();
        return new Product({
            ...props,
            id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: now,
            updatedAt: now,
        });
    }
    static reconstruct(props) {
        return new Product(props);
    }
    // Serialization
    toJSON() {
        return {
            id: this._id,
            name: this._name,
            description: this._description,
            sku: this._sku,
            category: this._category,
            brand: this._brand,
            unitPrice: this._unitPrice,
            currency: this._currency,
            currentStock: this._currentStock,
            reservedStock: this._reservedStock,
            minimumStock: this._minimumStock,
            maximumStock: this._maximumStock,
            isActive: this._isActive,
            artisanId: this._artisanId,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map