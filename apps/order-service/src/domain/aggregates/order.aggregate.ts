import { AggregateRoot, DomainEvent, ValueObject } from '../base-classes';

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
    PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
    INVENTORY_RESERVED = 'INVENTORY_RESERVED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED'
}

// DOMAIN EVENTS

export class OrderCreatedEvent extends DomainEvent {
    constructor(
        public readonly orderId: string,
        public readonly customerId: string,
        public readonly items: OrderItem[],
    ) {
        super(orderId, 'order.created.v1');
    }
}

export class OrderStatusChangedEvent extends DomainEvent {
    constructor(
        public readonly orderId: string,
        public readonly oldStatus: OrderStatus,
        public readonly newStatus: OrderStatus,
    ) {
        super(orderId, 'order.status.changed.v1');
    }
}

export class OrderCompletedEvent extends DomainEvent {
    constructor(
        public readonly orderId: string,
        public readonly customerId: string,
        public readonly totalAmount: number,
    ) {
        super(orderId, 'order.completed.v1');
    }
}

export class OrderCancelledEvent extends DomainEvent {
    constructor(
        public readonly orderId: string,
        public readonly customerId: string,
        public readonly reason: string,
    ) {
        super(orderId, 'order.cancelled.v1');
    }
}

export class OrderFailedEvent extends DomainEvent {
    constructor(
        public readonly orderId: string,
        public readonly customerId: string,
        public readonly reason: string,
    ) {
        super(orderId, 'order.failed.v1');
    }
}

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
            this.addDomainEvent(new OrderCreatedEvent(id, customerId, items));
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

        this.addDomainEvent(new OrderStatusChangedEvent(this.id, oldStatus, newStatus));
    }

    addItem(item: OrderItem): void {
        this._items.push(item);
        this._totalAmount = this.calculateTotal();
        this.touch();
    }

    removeItem(productId: string): void {
        const index = this._items.findIndex(item => item.productId === productId);
        if (index === -1) {
            throw new Error(`Item with productId ${productId} not found in order`);
        }

        this._items.splice(index, 1);
        this._totalAmount = this.calculateTotal();
        this.touch();
    }

    /**
     * Confirma el pago de la orden
     * Transición válida: PENDING -> PAYMENT_CONFIRMED
     */
    confirmPayment(): void {
        if (this._status !== OrderStatus.PENDING) {
            throw new Error(
                `Cannot confirm payment. Order status must be PENDING, current status: ${this._status}`
            );
        }

        const oldStatus = this._status;
        this._status = OrderStatus.PAYMENT_CONFIRMED;
        this.touch();

        this.addDomainEvent(new OrderStatusChangedEvent(this.id, oldStatus, this._status));
    }

    /**
     * Reserva el inventario de la orden
     * Transición válida: PAYMENT_CONFIRMED -> INVENTORY_RESERVED
     */
    reserveInventory(): void {
        if (this._status !== OrderStatus.PAYMENT_CONFIRMED) {
            throw new Error(
                `Cannot reserve inventory. Order status must be PAYMENT_CONFIRMED, current status: ${this._status}`
            );
        }

        const oldStatus = this._status;
        this._status = OrderStatus.INVENTORY_RESERVED;
        this.touch();

        this.addDomainEvent(new OrderStatusChangedEvent(this.id, oldStatus, this._status));
    }

    /**
     * Completa la orden
     * Transición válida: INVENTORY_RESERVED -> COMPLETED
     */
    complete(): void {
        if (this._status !== OrderStatus.INVENTORY_RESERVED) {
            throw new Error(
                `Cannot complete order. Order status must be INVENTORY_RESERVED, current status: ${this._status}`
            );
        }

        const oldStatus = this._status;
        this._status = OrderStatus.COMPLETED;
        this.touch();

        this.addDomainEvent(new OrderStatusChangedEvent(this.id, oldStatus, this._status));
        this.addDomainEvent(new OrderCompletedEvent(this.id, this._customerId, this._totalAmount));
    }

    /**
     * Cancela la orden (compensación)
     * Transición válida: Cualquier estado -> CANCELLED
     */
    cancel(reason: string): void {
        if (this._status === OrderStatus.COMPLETED) {
            throw new Error('Cannot cancel a completed order');
        }

        if (this._status === OrderStatus.CANCELLED) {
            return; // Ya está cancelada
        }

        const oldStatus = this._status;
        this._status = OrderStatus.CANCELLED;
        this.touch();

        this.addDomainEvent(new OrderStatusChangedEvent(this.id, oldStatus, this._status));
        this.addDomainEvent(new OrderCancelledEvent(this.id, this._customerId, reason));
    }

    /**
     * Marca la orden como fallida
     * Transición válida: Cualquier estado -> FAILED
     */
    markAsFailed(reason: string): void {
        if (this._status === OrderStatus.COMPLETED || this._status === OrderStatus.CANCELLED) {
            throw new Error(`Cannot mark as failed. Order is already ${this._status}`);
        }

        if (this._status === OrderStatus.FAILED) {
            return; // Ya está marcada como fallida
        }

        const oldStatus = this._status;
        this._status = OrderStatus.FAILED;
        this.touch();

        this.addDomainEvent(new OrderStatusChangedEvent(this.id, oldStatus, this._status));
        this.addDomainEvent(new OrderFailedEvent(this.id, this._customerId, reason));
    }

    /**
     * Método estático para reconstruir una orden desde persistencia
     */
    static reconstruct(
        id: string,
        customerId: string,
        items: OrderItem[],
        status: OrderStatus,
        createdAt: Date,
        updatedAt: Date,
    ): Order {
        const order = new Order(id, customerId, items, status, createdAt, updatedAt);
        order.clearDomainEvents(); // Limpiar eventos al reconstruir
        return order;
    }
}
