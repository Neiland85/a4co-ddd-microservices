import { AggregateRoot } from '@a4co/shared-utils';
import { v4 as uuidv4 } from 'uuid';
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
  id: ProductId;
  name: string;
  description?: string;
  sku: SKU;
  category: string;
  brand?: string;
  unitPrice: number;
  currency: string;
  stock: StockQuantity;
  reservedStock: StockQuantity;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  isActive: boolean;
  artisanId: string;
  warehouseLocation?: WarehouseLocation;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends AggregateRoot {
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
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ProductProps) {
    super(props.id.value);
    this._name = props.name;
    this._description = props.description;
    this._sku = props.sku;
    this._category = props.category;
    this._brand = props.brand;
    this._unitPrice = props.unitPrice;
    this._currency = props.currency;
    this._stock = props.stock;
    this._reservedStock = props.reservedStock;
    this._minimumStock = props.minimumStock;
    this._maximumStock = props.maximumStock;
    this._reorderPoint = props.reorderPoint;
    this._reorderQuantity = props.reorderQuantity;
    this._isActive = props.isActive;
    this._artisanId = props.artisanId;
    this._warehouseLocation = props.warehouseLocation;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // Getters
  get id(): ProductId {
    return ProductId.create(this._id);
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

  get reservedStock(): StockQuantity {
    return this._reservedStock;
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

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Computed properties
  get availableStock(): StockQuantity {
    return this._stock.subtract(this._reservedStock);
  }

  get stockStatus(): 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued' {
    if (!this._isActive) return 'discontinued';
    const available = this.availableStock;
    if (available.isZero() || available.isLessThan(StockQuantity.zero())) {
      return 'out_of_stock';
    }
    if (available.isLessThanOrEqual(StockQuantity.create(this._reorderPoint))) {
      return 'low_stock';
    }
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
    if (!this.canReserveStock(quantity)) {
      const available = this.availableStock;
      this.addDomainEvent(
        new InventoryOutOfStockEvent(
          this.id,
          {
            requestedQuantity: quantity,
            availableStock: available,
            orderId,
            timestamp: new Date(),
          },
          sagaId
        )
      );
      throw new Error(
        `Cannot reserve ${quantity.value} units. Available: ${available.value}`
      );
    }

    const previousReservedStock = this._reservedStock;
    this._reservedStock = this._reservedStock.add(quantity);
    this._updatedAt = new Date();

    // Emit InventoryReservedEvent
    this.addDomainEvent(
      new InventoryReservedEvent(
        this.id,
        {
          quantity,
          currentStock: this._stock,
          reservedStock: this._reservedStock,
          availableStock: this.availableStock,
          orderId,
          timestamp: new Date(),
        },
        sagaId
      )
    );

    // Check if low stock and emit LowStockEvent
    if (this.needsRestock) {
      this.addDomainEvent(
        new LowStockEvent(
          this.id,
          {
            currentStock: this._stock,
            reservedStock: this._reservedStock,
            availableStock: this.availableStock,
            reorderPoint: this._reorderPoint,
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
    this._updatedAt = new Date();

    // Emit InventoryReleasedEvent
    this.addDomainEvent(
      new InventoryReleasedEvent(
        this.id,
        {
          quantity,
          currentStock: this._stock,
          reservedStock: this._reservedStock,
          availableStock: this.availableStock,
          orderId,
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

    // Reduce both stock and reservedStock
    this._stock = this._stock.subtract(quantity);
    this._reservedStock = this._reservedStock.subtract(quantity);
    this._updatedAt = new Date();

    // Emit StockDeductedEvent
    this.addDomainEvent(
      new StockDeductedEvent(
        this.id,
        {
          quantity,
          currentStock: this._stock,
          reservedStock: this._reservedStock,
          availableStock: this.availableStock,
          orderId,
          timestamp: new Date(),
        },
        sagaId
      )
    );
  }

  replenishStock(quantity: StockQuantity, reason: string, sagaId?: string): void {
    const previousStock = this._stock;
    this._stock = this._stock.add(quantity);
    this._updatedAt = new Date();

    // Emit StockReplenishedEvent
    this.addDomainEvent(
      new StockReplenishedEvent(
        this.id,
        {
          quantity,
          currentStock: this._stock,
          previousStock,
          reason,
          timestamp: new Date(),
        },
        sagaId
      )
    );
  }

  updateStock(newStock: StockQuantity, reason: string): void {
    this._stock = newStock;
    this._updatedAt = new Date();
  }

  adjustStock(adjustment: StockQuantity, reason: string): void {
    if (adjustment.isLessThan(StockQuantity.zero())) {
      const absAdjustment = StockQuantity.create(Math.abs(adjustment.value));
      if (this._stock.isLessThan(absAdjustment)) {
        throw new Error('Cannot adjust stock: result would be negative');
      }
    }
    this._stock = this._stock.add(adjustment);
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  updatePricing(newPrice: number, newCurrency?: string): void {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }

    this._unitPrice = newPrice;
    if (newCurrency) {
      this._currency = newCurrency;
    }
    this._updatedAt = new Date();
  }

  // Static factory methods
  static create(
    props: Omit<
      ProductProps,
      'id' | 'createdAt' | 'updatedAt' | 'stock' | 'reservedStock'
    > & {
      stock?: number;
      reservedStock?: number;
    }
  ): Product {
    const now = new Date();
    return new Product({
      ...props,
      id: ProductId.fromUUID(uuidv4()),
      sku: typeof props.sku === 'string' ? SKU.create(props.sku) : props.sku,
      stock: props.stock
        ? StockQuantity.create(props.stock)
        : StockQuantity.zero(),
      reservedStock: props.reservedStock
        ? StockQuantity.create(props.reservedStock)
        : StockQuantity.zero(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstruct(props: {
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
    reorderPoint?: number;
    reorderQuantity?: number;
    isActive: boolean;
    artisanId: string;
    warehouseLocation?: { warehouse: string; aisle?: string; shelf?: string };
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return new Product({
      id: ProductId.create(props.id),
      name: props.name,
      description: props.description,
      sku: SKU.create(props.sku),
      category: props.category,
      brand: props.brand,
      unitPrice: props.unitPrice,
      currency: props.currency,
      stock: StockQuantity.create(props.currentStock),
      reservedStock: StockQuantity.create(props.reservedStock),
      minimumStock: props.minimumStock,
      maximumStock: props.maximumStock,
      reorderPoint: props.reorderPoint ?? props.minimumStock,
      reorderQuantity: props.reorderQuantity ?? props.minimumStock * 2,
      isActive: props.isActive,
      artisanId: props.artisanId,
      warehouseLocation: props.warehouseLocation
        ? WarehouseLocation.create(
            props.warehouseLocation.warehouse,
            props.warehouseLocation.aisle,
            props.warehouseLocation.shelf
          )
        : undefined,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  // Serialization
  toJSON(): {
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
    reorderPoint: number;
    reorderQuantity: number;
    isActive: boolean;
    artisanId: string;
    warehouseLocation?: { warehouse: string; aisle?: string; shelf?: string };
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id.value,
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
      warehouseLocation: this._warehouseLocation
        ? {
            warehouse: this._warehouseLocation.warehouse,
            aisle: this._warehouseLocation.aisle,
            shelf: this._warehouseLocation.shelf,
          }
        : undefined,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
