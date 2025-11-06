export class WarehouseLocation {
  constructor(
    public readonly warehouse: string,
    public readonly aisle?: string,
    public readonly shelf?: string
  ) {
    if (!warehouse || warehouse.trim().length === 0) {
      throw new Error('Warehouse name cannot be empty');
    }
  }

  equals(other: WarehouseLocation): boolean {
    return (
      this.warehouse === other.warehouse &&
      this.aisle === other.aisle &&
      this.shelf === other.shelf
    );
  }

  toString(): string {
    const parts = [this.warehouse];
    if (this.aisle) parts.push(`Aisle ${this.aisle}`);
    if (this.shelf) parts.push(`Shelf ${this.shelf}`);
    return parts.join(' - ');
  }

  toShortString(): string {
    const parts = [this.warehouse];
    if (this.aisle) parts.push(this.aisle);
    if (this.shelf) parts.push(this.shelf);
    return parts.join('-');
  }

  static create(warehouse: string, aisle?: string, shelf?: string): WarehouseLocation {
    return new WarehouseLocation(warehouse, aisle, shelf);
  }
}
