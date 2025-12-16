import { Money, MoneyPrimitives } from '../../common/value-objects/money.vo.js';

/**
 * OrderItem primitives for serialization
 */
export interface OrderItemPrimitives {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: MoneyPrimitives;
}

/**
 * OrderItem Value Object
 * Represents a single item in an order
 * 
 * @invariant quantity must be positive
 * @invariant unitPrice must be non-negative
 */
export class OrderItem {
  private constructor(
    public readonly productId: string,
    public readonly productName: string,
    public readonly quantity: number,
    public readonly unitPrice: Money,
  ) {
    this.validate();
  }

  /**
   * Get currency from unit price
   */
  get currency(): string {
    return this.unitPrice.currency;
  }

  /**
   * Create an OrderItem
   */
  static create(
    productId: string,
    productName: string,
    quantity: number,
    unitPrice: Money,
  ): OrderItem {
    return new OrderItem(productId, productName, quantity, unitPrice);
  }

  /**
   * Create OrderItem from primitives
   */
  static fromPrimitives(primitives: OrderItemPrimitives): OrderItem {
    return OrderItem.create(
      primitives.productId,
      primitives.productName,
      primitives.quantity,
      Money.fromPrimitives(primitives.unitPrice),
    );
  }

  /**
   * Validate the order item
   */
  private validate(): void {
    if (!this.productId || this.productId.trim().length === 0) {
      throw new Error('Product ID cannot be empty');
    }

    if (!this.productName || this.productName.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }

    if (this.quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    if (!Number.isInteger(this.quantity)) {
      throw new Error('Quantity must be an integer');
    }
  }

  /**
   * Calculate total price for this item
   */
  totalPrice(): Money {
    return this.unitPrice.multiply(this.quantity);
  }

  /**
   * Check if this item equals another
   */
  equals(other: OrderItem): boolean {
    return (
      this.productId === other.productId &&
      this.productName === other.productName &&
      this.quantity === other.quantity &&
      this.unitPrice.equals(other.unitPrice)
    );
  }

  /**
   * Convert to primitives for persistence
   */
  toPrimitives(): OrderItemPrimitives {
    return {
      productId: this.productId,
      productName: this.productName,
      quantity: this.quantity,
      unitPrice: this.unitPrice.toPrimitives(),
    };
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return `${this.quantity}x ${this.productName} @ ${this.unitPrice.toString()}`;
  }

  /**
   * Convert to JSON representation
   */
  toJSON(): OrderItemPrimitives {
    return this.toPrimitives();
  }
}
