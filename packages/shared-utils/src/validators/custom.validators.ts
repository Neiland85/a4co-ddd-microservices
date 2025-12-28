import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validator to check if a field matches another field
 * Useful for password confirmation fields
 */
@ValidatorConstraint({ name: 'matchesField', async: false })
export class MatchesFieldConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must match ${relatedPropertyName}`;
  }
}

/**
 * Custom decorator to validate that a field matches another field
 * @param property - The property name to match against
 * @param validationOptions - Optional validation options
 */
export function MatchesField(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {},
      constraints: [property],
      validator: MatchesFieldConstraint,
    });
  };
}

/**
 * Validator for Spanish DNI/NIE format
 */
@ValidatorConstraint({ name: 'isDniNie', async: false })
export class IsDniNieConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    
    const dniNieRegex = /^[XYZ]?\d{7,8}[A-Z]$/i;
    if (!dniNieRegex.test(value)) return false;

    // Validate letter
    const dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const nie = value.toUpperCase().replace(/^[XYZ]/, (match) => {
      return { X: '0', Y: '1', Z: '2' }[match] || match;
    });
    
    const number = parseInt(nie.slice(0, -1), 10);
    const letter = nie.slice(-1);
    
    return dniLetters[number % 23] === letter;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid Spanish DNI or NIE`;
  }
}

/**
 * Custom decorator for Spanish DNI/NIE validation
 */
export function IsDniNie(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {},
      constraints: [],
      validator: IsDniNieConstraint,
    });
  };
}

/**
 * Validator for Spanish postal code
 */
@ValidatorConstraint({ name: 'isSpanishPostalCode', async: false })
export class IsSpanishPostalCodeConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    const postalCodeRegex = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
    return postalCodeRegex.test(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid Spanish postal code`;
  }
}

/**
 * Custom decorator for Spanish postal code validation
 */
export function IsSpanishPostalCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {},
      constraints: [],
      validator: IsSpanishPostalCodeConstraint,
    });
  };
}

/**
 * Validator for IBAN format
 */
@ValidatorConstraint({ name: 'isIban', async: false })
export class IsIbanConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    
    // Remove spaces and convert to uppercase
    const iban = value.replace(/\s/g, '').toUpperCase();
    
    // Check length (15-34 characters)
    if (iban.length < 15 || iban.length > 34) return false;
    
    // Check format
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]+$/;
    if (!ibanRegex.test(iban)) return false;
    
    // Validate checksum using mod-97 algorithm
    const rearranged = iban.slice(4) + iban.slice(0, 4);
    const numericIban = rearranged.replace(/[A-Z]/g, (char) =>
      (char.charCodeAt(0) - 55).toString(),
    );
    
    // Calculate mod 97
    let remainder = numericIban;
    while (remainder.length > 2) {
      const block = remainder.slice(0, 9);
      remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(9);
    }
    
    return parseInt(remainder, 10) % 97 === 1;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid IBAN`;
  }
}

/**
 * Custom decorator for IBAN validation
 */
export function IsIban(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {},
      constraints: [],
      validator: IsIbanConstraint,
    });
  };
}

/**
 * Validator for credit card number (Luhn algorithm)
 */
@ValidatorConstraint({ name: 'isCreditCard', async: false })
export class IsCreditCardConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    
    const sanitized = value.replace(/\s|-/g, '');
    if (!/^\d{13,19}$/.test(sanitized)) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i], 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid credit card number`;
  }
}

/**
 * Custom decorator for credit card validation
 */
export function IsCreditCard(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {},
      constraints: [],
      validator: IsCreditCardConstraint,
    });
  };
}
