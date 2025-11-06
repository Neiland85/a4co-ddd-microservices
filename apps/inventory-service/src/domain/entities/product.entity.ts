import { AggregateRoot } from '@a4co/shared-utils';
import { ProductId, StockQuantity, SKU, WarehouseLocation } from '../value-objects';
import {
  InventoryReservedEvent,
  InventoryOutOfStockEvent,
  InventoryReleasedEvent,
  StockDeductedEvent,
  StockReplenishedEvent,
  LowStockEvent,
} from '../events';

export interface ProductProps {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  brand?: string;
  unitPrice: number;
  currency: string;
  currentStock: number;
  reservedStock: number;
  minimumStock: number;
  maximumStock: number;
  isActive: boolean;
  artisanId: string;
  reorderPoint?: number;
  reorderQuantity?: number;
  warehouseLocation?: { warehouse: string; aisle?: string; shelf?: string };
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends AggregateRoot {
  private _productId: ProductId;
  private _name: string;
  private _description?: string;
  private _sku: SKU;
  private _category: string;
  private _brand?: string;
  private _unitPrice: number;
  private _currency: string;
  private _stock: StockQuantity;
  private _reservedStock: StockQuantity;
  private _minimumStock: number;
  private _maximumStock: number;
  private _reorderPoint: number;
  private _reorderQuantity: number;
  private _isActive: boolean;
  private _artisanId: string;
  private _warehouseLocation?: WarehouseLocation;

  constructor(props: ProductProps) {
    super(props.id);
    this._productId = ProductId.create(props.id);
    this._name = props.name;
    this._description = props.description;
    this._sku = SKU.create(props.sku);
    this._category = props.category;
    this._brand = props.brand;
    this._unitPrice = props.unitPrice;
    this._currency = props.currency;
    this._stock = StockQuantity.create(props.currentStock);
    this._reservedStock = StockQuantity.create(props.reservedStock);
    this._minimumStock = props.minimumStock;
    this._maximumStock = props.maximumStock;
    this._reorderPoint = props.reorderPoint ?? props.minimumStock;
    this._reorderQuantity = props.reorderQuantity ?? props.minimumStock * 2;
    this._isActive = props.isActive;
    this._artisanId = props.artisanId;
    this._warehouseLocation = props.warehouseLocation
      ? WarehouseLocation.create(
          props.warehouseLocation.warehouse,
          props.warehouseLocation.aisle,
          props.warehouseLocation.shelf
        )
      : undefined;
  }

  // Getters
  get productId(): ProductId {
    return this._productId;
  }

  get id(): string {
    return this._productId.value;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get sku(): SKU {
    return this._sku;
  }

  get category(): string {
    return this._category;
  }

  get brand(): string | undefined {
    return this._brand;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  get currency(): string {
    return this._currency;
  }

  get stock(): StockQuantity {
    return this._stock;
  }

  get currentStock(): number {
    return this._stock.value;
  }

  get reservedStock(): StockQuantity {
    return this._reservedStock;
  }

  get reservedStockValue(): number {
    return this._reservedStock.value;
  }

  get minimumStock(): number {
    return this._minimumStock;
  }

  get maximumStock(): number {
    return this._maximumStock;
  }

  get reorderPoint(): number {
    return this._reorderPoint;
  }

  get reorderQuantity(): number {
    return this._reorderQuantity;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get artisanId(): string {
    return this._artisanId;
  }

  get warehouseLocation(): WarehouseLocation | undefined {
    return this._warehouseLocation;
  }

  // Computed properties
  get availableStock(): StockQuantity {
    return StockQuantity.create(this._stock.value - this._reservedStock.value);
  }

  get availableStockValue(): number {
    return this._stock.value - this._reservedStock.value;
  }

  get stockStatus(): 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued' {
    if (!this._isActive) return 'discontinued';
    const available = this.availableStock;
    if (available.isZero() || available.isLessThan(StockQuantity.zero())) return 'out_of_stock';
    if (available.isLessThanOrEqual(StockQuantity.create(this._reorderPoint))) return 'low_stock';
    return 'in_stock';
  }

  get needsRestock(): boolean {
    return this.availableStock.isLessThanOrEqual(StockQuantity.create(this._reorderPoint));
  }

  // Business logic methods
  canReserveStock(quantity: StockQuantity): boolean {
    return this._isActive && this.availableStock.isGreaterThanOrEqual(quantity);
  }

  reserveStock(quantity: StockQuantity, orderId: string, sagaId?: string): void {
    if (!this._isActive) {
      throw new Error(`Product ${this._name} is not active`);
    }

    if (!this.canReserveStock(quantity)) {
      const available = this.availableStock;
      this.addDomainEvent(
        new InventoryOutOfStockEvent(
          this.id,
          {
            orderId,
            requestedQuantity: quantity.value,
            availableStock: available.value,
            timestamp: new Date(),
          },
          sagaId
        )
      );
      throw new Error(
        `Cannot reserve ${quantity.value} units. Available: ${available.value}`
      );
    }

    this._reservedStock = this._reservedStock.add(quantity);
    this.touch();

    const available = this.availableStock;
    this.addDomainEvent(
      new InventoryReservedEvent(
        this.id,
        {
          orderId,
          quantity: quantity.value,
          currentStock: this._stock.value,
          reservedStock: this._reservedStock.value,
          availableStock: available.value,
          timestamp: new Date(),
        },
        sagaId
      )
    );

    // Check for low stock alert
    if (this.needsRestock) {
      this.addDomainEvent(
        new LowStockEvent(
          this.id,
          {
            currentStock: this._stock.value,
            reservedStock: this._reservedStock.value,
            availableStock: available.value,
            reorderPoint: this._reorderPoint,
            reorderQuantity: this._reorderQuantity,
            timestamp: new Date(),
          },
          sagaId
        )
      );
    }
  }

  releaseStock(quantity: StockQuantity, orderId: string, reason: string, sagaId?: string): void {
    if (this._reservedStock.isLessThan(quantity)) {
      throw new Error(
        `Cannot release ${quantity.value} units. Reserved: ${this._reservedStock.value}`
      );
    }

    this._reservedStock = this._reservedStock.subtract(quantity);
    this.touch();

    const available = this.availableStock;
    this.addDomainEvent(
      new InventoryReleasedEvent(
        this.id,
        {
          orderId,
          quantity: quantity.value,
          currentStock: this._stock.value,
          reservedStock: this._reservedStock.value,
          availableStock: available.value,
          reason,
          timestamp: new Date(),
        },
        sagaId
      )
    );
  }

  confirmReservation(quantity: StockQuantity, orderId: string, sagaId?: string): void {
    if (this._reservedStock.isLessThan(quantity)) {
      throw new Error(
        `Cannot confirm reservation of ${quantity.value} units. Reserved: ${this._reservedStock.value}`
      );
    }

    if (this._stock.isLessThan(quantity)) {
      throw new Error(
        `Cannot deduct ${quantity.value} units. Current stock: ${this._stock.value}`
      );
    }

    // Deduct from both stock and reserved stock
    this._stock = this._stock.subtract(quantity);
    this._reservedStock = this._reservedStock.subtract(quantity);
    this.touch();

    const available = this.availableStock;
    this.addDomainEvent(
      new StockDeductedEvent(
        this.id,
        {
          orderId,
          quantity: quantity.value,
          currentStock: this._stock.value,
          reservedStock: this._reservedStock.value,
          availableStock: available.value,
          timestamp: new Date(),
        },
        sagaId
      )
    );

    // Check for low stock alert after deduction
    if (this.needsRestock) {
      this.addDomainEvent(
        new LowStockEvent(
          this.id,
          {
            currentStock: this._stock.value,
            reservedStock: this._reservedStock.value,
            availableStock: available.value,
            reorderPoint: this._reorderPoint,
            reorderQuantity: this._reorderQuantity,
            timestamp: new Date(),
          },
          sagaId
        )
      );
    }
  }

  replenishStock(quantity: StockQuantity, reason: string, sagaId?: string): void {
    const previousStock = this._stock.value;
    this._stock = this._stock.add(quantity);
    this.touch();

    this.addDomainEvent(
      new StockReplenishedEvent(
        this.id,
        {
          quantity: quantity.value,
          previousStock,
          currentStock: this._stock.value,
          reason,
          timestamp: new Date(),
        },
        sagaId
      )
    );
  }

  updateStock(newStock: number, reason: string): void {
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }

    this._stock = StockQuantity.create(newStock);
    this.touch();
  }

  adjustStock(adjustment: number, reason: string): void {
    const newStock = this._stock.value + adjustment;
    this.updateStock(newStock, reason);
  }

  deactivate(): void {
    this._isActive = false;
    this.touch();
  }

  activate(): void {
    this._isActive = true;
    this.touch();
  }

  updatePricing(newPrice: number, newCurrency?: string): void {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }

    this._unitPrice = newPrice;
    if (newCurrency) {
      this._currency = newCurrency;
    }
    this.touch();
  }

  updateWarehouseLocation(location: WarehouseLocation): void {
    this._warehouseLocation = location;
    this.touch();
  }

  // Static factory methods
  static create(props: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const now = new Date();
    return new Product({
      ...props,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstruct(props: ProductProps): Product {
    return new Product(props);
  }

  // Serialization
  toJSON(): ProductProps {
    return {
      id: this.id,
      name: this._name,
      description: this._description,
      sku: this._sku.value,
      category: this._category,
      brand: this._brand,
      unitPrice: this._unitPrice,
      currency: this._currency,
      currentStock: this._stock.value,
      reservedStock: this._reservedStock.value,
      minimumStock: this._minimumStock,
      maximumStock: this._maximumStock,
      reorderPoint: this._reorderPoint,
      reorderQuantity: this._reorderQuantity,
      isActive: this._isActive,
      artisanId: this._artisanId,
      warehouseLocation: this._warehouseLocation?.toJSON(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
