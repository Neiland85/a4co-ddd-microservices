// Hook para gestión de oportunidades de venta
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SalesOpportunity } from '../app/api/sales-opportunities/route';

interface UseSalesOpportunitiesOptions {
  type?: string;
  location?: string;
  category?: string;
  autoFetch?: boolean;
}

interface SalesOpportunitiesState {
  opportunities: SalesOpportunity[];
  loading: boolean;
  error: string | null;
  total: number;
  filters: {
    type?: string;
    location?: string;
    category?: string;
  };
}

export function useSalesOpportunities(
  options: UseSalesOpportunitiesOptions = {}
) {
  const { type, location, category, autoFetch = true } = options;

  const [state, setState] = useState<SalesOpportunitiesState>({
    opportunities: [],
    loading: false,
    error: null,
    total: 0,
    filters: {},
  });

  const fetchOpportunities = useCallback(
    async (customFilters?: Partial<UseSalesOpportunitiesOptions>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const params = new URLSearchParams();

        const finalFilters = { ...options, ...customFilters };

        if (finalFilters.type) params.append('type', finalFilters.type);
        if (finalFilters.location)
          params.append('location', finalFilters.location);
        if (finalFilters.category)
          params.append('category', finalFilters.category);

        const response = await fetch(
          `/api/sales-opportunities?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          setState((prev) => ({
            ...prev,
            opportunities: result.data.opportunities,
            total: result.data.total,
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
              : 'Error al cargar oportunidades',
        }));
      }
    },
    [options]
  );

  const createOpportunity = useCallback(
    async (opportunityData: Partial<SalesOpportunity>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

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
          await fetchOpportunities();
          return result.data;
        } else {
          throw new Error(result.error || 'Error al crear oportunidad');
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Error al crear oportunidad',
        }));
        throw error;
      }
    },
    [fetchOpportunities]
  );

  const refetch = useCallback(() => {
    return fetchOpportunities();
  }, [fetchOpportunities]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Auto-fetch en mount si está habilitado
  useEffect(() => {
    if (autoFetch) {
      fetchOpportunities();
    }
  }, [fetchOpportunities, autoFetch]);

  return {
    ...state,
    fetchOpportunities,
    createOpportunity,
    refetch,
    clearError,
    // Utilities
    hasData: state.opportunities.length > 0,
    isEmpty: !state.loading && state.opportunities.length === 0,
    isFiltered: Object.keys(state.filters).some(
      (key) => state.filters[key as keyof typeof state.filters]
    ),
  };
}

// Hook específico para obtener oportunidades por prioridad
export function useHighPriorityOpportunities() {
  const { opportunities, loading, error } = useSalesOpportunities({
    autoFetch: true,
  });

  const highPriorityOpportunities = opportunities.filter(
    (opp) => opp.priority === 'alta'
  );

  return {
    opportunities: highPriorityOpportunities,
    loading,
    error,
    count: highPriorityOpportunities.length,
  };
}

// Hook para oportunidades por ubicación
export function useLocalOpportunities(municipality: string) {
  return useSalesOpportunities({
    location: municipality,
    autoFetch: !!municipality,
  });
}
