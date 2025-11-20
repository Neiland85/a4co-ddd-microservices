/**
 * Value Object: Email
 * Representa un email válido con sus reglas de negocio
 */
export class Email {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.toLowerCase().trim();
  }

  get value(): string {
    return this._value;
  }

  private validate(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      throw new Error('Email es requerido');
    }

    if (!emailRegex.test(email)) {
      throw new Error('Formato de email inválido');
    }

    if (email.length > 254) {
      throw new Error('Email demasiado largo');
    }
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
