export class StockQuantity {
  constructor(private readonly _value: number) {
    if (_value < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    if (!Number.isInteger(_value)) {
      throw new Error('Stock quantity must be an integer');
    }
  }

  get value(): number {
    return this._value;
  }

  equals(other: StockQuantity): boolean {
    return this._value === other._value;
  }

  isGreaterThan(other: StockQuantity): boolean {
    return this._value > other._value;
  }

  isGreaterThanOrEqual(other: StockQuantity): boolean {
    return this._value >= other._value;
  }

  isLessThan(other: StockQuantity): boolean {
    return this._value < other._value;
  }

  isLessThanOrEqual(other: StockQuantity): boolean {
    return this._value <= other._value;
  }

  add(other: StockQuantity): StockQuantity {
    return new StockQuantity(this._value + other._value);
  }

  subtract(other: StockQuantity): StockQuantity {
    if (this._value < other._value) {
      throw new Error('Cannot subtract: result would be negative');
    }
    return new StockQuantity(this._value - other._value);
  }

  multiply(factor: number): StockQuantity {
    if (factor < 0) {
      throw new Error('Multiplication factor cannot be negative');
    }
    return new StockQuantity(Math.floor(this._value * factor));
  }

  isZero(): boolean {
    return this._value === 0;
  }

  toString(): string {
    return this._value.toString();
  }

  static create(value: number): StockQuantity {
    return new StockQuantity(value);
  }

  static zero(): StockQuantity {
    return new StockQuantity(0);
  }
}
