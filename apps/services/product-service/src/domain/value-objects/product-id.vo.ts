import { ValueObject } from '@a4co/shared-utils';

export class ProductId extends ValueObject<string> {
  static create(value?: string): ProductId {
    return new ProductId(value ?? crypto.randomUUID());
  }

  toString(): string {
    return this.value as string;
  }
}
