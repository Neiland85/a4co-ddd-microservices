import { v4 as uuidv4 } from 'uuid';
import { ValueObject } from '@a4co/shared-utils';

export class ProductId extends ValueObject<string> {
  constructor(value?: string) {
    super(value || uuidv4());
  }

  public static fromString(value: string): ProductId {
    if (!value || value.trim().length === 0) {
      throw new Error('ProductId cannot be empty');
    }
    return new ProductId(value);
  }
}

export class ProductName extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (value.length > 200) {
      throw new Error('Product name cannot exceed 200 characters');
    }
    super(value.trim());
  }
}

export class ProductDescription extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Product description cannot be empty');
    }
    if (value.length > 2000) {
      throw new Error('Product description cannot exceed 2000 characters');
    }
    super(value.trim());
  }
}

export class Price extends ValueObject<{ amount: number; currency: string }> {
  constructor(amount: number, currency: string) {
    if (amount < 0) {
      throw new Error('Price amount cannot be negative');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a valid 3-letter code');
    }
    super({ amount, currency: currency.toUpperCase() });
  }

  public get amount(): number {
    return this.value.amount;
  }

  public get currency(): string {
    return this.value.currency;
  }

  public add(other: Price): Price {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return new Price(this.amount + other.amount, this.currency);
  }

  public multiply(factor: number): Price {
    return new Price(this.amount * factor, this.currency);
  }

  public withTax(taxRate: number = 0.21): Price {
    return new Price(this.amount * (1 + taxRate), this.currency);
  }
}

export class Stock extends ValueObject<number> {
  constructor(value: number) {
    if (value < 0) {
      throw new Error('Stock cannot be negative');
    }
    super(value);
  }

  public add(quantity: number): Stock {
    return new Stock(this.value + quantity);
  }

  public subtract(quantity: number): Stock {
    return new Stock(Math.max(0, this.value - quantity));
  }

  public isLow(threshold: number = 10): boolean {
    return this.value < threshold;
  }

  public isAvailable(): boolean {
    return this.value > 0;
  }
}

export class ProductCategory extends ValueObject<string> {
  private static readonly VALID_CATEGORIES = [
    'ceramics',
    'textiles',
    'jewelry',
    'woodwork',
    'metalwork',
    'glass',
    'leather',
    'other',
  ];

  constructor(value: string) {
    const normalized = value.toLowerCase().trim();
    if (!ProductCategory.VALID_CATEGORIES.includes(normalized)) {
      throw new Error(
        `Invalid category: ${value}. Valid categories: ${ProductCategory.VALID_CATEGORIES.join(', ')}`,
      );
    }
    super(normalized);
  }

  public static getValidCategories(): string[] {
    return [...ProductCategory.VALID_CATEGORIES];
  }
}

export class CategoryId extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('CategoryId cannot be empty');
    }
    super(value);
  }
}

export class Slug extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Slug cannot be empty');
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      throw new Error('Slug must be URL-friendly (lowercase, numbers, hyphens only)');
    }
    if (value.length > 100) {
      throw new Error('Slug cannot exceed 100 characters');
    }
    super(value.toLowerCase());
  }

  public static generateFromName(name: string): Slug {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    return new Slug(slug);
  }
}

export class SKU extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('SKU cannot be empty');
    }
    if (!/^[A-Z0-9-_]+$/i.test(value)) {
      throw new Error('SKU can only contain alphanumeric characters, hyphens, and underscores');
    }
    super(value.toUpperCase());
  }

  public static generate(productId: string, variant?: string): SKU {
    const base = productId.substring(0, 8).toUpperCase();
    const suffix = variant ? `-${variant.toUpperCase()}` : '';
    return new SKU(`${base}${suffix}`);
  }
}
