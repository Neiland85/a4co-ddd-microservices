import { ValueObject } from '@a4co/shared-utils';

export interface MoneyPrimitives {
  amount: number;
  currency: string;
}

const ISO_CURRENCY_REGEX = /^[A-Z]{3}$/;

export class Money extends ValueObject<MoneyPrimitives> {
  private static readonly MIN_AMOUNT = 0.01;

  private constructor(amount: number, currency: string) {
    Money.ensureValidAmount(amount);
    Money.ensureValidCurrency(currency);

    const normalizedCurrency = currency.toUpperCase();
    const roundedAmount = Money.round(amount);

    super({ amount: roundedAmount, currency: normalizedCurrency });
  }

  public static create(amount: number, currency: string = 'USD'): Money {
    return new Money(amount, currency);
  }

  public static fromPrimitives(primitives: MoneyPrimitives): Money {
    return Money.create(primitives.amount, primitives.currency);
  }

  public get amount(): number {
    return this.value.amount;
  }

  public get currency(): string {
    return this.value.currency;
  }

  public add(other: Money): Money {
    this.ensureSameCurrency(other);
    return Money.create(this.amount + other.amount, this.currency);
  }

  public subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    const result = this.amount - other.amount;
    if (result < Money.MIN_AMOUNT) {
      throw new Error('Resulting money amount cannot be less than minimum allowed');
    }
    return Money.create(result, this.currency);
  }

  public multiply(multiplier: number): Money {
    if (multiplier <= 0) {
      throw new Error('Money multiplier must be greater than zero');
    }

    return Money.create(this.amount * multiplier, this.currency);
  }

  public equals(other: Money): boolean {
    return this.currency === other.currency && this.amount === other.amount;
  }

  public toPrimitives(): MoneyPrimitives {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }

  private static ensureValidAmount(amount: number): void {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
      throw new Error('Money amount must be a valid number');
    }

    if (!Number.isFinite(amount)) {
      throw new Error('Money amount must be finite');
    }

    if (amount < Money.MIN_AMOUNT) {
      throw new Error('Money amount must be greater than zero');
    }
  }

  private static ensureValidCurrency(currency: string): void {
    if (!currency || !ISO_CURRENCY_REGEX.test(currency.toUpperCase())) {
      throw new Error('Currency must be a valid ISO 4217 3-letter code');
    }
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error('Money operations require matching currencies');
    }
  }

  private static round(amount: number): number {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
  }
}

