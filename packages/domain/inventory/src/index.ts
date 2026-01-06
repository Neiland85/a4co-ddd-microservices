// Minimal exports for domain-inventory bounded context
export type SKU = string;

export interface StockItem {
  sku: SKU;
  available: number;
}

export const createStockItem = (sku: SKU, qty = 0): StockItem => ({ sku, available: qty });
