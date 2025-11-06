export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'EUR'
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
    // Validar que el amount tenga máximo 2 decimales
    if (Math.round(amount * 100) !== amount * 100) {
      throw new Error('Money amount cannot have more than 2 decimal places');
    }
  }

  equals(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this.amount === other.amount;
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
      throw new Error('Result cannot be negative');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Factor cannot be negative');
    }
    return new Money(Math.round(this.amount * factor * 100) / 100, this.currency);
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

  toJSON(): { amount: number; currency: string } {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}
