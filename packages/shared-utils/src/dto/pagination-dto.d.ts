export declare class PaginationDto {
    page?: number;
    limit?: number;
    get skip(): number;
}
export declare class PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    constructor(data: T[], total: number, page: number, limit: number);
}
//# sourceMappingURL=pagination-dto.d.ts.map