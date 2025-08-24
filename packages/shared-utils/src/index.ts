// Domain-Driven Design base classes and utilities
export * from './domain';
export * from './dto';
export * from './utils';
export * from './events';
export * from './constants';
export * from './types';
export * from './saga/saga-orchestrator';

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
