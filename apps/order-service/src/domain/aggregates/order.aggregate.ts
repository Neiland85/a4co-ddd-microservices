import { AggregateRoot, ValueObject } from '../base-classes';
import { DomainEvent } from '@a4co/shared-utils';
import { OrderStatus, OrderStatusEnum } from '../value-objects/order-status.vo';
import { Money } from '../value-objects/money.vo';
import { CustomerId } from '../value-objects/customer-id.vo';

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

    toJSON() {
        return {
            productId: this.productId,
            quantity: this.quantity,
            unitPrice: this.unitPrice,
            currency: this.currency,
            totalPrice: this.totalPrice,
        };
    }
}

// DOMAIN EVENTS

export class OrderCreatedEvent extends DomainEvent {
    constructor(
        orderId: string,
        customerId: string,
        items: OrderItem[],
        totalAmount: number,
        currency: string,
    ) {
        super(orderId, {
            orderId,
            customerId,
            items: items.map(item => item.toJSON()),
            totalAmount,
            currency,
        });
    }
}

export class OrderStatusChangedEvent extends DomainEvent {
    constructor(
        orderId: string,
        oldStatus: OrderStatusEnum,
        newStatus: OrderStatusEnum,
    ) {
        super(orderId, {
            orderId,
            oldStatus,
            newStatus,
        });
    }
}

export class OrderCancelledEvent extends DomainEvent {
    constructor(
        orderId: string,
        reason: string,
    ) {
        super(orderId, {
            orderId,
            reason,
        });
    }
}

export class OrderCompletedEvent extends DomainEvent {
    constructor(
        orderId: string,
        customerId: string,
    ) {
        super(orderId, {
            orderId,
            customerId,
        });
    }
}

export class OrderFailedEvent extends DomainEvent {
    constructor(
        orderId: string,
        reason: string,
    ) {
        super(orderId, {
            orderId,
            reason,
        });
    }
}

// AGGREGATE

export class Order extends AggregateRoot {
    private _customerId: CustomerId;
    private _items: OrderItem[];
    private _status: OrderStatus;
    private _totalAmount: Money;
    private _cancelledAt?: Date;
    private _cancelledReason?: string;

    constructor(
        id: string,
        customerId: string,
        items: OrderItem[],
        status: OrderStatusEnum = OrderStatusEnum.PENDING,
        createdAt?: Date,
        updatedAt?: Date,
    ) {
        super(id, createdAt, updatedAt);
        this._customerId = new CustomerId(customerId);
        this._items = [...items];
        this._status = new OrderStatus(status);
        
        const currency = items.length > 0 ? items[0].currency : 'EUR';
        const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
        this._totalAmount = new Money(totalAmount, currency);

        // Add domain event if this is a new order
        if (status === OrderStatusEnum.PENDING && !createdAt) {
            this.addDomainEvent(new OrderCreatedEvent(
                id,
                customerId,
                items,
                totalAmount,
                currency,
            ));
        }
    }

    // Factory method para reconstruir desde persistencia
    static reconstruct(
        id: string,
        customerId: string,
        items: OrderItem[],
        status: OrderStatusEnum,
        totalAmount: number,
        currency: string,
        cancelledAt?: Date,
        cancelledReason?: string,
        createdAt?: Date,
        updatedAt?: Date,
    ): Order {
        const order = new Order(id, customerId, items, status, createdAt, updatedAt);
        order._totalAmount = new Money(totalAmount, currency);
        order._cancelledAt = cancelledAt;
        order._cancelledReason = cancelledReason;
        return order;
    }

    get customerId(): string {
        return this._customerId.value;
    }

    get items(): OrderItem[] {
        return [...this._items];
    }

    get status(): OrderStatusEnum {
        return this._status.value;
    }

    get totalAmount(): number {
        return this._totalAmount.amount;
    }

    get currency(): string {
        return this._totalAmount.currency;
    }

    get cancelledAt(): Date | undefined {
        return this._cancelledAt;
    }

    get cancelledReason(): string | undefined {
        return this._cancelledReason;
    }

    confirmPayment(): void {
        if (!this._status.canTransitionTo(OrderStatusEnum.PAYMENT_CONFIRMED)) {
            throw new Error(
                `Cannot confirm payment. Current status: ${this._status.value}, ` +
                `valid transitions: PENDING -> PAYMENT_CONFIRMED`
            );
        }

        const oldStatus = this._status.value;
        this._status = new OrderStatus(OrderStatusEnum.PAYMENT_CONFIRMED);
        this.touch();

        this.addDomainEvent(new OrderStatusChangedEvent(this.id, oldStatus, OrderStatusEnum.PAYMENT_CONFIRMED));
    }

    reserveInventory(): void {
        if (!this._status.canTransitionTo(OrderStatusEnum.INVENTORY_RESERVED)) {
            throw new Error(
                `Cannot reserve inventory. Current status: ${this._status.value}, ` +
                `valid transitions: PAYMENT_CONFIRMED -> INVENTORY_RESERVED`
            );
        }

        const oldStatus = this._status.value;
        this._status = new OrderStatus(OrderStatusEnum.INVENTORY_RESERVED);
        this.touch();

        this.addDomainEvent(new OrderStatusChangedEvent(this.id, oldStatus, OrderStatusEnum.INVENTORY_RESERVED));
    }

    complete(): void {
        if (!this._status.canTransitionTo(OrderStatusEnum.COMPLETED)) {
            throw new Error(
                `Cannot complete order. Current status: ${this._status.value}, ` +
                `valid transitions: INVENTORY_RESERVED -> COMPLETED`
            );
        }

        const oldStatus = this._status.value;
        this._status = new OrderStatus(OrderStatusEnum.COMPLETED);
        this.touch();

        this.addDomainEvent(new OrderStatusChangedEvent(this.id, oldStatus, OrderStatusEnum.COMPLETED));
        this.addDomainEvent(new OrderCompletedEvent(this.id, this._customerId.value));
    }

    cancel(reason: string): void {
        if (!reason || reason.trim().length === 0) {
            throw new Error('Cancellation reason is required');
        }

        if (!this._status.canTransitionTo(OrderStatusEnum.CANCELLED)) {
            throw new Error(
                `Cannot cancel order. Current status: ${this._status.value}, ` +
                `valid transitions: PENDING, PAYMENT_CONFIRMED, INVENTORY_RESERVED -> CANCELLED`
            );
        }

        const oldStatus = this._status.value;
        this._status = new OrderStatus(OrderStatusEnum.CANCELLED);
        this._cancelledAt = new Date();
        this._cancelledReason = reason.trim();
        this.touch();

        this.addDomainEvent(new OrderStatusChangedEvent(this.id, oldStatus, OrderStatusEnum.CANCELLED));
        this.addDomainEvent(new OrderCancelledEvent(this.id, reason));
    }

    markAsFailed(reason: string): void {
        if (!reason || reason.trim().length === 0) {
            throw new Error('Failure reason is required');
        }

        if (!this._status.canTransitionTo(OrderStatusEnum.FAILED)) {
            throw new Error(
                `Cannot mark order as failed. Current status: ${this._status.value}, ` +
                `valid transitions: PENDING, PAYMENT_CONFIRMED, INVENTORY_RESERVED -> FAILED`
            );
        }

        const oldStatus = this._status.value;
        this._status = new OrderStatus(OrderStatusEnum.FAILED);
        this.touch();

        this.addDomainEvent(new OrderStatusChangedEvent(this.id, oldStatus, OrderStatusEnum.FAILED));
        this.addDomainEvent(new OrderFailedEvent(this.id, reason));
    }

    addItem(item: OrderItem): void {
        if (this._status.value !== OrderStatusEnum.PENDING) {
            throw new Error('Cannot add items to an order that is not in PENDING status');
        }
        this._items.push(item);
        const newTotal = this._items.reduce((sum, i) => sum + i.totalPrice, 0);
        this._totalAmount = new Money(newTotal, this._totalAmount.currency);
        this.touch();
    }

    removeItem(productId: string): void {
        if (this._status.value !== OrderStatusEnum.PENDING) {
            throw new Error('Cannot remove items from an order that is not in PENDING status');
        }
        const index = this._items.findIndex(item => item.productId === productId);
        if (index === -1) {
            throw new Error(`Item with productId ${productId} not found in order`);
        }

        this._items.splice(index, 1);
        const newTotal = this._items.reduce((sum, i) => sum + i.totalPrice, 0);
        this._totalAmount = new Money(newTotal, this._totalAmount.currency);
        this.touch();
    }

    // Método para serialización a persistencia
    toPersistence() {
        return {
            id: this.id,
            customerId: this._customerId.value,
            status: this._status.value,
            totalAmount: this._totalAmount.amount,
            currency: this._totalAmount.currency,
            items: this._items.map(item => item.toJSON()),
            cancelledAt: this._cancelledAt,
            cancelledReason: this._cancelledReason,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
