import { ValueObject } from '../base-classes';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  INVENTORY_RESERVED = 'INVENTORY_RESERVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export class OrderStatus extends ValueObject<OrderStatusEnum> {
  constructor(value: OrderStatusEnum) {
    super(value);
    if (!Object.values(OrderStatusEnum).includes(value)) {
      throw new Error(`Invalid order status: ${value}`);
    }
  }

  static PENDING = new OrderStatus(OrderStatusEnum.PENDING);
  static PAYMENT_CONFIRMED = new OrderStatus(OrderStatusEnum.PAYMENT_CONFIRMED);
  static INVENTORY_RESERVED = new OrderStatus(OrderStatusEnum.INVENTORY_RESERVED);
  static COMPLETED = new OrderStatus(OrderStatusEnum.COMPLETED);
  static CANCELLED = new OrderStatus(OrderStatusEnum.CANCELLED);
  static FAILED = new OrderStatus(OrderStatusEnum.FAILED);

  canTransitionTo(newStatus: OrderStatusEnum): boolean {
    const validTransitions: Record<OrderStatusEnum, OrderStatusEnum[]> = {
      [OrderStatusEnum.PENDING]: [
        OrderStatusEnum.PAYMENT_CONFIRMED,
        OrderStatusEnum.CANCELLED,
        OrderStatusEnum.FAILED,
      ],
      [OrderStatusEnum.PAYMENT_CONFIRMED]: [
        OrderStatusEnum.INVENTORY_RESERVED,
        OrderStatusEnum.CANCELLED,
        OrderStatusEnum.FAILED,
      ],
      [OrderStatusEnum.INVENTORY_RESERVED]: [
        OrderStatusEnum.COMPLETED,
        OrderStatusEnum.CANCELLED,
        OrderStatusEnum.FAILED,
      ],
      [OrderStatusEnum.COMPLETED]: [],
      [OrderStatusEnum.CANCELLED]: [],
      [OrderStatusEnum.FAILED]: [],
    };

    return validTransitions[this.value].includes(newStatus);
  }

  toString(): string {
    return this.value;
  }
}
