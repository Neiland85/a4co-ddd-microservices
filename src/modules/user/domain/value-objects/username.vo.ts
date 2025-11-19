/**
 * Username Value Object
 *
 * Representa un nombre de usuario válido
 * Reglas:
 * - Longitud: 3-50 caracteres
 * - Solo permite: letras, números y guiones bajos
 * - No puede empezar con número
 */
export class Username {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Username {
    if (!value || typeof value !== 'string') {
      throw new Error('Username no puede estar vacío');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length < 3) {
      throw new Error('Username debe tener al menos 3 caracteres');
    }

    if (trimmedValue.length > 50) {
      throw new Error('Username no puede exceder 50 caracteres');
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(trimmedValue)) {
      throw new Error(
        'Username solo puede contener letras, números y guiones bajos, y debe empezar con letra',
      );
    }

    return new Username(trimmedValue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Username): boolean {
    if (!(other instanceof Username)) {
      return false;
    }
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
