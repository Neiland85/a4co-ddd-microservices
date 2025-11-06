export class SKU {
  private static readonly SKU_PATTERN = /^[A-Z]{3}-[0-9]{4}$/;

  constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('SKU cannot be empty');
    }
    if (!SKU.SKU_PATTERN.test(_value)) {
      throw new Error(`SKU must match pattern [A-Z]{3}-[0-9]{4}. Received: ${_value}`);
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: SKU): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static create(value: string): SKU {
    return new SKU(value);
  }

  static isValid(value: string): boolean {
    return SKU.SKU_PATTERN.test(value);
  }
}
