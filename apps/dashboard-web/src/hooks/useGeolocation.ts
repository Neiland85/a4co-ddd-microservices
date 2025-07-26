// Hook para geolocalización y mapas
'use client';

import { useState, useEffect, useCallback } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationData {
  coordinates: Coordinates;
  municipality?: string;
  province?: string;
  accuracy?: number;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoStart?: boolean;
}

interface GeolocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permission: PermissionState | null;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 600000, // 10 minutos
    autoStart = false,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    permission: null,
  });

  // Verificar permisos de geolocalización
  const checkPermission = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({
          name: 'geolocation',
        });
        setState((prev) => ({ ...prev, permission: permission.state }));
        return permission.state;
      } catch (error) {
        console.warn(
          'No se pudieron verificar permisos de geolocalización:',
          error
        );
        return null;
      }
    }
    return null;
  }, []);

  // Obtener ubicación actual
  const getCurrentLocation =
    useCallback(async (): Promise<LocationData | null> => {
      if (!navigator.geolocation) {
        setState((prev) => ({
          ...prev,
          error: 'Geolocalización no soportada en este navegador',
          loading: false,
        }));
        return null;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude, accuracy } = position.coords;

            try {
              // Intentar obtener información del municipio usando reverse geocoding
              const locationInfo = await reverseGeocode(latitude, longitude);

              const locationData: LocationData = {
                coordinates: { latitude, longitude },
                accuracy,
                ...locationInfo,
              };

              setState((prev) => ({
                ...prev,
                location: locationData,
                loading: false,
              }));

              resolve(locationData);
            } catch (error) {
              // Si falla el reverse geocoding, aún devolvemos las coordenadas
              const locationData: LocationData = {
                coordinates: { latitude, longitude },
                accuracy,
              };

              setState((prev) => ({
                ...prev,
                location: locationData,
                loading: false,
              }));

              resolve(locationData);
            }
          },
          (error) => {
            let errorMessage = 'Error obteniendo ubicación';

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Permisos de ubicación denegados';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Ubicación no disponible';
                break;
              case error.TIMEOUT:
                errorMessage = 'Tiempo de espera agotado';
                break;
              default:
                errorMessage = 'Error desconocido de geolocalización';
            }

            setState((prev) => ({
              ...prev,
              loading: false,
              error: errorMessage,
            }));

            resolve(null);
          },
          {
            enableHighAccuracy,
            timeout,
            maximumAge,
          }
        );
      });
    }, [enableHighAccuracy, timeout, maximumAge]);

  // Calcular distancia entre dos puntos
  const calculateDistance = useCallback(
    (coords1: Coordinates, coords2: Coordinates): number => {
      const R = 6371; // Radio de la Tierra en km
      const dLat = ((coords2.latitude - coords1.latitude) * Math.PI) / 180;
      const dLon = ((coords2.longitude - coords1.longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((coords1.latitude * Math.PI) / 180) *
          Math.cos((coords2.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distancia en km
    },
    []
  );

  // Verificar si estamos en la provincia de Jaén
  const isInJaen = useCallback((coordinates: Coordinates): boolean => {
    // Coordenadas aproximadas de los límites de la provincia de Jaén
    const jaenBounds = {
      north: 38.5,
      south: 37.3,
      east: -2.7,
      west: -4.0,
    };

    return (
      coordinates.latitude >= jaenBounds.south &&
      coordinates.latitude <= jaenBounds.north &&
      coordinates.longitude >= jaenBounds.west &&
      coordinates.longitude <= jaenBounds.east
    );
  }, []);

  // Encontrar productores/artesanos cercanos
  const findNearbyLocations = useCallback(
    (
      locations: Array<{
        coordinates: [number, number];
        name: string;
        type: string;
      }>,
      maxDistance: number = 20 // km
    ) => {
      if (!state.location) return [];

      return locations
        .map((location) => ({
          ...location,
          distance: calculateDistance(state.location!.coordinates, {
            latitude: location.coordinates[0],
            longitude: location.coordinates[1],
          }),
        }))
        .filter((location) => location.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
    },
    [state.location, calculateDistance]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Auto-start si está habilitado
  useEffect(() => {
    if (autoStart) {
      checkPermission().then(() => {
        getCurrentLocation();
      });
    }
  }, [autoStart, checkPermission, getCurrentLocation]);

  return {
    ...state,
    getCurrentLocation,
    checkPermission,
    calculateDistance,
    isInJaen: state.location ? isInJaen(state.location.coordinates) : false,
    findNearbyLocations,
    clearError,
    // Utilities
    hasLocation: !!state.location,
    isLocationInJaen: state.location
      ? isInJaen(state.location.coordinates)
      : false,
  };
}

// Función auxiliar para reverse geocoding (simulada)
async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ municipality?: string; province?: string }> {
  // En una implementación real, aquí usarías un servicio como Google Maps, OpenStreetMap, etc.
  // Por ahora, simulamos algunos municipios de Jaén basados en coordenadas aproximadas

  const jaenMunicipalities = [
    { name: 'Jaén', lat: 37.7796, lng: -3.7849, bounds: 0.05 },
    { name: 'Úbeda', lat: 38.0138, lng: -3.3706, bounds: 0.03 },
    { name: 'Baeza', lat: 37.9915, lng: -3.4698, bounds: 0.03 },
    { name: 'Linares', lat: 38.0937, lng: -3.6335, bounds: 0.04 },
    { name: 'Andújar', lat: 38.0384, lng: -4.0517, bounds: 0.04 },
    { name: 'Martos', lat: 37.7211, lng: -3.9717, bounds: 0.03 },
    { name: 'Cazorla', lat: 37.9105, lng: -2.9745, bounds: 0.03 },
    { name: 'Alcaudete', lat: 37.5914, lng: -4.0894, bounds: 0.03 },
    { name: 'La Carolina', lat: 38.2833, lng: -3.6167, bounds: 0.03 },
    { name: 'Villacarrillo', lat: 38.1117, lng: -2.9967, bounds: 0.03 },
  ];

  // Buscar municipio más cercano
  for (const municipality of jaenMunicipalities) {
    const distance = Math.sqrt(
      Math.pow(lat - municipality.lat, 2) + Math.pow(lng - municipality.lng, 2)
    );

    if (distance <= municipality.bounds) {
      return {
        municipality: municipality.name,
        province: 'Jaén',
      };
    }
  }

  // Si no encuentra municipio específico pero está en Jaén
  if (lat >= 37.3 && lat <= 38.5 && lng >= -4.0 && lng <= -2.7) {
    return {
      province: 'Jaén',
    };
  }

  return {};
}

// Hook específico para ubicaciones del mercado local
export function useMarketLocations() {
  const geolocation = useGeolocation({ autoStart: true });

  // Ubicaciones predefinidas de interés en Jaén
  const marketLocations = [
    {
      name: 'Mercado de Abastos - Jaén Capital',
      coordinates: [37.7796, -3.7849] as [number, number],
      type: 'market',
      description: 'Mercado principal de productos frescos y locales',
      address: 'Plaza del Mercado, s/n, 23001 Jaén',
    },
    {
      name: 'Cooperativa Olivarera San José - Úbeda',
      coordinates: [38.0138, -3.3706] as [number, number],
      type: 'producer',
      description: 'Aceite de oliva virgen extra',
      address: 'Carretera de Córdoba, Km 12, Úbeda',
    },
    {
      name: 'Quesería Los Olivos - Cazorla',
      coordinates: [37.9105, -2.9745] as [number, number],
      type: 'producer',
      description: 'Quesos artesanales de cabra',
      address: 'Parque Natural de Cazorla, Finca Los Olivos',
    },
    {
      name: 'Plaza de Santa María - Úbeda',
      coordinates: [38.015, -3.37] as [number, number],
      type: 'event',
      description: 'Mercado de productos locales los sábados',
      address: 'Plaza Vázquez de Molina, Úbeda',
    },
  ];

  const nearbyLocations = geolocation.findNearbyLocations(marketLocations, 30);

  return {
    ...geolocation,
    marketLocations,
    nearbyLocations,
    nearbyMarkets: nearbyLocations.filter((loc) => loc.type === 'market'),
    nearbyProducers: nearbyLocations.filter((loc) => loc.type === 'producer'),
    nearbyEvents: nearbyLocations.filter((loc) => loc.type === 'event'),
  };
}
