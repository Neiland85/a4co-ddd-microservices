import { AggregateRoot, DomainEvent, ValueObject } from '../base-classes.js';
import { OrderCreatedEvent, OrderStatusChangedEvent } from '../events/index.js';

// VALUE OBJECTS

export class OrderId extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    if (!value || value.trim().length === 0) {
      throw new Error('OrderId cannot be empty');
    }
  }
}

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
  }

  get totalPrice(): number {
    return this.quantity * this.unitPrice;
  }
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// DOMAIN EVENTS
// Events are now defined in the events directory

// AGGREGATE

export class Order extends AggregateRoot {
  private _customerId: string;
  private _items: OrderItem[];
  private _status: OrderStatus;
  private _totalAmount: number;

  constructor(
    id: string,
    customerId: string,
    items: OrderItem[],
    status: OrderStatus = OrderStatus.PENDING,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._customerId = customerId;
    this._items = [...items];
    this._status = status;
    this._totalAmount = this.calculateTotal();

    // Add domain event if this is a new order
    if (status === OrderStatus.PENDING && !createdAt) {
      this.addDomainEvent(
        new OrderCreatedEvent(
          id,
          customerId,
          items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
          this._totalAmount,
        ),
      );
    }
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return [...this._items];
  }

  get status(): OrderStatus {
    return this._status;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  private calculateTotal(): number {
    return this._items.reduce((total, item) => total + item.totalPrice, 0);
  }

  changeStatus(newStatus: OrderStatus): void {
    if (this._status === newStatus) {
      return;
    }

    const oldStatus = this._status;
    this._status = newStatus;
    this.touch();

    this.addDomainEvent(new OrderStatusChangedEvent(this._id, oldStatus, newStatus));
  }
  addItem(item: OrderItem): void {
    this._items.push(item);
    this._totalAmount = this.calculateTotal();
    this.touch();
  }

  removeItem(productId: string): void {
    const index = this._items.findIndex((item) => item.productId === productId);
    if (index === -1) {
      throw new Error(`Item with productId ${productId} not found in order`);
    }

    this._items.splice(index, 1);
    this._totalAmount = this.calculateTotal();
    this.touch();
  }

  // Saga-related methods
  confirmPayment(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error(`Cannot confirm payment for order in status: ${this._status}`);
    }
    this.changeStatus(OrderStatus.PAID);
  }

  markAsShipped(): void {
    if (this._status !== OrderStatus.PAID) {
      throw new Error(`Cannot ship order in status: ${this._status}`);
    }
    this.changeStatus(OrderStatus.SHIPPED);
  }

  markAsDelivered(): void {
    if (this._status !== OrderStatus.SHIPPED) {
      throw new Error(`Cannot deliver order in status: ${this._status}`);
    }
    this.changeStatus(OrderStatus.DELIVERED);
  }

  cancel(reason?: string): void {
    if (this._status === OrderStatus.DELIVERED) {
      throw new Error('Cannot cancel a delivered order');
    }
    this.changeStatus(OrderStatus.CANCELLED);
  }

  // Domain event methods
  protected addDomainEvent(event: any): void {
    // For now, just log the event. In a real implementation, this would store events.
    console.log('Domain event:', event);
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }
}
