/**
 * Standard success response structure
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp?: string;
}

/**
 * Generic API response that can be either success or error
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Creates a success response
 * @param data - The response data
 * @param message - Optional success message
 * @returns Formatted success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
): SuccessResponse<T> {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
  if (message) {
    response.message = message;
  }
  return response;
}

/**
 * Creates an error response
 * @param code - Error code
 * @param message - Error message
 * @param details - Optional error details
 * @returns Formatted error response
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: any,
): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Health check response structure
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  service: string;
  version: string;
  dependencies?: Record<string, 'ok' | 'error'>;
}

/**
 * Creates a health check response
 * @param serviceName - The name of the service
 * @param version - The service version
 * @param dependencies - Optional dependency health status
 * @returns Health check response
 */
export function createHealthCheckResponse(
  serviceName: string,
  version: string,
  dependencies?: Record<string, 'ok' | 'error'>,
): HealthCheckResponse {
  const hasErrors = dependencies
    ? Object.values(dependencies).some((status) => status === 'error')
    : false;

  return {
    status: hasErrors ? 'error' : 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: serviceName,
    version,
    ...(dependencies && { dependencies }),
  };
}
