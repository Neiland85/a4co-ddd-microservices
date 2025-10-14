import { useState, useEffect, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface Productor {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
  category: string;
  rating: number;
  isOpen: boolean;
}

interface GeolocationState {
  location: Location | null;
  error: string | null;
  isLoading: boolean;
  hasPermission: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    isLoading: false,
    hasPermission: false,
  });

  const defaultOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
    ...options,
  };

  // Verificar permisos de geolocalización
<<<<<<< HEAD
  const checkPermission = useCallback(async(): Promise<boolean> => {
=======
  const checkPermission = useCallback(async (): Promise<boolean> => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    if (!('geolocation' in navigator)) {
      setState(prev => ({ ...prev, error: 'Geolocalización no soportada' }));
      return false;
    }

    try {
      // En navegadores modernos, podemos verificar el permiso
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({
          name: 'geolocation' as PermissionName,
        });
        const hasPermission = permission.state === 'granted';
        setState(prev => ({ ...prev, hasPermission }));
        return hasPermission;
      }

      // Fallback para navegadores que no soportan permissions API
      return true;
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return false;
    }
  }, []);

  // Obtener ubicación actual
<<<<<<< HEAD
  const getCurrentLocation = useCallback(async(): Promise<Location | null> => {
=======
  const getCurrentLocation = useCallback(async (): Promise<Location | null> => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        throw new Error('Permisos de geolocalización no concedidos');
      }

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => {
            const location: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            };

            setState(prev => ({
              ...prev,
              location,
              isLoading: false,
              error: null,
            }));

            resolve(location);
          },
          error => {
            let errorMessage = 'Error obteniendo ubicación';

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Permisos de geolocalización denegados';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Información de ubicación no disponible';
                break;
              case error.TIMEOUT:
                errorMessage = 'Tiempo de espera agotado';
                break;
              default:
                errorMessage = 'Error desconocido de geolocalización';
            }

            setState(prev => ({
              ...prev,
              isLoading: false,
              error: errorMessage,
            }));

            reject(new Error(errorMessage));
          },
<<<<<<< HEAD
          defaultOptions,
=======
          defaultOptions
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
        );
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
      return null;
    }
  }, [checkPermission, defaultOptions]);

  // Observar cambios en la ubicación
  const watchLocation = useCallback(
    (callback?: (location: Location) => void) => {
      if (!('geolocation' in navigator)) {
        setState(prev => ({ ...prev, error: 'Geolocalización no soportada' }));
        return null;
      }

      const watchId = navigator.geolocation.watchPosition(
        position => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          setState(prev => ({
            ...prev,
            location,
            error: null,
          }));

          if (callback) {
            callback(location);
          }
        },
        error => {
          let errorMessage = 'Error observando ubicación';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permisos de geolocalización denegados';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Información de ubicación no disponible';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado';
              break;
            default:
              errorMessage = 'Error desconocido de geolocalización';
          }

          setState(prev => ({ ...prev, error: errorMessage }));
        },
<<<<<<< HEAD
        defaultOptions,
=======
        defaultOptions
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      );

      return watchId;
    },
<<<<<<< HEAD
    [defaultOptions],
=======
    [defaultOptions]
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371; // Radio de la Tierra en km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
<<<<<<< HEAD
    [],
=======
    []
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Encontrar productores cercanos
  const findNearbyProductors = useCallback(
<<<<<<< HEAD
    async(
      productors: Productor[],
      maxDistance: number = 50, // km por defecto
=======
    async (
      productors: Productor[],
      maxDistance: number = 50 // km por defecto
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    ): Promise<Productor[]> => {
      if (!state.location) {
        throw new Error('Ubicación no disponible');
      }

      const nearbyProductors = productors
        .map(productor => ({
          ...productor,
          distance: calculateDistance(
            state.location!.latitude,
            state.location!.longitude,
            productor.latitude,
<<<<<<< HEAD
            productor.longitude,
=======
            productor.longitude
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
          ),
        }))
        .filter(productor => productor.distance <= maxDistance)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

      return nearbyProductors;
    },
<<<<<<< HEAD
    [state.location, calculateDistance],
=======
    [state.location, calculateDistance]
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Obtener dirección a partir de coordenadas (reverse geocoding)
  const getAddressFromCoordinates = useCallback(
<<<<<<< HEAD
    async(latitude: number, longitude: number): Promise<string> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
=======
    async (latitude: number, longitude: number): Promise<string> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
        );

        if (!response.ok) {
          throw new Error('Error en reverse geocoding');
        }

        const data = await response.json();
        return data.display_name || 'Dirección no disponible';
      } catch (error) {
        console.error('Error obteniendo dirección:', error);
        return 'Dirección no disponible';
      }
    },
<<<<<<< HEAD
    [],
=======
    []
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Obtener coordenadas a partir de dirección (geocoding)
  const getCoordinatesFromAddress = useCallback(
<<<<<<< HEAD
    async(address: string): Promise<Location | null> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
=======
    async (address: string): Promise<Location | null> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
        );

        if (!response.ok) {
          throw new Error('Error en geocoding');
        }

        const data = await response.json();

        if (data.length === 0) {
          return null;
        }

        const result = data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          accuracy: 100, // Precisión estimada para geocoding
          timestamp: Date.now(),
        };
      } catch (error) {
        console.error('Error obteniendo coordenadas:', error);
        return null;
      }
    },
<<<<<<< HEAD
    [],
=======
    []
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Verificar si una ubicación está dentro de un área específica
  const isLocationInArea = useCallback(
    (location: Location, centerLat: number, centerLon: number, radiusKm: number): boolean => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        centerLat,
<<<<<<< HEAD
        centerLon,
      );
      return distance <= radiusKm;
    },
    [calculateDistance],
=======
        centerLon
      );
      return distance <= radiusKm;
    },
    [calculateDistance]
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Inicializar geolocalización al montar el componente
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    ...state,
    getCurrentLocation,
    watchLocation,
    calculateDistance,
    findNearbyProductors,
    getAddressFromCoordinates,
    getCoordinatesFromAddress,
    isLocationInArea,
    checkPermission,
  };
};
