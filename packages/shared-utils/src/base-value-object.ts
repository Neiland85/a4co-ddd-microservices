// Clase base para Value Objects en DDD

export abstract class BaseValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
    this.ensureValidState();
  }

  get value(): T {
    return this._value;
  }

  protected abstract ensureValidState(): void;

  equals(other: BaseValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (this === other) {
      return true;
    }

    return this._value === other._value;
  }

  toString(): string {
    return String(this._value);
  }

  valueOf(): T {
    return this._value;
  }
}
