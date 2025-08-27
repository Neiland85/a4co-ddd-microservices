// DTOs de respuesta comunes

export interface BaseResponse {
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface SuccessResponse<T = any> extends BaseResponse {
  success: true;
  data: T;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T = any> extends BaseResponse {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Factories para crear respuestas
export const createSuccessResponse = <T>(data: T, message: string = ''): SuccessResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: new Date()
});

export const createErrorResponse = (code: string, message: string, details?: any): ErrorResponse => ({
  success: false,
  error: { code, message, details },
  timestamp: new Date()
});

export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1
  },
  timestamp: new Date()
});
