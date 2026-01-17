export class ProductId {
  private constructor(private readonly value: string) {}

  static fromString(value: string): ProductId {
    if (!value || value.trim() === '') {
      throw new Error('ProductId cannot be empty');
    }
    return new ProductId(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: ProductId): boolean {
    return this.value === other.value;
  }
}
