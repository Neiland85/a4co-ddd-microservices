import { ValueObject } from '../shared/ValueObject';
import { Result } from '../shared/Result';

interface MoneyProps {
  amount: number;
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  private static readonly SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'MXN'];

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  private constructor(props: MoneyProps) {
    super(props);
  }

  public static create(props: MoneyProps): Result<Money> {
    if (props.amount < 0) {
      return Result.fail<Money>('Amount cannot be negative');
    }

    if (!this.SUPPORTED_CURRENCIES.includes(props.currency)) {
      return Result.fail<Money>(`Currency ${props.currency} is not supported`);
    }

    // Redondear a 2 decimales
    const roundedAmount = Math.round(props.amount * 100) / 100;

    return Result.ok<Money>(
      new Money({
        amount: roundedAmount,
        currency: props.currency,
      })
    );
  }

  public add(money: Money): Result<Money> {
    if (this.currency !== money.currency) {
      return Result.fail<Money>('Cannot add money with different currencies');
    }

    return Money.create({
      amount: this.amount + money.amount,
      currency: this.currency,
    });
  }

  public subtract(money: Money): Result<Money> {
    if (this.currency !== money.currency) {
      return Result.fail<Money>('Cannot subtract money with different currencies');
    }

    return Money.create({
      amount: this.amount - money.amount,
      currency: this.currency,
    });
  }

  public multiply(factor: number): Result<Money> {
    return Money.create({
      amount: this.amount * factor,
      currency: this.currency,
    });
  }

  public isGreaterThan(money: Money): boolean {
    if (this.currency !== money.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount > money.amount;
  }

  public isLessThan(money: Money): boolean {
    if (this.currency !== money.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount < money.amount;
  }

  public equals(money: Money): boolean {
    return this.currency === money.currency && this.amount === money.amount;
  }

  public toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}
