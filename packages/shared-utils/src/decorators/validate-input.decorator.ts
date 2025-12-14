import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

/**
 * Custom parameter decorator for validating and transforming input
 * @param dtoClass - The DTO class to validate against
 */
export const ValidateInput = createParamDecorator(
  async (dtoClass: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;

    if (!dtoClass) {
      return body;
    }

    // Transform plain object to class instance
    const dtoInstance = plainToClass(dtoClass, body);

    // Validate the instance
    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => ({
        field: error.property,
        constraints: error.constraints,
      }));

      throw new Error(
        `Validation failed: ${JSON.stringify(formattedErrors)}`,
      );
    }

    return dtoInstance;
  },
);

/**
 * Decorator to mark a field as trimmed (removes leading/trailing whitespace)
 */
export function Trim() {
  return function (target: any, propertyKey: string) {
    let value = target[propertyKey];

    const getter = function () {
      return value;
    };

    const setter = function (newVal: any) {
      value = typeof newVal === 'string' ? newVal.trim() : newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

/**
 * Decorator to mark a field as lowercase
 */
export function ToLowerCase() {
  return function (target: any, propertyKey: string) {
    let value = target[propertyKey];

    const getter = function () {
      return value;
    };

    const setter = function (newVal: any) {
      value = typeof newVal === 'string' ? newVal.toLowerCase() : newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

/**
 * Decorator to mark a field as uppercase
 */
export function ToUpperCase() {
  return function (target: any, propertyKey: string) {
    let value = target[propertyKey];

    const getter = function () {
      return value;
    };

    const setter = function (newVal: any) {
      value = typeof newVal === 'string' ? newVal.toUpperCase() : newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
