import { v4 as uuidv4 } from 'uuid';

/**
 * ProductId Value Object
 */
export class ProductId {
  private constructor(public readonly value: string) {
    this.validate();
  }

  static create(value: string): ProductId {
    return new ProductId(value);
  }

  static generate(): ProductId {
    return new ProductId(uuidv4());
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('ProductId cannot be empty');
    }
  }

  equals(other: ProductId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
