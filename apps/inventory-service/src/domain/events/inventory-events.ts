import { DomainEvent } from '@a4co/shared-utils/src/domain/domain-event';

/**
 * Evento emitido cuando se reserva stock para una orden
 * Suscriptores: Order Service, Product Service
 */
export class StockReservedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly reservationData: {
      reservationId: string;
      orderId: string;
      items: Array<{
        productId: string;
        productName: string;
        quantity: number;
        warehouseId: string;
        location: string;
        reservedUntil: Date;
      }>;
      totalItems: number;
      createdAt: Date;
      expiresAt: Date;
    },
    eventVersion?: number
  ) {
    super(aggregateId, reservationData, eventVersion);
  }
}

/**
 * Evento emitido cuando se confirma una reserva de stock
 * Suscriptores: Analytics, Product Service
 */
export class StockReservationConfirmedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly confirmationData: {
      reservationId: string;
      orderId: string;
      confirmedAt: Date;
      items: Array<{
        productId: string;
        quantity: number;
        finalStock: number;
      }>;
    },
    eventVersion?: number
  ) {
    super(aggregateId, confirmationData, eventVersion);
  }
}

/**
 * Evento emitido cuando se libera stock reservado
 * Suscriptores: Product Service, Analytics
 */
export class StockReleasedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly releaseData: {
      reservationId?: string;
      orderId?: string;
      reason: 'order_cancelled' | 'reservation_expired' | 'payment_failed' | 'manual';
      items: Array<{
        productId: string;
        quantity: number;
        warehouseId: string;
        newStock: number;
      }>;
      releasedAt: Date;
      releasedBy?: string;
    },
    eventVersion?: number
  ) {
    super(aggregateId, releaseData, eventVersion);
  }
}

/**
 * Evento emitido cuando el stock llega a un nivel bajo
 * Suscriptores: Notification Service, Product Service, Analytics
 */
export class LowStockEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly stockData: {
      productId: string;
      productName: string;
      artisanId: string;
      currentStock: number;
      threshold: number;
      warehouseId: string;
      location: string;
      lastRestockDate?: Date;
      averageDailySales?: number;
      estimatedDaysRemaining?: number;
    },
    eventVersion?: number
  ) {
    super(aggregateId, stockData, eventVersion);
  }
}

/**
 * Evento emitido cuando un producto se queda sin stock
 * Suscriptores: Product Service, Notification Service, Analytics
 */
export class OutOfStockEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly stockData: {
      productId: string;
      productName: string;
      artisanId: string;
      warehouseId: string;
      outOfStockSince: Date;
      pendingOrders?: number;
      estimatedRestockDate?: Date;
    },
    eventVersion?: number
  ) {
    super(aggregateId, stockData, eventVersion);
  }
}

/**
 * Evento emitido cuando se reabastece el inventario
 * Suscriptores: Product Service, Notification Service, Analytics
 */
export class StockReplenishedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly replenishmentData: {
      productId: string;
      productName: string;
      warehouseId: string;
      previousStock: number;
      addedQuantity: number;
      newStock: number;
      source: 'production' | 'transfer' | 'return' | 'adjustment';
      batchNumber?: string;
      expirationDate?: Date;
      replenishedAt: Date;
      replenishedBy: string;
    },
    eventVersion?: number
  ) {
    super(aggregateId, replenishmentData, eventVersion);
  }
}

/**
 * Evento emitido para ajustes de inventario
 * Suscriptores: Analytics, Audit Service
 */
export class InventoryAdjustedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly adjustmentData: {
      adjustmentId: string;
      productId: string;
      warehouseId: string;
      previousQuantity: number;
      newQuantity: number;
      difference: number;
      reason: 'damage' | 'loss' | 'count_correction' | 'quality_issue' | 'other';
      notes?: string;
      adjustedAt: Date;
      adjustedBy: string;
    },
    eventVersion?: number
  ) {
    super(aggregateId, adjustmentData, eventVersion);
  }
}

/**
 * Evento emitido cuando se transfiere stock entre almacenes
 * Suscriptores: Analytics, Logistics Service
 */
export class StockTransferredEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly transferData: {
      transferId: string;
      productId: string;
      quantity: number;
      fromWarehouseId: string;
      toWarehouseId: string;
      reason: string;
      expectedArrival: Date;
      actualArrival?: Date;
      status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
      initiatedAt: Date;
      initiatedBy: string;
    },
    eventVersion?: number
  ) {
    super(aggregateId, transferData, eventVersion);
  }
}