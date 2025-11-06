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
  reorderPoint: number;
  reorderQuantity: number;
  isActive: boolean;
  artisanId: string;
  warehouseLocation?: string;
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
  private _minimumStock: StockQuantity;
  private _maximumStock: StockQuantity;
  private _reorderPoint: StockQuantity;
  private _reorderQuantity: StockQuantity;
  private _isActive: boolean;
  private _artisanId: string;
  private _warehouseLocation?: WarehouseLocation;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ProductProps) {
    super(props.id);
    
    // Validaciones de dominio
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (!props.sku || props.sku.trim().length === 0) {
      throw new Error('SKU cannot be empty');
    }
    if (props.currentStock < 0) {
      throw new Error('Current stock cannot be negative');
    }
    if (props.reservedStock < 0) {
      throw new Error('Reserved stock cannot be negative');
    }
    if (props.reservedStock > props.currentStock) {
      throw new Error('Reserved stock cannot exceed current stock');
    }

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
    this._minimumStock = StockQuantity.create(props.minimumStock);
    this._maximumStock = StockQuantity.create(props.maximumStock);
    this._reorderPoint = StockQuantity.create(props.reorderPoint || props.minimumStock);
    this._reorderQuantity = StockQuantity.create(props.reorderQuantity || props.minimumStock * 2);
    this._isActive = props.isActive;
    this._artisanId = props.artisanId;
    this._warehouseLocation = props.warehouseLocation
      ? WarehouseLocation.create(props.warehouseLocation)
      : undefined;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // ========================================
  // GETTERS
  // ========================================

  get id(): string {
    return this._productId.value;
  }

  get productId(): ProductId {
    return this._productId;
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

  get currentStock(): number {
    return this._stock.value;
  }

  get stock(): StockQuantity {
    return this._stock;
  }

  get reservedStock(): number {
    return this._reservedStock.value;
  }

  get reservedStockQuantity(): StockQuantity {
    return this._reservedStock;
  }

  get minimumStock(): number {
    return this._minimumStock.value;
  }

  get maximumStock(): number {
    return this._maximumStock.value;
  }

  get reorderPoint(): number {
    return this._reorderPoint.value;
  }

  get reorderQuantity(): number {
    return this._reorderQuantity.value;
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

  // ========================================
  // COMPUTED PROPERTIES
  // ========================================

  get availableStock(): number {
    return this._stock.subtract(this._reservedStock).value;
  }

  get availableStockQuantity(): StockQuantity {
    return this._stock.subtract(this._reservedStock);
  }

  get stockStatus(): 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued' {
    if (!this._isActive) return 'discontinued';
    const available = this.availableStockQuantity;
    if (available.isLessThanOrEqual(StockQuantity.zero())) return 'out_of_stock';
    if (available.isLessThanOrEqual(this._reorderPoint)) return 'low_stock';
    return 'in_stock';
  }

  get needsRestock(): boolean {
    return this.availableStockQuantity.isLessThanOrEqual(this._reorderPoint);
  }

  // ========================================
  // BUSINESS LOGIC METHODS
  // ========================================

  canReserveStock(quantity: StockQuantity): boolean {
    return this._isActive && this.availableStockQuantity.isGreaterThanOrEqual(quantity);
  }

  reserveStock(quantity: StockQuantity, orderId: string, sagaId?: string): void {
    if (!this._isActive) {
      throw new Error(`Product ${this._name} is not active`);
    }

    if (!this.canReserveStock(quantity)) {
      const available = this.availableStockQuantity;
      this.addDomainEvent(
        new InventoryOutOfStockEvent(
          this.id,
          {
            requestedQuantity: quantity.value,
            availableStock: available.value,
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

    // Actualizar stock reservado
    this._reservedStock = this._reservedStock.add(quantity);
    this._updatedAt = new Date();

    // Emitir evento de reserva exitosa
    this.addDomainEvent(
      new InventoryReservedEvent(
        this.id,
        {
          quantity: quantity.value,
          currentStock: this._stock.value,
          reservedStock: this._reservedStock.value,
          availableStock: this.availableStock,
          orderId,
          timestamp: new Date(),
        },
        sagaId
      )
    );

    // Verificar si necesita reorden y emitir alerta
    if (this.needsRestock) {
      this.addDomainEvent(
        new LowStockEvent(
          this.id,
          {
            currentStock: this._stock.value,
            reservedStock: this._reservedStock.value,
            availableStock: this.availableStock,
            reorderPoint: this._reorderPoint.value,
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
  }

    // Reducir stock reservado
    this._reservedStock = this._reservedStock.subtract(quantity);
    this._updatedAt = new Date();

    // Emitir evento de liberación
    this.addDomainEvent(
      new InventoryReleasedEvent(
        this.id,
        {
          quantity: quantity.value,
          currentStock: this._stock.value,
          reservedStock: this._reservedStock.value,
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

    // Reducir stock y stock reservado
    this._stock = this._stock.subtract(quantity);
    this._reservedStock = this._reservedStock.subtract(quantity);
    this._updatedAt = new Date();

    // Emitir evento de deducción de stock
    this.addDomainEvent(
      new StockDeductedEvent(
        this.id,
        {
          quantity: quantity.value,
          currentStock: this._stock.value,
          reservedStock: this._reservedStock.value,
          availableStock: this.availableStock,
          orderId,
          timestamp: new Date(),
        },
        sagaId
      )
    );

    // Verificar si necesita reorden después de la deducción
    if (this.needsRestock) {
      this.addDomainEvent(
        new LowStockEvent(
          this.id,
          {
            currentStock: this._stock.value,
            reservedStock: this._reservedStock.value,
            availableStock: this.availableStock,
            reorderPoint: this._reorderPoint.value,
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
    this._updatedAt = new Date();

    // Emitir evento de reposición
    this.addDomainEvent(
      new StockReplenishedEvent(
        this.id,
        {
          quantity: quantity.value,
          previousStock,
          newStock: this._stock.value,
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

  adjustStock(adjustment: number, reason: string): void {
    const adjustmentQuantity = StockQuantity.create(Math.abs(adjustment));
    if (adjustment >= 0) {
      this._stock = this._stock.add(adjustmentQuantity);
    } else {
      this._stock = this._stock.subtract(adjustmentQuantity);
    }
    this._updatedAt = new Date();
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

  // ========================================
  // STATIC FACTORY METHODS
  // ========================================

  static create(
    props: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>
  ): Product {
    const now = new Date();
    return new Product({
      ...props,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reorderPoint: props.reorderPoint || props.minimumStock,
      reorderQuantity: props.reorderQuantity || props.minimumStock * 2,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstruct(props: ProductProps): Product {
    return new Product(props);
  }

  // ========================================
  // SERIALIZATION
  // ========================================

  toJSON(): ProductProps {
    return {
      id: this._productId.value,
      name: this._name,
      description: this._description,
      sku: this._sku.value,
      category: this._category,
      brand: this._brand,
      unitPrice: this._unitPrice,
      currency: this._currency,
      currentStock: this._stock.value,
      reservedStock: this._reservedStock.value,
      minimumStock: this._minimumStock.value,
      maximumStock: this._maximumStock.value,
      reorderPoint: this._reorderPoint.value,
      reorderQuantity: this._reorderQuantity.value,
      isActive: this._isActive,
      artisanId: this._artisanId,
      warehouseLocation: this._warehouseLocation?.toString(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
