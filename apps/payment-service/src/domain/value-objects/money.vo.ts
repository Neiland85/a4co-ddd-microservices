export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'USD'
  ) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    if (amount === 0) {
      throw new Error('Money amount cannot be zero');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a valid 3-letter code (ISO 4217)');
    }
    if (!['USD', 'EUR', 'GBP', 'MXN', 'COP'].includes(currency.toUpperCase())) {
      throw new Error(`Unsupported currency: ${currency}`);
    }
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract different currencies');
    }
    if (this.amount < other.amount) {
      throw new Error('Cannot subtract: result would be negative');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Multiplication factor cannot be negative');
    }
    return new Money(this.amount * factor, this.currency);
  }

  isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this.amount < other.amount;
  }

  toCents(): number {
    return Math.round(this.amount * 100);
  }

  static fromCents(cents: number, currency: string = 'USD'): Money {
    return new Money(cents / 100, currency);
  }

  static zero(currency: string = 'USD'): Money {
    return new Money(0.01, currency); // Mínimo permitido (1 centavo)
  }
}
