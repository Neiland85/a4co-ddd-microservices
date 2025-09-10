"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGeolocation = void 0;
const react_1 = require("react");
const useGeolocation = (options = {}) => {
    const [state, setState] = (0, react_1.useState)({
        location: null,
        error: null,
        isLoading: false,
        hasPermission: false,
    });
    const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
        ...options,
    };
    // Verificar permisos de geolocalización
    const checkPermission = (0, react_1.useCallback)(async () => {
        if (!('geolocation' in navigator)) {
            setState(prev => ({ ...prev, error: 'Geolocalización no soportada' }));
            return false;
        }
        try {
            // En navegadores modernos, podemos verificar el permiso
            if ('permissions' in navigator) {
                const permission = await navigator.permissions.query({
                    name: 'geolocation',
                });
                const hasPermission = permission.state === 'granted';
                setState(prev => ({ ...prev, hasPermission }));
                return hasPermission;
            }
            // Fallback para navegadores que no soportan permissions API
            return true;
        }
        catch (error) {
            console.error('Error verificando permisos:', error);
            return false;
        }
    }, []);
    // Obtener ubicación actual
    const getCurrentLocation = (0, react_1.useCallback)(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const hasPermission = await checkPermission();
            if (!hasPermission) {
                throw new Error('Permisos de geolocalización no concedidos');
            }
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(position => {
                    const location = {
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
                }, error => {
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
                }, defaultOptions);
            });
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Error desconocido',
            }));
            return null;
        }
    }, [checkPermission, defaultOptions]);
    // Observar cambios en la ubicación
    const watchLocation = (0, react_1.useCallback)((callback) => {
        if (!('geolocation' in navigator)) {
            setState(prev => ({ ...prev, error: 'Geolocalización no soportada' }));
            return null;
        }
        const watchId = navigator.geolocation.watchPosition(position => {
            const location = {
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
        }, error => {
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
        }, defaultOptions);
        return watchId;
    }, [defaultOptions]);
    // Calcular distancia entre dos puntos (fórmula de Haversine)
    const calculateDistance = (0, react_1.useCallback)((lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radio de la Tierra en km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);
    // Encontrar productores cercanos
    const findNearbyProductors = (0, react_1.useCallback)(async (productors, maxDistance = 50 // km por defecto
    ) => {
        if (!state.location) {
            throw new Error('Ubicación no disponible');
        }
        const nearbyProductors = productors
            .map(productor => ({
            ...productor,
            distance: calculateDistance(state.location.latitude, state.location.longitude, productor.latitude, productor.longitude),
        }))
            .filter(productor => productor.distance <= maxDistance)
            .sort((a, b) => (a.distance || 0) - (b.distance || 0));
        return nearbyProductors;
    }, [state.location, calculateDistance]);
    // Obtener dirección a partir de coordenadas (reverse geocoding)
    const getAddressFromCoordinates = (0, react_1.useCallback)(async (latitude, longitude) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            if (!response.ok) {
                throw new Error('Error en reverse geocoding');
            }
            const data = await response.json();
            return data.display_name || 'Dirección no disponible';
        }
        catch (error) {
            console.error('Error obteniendo dirección:', error);
            return 'Dirección no disponible';
        }
    }, []);
    // Obtener coordenadas a partir de dirección (geocoding)
    const getCoordinatesFromAddress = (0, react_1.useCallback)(async (address) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
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
        }
        catch (error) {
            console.error('Error obteniendo coordenadas:', error);
            return null;
        }
    }, []);
    // Verificar si una ubicación está dentro de un área específica
    const isLocationInArea = (0, react_1.useCallback)((location, centerLat, centerLon, radiusKm) => {
        const distance = calculateDistance(location.latitude, location.longitude, centerLat, centerLon);
        return distance <= radiusKm;
    }, [calculateDistance]);
    // Inicializar geolocalización al montar el componente
    (0, react_1.useEffect)(() => {
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
exports.useGeolocation = useGeolocation;
//# sourceMappingURL=useGeolocation.js.map