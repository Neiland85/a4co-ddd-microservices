export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = Object.freeze(value);
  }

  public get value(): T {
    return this._value;
  }

  public equals(vo: ValueObject<T>): boolean {
    return JSON.stringify(this._value) === JSON.stringify(vo._value);
  }

  public toString(): string {
    return String(this._value);
  }
}
