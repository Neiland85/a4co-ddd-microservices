/**
 * Value Object: Password
 * Representa una contraseña válida con sus reglas de seguridad
 */
export class Password {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private validate(password: string): void {
    if (!password) {
      throw new Error('Password es requerido');
    }

    if (password.length < 8) {
      throw new Error('Password debe tener al menos 8 caracteres');
    }

    if (password.length > 100) {
      throw new Error('Password demasiado largo');
    }

    // Al menos una letra minúscula, una mayúscula, un número
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasLowerCase || !hasUpperCase || !hasNumbers) {
      throw new Error('Password debe contener al menos una minúscula, una mayúscula y un número');
    }
  }
}
