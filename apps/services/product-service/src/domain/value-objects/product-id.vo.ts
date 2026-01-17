import { ValueObject } from '@a4co/shared-utils';

export class ProductId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public static fromString(value: string): ProductId {
    if (!value || value.trim().length === 0) {
      throw new Error('ProductId cannot be empty');
    }
    return new ProductId(value);
  }

  public toString(): string {
    return this.props.value;
  }
}
