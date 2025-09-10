import type { LocalProduct } from '../app/api/sales-opportunities/route';
interface UseProductsOptions {
    category?: string;
    location?: string;
    seasonal?: boolean;
    available?: boolean;
    search?: string;
    limit?: number;
    autoFetch?: boolean;
}
export declare function useProducts(options?: UseProductsOptions): {
    fetchProducts: (customOptions?: UseProductsOptions, append?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    refetch: () => Promise<void>;
    reset: () => void;
    clearError: () => void;
    searchProducts: (searchTerm: string) => Promise<void>;
    filterByCategory: (category: string) => Promise<void>;
    filterByLocation: (location: string) => Promise<void>;
    getSeasonalProducts: () => Promise<void>;
    getAvailableProducts: () => Promise<void>;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    canLoadMore: boolean;
    products: LocalProduct[];
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
    filters: {
        category?: string;
        location?: string;
        seasonal?: boolean;
        available?: boolean;
        search?: string;
    };
};
export declare function useProductsByCategory(category: string): {
    fetchProducts: (customOptions?: UseProductsOptions, append?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    refetch: () => Promise<void>;
    reset: () => void;
    clearError: () => void;
    searchProducts: (searchTerm: string) => Promise<void>;
    filterByCategory: (category: string) => Promise<void>;
    filterByLocation: (location: string) => Promise<void>;
    getSeasonalProducts: () => Promise<void>;
    getAvailableProducts: () => Promise<void>;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    canLoadMore: boolean;
    products: LocalProduct[];
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
    filters: {
        category?: string;
        location?: string;
        seasonal?: boolean;
        available?: boolean;
        search?: string;
    };
};
export declare function useSeasonalProducts(): {
    fetchProducts: (customOptions?: UseProductsOptions, append?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    refetch: () => Promise<void>;
    reset: () => void;
    clearError: () => void;
    searchProducts: (searchTerm: string) => Promise<void>;
    filterByCategory: (category: string) => Promise<void>;
    filterByLocation: (location: string) => Promise<void>;
    getSeasonalProducts: () => Promise<void>;
    getAvailableProducts: () => Promise<void>;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    canLoadMore: boolean;
    products: LocalProduct[];
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
    filters: {
        category?: string;
        location?: string;
        seasonal?: boolean;
        available?: boolean;
        search?: string;
    };
};
export declare function useAvailableProducts(): {
    fetchProducts: (customOptions?: UseProductsOptions, append?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    refetch: () => Promise<void>;
    reset: () => void;
    clearError: () => void;
    searchProducts: (searchTerm: string) => Promise<void>;
    filterByCategory: (category: string) => Promise<void>;
    filterByLocation: (location: string) => Promise<void>;
    getSeasonalProducts: () => Promise<void>;
    getAvailableProducts: () => Promise<void>;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    canLoadMore: boolean;
    products: LocalProduct[];
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
    filters: {
        category?: string;
        location?: string;
        seasonal?: boolean;
        available?: boolean;
        search?: string;
    };
};
export declare function useProductSearch(): {
    searchTerm: string;
    setSearchTerm: import("react").Dispatch<import("react").SetStateAction<string>>;
    clearSearch: () => void;
    resetProducts: () => void;
    isSearching: boolean;
    fetchProducts: (customOptions?: UseProductsOptions, append?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    refetch: () => Promise<void>;
    reset: () => void;
    clearError: () => void;
    searchProducts: (searchTerm: string) => Promise<void>;
    filterByCategory: (category: string) => Promise<void>;
    filterByLocation: (location: string) => Promise<void>;
    getSeasonalProducts: () => Promise<void>;
    getAvailableProducts: () => Promise<void>;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    canLoadMore: boolean;
    products: LocalProduct[];
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
    filters: {
        category?: string;
        location?: string;
        seasonal?: boolean;
        available?: boolean;
        search?: string;
    };
};
export {};
//# sourceMappingURL=useProducts.d.ts.map