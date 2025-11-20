/**
 * Email Value Object
 *
 * Representa un correo electrónico válido según RFC 5322
 * Validación: formato email + longitud máxima 254 caracteres
 */
export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Email {
    if (!value || typeof value !== 'string') {
      throw new Error('Email no puede estar vacío');
    }

    const trimmedValue = value.trim().toLowerCase();

    if (trimmedValue.length > 254) {
      throw new Error('Email no puede exceder 254 caracteres');
    }

    if (!this.isValidFormat(trimmedValue)) {
      throw new Error('Formato de email inválido');
    }

    return new Email(trimmedValue);
  }

  private static isValidFormat(email: string): boolean {
    // RFC 5322 simplified regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    if (!(other instanceof Email)) {
      return false;
    }
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
