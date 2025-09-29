// Hook para gestión de artesanos/productores
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Artisan } from '../app/api/artisans/route';

interface UseArtisansOptions {
  municipality?: string;
  specialty?: string;
  verified?: boolean;
  search?: string;
  autoFetch?: boolean;
}

interface ArtisansState {
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
}

export function useArtisans(options: UseArtisansOptions = {}) {
  const { autoFetch = true } = options;

  const [state, setState] = useState<ArtisansState>({
    artisans: [],
    loading: false,
    error: null,
    total: 0,
    filters: {},
  });

  // Memoizar las opciones para evitar recreaciones innecesarias
  const memoizedOptions = useMemo(
    () => options,
    [options.municipality, options.specialty, options.verified, options.search, options.autoFetch],
  );

  const fetchArtisans = useCallback(
    async(customOptions?: UseArtisansOptions) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const finalOptions = { ...memoizedOptions, ...customOptions };
        const params = new URLSearchParams();

        if (finalOptions.municipality) params.append('municipality', finalOptions.municipality);
        if (finalOptions.specialty) params.append('specialty', finalOptions.specialty);
        if (finalOptions.verified !== undefined)
          params.append('verified', finalOptions.verified.toString());
        if (finalOptions.search) params.append('search', finalOptions.search);

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
        } else {
          throw new Error(result.error || 'Error desconocido');
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Error al cargar artesanos',
        }));
      }
    },
    [memoizedOptions],
  );

  const searchArtisans = useCallback(
    async(searchTerm: string) => {
      await fetchArtisans({ search: searchTerm });
    },
    [fetchArtisans],
  );

  const filterByMunicipality = useCallback(
    async(municipality: string) => {
      await fetchArtisans({ municipality });
    },
    [fetchArtisans],
  );

  const filterBySpecialty = useCallback(
    async(specialty: string) => {
      await fetchArtisans({ specialty });
    },
    [fetchArtisans],
  );

  const getVerifiedArtisans = useCallback(async() => {
    await fetchArtisans({ verified: true });
  }, [fetchArtisans]);

  const refetch = useCallback(() => {
    return fetchArtisans();
  }, [fetchArtisans]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-fetch en mount si está habilitado
  useEffect(() => {
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
    isFiltered: Object.keys(state.filters).some(
      key => state.filters[key as keyof typeof state.filters] !== undefined,
    ),
    verifiedArtisans: state.artisans.filter(artisan => artisan.verified),
    topRatedArtisans: state.artisans
      .filter(artisan => artisan.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating),
  };
}

// Hook específico para artesanos verificados
export function useVerifiedArtisans() {
  return useArtisans({
    verified: true,
    autoFetch: true,
  });
}

// Hook para artesanos por municipio
export function useArtisansByMunicipality(municipality: string) {
  return useArtisans({
    municipality,
    autoFetch: !!municipality,
  });
}

// Hook para artesanos por especialidad
export function useArtisansBySpecialty(specialty: string) {
  return useArtisans({
    specialty,
    autoFetch: !!specialty,
  });
}

// Hook para búsqueda de artesanos con debounce
export function useArtisanSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce del término de búsqueda
  useEffect(() => {
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
  useEffect(() => {
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
export function useArtisanStats() {
  const { artisans, loading, error } = useArtisans({ autoFetch: true });

  const stats = {
    total: artisans.length,
    verified: artisans.filter(a => a.verified).length,
    municipalities: new Set(artisans.map(a => a.location.municipality)).size,
    specialties: new Set(artisans.map(a => a.specialty)).size,
    averageRating:
      artisans.length > 0 ? artisans.reduce((acc, a) => acc + a.rating, 0) / artisans.length : 0,
    totalExperience: artisans.reduce((acc, a) => acc + a.experience, 0),
  };

  return {
    stats,
    loading,
    error,
  };
}
