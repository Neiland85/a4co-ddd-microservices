import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validator for UUID format
 */
@ValidatorConstraint({ name: 'isUuid', async: false })
export class IsUuidConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid UUID`;
  }
}

/**
 * Custom UUID validation decorator
 */
export function IsUuidField(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {},
      constraints: [],
      validator: IsUuidConstraint,
    });
  };
}

/**
 * Validator for email format
 */
@ValidatorConstraint({ name: 'isEmail', async: false })
export class IsEmailConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid email address`;
  }
}

/**
 * Validator for phone number format (international)
 */
@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    // Basic international phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid phone number`;
  }
}

/**
 * Custom phone number validation decorator
 */
export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {},
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}

/**
 * Validator for strong password
 */
@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character`;
  }
}

/**
 * Custom strong password validation decorator
 */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {},
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

/**
 * Validator for positive numbers
 */
export function isPositiveNumber(value: any): boolean {
  return typeof value === 'number' && value > 0;
}

/**
 * Validator for non-negative numbers
 */
export function isNonNegativeNumber(value: any): boolean {
  return typeof value === 'number' && value >= 0;
}

/**
 * Validator for date in the past
 */
export function isDateInPast(value: any): boolean {
  if (!(value instanceof Date) && typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && date < new Date();
}

/**
 * Validator for date in the future
 */
export function isDateInFuture(value: any): boolean {
  if (!(value instanceof Date) && typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && date > new Date();
}

/**
 * Validator for URL format
 */
@ValidatorConstraint({ name: 'isUrl', async: false })
export class IsUrlConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid URL`;
  }
}

/**
 * Custom URL validation decorator
 */
export function IsUrlField(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {},
      constraints: [],
      validator: IsUrlConstraint,
    });
  };
}
