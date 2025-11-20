/**
 * Value Object: UserName
 * Representa el nombre de un usuario con sus reglas de validación
 */
export class UserName {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  private validate(name: string): void {
    if (!name) {
      throw new Error('Nombre es requerido');
    }

    if (name.trim().length < 2) {
      throw new Error('Nombre debe tener al menos 2 caracteres');
    }

    if (name.length > 100) {
      throw new Error('Nombre demasiado largo');
    }

    // Solo letras, espacios y algunos caracteres especiales
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(name)) {
      throw new Error('Nombre contiene caracteres inválidos');
    }
  }

  equals(other: UserName): boolean {
    return this._value === other._value;
  }
}
