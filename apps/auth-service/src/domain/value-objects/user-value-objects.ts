// prompt: ✦ gen-service
import { ValueObject } from '@a4co/shared-utils';

export class Email extends ValueObject<string> {
  constructor(value: string) {
    Email.validate(value);
    super(value);
  }

  private static validate(email: string): void {
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
}

export class Password extends ValueObject<string> {
  constructor(value: string) {
    Password.validate(value);
    super(value);
  }

  private static validate(password: string): void {
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

export class UserName extends ValueObject<string> {
  constructor(value: string) {
    UserName.validate(value);
    super(value);
  }

  private static validate(name: string): void {
    if (!name) {
      throw new Error('Nombre es requerido');
    }

    if (name.length < 2) {
      throw new Error('Nombre debe tener al menos 2 caracteres');
    }

    if (name.length > 50) {
      throw new Error('Nombre demasiado largo');
    }

    // Solo letras, espacios y algunos caracteres especiales
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(name)) {
      throw new Error('Nombre contiene caracteres inválidos');
    }
  }
}
