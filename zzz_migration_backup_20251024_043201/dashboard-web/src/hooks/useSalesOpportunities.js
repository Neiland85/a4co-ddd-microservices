// Hook para gestión de oportunidades de venta
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSalesOpportunities = useSalesOpportunities;
exports.useHighPriorityOpportunities = useHighPriorityOpportunities;
exports.useLocalOpportunities = useLocalOpportunities;
const react_1 = require("react");
function useSalesOpportunities(options = {}) {
    const { autoFetch = false, type, location, category } = options;
    // Memoizar las opciones para evitar recreación en cada render
    const memoizedOptions = (0, react_1.useMemo)(() => ({ type, location, category }), [type, location, category]);
    const [state, setState] = (0, react_1.useState)({
        opportunities: [],
        loading: false,
        error: null,
        total: 0,
        filters: {},
    });
    const fetchOpportunities = (0, react_1.useCallback)(async (customFilters = {}) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const params = new URLSearchParams();
            const finalFilters = { ...memoizedOptions, ...customFilters };
            if (finalFilters.type)
                params.append('type', finalFilters.type);
            if (finalFilters.location)
                params.append('location', finalFilters.location);
            if (finalFilters.category)
                params.append('category', finalFilters.category);
            const response = await fetch(`/api/sales-opportunities?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success) {
                setState(prev => ({
                    ...prev,
                    opportunities: result.data.opportunities || [],
                    total: result.data.total || 0,
                    loading: false,
                    error: null,
                    filters: finalFilters,
                }));
            }
            else {
                throw new Error(result.error || 'Error al cargar oportunidades');
            }
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Error al cargar oportunidades',
            }));
        }
    }, [memoizedOptions]);
    // Use ref to store the latest fetchOpportunities function
    const fetchOpportunitiesRef = (0, react_1.useRef)(fetchOpportunities);
    fetchOpportunitiesRef.current = fetchOpportunities;
    const createOpportunity = (0, react_1.useCallback)(async (opportunityData) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const response = await fetch('/api/sales-opportunities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(opportunityData),
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success) {
                // Refrescar la lista después de crear
                await fetchOpportunitiesRef.current();
                return result.data;
            }
            else {
                throw new Error(result.error || 'Error al crear oportunidad');
            }
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Error al crear oportunidad',
            }));
            throw error;
        }
    }, []);
    const refetch = (0, react_1.useCallback)(() => {
        return fetchOpportunitiesRef.current();
    }, []);
    const clearError = (0, react_1.useCallback)(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);
    // Auto-fetch en mount si está habilitado
    (0, react_1.useEffect)(() => {
        if (autoFetch) {
            fetchOpportunitiesRef.current();
        }
    }, [autoFetch]);
    return {
        ...state,
        fetchOpportunities,
        createOpportunity,
        refetch,
        clearError,
        // Utilities
        hasData: state.opportunities.length > 0,
        isEmpty: !state.loading && state.opportunities.length === 0,
        isFiltered: Object.keys(state.filters).some(key => state.filters[key]),
    };
}
// Hook específico para obtener oportunidades por prioridad
function useHighPriorityOpportunities() {
    const { opportunities, loading, error } = useSalesOpportunities({
        autoFetch: true,
    });
    const highPriorityOpportunities = opportunities.filter(opp => opp.priority === 'alta');
    return {
        opportunities: highPriorityOpportunities,
        loading,
        error,
        count: highPriorityOpportunities.length,
    };
}
// Hook para oportunidades por ubicación
function useLocalOpportunities(municipality) {
    return useSalesOpportunities({
        location: municipality,
        autoFetch: !!municipality,
    });
}
//# sourceMappingURL=useSalesOpportunities.js.map