import { NextRequest, NextResponse } from 'next/server';
interface Artisan {
    id: string;
    name: string;
    specialty: string;
    location: {
        municipality: string;
        address: string;
        coordinates: [number, number];
    };
    contact: {
        phone: string;
        email: string;
        website?: string;
    };
    description: string;
    experience: number;
    certifications: string[];
    products: string[];
    images: string[];
    schedules: {
        [key: string]: string;
    };
    services: string[];
    rating: number;
    reviewsCount: number;
    verified: boolean;
}
export declare function GET(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    data: {
        artisans: Artisan[];
        total: number;
        filters: {
            municipality: string | null;
            specialty: string | null;
            verified: boolean;
            search: string | null;
        };
    };
    meta: {
        timestamp: string;
        region: string;
        specialties: string[];
    };
}> | NextResponse<{
    success: boolean;
    error: string;
    code: string;
}>>;
export type { Artisan };
//# sourceMappingURL=route.d.ts.map