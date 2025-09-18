import { type NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    event: any;
    stats: any;
    recommendations: string[];
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map