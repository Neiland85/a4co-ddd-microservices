/**
 * Order Item Value Object
 * Represents an item in an order with product, quantity, and price information.
 */
export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly currency: string = 'EUR',
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (unitPrice < 0) {
      throw new Error('Unit price cannot be negative');
    }
    if (!productId || productId.trim().length === 0) {
      throw new Error('Product ID cannot be empty');
    }
  }

  get totalPrice(): number {
    return this.quantity * this.unitPrice;
  }

  public equals(other: OrderItem): boolean {
    return (
      this.productId === other.productId &&
      this.quantity === other.quantity &&
      this.unitPrice === other.unitPrice &&
      this.currency === other.currency
    );
  }

  public toJSON() {
    return {
      productId: this.productId,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      currency: this.currency,
      totalPrice: this.totalPrice,
    };
  }
}
