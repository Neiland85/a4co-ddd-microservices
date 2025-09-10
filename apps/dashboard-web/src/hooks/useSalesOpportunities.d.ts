interface SalesOpportunity {
    id: string;
    title: string;
    description: string;
    type: string;
    location: string;
    category: string;
    priority: 'baja' | 'media' | 'alta';
    value: number;
    status: 'abierta' | 'en_proceso' | 'cerrada';
    createdAt: string;
    updatedAt: string;
}
interface UseSalesOpportunitiesOptions {
    type?: string;
    location?: string;
    category?: string;
    autoFetch?: boolean;
}
export declare function useSalesOpportunities(options?: UseSalesOpportunitiesOptions): {
    fetchOpportunities: (customFilters?: {}) => Promise<void>;
    createOpportunity: (opportunityData: Partial<SalesOpportunity>) => Promise<any>;
    refetch: () => Promise<void>;
    clearError: () => void;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    opportunities: SalesOpportunity[];
    loading: boolean;
    error: string | null;
    total: number;
    filters: {
        type?: string;
        location?: string;
        category?: string;
    };
};
export declare function useHighPriorityOpportunities(): {
    opportunities: SalesOpportunity[];
    loading: boolean;
    error: string | null;
    count: number;
};
export declare function useLocalOpportunities(municipality: string): {
    fetchOpportunities: (customFilters?: {}) => Promise<void>;
    createOpportunity: (opportunityData: Partial<SalesOpportunity>) => Promise<any>;
    refetch: () => Promise<void>;
    clearError: () => void;
    hasData: boolean;
    isEmpty: boolean;
    isFiltered: boolean;
    opportunities: SalesOpportunity[];
    loading: boolean;
    error: string | null;
    total: number;
    filters: {
        type?: string;
        location?: string;
        category?: string;
    };
};
export {};
//# sourceMappingURL=useSalesOpportunities.d.ts.map