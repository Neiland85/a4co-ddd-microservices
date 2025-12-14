import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

/**
 * Default validation pipe options used across all services
 */
export const DEFAULT_VALIDATION_OPTIONS: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: false,
  },
};

/**
 * Creates a validation pipe with standard options
 * @param customOptions - Optional custom validation options to override defaults
 * @returns ValidationPipe instance
 */
export function createValidationPipe(
  customOptions?: Partial<ValidationPipeOptions>,
): ValidationPipe {
  return new ValidationPipe({
    ...DEFAULT_VALIDATION_OPTIONS,
    ...customOptions,
  });
}

/**
 * Validation options for strict mode (additional security)
 */
export const STRICT_VALIDATION_OPTIONS: ValidationPipeOptions = {
  ...DEFAULT_VALIDATION_OPTIONS,
  forbidUnknownValues: true,
  disableErrorMessages: process.env['NODE_ENV'] === 'production',
};

/**
 * Creates a strict validation pipe
 * @param customOptions - Optional custom validation options to override defaults
 * @returns ValidationPipe instance with strict options
 */
export function createStrictValidationPipe(
  customOptions?: Partial<ValidationPipeOptions>,
): ValidationPipe {
  return new ValidationPipe({
    ...STRICT_VALIDATION_OPTIONS,
    ...customOptions,
  });
}
