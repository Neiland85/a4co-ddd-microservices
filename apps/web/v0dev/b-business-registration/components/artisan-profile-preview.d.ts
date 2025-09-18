interface ArtisanProfilePreviewProps {
    artisanName?: string;
    niche?: string;
    specialty?: string;
    description?: string;
    culturalOrigin?: string;
    techniques: string[];
    materials?: string;
    experience?: string;
    priceRange?: string;
    customOrders?: boolean;
    workshops?: boolean;
    certifications?: string;
    additionalInfo?: string;
    images: string[];
    documents: File[];
}
export declare function ArtisanProfilePreview({ artisanName, niche, specialty, description, culturalOrigin, techniques, materials, experience, priceRange, customOrders, workshops, certifications, additionalInfo, images, documents, }: ArtisanProfilePreviewProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=artisan-profile-preview.d.ts.map