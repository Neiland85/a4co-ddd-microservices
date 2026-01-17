export class Slug {
  private readonly _value: string;

  private constructor(value: string) {
    if (!Slug.isValid(value)) {
      throw new Error('Slug inválido');
    }
    this._value = value;
  }

  static create(value: string): Slug {
    return new Slug(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Slug): boolean {
    return this._value === other.value;
  }

  static isValid(value: string): boolean {
    // Slug: min 3, max 50, solo letras, números y guiones
    return /^[a-z0-9-]{3,50}$/.test(value);
  }
}
