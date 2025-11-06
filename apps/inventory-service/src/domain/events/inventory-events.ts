import { DomainEvent } from '@a4co/shared-utils';

export class InventoryReservedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      orderId: string;
      quantity: number;
      currentStock: number;
      reservedStock: number;
      availableStock: number;
      timestamp: Date;
    },
    sagaId?: string
  ) {
    super(productId, data, 1, sagaId);
  }
}

export class InventoryOutOfStockEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      orderId: string;
      requestedQuantity: number;
      availableStock: number;
      timestamp: Date;
    },
    sagaId?: string
  ) {
    super(productId, data, 1, sagaId);
  }
}

export class InventoryReleasedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      orderId: string;
      quantity: number;
      currentStock: number;
      reservedStock: number;
      availableStock: number;
      reason: string;
      timestamp: Date;
    },
    sagaId?: string
  ) {
    super(productId, data, 1, sagaId);
  }
}

export class StockDeductedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      orderId: string;
      quantity: number;
      currentStock: number;
      reservedStock: number;
      availableStock: number;
      timestamp: Date;
    },
    sagaId?: string
  ) {
    super(productId, data, 1, sagaId);
  }
}

export class StockReplenishedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      quantity: number;
      previousStock: number;
      currentStock: number;
      reason: string;
      timestamp: Date;
    },
    sagaId?: string
  ) {
    super(productId, data, 1, sagaId);
  }
}

export class LowStockEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      currentStock: number;
      reservedStock: number;
      availableStock: number;
      reorderPoint: number;
      reorderQuantity: number;
      timestamp: Date;
    },
    sagaId?: string
  ) {
    super(productId, data, 1, sagaId);
  }
}
