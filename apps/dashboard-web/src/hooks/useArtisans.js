// Hook para gestión de artesanos/productores
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useArtisans = useArtisans;
exports.useVerifiedArtisans = useVerifiedArtisans;
exports.useArtisansByMunicipality = useArtisansByMunicipality;
exports.useArtisansBySpecialty = useArtisansBySpecialty;
exports.useArtisanSearch = useArtisanSearch;
exports.useArtisanStats = useArtisanStats;
const react_1 = require("react");
function useArtisans(options = {}) {
    const { autoFetch = true } = options;
    const [state, setState] = (0, react_1.useState)({
        artisans: [],
        loading: false,
        error: null,
        total: 0,
        filters: {},
    });
    // Memoizar las opciones para evitar recreaciones innecesarias
    const memoizedOptions = (0, react_1.useMemo)(() => options, [options.municipality, options.specialty, options.verified, options.search, options.autoFetch]);
    const fetchArtisans = (0, react_1.useCallback)(async (customOptions) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const finalOptions = { ...memoizedOptions, ...customOptions };
            const params = new URLSearchParams();
            if (finalOptions.municipality)
                params.append('municipality', finalOptions.municipality);
            if (finalOptions.specialty)
                params.append('specialty', finalOptions.specialty);
            if (finalOptions.verified !== undefined)
                params.append('verified', finalOptions.verified.toString());
            if (finalOptions.search)
                params.append('search', finalOptions.search);
            const response = await fetch(`/api/artisans?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success) {
                setState(prev => ({
                    ...prev,
                    artisans: result.data.artisans,
                    total: result.data.total,
                    filters: result.data.filters,
                    loading: false,
                }));
            }
            else {
                throw new Error(result.error || 'Error desconocido');
            }
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Error al cargar artesanos',
            }));
        }
    }, [memoizedOptions]);
    const searchArtisans = (0, react_1.useCallback)(async (searchTerm) => {
        await fetchArtisans({ search: searchTerm });
    }, [fetchArtisans]);
    const filterByMunicipality = (0, react_1.useCallback)(async (municipality) => {
        await fetchArtisans({ municipality });
    }, [fetchArtisans]);
    const filterBySpecialty = (0, react_1.useCallback)(async (specialty) => {
        await fetchArtisans({ specialty });
    }, [fetchArtisans]);
    const getVerifiedArtisans = (0, react_1.useCallback)(async () => {
        await fetchArtisans({ verified: true });
    }, [fetchArtisans]);
    const refetch = (0, react_1.useCallback)(() => {
        return fetchArtisans();
    }, [fetchArtisans]);
    const clearError = (0, react_1.useCallback)(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);
    // Auto-fetch en mount si está habilitado
    (0, react_1.useEffect)(() => {
        if (autoFetch) {
            fetchArtisans();
        }
    }, [fetchArtisans, autoFetch]);
    return {
        ...state,
        // Métodos principales
        fetchArtisans,
        refetch,
        clearError,
        // Métodos de filtrado
        searchArtisans,
        filterByMunicipality,
        filterBySpecialty,
        getVerifiedArtisans,
        // Utilities
        hasData: state.artisans.length > 0,
        isEmpty: !state.loading && state.artisans.length === 0,
        isFiltered: Object.keys(state.filters).some(key => state.filters[key] !== undefined),
        verifiedArtisans: state.artisans.filter(artisan => artisan.verified),
        topRatedArtisans: state.artisans
            .filter(artisan => artisan.rating >= 4.5)
            .sort((a, b) => b.rating - a.rating),
    };
}
// Hook específico para artesanos verificados
function useVerifiedArtisans() {
    return useArtisans({
        verified: true,
        autoFetch: true,
    });
}
// Hook para artesanos por municipio
function useArtisansByMunicipality(municipality) {
    return useArtisans({
        municipality,
        autoFetch: !!municipality,
    });
}
// Hook para artesanos por especialidad
function useArtisansBySpecialty(specialty) {
    return useArtisans({
        specialty,
        autoFetch: !!specialty,
    });
}
// Hook para búsqueda de artesanos con debounce
function useArtisanSearch() {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = (0, react_1.useState)('');
    // Debounce del término de búsqueda
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);
    const artisansResult = useArtisans({
        search: debouncedSearchTerm,
        autoFetch: false,
    });
    // Ejecutar búsqueda cuando el término debounced cambie
    (0, react_1.useEffect)(() => {
        if (debouncedSearchTerm) {
            artisansResult.searchArtisans(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, artisansResult.searchArtisans]);
    return {
        ...artisansResult,
        searchTerm,
        setSearchTerm,
        isSearching: !!debouncedSearchTerm,
    };
}
// Hook para estadísticas de artesanos
function useArtisanStats() {
    const { artisans, loading, error } = useArtisans({ autoFetch: true });
    const stats = {
        total: artisans.length,
        verified: artisans.filter(a => a.verified).length,
        municipalities: new Set(artisans.map(a => a.location.municipality)).size,
        specialties: new Set(artisans.map(a => a.specialty)).size,
        averageRating: artisans.length > 0 ? artisans.reduce((acc, a) => acc + a.rating, 0) / artisans.length : 0,
        totalExperience: artisans.reduce((acc, a) => acc + a.experience, 0),
    };
    return {
        stats,
        loading,
        error,
    };
}
//# sourceMappingURL=useArtisans.js.map