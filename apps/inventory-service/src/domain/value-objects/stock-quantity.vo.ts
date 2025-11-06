export class StockQuantity {
  constructor(public readonly value: number) {
    if (value < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Stock quantity must be an integer');
    }
  }

  equals(other: StockQuantity): boolean {
    return this.value === other.value;
  }

  isGreaterThan(other: StockQuantity): boolean {
    return this.value > other.value;
  }

  isGreaterThanOrEqual(other: StockQuantity): boolean {
    return this.value >= other.value;
  }

  isLessThan(other: StockQuantity): boolean {
    return this.value < other.value;
  }

  isLessThanOrEqual(other: StockQuantity): boolean {
    return this.value <= other.value;
  }

  add(other: StockQuantity): StockQuantity {
    return new StockQuantity(this.value + other.value);
  }

  subtract(other: StockQuantity): StockQuantity {
    if (this.value < other.value) {
      throw new Error('Cannot subtract: result would be negative');
    }
    return new StockQuantity(this.value - other.value);
  }

  multiply(factor: number): StockQuantity {
    if (factor < 0) {
      throw new Error('Multiplication factor cannot be negative');
    }
    return new StockQuantity(Math.floor(this.value * factor));
  }

  toString(): string {
    return this.value.toString();
  }

  static create(value: number): StockQuantity {
    return new StockQuantity(value);
  }

  static zero(): StockQuantity {
    return new StockQuantity(0);
  }
}
