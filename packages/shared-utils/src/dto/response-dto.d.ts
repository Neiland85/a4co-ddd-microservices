export interface BaseResponse {
    success: boolean;
    message?: string;
    timestamp: Date;
}
export interface SuccessResponse<T = unknown> extends BaseResponse {
    success: true;
    data: T;
}
export interface ErrorResponse extends BaseResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}
export interface PaginatedResponse<T = unknown> extends BaseResponse {
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
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
export declare const createSuccessResponse: <T>(data: T, message?: string) => SuccessResponse<T>;
export declare const createErrorResponse: (code: string, message: string, details?: unknown) => ErrorResponse;
export declare const createPaginatedResponse: <T>(data: T[], page: number, limit: number, total: number) => PaginatedResponse<T>;
//# sourceMappingURL=response-dto.d.ts.map