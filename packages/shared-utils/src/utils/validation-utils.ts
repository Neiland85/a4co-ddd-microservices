export interface ValidationRule<T = unknown> {
  validate: (value: T) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validator<T = unknown> {
  private rules: ValidationRule<T>[] = [];

  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  validate(value: T): ValidationResult {
    const errors: string[] = [];

    for (const rule of this.rules) {
      if (!rule.validate(value)) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Reglas de validación comunes
export const required = (message: string = 'Este campo es requerido'): ValidationRule<unknown> => ({
  validate: (value: unknown) => value !== null && value !== undefined && value !== '',
  message,
});

export const minLength = (min: number, message?: string): ValidationRule<string> => ({
  validate: (value: string) => value.length >= min,
  message: message || `Debe tener al menos ${min} caracteres`,
});

export const maxLength = (max: number, message?: string): ValidationRule<string> => ({
  validate: (value: string) => value.length <= max,
  message: message || `Debe tener máximo ${max} caracteres`,
});

export const email = (message: string = 'Formato de email inválido'): ValidationRule<string> => ({
  validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message,
});

export const min = (min: number, message?: string): ValidationRule<number> => ({
  validate: (value: number) => value >= min,
  message: message || `Debe ser mayor o igual a ${min}`,
});

export const max = (max: number, message?: string): ValidationRule<number> => ({
  validate: (value: number) => value <= max,
  message: message || `Debe ser menor o igual a ${max}`,
});

export const pattern = (regex: RegExp, message: string): ValidationRule<string> => ({
  validate: (value: string) => regex.test(value),
  message,
});

export const custom = <T>(
  validator: (value: T) => boolean,
  message: string
): ValidationRule<T> => ({
  validate: validator,
  message,
});
