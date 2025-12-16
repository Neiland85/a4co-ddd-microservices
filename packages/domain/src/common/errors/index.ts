/**
 * Shared Domain Errors
 * 
 * Common error classes used across bounded contexts
 */

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'DomainError';
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string, details?: unknown) {
    super(message, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFLICT', details);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string, details?: unknown) {
    super(message, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string, details?: unknown) {
    super(message, 'FORBIDDEN', details);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(message: string, details?: unknown) {
    super(message, 'BUSINESS_RULE_VIOLATION', details);
    this.name = 'BusinessRuleViolationError';
    Object.setPrototypeOf(this, BusinessRuleViolationError.prototype);
  }
}
