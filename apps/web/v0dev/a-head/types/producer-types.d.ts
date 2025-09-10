export interface Coordinates {
    lat: number;
    lng: number;
}
export interface Producer {
    id: string;
    name: string;
    category: string;
    location: string;
    lat: number;
    lng: number;
    rating: number;
    reviewCount: number;
    distance: number;
    isOpen: boolean;
    specialties: string[];
    description?: string;
    phone?: string;
    email?: string;
    website?: string;
    hours?: string;
    image?: string;
}
export interface ProducerFilter {
    category?: string;
    maxDistance?: number;
    minRating?: number;
    certifications?: string[];
    isOpen?: boolean;
    searchQuery?: string;
}
export interface ProducerFilters {
    search: string;
    category: string;
    maxDistance: number;
    minRating: number;
    onlyOpen: boolean;
}
export interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}
export interface MapFilters {
    categories: string[];
    maxDistance: number;
    searchQuery: string;
    minRating: number;
}
export interface ProducerStats {
    total: number;
    categories: number;
    averageRating: number;
    openNow: number;
}
export interface MapViewProps {
    producers: Producer[];
    filters: MapFilters;
    onFiltersChange: (filters: MapFilters) => void;
    userLocation?: {
        lat: number;
        lng: number;
    };
    className?: string;
}
//# sourceMappingURL=producer-types.d.ts.map