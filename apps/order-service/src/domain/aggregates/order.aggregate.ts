import { AggregateRoot, DomainEvent, ValueObject } from '../base-classes';
import {
  OrderCancelledEvent,
  OrderCompletedEvent,
  OrderCreatedEvent,
  OrderFailedEvent,
  OrderStatusChangedEvent,
} from '../events';

export class OrderId extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    if (!value || !value.trim()) {
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

  toJSON(): { productId: string; quantity: number; unitPrice: number; currency: string } {
    return {
      productId: this.productId,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      currency: this.currency,
    };
  }
}

export interface OrderReservation {
  reservationId: string;
  productId: string;
  quantity: number;
}

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  INVENTORY_RESERVED = 'INVENTORY_RESERVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export class Order extends AggregateRoot {
  private readonly _customerId: string;
  private readonly _items: OrderItem[];
  private _status: OrderStatusEnum;
  private readonly _totalAmount: number;
  private _paymentId?: string;
  private _reservations: OrderReservation[] = [];
  private _failureReason?: string;

  constructor(params: {
    id: string;
    customerId: string;
    items: OrderItem[];
    status?: OrderStatusEnum;
    paymentId?: string;
    reservations?: OrderReservation[];
    failureReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(params.id, params.createdAt, params.updatedAt);
    this._customerId = params.customerId;
    this._items = [...params.items];
    this._status = params.status ?? OrderStatusEnum.PENDING;
    this._totalAmount = this._items.reduce((acc, item) => acc + item.totalPrice, 0);
    this._paymentId = params.paymentId;
    this._reservations = params.reservations ? [...params.reservations] : [];
    this._failureReason = params.failureReason;

    if (!params.createdAt) {
      this.addDomainEvent(
        new OrderCreatedEvent({
          orderId: this.id,
          customerId: this._customerId,
          items: this._items.map(item => item.toJSON()),
          totalAmount: this._totalAmount,
        }),
      );
    }
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return [...this._items];
  }

  get status(): OrderStatusEnum {
    return this._status;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get paymentId(): string | undefined {
    return this._paymentId;
  }

  get reservations(): OrderReservation[] {
    return [...this._reservations];
  }

  get failureReason(): string | undefined {
    return this._failureReason;
  }

  confirmPayment(paymentId: string): void {
    if (!paymentId || !paymentId.trim()) {
      throw new Error('paymentId is required to confirm payment');
    }
    if (this._status !== OrderStatusEnum.PENDING && this._status !== OrderStatusEnum.INVENTORY_RESERVED) {
      throw new Error(`Cannot confirm payment from status ${this._status}`);
    }

    const previous = this._status;
    this._paymentId = paymentId;
    this._status = OrderStatusEnum.PAYMENT_CONFIRMED;
    this.touch();
    this.addDomainEvent(
      new OrderStatusChangedEvent({
        orderId: this.id,
        oldStatus: previous,
        newStatus: this._status,
      }),
    );
  }

  recordInventoryReservations(reservations: OrderReservation[]): void {
    if (!reservations.length) {
      throw new Error('At least one reservation is required');
    }

    const previous = this._status;
    this._reservations = reservations.map(r => ({ ...r }));
    this._status = OrderStatusEnum.INVENTORY_RESERVED;
    this.touch();
    this.addDomainEvent(
      new OrderStatusChangedEvent({
        orderId: this.id,
        oldStatus: previous,
        newStatus: this._status,
      }),
    );
  }

  complete(): void {
    if (this._status !== OrderStatusEnum.INVENTORY_RESERVED && this._status !== OrderStatusEnum.PAYMENT_CONFIRMED) {
      throw new Error(`Cannot complete order from status ${this._status}`);
    }

    const previous = this._status;
    this._status = OrderStatusEnum.COMPLETED;
    this.touch();
    this.addDomainEvent(
      new OrderStatusChangedEvent({
        orderId: this.id,
        oldStatus: previous,
        newStatus: this._status,
      }),
    );
    this.addDomainEvent(
      new OrderCompletedEvent({
        orderId: this.id,
        customerId: this._customerId,
        totalAmount: this._totalAmount,
        paymentId: this._paymentId,
        items: this._items.map(item => item.toJSON()),
      }),
    );
  }

  cancel(reason: string): void {
    if (!reason || !reason.trim()) {
      throw new Error('Cancellation reason is required');
    }

    const previous = this._status;
    this._status = OrderStatusEnum.CANCELLED;
    this._failureReason = reason;
    this.touch();
    this.addDomainEvent(
      new OrderStatusChangedEvent({
        orderId: this.id,
        oldStatus: previous,
        newStatus: this._status,
      }),
    );
    this.addDomainEvent(
      new OrderCancelledEvent({
        orderId: this.id,
        reason,
      }),
    );
  }

  markAsFailed(reason: string): void {
    if (!reason || !reason.trim()) {
      throw new Error('Failure reason is required');
    }

    const previous = this._status;
    this._status = OrderStatusEnum.FAILED;
    this._failureReason = reason;
    this.touch();
    this.addDomainEvent(
      new OrderStatusChangedEvent({
        orderId: this.id,
        oldStatus: previous,
        newStatus: this._status,
      }),
    );
    this.addDomainEvent(
      new OrderFailedEvent({
        orderId: this.id,
        reason,
      }),
    );
  }

  pullDomainEvents(): DomainEvent[] {
    const events = this.domainEvents;
    this.clearDomainEvents();
    return events;
  }

  static reconstruct(params: {
    id: string;
    customerId: string;
    items: OrderItem[];
    status: OrderStatusEnum;
    paymentId?: string;
    reservations?: OrderReservation[];
    failureReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Order {
    return new Order(params);
  }
}
