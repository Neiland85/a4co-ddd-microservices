import type { Artisan } from '../app/api/artisans/route';
interface UseArtisansOptions {
    municipality?: string;
    specialty?: string;
    verified?: boolean;
    search?: string;
    autoFetch?: boolean;
}
export declare function useArtisans(options?: UseArtisansOptions): {
    fetchArtisans: (customOptions?: UseArtisansOptions) => Promise<void>;
    refetch: () => Promise<void>;
    clearError: () => void;
    searchArtisans: (searchTerm: string) => Promise<void>;
    filterByMunicipality: (municipality: string) => Promise<void>;
    filterBySpecialty: (specialty: string) => Promise<void>;
    getVerifiedArtisans: () => Promise<void>;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    verifiedArtisans: Artisan[];
    topRatedArtisans: Artisan[];
    artisans: Artisan[];
    loading: boolean;
    error: string | null;
    total: number;
    filters: {
        municipality?: string;
        specialty?: string;
        verified?: boolean;
        search?: string;
    };
};
export declare function useVerifiedArtisans(): {
    fetchArtisans: (customOptions?: UseArtisansOptions) => Promise<void>;
    refetch: () => Promise<void>;
    clearError: () => void;
    searchArtisans: (searchTerm: string) => Promise<void>;
    filterByMunicipality: (municipality: string) => Promise<void>;
    filterBySpecialty: (specialty: string) => Promise<void>;
    getVerifiedArtisans: () => Promise<void>;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    verifiedArtisans: Artisan[];
    topRatedArtisans: Artisan[];
    artisans: Artisan[];
    loading: boolean;
    error: string | null;
    total: number;
    filters: {
        municipality?: string;
        specialty?: string;
        verified?: boolean;
        search?: string;
    };
};
export declare function useArtisansByMunicipality(municipality: string): {
    fetchArtisans: (customOptions?: UseArtisansOptions) => Promise<void>;
    refetch: () => Promise<void>;
    clearError: () => void;
    searchArtisans: (searchTerm: string) => Promise<void>;
    filterByMunicipality: (municipality: string) => Promise<void>;
    filterBySpecialty: (specialty: string) => Promise<void>;
    getVerifiedArtisans: () => Promise<void>;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    verifiedArtisans: Artisan[];
    topRatedArtisans: Artisan[];
    artisans: Artisan[];
    loading: boolean;
    error: string | null;
    total: number;
    filters: {
        municipality?: string;
        specialty?: string;
        verified?: boolean;
        search?: string;
    };
};
export declare function useArtisansBySpecialty(specialty: string): {
    fetchArtisans: (customOptions?: UseArtisansOptions) => Promise<void>;
    refetch: () => Promise<void>;
    clearError: () => void;
    searchArtisans: (searchTerm: string) => Promise<void>;
    filterByMunicipality: (municipality: string) => Promise<void>;
    filterBySpecialty: (specialty: string) => Promise<void>;
    getVerifiedArtisans: () => Promise<void>;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    verifiedArtisans: Artisan[];
    topRatedArtisans: Artisan[];
    artisans: Artisan[];
    loading: boolean;
    error: string | null;
    total: number;
    filters: {
        municipality?: string;
        specialty?: string;
        verified?: boolean;
        search?: string;
    };
};
export declare function useArtisanSearch(): {
    searchTerm: string;
    setSearchTerm: import("react").Dispatch<import("react").SetStateAction<string>>;
    isSearching: boolean;
    fetchArtisans: (customOptions?: UseArtisansOptions) => Promise<void>;
    refetch: () => Promise<void>;
    clearError: () => void;
    searchArtisans: (searchTerm: string) => Promise<void>;
    filterByMunicipality: (municipality: string) => Promise<void>;
    filterBySpecialty: (specialty: string) => Promise<void>;
    getVerifiedArtisans: () => Promise<void>;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    verifiedArtisans: Artisan[];
    topRatedArtisans: Artisan[];
    artisans: Artisan[];
    loading: boolean;
    error: string | null;
    total: number;
    filters: {
        municipality?: string;
        specialty?: string;
        verified?: boolean;
        search?: string;
    };
};
export declare function useArtisanStats(): {
    stats: {
        total: number;
        verified: number;
        municipalities: number;
        specialties: number;
        averageRating: number;
        totalExperience: number;
    };
    loading: boolean;
    error: string | null;
};
export {};
//# sourceMappingURL=useArtisans.d.ts.map