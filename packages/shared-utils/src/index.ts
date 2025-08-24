// Domain-Driven Design base classes and utilities
export * from './domain/base-entity';
export * from './domain/value-object';
export * from './domain/domain-event';
export * from './domain/aggregate-root';

// DTOs
export * from './dto/base-dto';
export * from './dto/pagination-dto';

// Utils
export * from './utils/date.util';
export * from './utils/uuid.util';

// Constants
export * from './constants/error-codes';

// Types
export * from './types/common.types';

// Application layer patterns
export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}

// Repository pattern
export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}
