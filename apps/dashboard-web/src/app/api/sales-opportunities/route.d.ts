import { NextRequest, NextResponse } from 'next/server';
interface LocalProduct {
    id: string;
    name: string;
    category: 'aceite' | 'queso' | 'jamón' | 'miel' | 'vino' | 'aceitunas' | 'artesanía';
    producer: string;
    location: {
        municipality: string;
        coordinates: [number, number];
    };
    price: number;
    unit: string;
    seasonal: boolean;
    harvestDate?: string;
    description: string;
    images: string[];
    certifications: string[];
    available: boolean;
    stock: number;
}
interface SalesOpportunity {
    id: string;
    type: 'direct_sale' | 'market_event' | 'festival' | 'cooperative';
    title: string;
    location: string;
    date: string;
    products: LocalProduct[];
    contactInfo: {
        name: string;
        phone: string;
        email: string;
    };
    priority: 'alta' | 'media' | 'baja';
}
export declare function GET(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    data: {
        opportunities: SalesOpportunity[];
        total: number;
        filters: {
            type: string | null;
            location: string | null;
            category: string | null;
        };
    };
    meta: {
        timestamp: string;
        region: string;
        season: string;
    };
}> | NextResponse<{
    success: boolean;
    error: string;
    code: string;
}>>;
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    error: string;
    code: string;
}> | NextResponse<{
    success: boolean;
    data: SalesOpportunity;
    message: string;
}>>;
export type { LocalProduct, SalesOpportunity };
//# sourceMappingURL=route.d.ts.map