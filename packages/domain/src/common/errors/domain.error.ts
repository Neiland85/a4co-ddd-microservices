/**
 * Base class for all domain errors
 */
export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly metadata?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when a business rule is violated
 */
export class BusinessRuleViolationError extends DomainError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'BUSINESS_RULE_VIOLATION', metadata);
  }
}

/**
 * Error thrown when an aggregate/entity is not found
 */
export class NotFoundError extends DomainError {
  constructor(entityName: string, identifier: string, metadata?: Record<string, any>) {
    super(
      `${entityName} with identifier ${identifier} not found`,
      'NOT_FOUND',
      metadata,
    );
  }
}

/**
 * Error thrown when trying to create a duplicate entity
 */
export class DuplicateError extends DomainError {
  constructor(entityName: string, identifier: string, metadata?: Record<string, any>) {
    super(
      `${entityName} with identifier ${identifier} already exists`,
      'DUPLICATE',
      metadata,
    );
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends DomainError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', metadata);
  }
}

/**
 * Error thrown when an invalid state transition is attempted
 */
export class InvalidStateTransitionError extends DomainError {
  constructor(
    from: string,
    to: string,
    entityName: string,
    metadata?: Record<string, any>,
  ) {
    super(
      `Cannot transition ${entityName} from state ${from} to ${to}`,
      'INVALID_STATE_TRANSITION',
      metadata,
    );
  }
}

/**
 * Error thrown when an operation fails due to concurrency issues
 */
export class ConcurrencyError extends DomainError {
  constructor(entityName: string, identifier: string, metadata?: Record<string, any>) {
    super(
      `Concurrency conflict for ${entityName} with identifier ${identifier}`,
      'CONCURRENCY_ERROR',
      metadata,
    );
  }
}
