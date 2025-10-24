import { NextRequest, NextResponse } from 'next/server';
import type { LocalProduct } from '../sales-opportunities/route';
export declare function GET(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    data: {
        products: LocalProduct[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            hasMore: boolean;
        };
        filters: {
            category: string | null;
            location: string | null;
            seasonal: boolean;
            available: boolean;
            search: string | null;
        };
    };
    meta: {
        timestamp: string;
        region: string;
        categories: string[];
    };
}> | NextResponse<{
    success: boolean;
    error: string;
    code: string;
}>>;
export declare function getProductById(id: string): Promise<NextResponse<{
    success: boolean;
    error: string;
    code: string;
}> | NextResponse<{
    success: boolean;
    data: LocalProduct;
}>>;
//# sourceMappingURL=route.d.ts.map