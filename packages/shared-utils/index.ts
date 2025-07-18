// Domain-Driven Design base classes and utilities
export * from './src/domain/base-entity';
export * from './src/domain/value-object';
export * from './src/domain/domain-event';
export * from './src/domain/aggregate-root';

// Common DTOs and validation
export * from './src/dto/base-dto';
export * from './src/dto/pagination-dto';

// Utility functions
export * from './src/utils/uuid.util';
export * from './src/utils/date.util';

// Constants and enums
export * from './src/constants/error-codes';

// Types
export * from './src/types/common.types';

// Legacy functions (to be refactored)
export function formatDate(date: Date): string {
  return date.toISOString();
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}
