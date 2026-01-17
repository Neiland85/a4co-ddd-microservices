import { v4 as uuidv4 } from 'uuid';
import { ValueObject } from '@a4co/shared-utils';

export class ProductId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value?: string): ProductId {
    const finalValue = value ?? uuidv4();
    if (!finalValue || finalValue.trim().length === 0) {
      throw new Error('ProductId cannot be empty');
    }
    return new ProductId(finalValue);
  }

  public static fromString(value: string): ProductId {
    return ProductId.create(value);
  }
}

export class ProductName extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): ProductName {
    if (!value || value.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (value.length > 200) {
      throw new Error('Product name cannot exceed 200 characters');
    }
    return new ProductName(value.trim());
  }
}

export class ProductDescription extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): ProductDescription {
    if (!value || value.trim().length === 0) {
      throw new Error('Product description cannot be empty');
    }
    if (value.length > 2000) {
      throw new Error('Product description cannot exceed 2000 characters');
    }
    return new ProductDescription(value.trim());
  }
}

interface PriceProps {
  amount: number;
  currency: string;
}

export class Price extends ValueObject<PriceProps> {
  private constructor(props: PriceProps) {
    super({ amount: props.amount, currency: props.currency.toUpperCase() });
  }

  public static create(amount: number, currency: string): Price {
    if (amount < 0) {
      throw new Error('Price amount cannot be negative');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a valid 3-letter code');
    }
    return new Price({ amount, currency });
  }

  public get amount(): number {
    return this.value.amount;
  }

  public get currency(): string {
    return this.value.currency;
  }

  public add(other: Price): Price {
    Price.ensureSameCurrency(this, other);
    return Price.create(this.amount + other.amount, this.currency);
  }

  public multiply(factor: number): Price {
    return Price.create(this.amount * factor, this.currency);
  }

  public withTax(taxRate: number = 0.21): Price {
    return Price.create(this.amount * (1 + taxRate), this.currency);
  }

  private static ensureSameCurrency(left: Price, right: Price): void {
    if (left.currency !== right.currency) {
      throw new Error('Cannot operate on prices with different currencies');
    }
  }
}

export class Stock extends ValueObject<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): Stock {
    if (value < 0) {
      throw new Error('Stock cannot be negative');
    }
    return new Stock(value);
  }

  public add(quantity: number): Stock {
    return Stock.create(this.value + quantity);
  }

  public subtract(quantity: number): Stock {
    return Stock.create(Math.max(0, this.value - quantity));
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

  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): ProductCategory {
    const normalized = value.toLowerCase().trim();
    if (!ProductCategory.VALID_CATEGORIES.includes(normalized)) {
      throw new Error(
        `Invalid category: ${value}. Valid categories: ${ProductCategory.VALID_CATEGORIES.join(', ')}`,
      );
    }
    return new ProductCategory(normalized);
  }

  public static getValidCategories(): string[] {
    return [...ProductCategory.VALID_CATEGORIES];
  }
}

export class CategoryId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): CategoryId {
    if (!value || value.trim().length === 0) {
      throw new Error('CategoryId cannot be empty');
    }
    return new CategoryId(value);
  }
}

export class Slug extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): Slug {
    if (!value || value.trim().length === 0) {
      throw new Error('Slug cannot be empty');
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      throw new Error('Slug must be URL-friendly (lowercase, numbers, hyphens only)');
    }
    if (value.length > 100) {
      throw new Error('Slug cannot exceed 100 characters');
    }
    return new Slug(value.toLowerCase());
  }

  public static generateFromName(name: string): Slug {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return Slug.create(slug);
  }
}

export class SKU extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): SKU {
    if (!value || value.trim().length === 0) {
      throw new Error('SKU cannot be empty');
    }
    if (!/^[A-Z0-9-_]+$/i.test(value)) {
      throw new Error('SKU can only contain alphanumeric characters, hyphens, and underscores');
    }
    return new SKU(value.toUpperCase());
  }

  public static generate(productId: string, variant?: string): SKU {
    const base = productId.substring(0, 8).toUpperCase();
    const suffix = variant ? `-${variant.toUpperCase()}` : '';
    return SKU.create(`${base}${suffix}`);
  }
}
