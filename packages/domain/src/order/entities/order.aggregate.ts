import { AggregateRoot } from '@a4co/shared-utils';
import { OrderId } from '../value-objects/order-id.vo.js';
import { OrderItem } from '../value-objects/order-item.vo.js';
import { OrderStatus, OrderStatusValue } from '../value-objects/order-status.vo.js';

/**
 * Order Aggregate Root
 * Represents a customer order with items, status, and business rules.
 * Maintains invariants and emits domain events for state changes.
 */
export class Order extends AggregateRoot {
  private _orderId: OrderId;
  private _customerId: string;
  private _items: OrderItem[];
  private _status: OrderStatus;
  private _totalAmount: number;
  private _currency: string;

  private constructor(
    orderId: OrderId,
    customerId: string,
    items: OrderItem[],
    status: OrderStatus,
    totalAmount: number,
    currency: string,
  ) {
    super(orderId.value);
    this._orderId = orderId;
    this._customerId = customerId;
    this._items = [...items];
    this._status = status;
    this._totalAmount = totalAmount;
    this._currency = currency;
  }

  /**
   * Create a new Order
   */
  public static create(
    customerId: string,
    items: OrderItem[],
    orderId?: OrderId,
  ): Order {
    if (!customerId || customerId.trim().length === 0) {
      throw new Error('Customer ID cannot be empty');
    }

    if (!items || items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    const id = orderId || OrderId.generate();
    const totalAmount = Order.calculateTotal(items);
    const currency = items[0].currency; // Use currency from first item

    // Ensure all items use the same currency
    if (items.some((item) => item.currency !== currency)) {
      throw new Error('All order items must have the same currency');
    }

    const order = new Order(
      id,
      customerId,
      items,
      OrderStatus.pending(),
      totalAmount,
      currency,
    );

    return order;
  }

  /**
   * Rehydrate an Order from persistence
   */
  public static rehydrate(
    orderId: string,
    customerId: string,
    items: OrderItem[],
    status: OrderStatus,
    totalAmount: number,
    currency: string,
  ): Order {
    return new Order(
      OrderId.create(orderId),
      customerId,
      items,
      status,
      totalAmount,
      currency,
    );
  }

  // Getters
  public get orderId(): OrderId {
    return this._orderId;
  }

  public get customerId(): string {
    return this._customerId;
  }

  public get items(): OrderItem[] {
    return [...this._items];
  }

  public get status(): OrderStatus {
    return this._status;
  }

  public get totalAmount(): number {
    return this._totalAmount;
  }

  public get currency(): string {
    return this._currency;
  }

  // Business logic methods

  /**
   * Confirm the order after payment is successful
   */
  public confirm(): void {
    const newStatus = OrderStatus.create(OrderStatusValue.CONFIRMED);
    this._status = this._status.transitionTo(newStatus);
    this.touch();
  }

  /**
   * Mark order as shipped
   */
  public markAsShipped(): void {
    const newStatus = OrderStatus.create(OrderStatusValue.SHIPPED);
    this._status = this._status.transitionTo(newStatus);
    this.touch();
  }

  /**
   * Mark order as delivered
   */
  public markAsDelivered(): void {
    const newStatus = OrderStatus.create(OrderStatusValue.DELIVERED);
    this._status = this._status.transitionTo(newStatus);
    this.touch();
  }

  /**
   * Cancel the order
   */
  public cancel(_reason?: string): void {
    const newStatus = OrderStatus.create(OrderStatusValue.CANCELLED);
    this._status = this._status.transitionTo(newStatus);
    this.touch();
  }

  /**
   * Mark order as failed
   */
  public markAsFailed(_reason?: string): void {
    const newStatus = OrderStatus.create(OrderStatusValue.FAILED);
    this._status = this._status.transitionTo(newStatus);
    this.touch();
  }

  /**
   * Add an item to the order
   * Only allowed in PENDING status
   */
  public addItem(item: OrderItem): void {
    if (this._status.value !== OrderStatusValue.PENDING) {
      throw new Error('Cannot add items to a non-pending order');
    }

    if (item.currency !== this._currency) {
      throw new Error('Item currency must match order currency');
    }

    this._items.push(item);
    this._totalAmount = Order.calculateTotal(this._items);
    this.touch();
  }

  /**
   * Remove an item from the order
   * Only allowed in PENDING status
   */
  public removeItem(productId: string): void {
    if (this._status.value !== OrderStatusValue.PENDING) {
      throw new Error('Cannot remove items from a non-pending order');
    }

    const index = this._items.findIndex((item) => item.productId === productId);
    if (index === -1) {
      throw new Error(`Item with productId ${productId} not found in order`);
    }

    this._items.splice(index, 1);

    if (this._items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    this._totalAmount = Order.calculateTotal(this._items);
    this.touch();
  }

  /**
   * Calculate total amount from items
   */
  private static calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.totalPrice().amount, 0);
  }

  /**
   * Serialize to primitives for persistence
   */
  public toPrimitives() {
    return {
      id: this._orderId.value,
      customerId: this._customerId,
      items: this._items.map((item) => item.toJSON()),
      status: this._status.value,
      totalAmount: this._totalAmount,
      currency: this._currency,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
