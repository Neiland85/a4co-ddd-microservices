import { v4 as uuidv4 } from 'uuid';
import { ValueObject } from '../base-classes';

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
}

export class CategoryId extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('CategoryId cannot be empty');
    }
    super(value);
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
}
