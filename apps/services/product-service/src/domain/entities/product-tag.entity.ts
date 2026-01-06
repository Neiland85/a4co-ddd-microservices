// Temporary ProductTag entity
export class ProductTag {
  constructor(
    public id: string,
    public productId: string,
    public name: string,
    public value?: string,
  ) {}

  static create(data: any): ProductTag {
    return new ProductTag(data.id || 'temp-id', data.productId, data.name, data.value);
  }

  static reconstruct(data: any): ProductTag {
    return new ProductTag(data.id, data.productId, data.name, data.value);
  }
}
