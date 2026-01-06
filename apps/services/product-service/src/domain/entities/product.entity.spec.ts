
import { Money, ProductImage, ProductSpecification, Dimensions, ProductVariant, Product, ProductStatus, ProductAvailability, ImageType, SpecificationType } from './product.entity';

describe('Money', () => {
  it('should create a valid Money object', () => {
    const money = new Money(100, 'USD');
    expect(money.amount).toBe(100);
    expect(money.currency).toBe('USD');
  });

  it('should throw an error for a negative amount', () => {
    expect(() => new Money(-10, 'USD')).toThrow('Money amount cannot be negative');
  });

  it('should throw an error for an invalid currency', () => {
    expect(() => new Money(100, 'US')).toThrow('Currency must be a valid 3-letter code');
  });

  it('should correctly identify equal Money objects', () => {
    const moneyA = new Money(100, 'USD');
    const moneyB = new Money(100, 'USD');
    expect(moneyA.equals(moneyB)).toBe(true);
  });

  it('should correctly identify unequal Money objects', () => {
    const moneyA = new Money(100, 'USD');
    const moneyB = new Money(101, 'USD');
    const moneyC = new Money(100, 'EUR');
    expect(moneyA.equals(moneyB)).toBe(false);
    expect(moneyA.equals(moneyC)).toBe(false);
  });

  it('should add two Money objects of the same currency', () => {
    const moneyA = new Money(100, 'USD');
    const moneyB = new Money(50, 'USD');
    const result = moneyA.add(moneyB);
    expect(result.amount).toBe(150);
    expect(result.currency).toBe('USD');
  });

  it('should throw an error when adding different currencies', () => {
    const moneyA = new Money(100, 'USD');
    const moneyB = new Money(50, 'EUR');
    expect(() => moneyA.add(moneyB)).toThrow('Cannot add different currencies');
  });

  it('should multiply a Money object by a factor', () => {
    const money = new Money(100, 'USD');
    const result = money.multiply(1.5);
    expect(result.amount).toBe(150);
    expect(result.currency).toBe('USD');
  });

  it('should correctly compare two Money objects', () => {
    const moneyA = new Money(100, 'USD');
    const moneyB = new Money(50, 'USD');
    expect(moneyA.isGreaterThan(moneyB)).toBe(true);
    expect(moneyB.isGreaterThan(moneyA)).toBe(false);
  });

  it('should throw an error when comparing different currencies', () => {
    const moneyA = new Money(100, 'USD');
    const moneyB = new Money(50, 'EUR');
    expect(() => moneyA.isGreaterThan(moneyB)).toThrow('Cannot compare different currencies');
  });
});

describe('ProductImage', () => {
  it('should create a valid ProductImage object', () => {
    const image = new ProductImage('https://example.com/image.jpg', 'alt text', ImageType.GALLERY, true, 1);
    expect(image.url).toBe('https://example.com/image.jpg');
    expect(image.altText).toBe('alt text');
    expect(image.type).toBe(ImageType.GALLERY);
    expect(image.isPrimary).toBe(true);
    expect(image.sortOrder).toBe(1);
  });

  it('should throw an error for an invalid URL', () => {
    expect(() => new ProductImage('invalid-url')).toThrow('Invalid image URL');
  });
});

describe('ProductSpecification', () => {
  it('should create a valid ProductSpecification object', () => {
    const spec = new ProductSpecification('Weight', '1kg', SpecificationType.TEXT, 'kg', 'General');
    expect(spec.name).toBe('Weight');
    expect(spec.value).toBe('1kg');
    expect(spec.type).toBe(SpecificationType.TEXT);
    expect(spec.unit).toBe('kg');
    expect(spec.category).toBe('General');
  });

  it('should throw an error for an empty name', () => {
    expect(() => new ProductSpecification(' ', 'value')).toThrow('Specification name cannot be empty');
  });

  it('should throw an error for an empty value', () => {
    expect(() => new ProductSpecification('name', ' ')).toThrow('Specification value cannot be empty');
  });
});

describe('Dimensions', () => {
  it('should create a valid Dimensions object', () => {
    const dims = new Dimensions(10, 20, 30, 'cm');
    expect(dims.length).toBe(10);
    expect(dims.width).toBe(20);
    expect(dims.height).toBe(30);
    expect(dims.unit).toBe('cm');
  });

  it('should throw an error for non-positive dimensions', () => {
    expect(() => new Dimensions(0, 20, 30)).toThrow('Dimensions must be positive numbers');
    expect(() => new Dimensions(10, -5, 30)).toThrow('Dimensions must be positive numbers');
  });

  it('should calculate the correct volume', () => {
    const dims = new Dimensions(2, 3, 4);
    expect(dims.volume()).toBe(24);
  });
});

describe('ProductVariant', () => {
  let price: Money;

  beforeEach(() => {
    price = new Money(100, 'USD');
  });

  it('should create a valid ProductVariant object', () => {
    const variant = new ProductVariant('1', 'Variant 1', 'SKU001', price, { color: 'red' }, 10, 1, new Dimensions(1, 2, 3), true, true);
    expect(variant.id).toBe('1');
    expect(variant.name).toBe('Variant 1');
    expect(variant.sku).toBe('SKU001');
    expect(variant.price).toEqual(price);
    expect(variant.attributes).toEqual({ color: 'red' });
    expect(variant.stockQuantity).toBe(10);
    expect(variant.weight).toBe(1);
    expect(variant.dimensions).toBeInstanceOf(Dimensions);
    expect(variant.isActive).toBe(true);
    expect(variant.isDefault).toBe(true);
  });

  it('should throw an error for an empty name', () => {
    expect(() => new ProductVariant('1', ' ', 'SKU001', price, {})).toThrow('Variant name cannot be empty');
  });

  it('should throw an error for an empty SKU', () => {
    expect(() => new ProductVariant('1', 'Variant 1', ' ', price, {})).toThrow('Variant SKU cannot be empty');
  });

  it('should throw an error for a negative stock quantity', () => {
    expect(() => new ProductVariant('1', 'Variant 1', 'SKU001', price, {}, -1)).toThrow('Stock quantity cannot be negative');
  });

  it('should update the price', () => {
    const variant = new ProductVariant('1', 'Variant 1', 'SKU001', price, {});
    const newPrice = new Money(120, 'USD');
    variant.updatePrice(newPrice);
    expect(variant.price).toEqual(newPrice);
  });

  it('should update the stock quantity', () => {
    const variant = new ProductVariant('1', 'Variant 1', 'SKU001', price, {}, 10);
    variant.updateStock(20);
    expect(variant.stockQuantity).toBe(20);
  });

  it('should throw an error when updating with negative stock', () => {
    const variant = new ProductVariant('1', 'Variant 1', 'SKU001', price, {});
    expect(() => variant.updateStock(-5)).toThrow('Stock quantity cannot be negative');
  });

  it('should activate and deactivate', () => {
    const variant = new ProductVariant('1', 'Variant 1', 'SKU001', price, {});
    variant.deactivate();
    expect(variant.isActive).toBe(false);
    variant.activate();
    expect(variant.isActive).toBe(true);
  });

  it('should check if it is in stock', () => {
    const variant = new ProductVariant('1', 'Variant 1', 'SKU001', price, {}, 10);
    expect(variant.isInStock()).toBe(true);
    variant.updateStock(0);
    expect(variant.isInStock()).toBe(false);
    variant.updateStock(10);
    variant.deactivate();
    expect(variant.isInStock()).toBe(false);
  });
});

describe('Product', () => {
  let price: Money;

  beforeEach(() => {
    price = new Money(100, 'USD');
  });

  it('should create a valid Product object', () => {
    const product = new Product('1', 'Product 1', 'Description', 'SKU001', price, 'artisan1', 'category1', 'product-1');
    expect(product.id).toBe('1');
    expect(product.name).toBe('Product 1');
    expect(product.status).toBe(ProductStatus.DRAFT);
    expect(product.availability).toBe(ProductAvailability.AVAILABLE);
    expect(product.domainEvents.length).toBe(1);
  });

  it('should throw an error for an empty name', () => {
    expect(() => new Product('1', ' ', 'Description', 'SKU001', price, 'artisan1', 'category1', 'product-1')).toThrow('Product name cannot be empty');
  });

  it('should publish a product', () => {
    const product = new Product('1', 'Product 1', 'Description', 'SKU001', price, 'artisan1', 'category1', 'product-1');
    product.addImage(new ProductImage('https://example.com/image.jpg'));
    product.publish();
    expect(product.status).toBe(ProductStatus.PUBLISHED);
    expect(product.domainEvents.length).toBe(2);
  });

  it('should not publish a product without an image', () => {
    const product = new Product('1', 'Product 1', 'Description', 'SKU001', price, 'artisan1', 'category1', 'product-1');
    expect(() => product.publish()).toThrow('Product must have at least one image to be published');
  });

  it('should archive a product', () => {
    const product = new Product('1', 'Product 1', 'Description', 'SKU001', price, 'artisan1', 'category1', 'product-1');
    product.archive();
    expect(product.status).toBe(ProductStatus.ARCHIVED);
    expect(product.availability).toBe(ProductAvailability.DISCONTINUED);
  });

  it('should update the price', () => {
    const product = new Product('1', 'Product 1', 'Description', 'SKU001', price, 'artisan1', 'category1', 'product-1');
    const newPrice = new Money(120, 'USD');
    product.updatePrice(newPrice);
    expect(product.price).toEqual(newPrice);
    expect(product.domainEvents.length).toBe(2);
  });

  it('should add and remove a variant', () => {
    const product = new Product('1', 'Product 1', 'Description', 'SKU001', price, 'artisan1', 'category1', 'product-1');
    const variant = new ProductVariant('v1', 'Variant', 'SKU002', price, {});
    product.addVariant(variant);
    expect(product.variants.length).toBe(1);
    product.removeVariant('v1');
    expect(product.variants.length).toBe(0);
  });
});
