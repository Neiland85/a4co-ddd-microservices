export class WarehouseLocation {
  constructor(
    private readonly _warehouse: string,
    private readonly _aisle?: string,
    private readonly _shelf?: string
  ) {
    if (!_warehouse || _warehouse.trim().length === 0) {
      throw new Error('Warehouse name cannot be empty');
    }
  }

  get warehouse(): string {
    return this._warehouse;
  }

  get aisle(): string | undefined {
    return this._aisle;
  }

  get shelf(): string | undefined {
    return this._shelf;
  }

  equals(other: WarehouseLocation): boolean {
    return (
      this._warehouse === other._warehouse &&
      this._aisle === other._aisle &&
      this._shelf === other._shelf
    );
  }

  toString(): string {
    const parts = [this._warehouse];
    if (this._aisle) parts.push(`Aisle ${this._aisle}`);
    if (this._shelf) parts.push(`Shelf ${this._shelf}`);
    return parts.join(' - ');
  }

  toJSON(): { warehouse: string; aisle?: string; shelf?: string } {
    return {
      warehouse: this._warehouse,
      ...(this._aisle && { aisle: this._aisle }),
      ...(this._shelf && { shelf: this._shelf }),
    };
  }

  static create(warehouse: string, aisle?: string, shelf?: string): WarehouseLocation {
    return new WarehouseLocation(warehouse, aisle, shelf);
  }
}
