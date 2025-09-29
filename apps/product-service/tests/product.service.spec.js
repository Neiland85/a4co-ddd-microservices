"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_value_objects_1 = require("../src/domain/value-objects/product-value-objects");
describe('Product Value Objects', () => {
    describe('ProductId', () => {
        it('should create a ProductId with provided value', () => {
            const id = 'test-product-id';
            const productId = product_value_objects_1.ProductId.fromString(id);
            expect(productId.value).toBe(id);
        });
        it('should generate UUID when no value provided', () => {
            const productId = new product_value_objects_1.ProductId();
            expect(productId.value).toBeDefined();
            expect(typeof productId.value).toBe('string');
            expect(productId.value.length).toBeGreaterThan(0);
        });
        it('should throw error for empty ProductId', () => {
            expect(() => product_value_objects_1.ProductId.fromString('')).toThrow('ProductId cannot be empty');
            expect(() => product_value_objects_1.ProductId.fromString('   ')).toThrow('ProductId cannot be empty');
        });
    });
    describe('ProductName', () => {
        it('should create a valid ProductName', () => {
            const name = 'Test Product Name';
            const productName = new product_value_objects_1.ProductName(name);
            expect(productName.value).toBe(name);
        });
        it('should trim whitespace', () => {
            const name = '  Test Product  ';
            const productName = new product_value_objects_1.ProductName(name);
            expect(productName.value).toBe('Test Product');
        });
        it('should throw error for empty name', () => {
            expect(() => new product_value_objects_1.ProductName('')).toThrow('Product name cannot be empty');
            expect(() => new product_value_objects_1.ProductName('   ')).toThrow('Product name cannot be empty');
        });
        it('should throw error for name too long', () => {
            const longName = 'a'.repeat(201);
            expect(() => new product_value_objects_1.ProductName(longName)).toThrow('Product name cannot exceed 200 characters');
        });
    });
    describe('ProductDescription', () => {
        it('should create a valid ProductDescription', () => {
            const description = 'Test product description';
            const productDesc = new product_value_objects_1.ProductDescription(description);
            expect(productDesc.value).toBe(description);
        });
        it('should trim whitespace', () => {
            const description = '  Test description  ';
            const productDesc = new product_value_objects_1.ProductDescription(description);
            expect(productDesc.value).toBe('Test description');
        });
        it('should throw error for empty description', () => {
            expect(() => new product_value_objects_1.ProductDescription('')).toThrow('Product description cannot be empty');
        });
        it('should throw error for description too long', () => {
            const longDesc = 'a'.repeat(2001);
            expect(() => new product_value_objects_1.ProductDescription(longDesc)).toThrow('Product description cannot exceed 2000 characters');
        });
    });
    describe('Price', () => {
        it('should create a valid Price', () => {
            const amount = 99.99;
            const currency = 'EUR';
            const price = new product_value_objects_1.Price(amount, currency);
            expect(price.value.amount).toBe(amount);
            expect(price.value.currency).toBe(currency);
        });
        it('should convert currency to uppercase', () => {
            const price = new product_value_objects_1.Price(50, 'eur');
            expect(price.value.currency).toBe('EUR');
        });
        it('should throw error for negative amount', () => {
            expect(() => new product_value_objects_1.Price(-10, 'EUR')).toThrow('Price amount cannot be negative');
        });
        it('should throw error for invalid currency length', () => {
            expect(() => new product_value_objects_1.Price(100, 'EURO')).toThrow('Currency must be a valid 3-letter code');
            expect(() => new product_value_objects_1.Price(100, 'EU')).toThrow('Currency must be a valid 3-letter code');
            expect(() => new product_value_objects_1.Price(100, '')).toThrow('Currency must be a valid 3-letter code');
        });
    });
});
//# sourceMappingURL=product.service.spec.js.map