import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<({
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    user: string;
    details?: undefined;
} | {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    details: {
        memory: string;
    };
    user?: undefined;
})[]>>;
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    id: string;
}>>;
//# sourceMappingURL=route.d.ts.map