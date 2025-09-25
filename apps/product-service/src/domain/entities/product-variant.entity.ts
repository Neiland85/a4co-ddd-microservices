// Temporary ProductVariant entity
export class ProductVariant {
  constructor(
    public id: string,
    public productId: string,
    public sku: string,
    public price: number,
    public currency: string,
    public stock: number,
    public attributes: Record<string, any>,
    public name?: string
  ) {}

  static create(data: any): ProductVariant {
    return new ProductVariant(
      data.id || 'temp-id',
      data.productId,
      data.sku,
      data.price,
      data.currency,
      data.stock,
      data.attributes,
      data.name
    );
  }

  static reconstruct(data: any): ProductVariant {
    return new ProductVariant(
      data.id,
      data.productId,
      data.sku,
      data.price,
      data.currency,
      data.stock,
      data.attributes,
      data.name
    );
  }
}
