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
export declare const createSuccessResponse: <T>(data: T, message?: string) => SuccessResponse<T>;
export declare const createErrorResponse: (code: string, message: string, details?: any) => ErrorResponse;
export declare const createPaginatedResponse: <T>(data: T[], page: number, limit: number, total: number) => PaginatedResponse<T>;
//# sourceMappingURL=response-dto.d.ts.map