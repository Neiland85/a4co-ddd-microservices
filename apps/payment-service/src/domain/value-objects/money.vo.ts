import { ValueObject } from '../base-classes';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'MXN' | 'CAD';

export class Money extends ValueObject<{ amount: number; currency: Currency }> {
  private static readonly VALID_CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'MXN', 'CAD'];
  private static readonly MIN_AMOUNT = 0;
  private static readonly MAX_AMOUNT = 1000000;

  constructor(amount: number, currency: Currency = 'USD') {
    super({ amount, currency });
    this.validate(amount, currency);
  }

  private validate(amount: number, currency: Currency): void {
    if (amount < Money.MIN_AMOUNT) {
      throw new Error(`Amount cannot be negative. Received: ${amount}`);
    }
    if (amount === 0) {
      throw new Error('Amount cannot be zero');
    }
    if (amount > Money.MAX_AMOUNT) {
      throw new Error(`Amount exceeds maximum allowed: ${Money.MAX_AMOUNT}`);
    }
    if (!Money.VALID_CURRENCIES.includes(currency)) {
      throw new Error(
        `Invalid currency: ${currency}. Valid currencies: ${Money.VALID_CURRENCIES.join(', ')}`
      );
    }
  }

  get amount(): number {
    return this.value.amount;
  }

  get currency(): Currency {
    return this.value.currency;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot add different currencies: ${this.currency} + ${other.currency}`);
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot subtract different currencies: ${this.currency} - ${other.currency}`
      );
    }
    if (this.amount < other.amount) {
      throw new Error(`Cannot subtract ${other.amount} from ${this.amount}`);
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
      throw new Error(`Cannot compare different currencies: ${this.currency} vs ${other.currency}`);
    }
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot compare different currencies: ${this.currency} vs ${other.currency}`);
    }
    return this.amount < other.amount;
  }

  toJSON(): { amount: number; currency: Currency } {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}
