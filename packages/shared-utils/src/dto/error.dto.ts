/**
 * Standard error codes used across the application
 */
export enum ErrorCode {
  // Validation errors (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Authentication errors (401)
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',

  // Authorization errors (403)
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Resource errors (404)
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

  // Conflict errors (409)
  CONFLICT = 'CONFLICT',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',

  // Business logic errors (422)
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',

  // Server errors (500)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',

  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

/**
 * Error detail interface
 */
export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

/**
 * Detailed error DTO
 */
export class ErrorDto {
  /**
   * Error code from ErrorCode enum
   */
  code: string;

  /**
   * Human-readable error message
   */
  message: string;

  /**
   * HTTP status code
   */
  statusCode: number;

  /**
   * Timestamp when the error occurred
   */
  timestamp: string;

  /**
   * Request path where the error occurred
   */
  path?: string;

  /**
   * Detailed error information
   */
  details?: ErrorDetail[];

  /**
   * Stack trace (only in development)
   */
  stack?: string;

  constructor(
    code: string,
    message: string,
    statusCode: number,
    details?: ErrorDetail[],
  ) {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    if (details) {
      this.details = details;
    }
  }
}

/**
 * Creates a validation error DTO
 * @param message - Error message
 * @param details - Validation error details
 * @returns ErrorDto instance
 */
export function createValidationError(
  message: string,
  details?: ErrorDetail[],
): ErrorDto {
  return new ErrorDto(ErrorCode.VALIDATION_ERROR, message, 400, details);
}

/**
 * Creates a not found error DTO
 * @param resource - The resource that was not found
 * @param identifier - The resource identifier
 * @returns ErrorDto instance
 */
export function createNotFoundError(resource: string, identifier?: string): ErrorDto {
  const message = identifier
    ? `${resource} with identifier '${identifier}' not found`
    : `${resource} not found`;
  return new ErrorDto(ErrorCode.NOT_FOUND, message, 404);
}

/**
 * Creates an unauthorized error DTO
 * @param message - Optional custom message
 * @returns ErrorDto instance
 */
export function createUnauthorizedError(
  message: string = 'Unauthorized access',
): ErrorDto {
  return new ErrorDto(ErrorCode.UNAUTHORIZED, message, 401);
}

/**
 * Creates a forbidden error DTO
 * @param message - Optional custom message
 * @returns ErrorDto instance
 */
export function createForbiddenError(
  message: string = 'Access forbidden',
): ErrorDto {
  return new ErrorDto(ErrorCode.FORBIDDEN, message, 403);
}

/**
 * Creates a conflict error DTO
 * @param resource - The resource that caused the conflict
 * @param message - Optional custom message
 * @returns ErrorDto instance
 */
export function createConflictError(
  resource: string,
  message?: string,
): ErrorDto {
  const errorMessage = message || `${resource} already exists`;
  return new ErrorDto(ErrorCode.CONFLICT, errorMessage, 409);
}

/**
 * Creates an internal server error DTO
 * @param message - Optional custom message
 * @returns ErrorDto instance
 */
export function createInternalError(
  message: string = 'Internal server error',
): ErrorDto {
  return new ErrorDto(ErrorCode.INTERNAL_ERROR, message, 500);
}
