/**
 * Money primitives for serialization/deserialization
 */
export interface MoneyPrimitives {
  amount: number;
  currency: string;
}

/**
 * Money Value Object
 * Represents a monetary amount with currency
 * 
 * @invariant amount must be non-negative
 * @invariant currency must be a valid ISO 4217 code (3 uppercase letters)
 */
export class Money {
  private static readonly VALID_CURRENCIES = new Set([
    'EUR', 'USD', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'SEK', 'NZD'
  ]);

  private constructor(
    public readonly amount: number,
    public readonly currency: string,
  ) {
    this.validate();
  }

  /**
   * Create a Money instance
   */
  static create(amount: number, currency: string = 'EUR'): Money {
    return new Money(amount, currency.toUpperCase());
  }

  /**
   * Create Money from primitives
   */
  static fromPrimitives(primitives: MoneyPrimitives): Money {
    return Money.create(primitives.amount, primitives.currency);
  }

  /**
   * Validate the money value object
   */
  private validate(): void {
    if (this.amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    if (!Money.VALID_CURRENCIES.has(this.currency)) {
      throw new Error(`Invalid currency: ${this.currency}`);
    }
  }

  /**
   * Add money to this amount
   */
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot add different currencies: ${this.currency} and ${other.currency}`);
    }
    return Money.create(this.amount + other.amount, this.currency);
  }

  /**
   * Subtract money from this amount
   */
  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot subtract different currencies: ${this.currency} and ${other.currency}`);
    }
    if (this.amount < other.amount) {
      throw new Error('Cannot subtract to negative amount');
    }
    return Money.create(this.amount - other.amount, this.currency);
  }

  /**
   * Multiply money by a factor
   */
  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Factor cannot be negative');
    }
    return Money.create(this.amount * factor, this.currency);
  }

  /**
   * Check if this money is equal to another
   */
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  /**
   * Check if this money is greater than another
   */
  isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot compare different currencies: ${this.currency} and ${other.currency}`);
    }
    return this.amount > other.amount;
  }

  /**
   * Check if this money is zero
   */
  isZero(): boolean {
    return this.amount === 0;
  }

  /**
   * Convert to primitives for persistence
   */
  toPrimitives(): MoneyPrimitives {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }
}
