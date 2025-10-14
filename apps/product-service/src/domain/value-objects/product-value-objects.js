"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKU = exports.CategoryId = exports.Price = exports.ProductDescription = exports.ProductName = exports.ProductId = void 0;
const shared_utils_1 = require("@a4co/shared-utils");
const uuid_1 = require("uuid");
class ProductId extends shared_utils_1.ValueObject {
    constructor(value) {
        super(value || (0, uuid_1.v4)());
    }
    static fromString(value) {
        if (!value || value.trim().length === 0) {
            throw new Error('ProductId cannot be empty');
        }
        return new ProductId(value);
    }
}
exports.ProductId = ProductId;
class ProductName extends shared_utils_1.ValueObject {
    constructor(value) {
        if (!value || value.trim().length === 0) {
            throw new Error('Product name cannot be empty');
        }
        if (value.length > 200) {
            throw new Error('Product name cannot exceed 200 characters');
        }
        super(value.trim());
    }
}
exports.ProductName = ProductName;
class ProductDescription extends shared_utils_1.ValueObject {
    constructor(value) {
        if (!value || value.trim().length === 0) {
            throw new Error('Product description cannot be empty');
        }
        if (value.length > 2000) {
            throw new Error('Product description cannot exceed 2000 characters');
        }
        super(value.trim());
    }
}
exports.ProductDescription = ProductDescription;
class Price extends shared_utils_1.ValueObject {
    constructor(amount, currency) {
        if (amount < 0) {
            throw new Error('Price amount cannot be negative');
        }
        if (!currency || currency.length !== 3) {
            throw new Error('Currency must be a valid 3-letter code');
        }
        super({ amount, currency: currency.toUpperCase() });
    }
    get amount() {
        return this._value.amount;
    }
    get currency() {
        return this._value.currency;
    }
    add(other) {
        if (this.currency !== other.currency) {
            throw new Error('Cannot add prices with different currencies');
        }
        return new Price(this.amount + other.amount, this.currency);
    }
    multiply(factor) {
        return new Price(this.amount * factor, this.currency);
    }
}
exports.Price = Price;
class CategoryId extends shared_utils_1.ValueObject {
    constructor(value) {
        if (!value || value.trim().length === 0) {
            throw new Error('CategoryId cannot be empty');
        }
        super(value);
    }
}
exports.CategoryId = CategoryId;
class SKU extends shared_utils_1.ValueObject {
    constructor(value) {
        if (!value || value.trim().length === 0) {
            throw new Error('SKU cannot be empty');
        }
        if (!/^[A-Z0-9-_]+$/i.test(value)) {
            throw new Error('SKU can only contain alphanumeric characters, hyphens, and underscores');
        }
        super(value.toUpperCase());
    }
}
exports.SKU = SKU;
//# sourceMappingURL=product-value-objects.js.map