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
interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}
export declare const useGeolocation: (options?: GeolocationOptions) => {
    getCurrentLocation: () => Promise<Location | null>;
    watchLocation: (callback?: (location: Location) => void) => number | null;
    calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
    findNearbyProductors: (productors: Productor[], maxDistance?: number) => Promise<Productor[]>;
    getAddressFromCoordinates: (latitude: number, longitude: number) => Promise<string>;
    getCoordinatesFromAddress: (address: string) => Promise<Location | null>;
    isLocationInArea: (location: Location, centerLat: number, centerLon: number, radiusKm: number) => boolean;
    checkPermission: () => Promise<boolean>;
    location: Location | null;
    error: string | null;
    isLoading: boolean;
    hasPermission: boolean;
};
export {};
//# sourceMappingURL=useGeolocation.d.ts.map