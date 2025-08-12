export class ProductCreatedEvent {
  constructor(
    public readonly productId: string,
    public readonly productName: string,
    public readonly category: string,
    public readonly timestamp: Date = new Date()
  ) {}

  toJSON() {
    return {
      type: 'ProductCreated',
      productId: this.productId,
      productName: this.productName,
      category: this.category,
      timestamp: this.timestamp.toISOString()
    };
  }
} 