import { Logger } from '@nestjs/common';

/**
 * Base service class for all services
 * Provides common functionality like logging, validation, error handling
 */
export abstract class BaseService {
  protected logger: Logger;

  constructor(private serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  /**
   * Logs a message with optional context
   * @param message - The message to log
   * @param context - Optional context data
   */
  protected log(message: string, context?: any): void {
    this.logger.log(message, context);
  }

  /**
   * Validates that a value is present (not null, undefined, or empty)
   * @param value - The value to validate
   * @param fieldName - The name of the field being validated
   * @returns The validated value
   * @throws Error if the value is missing
   */
  protected validateRequired(value: any, fieldName: string): any {
    if (value === null || value === undefined || value === '') {
      throw new Error(`${fieldName} is required`);
    }
    return value;
  }

  /**
   * Validates an ID field (must be a non-empty string or number)
   * @param value - The ID value to validate
   * @param fieldName - The name of the field being validated
   * @returns The validated ID value
   * @throws Error if the ID is invalid
   */
  protected validateId(value: any, fieldName: string): string {
    if (value === null || value === undefined || value === '') {
      throw new Error(`${fieldName} is required`);
    }
    
    // Convert to string if it's a number
    const id = typeof value === 'number' ? String(value) : value;
    
    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error(`${fieldName} must be a valid ID`);
    }
    
    return id.trim();
  }

  /**
   * Creates a standardized success message
   * @param entity - The entity type (e.g., 'User', 'Product')
   * @param action - The action performed (e.g., 'created', 'updated')
   * @param id - Optional ID or additional information
   * @returns Formatted success message
   */
  protected createSuccessMessage(entity: string, action: string, id?: string): string {
    if (id) {
      return `${entity} ${id} ${action}.`;
    }
    return `${entity} ${action}.`;
  }

  /**
   * Handles service errors with logging
   * @param error - The error to handle
   * @param context - The context where the error occurred
   * @throws The original error after logging
   */
  protected handleServiceError(error: any, context: string): never {
    this.logger.error(`Error in ${context}:`, error);
    throw error;
  }
}
