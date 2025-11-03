import { type NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    token: any;
    user: {
        id: string;
        email: any;
        name: string;
        role: string;
    };
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map