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
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  private _id: string;
  private _name: string;
  private _description?: string;
  private _sku: string;
  private _category: string;
  private _brand?: string;
  private _unitPrice: number;
  private _currency: string;
  private _currentStock: number;
  private _reservedStock: number;
  private _minimumStock: number;
  private _maximumStock: number;
  private _isActive: boolean;
  private _artisanId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ProductProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._sku = props.sku;
    this._category = props.category;
    this._brand = props.brand;
    this._unitPrice = props.unitPrice;
    this._currency = props.currency;
    this._currentStock = props.currentStock;
    this._reservedStock = props.reservedStock;
    this._minimumStock = props.minimumStock;
    this._maximumStock = props.maximumStock;
    this._isActive = props.isActive;
    this._artisanId = props.artisanId;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string | undefined { return this._description; }
  get sku(): string { return this._sku; }
  get category(): string { return this._category; }
  get brand(): string | undefined { return this._brand; }
  get unitPrice(): number { return this._unitPrice; }
  get currency(): string { return this._currency; }
  get currentStock(): number { return this._currentStock; }
  get reservedStock(): number { return this._reservedStock; }
  get minimumStock(): number { return this._minimumStock; }
  get maximumStock(): number { return this._maximumStock; }
  get isActive(): boolean { return this._isActive; }
  get artisanId(): string { return this._artisanId; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Computed properties
  get availableStock(): number {
    return this._currentStock - this._reservedStock;
  }

  get stockStatus(): 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued' {
    if (!this._isActive) return 'discontinued';
    if (this.availableStock <= 0) return 'out_of_stock';
    if (this.availableStock <= this._minimumStock) return 'low_stock';
    return 'in_stock';
  }

  get needsRestock(): boolean {
    return this.availableStock <= this._minimumStock;
  }

  // Business logic methods
  canReserveStock(quantity: number): boolean {
    return this._isActive && this.availableStock >= quantity;
  }

  reserveStock(quantity: number): void {
    if (!this.canReserveStock(quantity)) {
      throw new Error(`Cannot reserve ${quantity} units. Available: ${this.availableStock}`);
    }

    this._reservedStock += quantity;
    this._updatedAt = new Date();
  }

  releaseStock(quantity: number): void {
    if (this._reservedStock < quantity) {
      throw new Error(`Cannot release ${quantity} units. Reserved: ${this._reservedStock}`);
    }

    this._reservedStock -= quantity;
    this._updatedAt = new Date();
  }

  updateStock(newStock: number, reason: string): void {
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }

    this._currentStock = newStock;
    this._updatedAt = new Date();
  }

  adjustStock(adjustment: number, reason: string): void {
    const newStock = this._currentStock + adjustment;
    this.updateStock(newStock, reason);
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
  static create(props: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const now = new Date();
    return new Product({
      ...props,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now
    });
  }

  static reconstruct(props: ProductProps): Product {
    return new Product(props);
  }

  // Serialization
  toJSON(): ProductProps {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      sku: this._sku,
      category: this._category,
      brand: this._brand,
      unitPrice: this._unitPrice,
      currency: this._currency,
      currentStock: this._currentStock,
      reservedStock: this._reservedStock,
      minimumStock: this._minimumStock,
      maximumStock: this._maximumStock,
      isActive: this._isActive,
      artisanId: this._artisanId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
