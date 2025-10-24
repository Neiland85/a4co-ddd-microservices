// Hook para gestión de productos locales
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProducts = useProducts;
exports.useProductsByCategory = useProductsByCategory;
exports.useSeasonalProducts = useSeasonalProducts;
exports.useAvailableProducts = useAvailableProducts;
exports.useProductSearch = useProductSearch;
const react_1 = require("react");
function useProducts(options = {}) {
    // Estabilizamos las opciones para evitar renders infinitos
    const optionsRef = (0, react_1.useRef)(options);
    const stableOptions = (0, react_1.useMemo)(() => {
        // Solo actualizamos si hay cambios reales en las opciones
        const current = optionsRef.current;
        const hasChanged = Object.keys({ ...current, ...options }).some(key => current[key] !== options[key]);
        if (hasChanged) {
            optionsRef.current = options;
        }
        return optionsRef.current;
    }, [JSON.stringify(options)]);
    const { autoFetch = true } = stableOptions;
    const [state, setState] = (0, react_1.useState)({
        products: [],
        loading: false,
        error: null,
        pagination: {
            total: 0,
            limit: 10,
            offset: 0,
            hasMore: false,
        },
        filters: {},
    });
    const fetchProducts = (0, react_1.useCallback)(async (customOptions, append = false) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const finalOptions = { ...stableOptions, ...customOptions };
            const params = new URLSearchParams();
            if (finalOptions.category)
                params.append('category', finalOptions.category);
            if (finalOptions.location)
                params.append('location', finalOptions.location);
            if (finalOptions.seasonal !== undefined)
                params.append('seasonal', finalOptions.seasonal.toString());
            if (finalOptions.available !== undefined)
                params.append('available', finalOptions.available.toString());
            if (finalOptions.search)
                params.append('search', finalOptions.search);
            if (finalOptions.limit)
                params.append('limit', finalOptions.limit.toString());
            const response = await fetch(`/api/products?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success) {
                setState(prev => ({
                    ...prev,
                    products: append ? [...prev.products, ...result.data.products] : result.data.products,
                    pagination: result.data.pagination,
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
                error: error instanceof Error ? error.message : 'Error al cargar productos',
            }));
        }
    }, [stableOptions]);
    const loadMore = (0, react_1.useCallback)(async () => {
        if (state.pagination.hasMore && !state.loading) {
            const offset = state.products.length;
            await fetchProducts({ limit: state.pagination.limit, offset }, true);
        }
    }, [
        state.pagination.hasMore,
        state.loading,
        state.products.length,
        state.pagination.limit,
        fetchProducts,
    ]);
    const searchProducts = (0, react_1.useCallback)(async (searchTerm) => {
        await fetchProducts({ search: searchTerm });
    }, [fetchProducts]);
    const filterByCategory = (0, react_1.useCallback)(async (category) => {
        await fetchProducts({ category });
    }, [fetchProducts]);
    const filterByLocation = (0, react_1.useCallback)(async (location) => {
        await fetchProducts({ location });
    }, [fetchProducts]);
    const getSeasonalProducts = (0, react_1.useCallback)(async () => {
        await fetchProducts({ seasonal: true });
    }, [fetchProducts]);
    const getAvailableProducts = (0, react_1.useCallback)(async () => {
        await fetchProducts({ available: true });
    }, [fetchProducts]);
    const refetch = (0, react_1.useCallback)(() => {
        return fetchProducts();
    }, [fetchProducts]);
    const clearError = (0, react_1.useCallback)(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);
    const reset = (0, react_1.useCallback)(() => {
        setState({
            products: [],
            loading: false,
            error: null,
            pagination: {
                total: 0,
                limit: 10,
                offset: 0,
                hasMore: false,
            },
            filters: {},
        });
    }, []);
    // Auto-fetch en mount si está habilitado
    (0, react_1.useEffect)(() => {
        if (autoFetch) {
            fetchProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoFetch]); // Solo dependemos de autoFetch, no de fetchProducts para evitar loops
    return {
        ...state,
        // Métodos principales
        fetchProducts,
        loadMore,
        refetch,
        reset,
        clearError,
        // Métodos de filtrado
        searchProducts,
        filterByCategory,
        filterByLocation,
        getSeasonalProducts,
        getAvailableProducts,
        // Utilities
        hasData: state.products.length > 0,
        isEmpty: !state.loading && state.products.length === 0,
        isFiltered: Object.keys(state.filters).some(key => state.filters[key] !== undefined),
        canLoadMore: state.pagination.hasMore && !state.loading,
    };
}
// Hook específico para productos por categoría
function useProductsByCategory(category) {
    return useProducts({
        category,
        autoFetch: !!category,
    });
}
// Hook para productos estacionales
function useSeasonalProducts() {
    return useProducts({
        seasonal: true,
        available: true,
        autoFetch: true,
    });
}
// Hook para productos disponibles
function useAvailableProducts() {
    return useProducts({
        available: true,
        autoFetch: true,
    });
}
// Hook para búsqueda de productos
function useProductSearch() {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = (0, react_1.useState)('');
    // Debounce del término de búsqueda
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);
    const productsResult = useProducts({
        search: debouncedSearchTerm,
        autoFetch: !!debouncedSearchTerm,
    });
    const clearSearch = (0, react_1.useCallback)(() => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
    }, []);
    const resetProducts = (0, react_1.useCallback)(() => {
        productsResult.reset();
    }, [productsResult.reset]);
    return {
        ...productsResult,
        searchTerm,
        setSearchTerm,
        clearSearch,
        resetProducts,
        isSearching: !!debouncedSearchTerm,
    };
}
//# sourceMappingURL=useProducts.js.map