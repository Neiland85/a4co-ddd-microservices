export class SKU {
  private static readonly SKU_PATTERN = /^[A-Z]{3}-[0-9]{4}$/;

  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('SKU cannot be empty');
    }
    if (!SKU.SKU_PATTERN.test(value)) {
      throw new Error(`SKU must match pattern [A-Z]{3}-[0-9]{4}. Example: INV-1234`);
    }
  }

  equals(other: SKU): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static create(value: string): SKU {
    return new SKU(value);
  }

  static isValid(value: string): boolean {
    return SKU.SKU_PATTERN.test(value);
  }
}
