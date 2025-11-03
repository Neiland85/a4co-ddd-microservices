import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}[]>>;
//# sourceMappingURL=route.d.ts.map