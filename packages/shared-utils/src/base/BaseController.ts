/**
 * Base controller class providing common functionality
 * for all controllers in the application.
 * 
 * @template TService - The service type this controller uses
 */
export abstract class BaseController<TService> {
  protected service: TService;

  /**
   * Creates an instance of BaseController
   * @param ServiceClass - The service class constructor
   */
  constructor(ServiceClass: new () => TService) {
    this.service = new ServiceClass();
  }

  /**
   * Validates a request object ensuring all required fields are present
   * @template T - The request type
   * @param request - The request object to validate
   * @param requiredFields - Array of field names that must be present
   * @returns The validated request object
   * @throws Error if any required field is missing or invalid
   */
  protected validateRequest<T extends Record<string, any>>(
    request: T,
    requiredFields: (keyof T)[],
  ): T {
    if (!request || typeof request !== 'object') {
      throw new Error('Invalid request: request must be an object');
    }

    for (const field of requiredFields) {
      if (request[field] === undefined || request[field] === null || request[field] === '') {
        throw new Error(`Invalid request: ${String(field)} is required`);
      }
    }

    return request;
  }

  /**
   * Formats a successful response
   * @template T - The response data type
   * @param data - The data to return
   * @returns Formatted response object
   */
  protected formatResponse<T>(data: T): { success: boolean; data: T } {
    return {
      success: true,
      data,
    };
  }

  /**
   * Handles errors and returns a formatted error response
   * @param error - The error to handle
   * @returns Formatted error response
   */
  protected handleError(error: unknown): { success: boolean; error: string } {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
