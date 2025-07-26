// Hook para gestión de productos locales
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

interface ProductsState {
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
}

export function useProducts(options: UseProductsOptions = {}) {
  // Estabilizamos las opciones para evitar renders infinitos
  const optionsRef = useRef(options);
  const stableOptions = useMemo(() => {
    // Solo actualizamos si hay cambios reales en las opciones
    const current = optionsRef.current;
    const hasChanged = Object.keys({ ...current, ...options }).some(
      (key) =>
        current[key as keyof UseProductsOptions] !==
        options[key as keyof UseProductsOptions]
    );

    if (hasChanged) {
      optionsRef.current = options;
    }

    return optionsRef.current;
  }, [JSON.stringify(options)]);

  const { autoFetch = true } = stableOptions;

  const [state, setState] = useState<ProductsState>({
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

  const fetchProducts = useCallback(
    async (customOptions?: UseProductsOptions, append = false) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

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
        if (finalOptions.search) params.append('search', finalOptions.search);
        if (finalOptions.limit)
          params.append('limit', finalOptions.limit.toString());

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          setState((prev) => ({
            ...prev,
            products: append
              ? [...prev.products, ...result.data.products]
              : result.data.products,
            pagination: result.data.pagination,
            filters: result.data.filters,
            loading: false,
          }));
        } else {
          throw new Error(result.error || 'Error desconocido');
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Error al cargar productos',
        }));
      }
    },
    [stableOptions]
  );

  const loadMore = useCallback(async () => {
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

  const searchProducts = useCallback(
    async (searchTerm: string) => {
      await fetchProducts({ search: searchTerm });
    },
    [fetchProducts]
  );

  const filterByCategory = useCallback(
    async (category: string) => {
      await fetchProducts({ category });
    },
    [fetchProducts]
  );

  const filterByLocation = useCallback(
    async (location: string) => {
      await fetchProducts({ location });
    },
    [fetchProducts]
  );

  const getSeasonalProducts = useCallback(async () => {
    await fetchProducts({ seasonal: true });
  }, [fetchProducts]);

  const getAvailableProducts = useCallback(async () => {
    await fetchProducts({ available: true });
  }, [fetchProducts]);

  const refetch = useCallback(() => {
    return fetchProducts();
  }, [fetchProducts]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
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
  useEffect(() => {
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
    isFiltered: Object.keys(state.filters).some(
      (key) => state.filters[key as keyof typeof state.filters] !== undefined
    ),
    canLoadMore: state.pagination.hasMore && !state.loading,
  };
}

// Hook específico para productos por categoría
export function useProductsByCategory(category: string) {
  return useProducts({
    category,
    autoFetch: !!category,
  });
}

// Hook para productos estacionales
export function useSeasonalProducts() {
  return useProducts({
    seasonal: true,
    available: true,
    autoFetch: true,
  });
}

// Hook para productos disponibles
export function useAvailableProducts() {
  return useProducts({
    available: true,
    autoFetch: true,
  });
}

// Hook para búsqueda de productos
export function useProductSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce del término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const productsResult = useProducts({
    search: debouncedSearchTerm,
    autoFetch: !!debouncedSearchTerm,
  });

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  const resetProducts = useCallback(() => {
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
