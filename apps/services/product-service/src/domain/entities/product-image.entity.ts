// Temporary ProductImage entity
export class ProductImage {
  constructor(
    public id: string,
    public productId: string,
    public url: string,
    public altText?: string,
    public type: string = 'PRODUCT',
    public isPrimary: boolean = false,
    public sortOrder: number = 0,
  ) {}

  static create(data: any): ProductImage {
    return new ProductImage(
      data.id || 'temp-id',
      data.productId,
      data.url,
      data.altText,
      data.type,
      data.isPrimary,
      data.sortOrder,
    );
  }

  static reconstruct(data: any): ProductImage {
    return new ProductImage(
      data.id,
      data.productId,
      data.url,
      data.altText,
      data.type,
      data.isPrimary,
      data.sortOrder,
    );
  }

  setPrimary(isPrimary: boolean): void {
    this.isPrimary = isPrimary;
  }
}
