/**
 * Quantity Value Object
 * Represents a stock quantity
 * 
 * @invariant value must be non-negative integer
 */
export class Quantity {
  private constructor(public readonly value: number) {
    this.validate();
  }

  static create(value: number): Quantity {
    return new Quantity(value);
  }

  static zero(): Quantity {
    return new Quantity(0);
  }

  private validate(): void {
    if (this.value < 0) {
      throw new Error('Quantity cannot be negative');
    }

    if (!Number.isInteger(this.value)) {
      throw new Error('Quantity must be an integer');
    }
  }

  add(other: Quantity): Quantity {
    return Quantity.create(this.value + other.value);
  }

  subtract(other: Quantity): Quantity {
    if (this.value < other.value) {
      throw new Error('Cannot subtract to negative quantity');
    }
    return Quantity.create(this.value - other.value);
  }

  isZero(): boolean {
    return this.value === 0;
  }

  isAvailable(required: Quantity): boolean {
    return this.value >= required.value;
  }

  equals(other: Quantity): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
