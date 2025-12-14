import { Logger } from '@nestjs/common';

/**
 * Base repository interface defining common CRUD operations
 * @template T - The entity type
 * @template ID - The ID type (typically string or number)
 */
export interface IBaseRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Partial<T>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

/**
 * Base repository class providing common repository patterns
 * This is an abstract class that can be extended by specific repositories
 * 
 * @template T - The entity type
 * @template ID - The ID type (typically string or number)
 */
export abstract class BaseRepository<T, ID = string> implements IBaseRepository<T, ID> {
  protected logger: Logger;

  constructor(
    protected entityName: string,
  ) {
    this.logger = new Logger(`${entityName}Repository`);
  }

  /**
   * Finds an entity by its ID
   * @param id - The entity ID
   * @returns The entity if found, null otherwise
   */
  abstract findById(id: ID): Promise<T | null>;

  /**
   * Finds all entities
   * @returns Array of all entities
   */
  abstract findAll(): Promise<T[]>;

  /**
   * Creates a new entity
   * @param entity - The entity data
   * @returns The created entity
   */
  abstract create(entity: Partial<T>): Promise<T>;

  /**
   * Updates an existing entity
   * @param id - The entity ID
   * @param entity - The updated entity data
   * @returns The updated entity
   */
  abstract update(id: ID, entity: Partial<T>): Promise<T>;

  /**
   * Deletes an entity by its ID
   * @param id - The entity ID
   */
  abstract delete(id: ID): Promise<void>;

  /**
   * Logs a repository operation
   * @param operation - The operation being performed
   * @param details - Optional operation details
   */
  protected logOperation(operation: string, details?: any): void {
    this.logger.log(`${operation}`, details);
  }

  /**
   * Handles repository errors
   * @param error - The error that occurred
   * @param operation - The operation that failed
   */
  protected handleError(error: unknown, operation: string): never {
    const message = error instanceof Error ? error.message : 'Unknown error';
    this.logger.error(`Failed to ${operation}: ${message}`, error);
    throw error;
  }
}
