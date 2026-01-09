// Domain Entities
export {
  Product,
  ProductProps,
  StockReservation,
  ReservationStatus,
  ReservationItem,
} from './entities/index.js';

// Domain Events
export {
  InventoryReservedEvent,
  InventoryReservedEventPayload,
  InventoryReleasedEvent,
  InventoryReleasedEventPayload,
  InventoryOutOfStockEvent,
  InventoryOutOfStockEventPayload,
} from './events/index.js';

// Domain Repositories (Ports)
export { ProductRepository } from './repositories/index.js';

// Legacy exports for backward compatibility
export type SKU = string;

export interface StockItem {
  sku: SKU;
  available: number;
}

export const createStockItem = (sku: SKU, qty = 0): StockItem => ({ sku, available: qty });
