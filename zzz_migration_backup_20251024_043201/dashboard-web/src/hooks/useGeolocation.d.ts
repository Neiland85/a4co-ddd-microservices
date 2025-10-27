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
interface MarketLocation {
    coordinates: [number, number];
    name: string;
    type: string;
    description?: string;
    address?: string;
}
export interface NearbyLocation extends MarketLocation {
    distance: number;
}
interface UseGeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    autoStart?: boolean;
}
export declare function useGeolocation(options?: UseGeolocationOptions): {
    getCurrentLocation: () => Promise<LocationData | null>;
    checkPermission: () => Promise<PermissionState | null>;
    calculateDistance: (coords1: Coordinates, coords2: Coordinates) => number;
    isInJaen: boolean;
    findNearbyLocations: (locations: MarketLocation[], maxDistance?: number) => NearbyLocation[];
    clearError: () => void;
    hasLocation: boolean;
    isLocationInJaen: boolean;
    location: LocationData | null;
    loading: boolean;
    error: string | null;
    permission: PermissionState | null;
};
export declare function useMarketLocations(): {
    marketLocations: MarketLocation[];
    nearbyLocations: NearbyLocation[];
    nearbyMarkets: NearbyLocation[];
    nearbyProducers: NearbyLocation[];
    nearbyEvents: NearbyLocation[];
    getCurrentLocation: () => Promise<LocationData | null>;
    checkPermission: () => Promise<PermissionState | null>;
    calculateDistance: (coords1: Coordinates, coords2: Coordinates) => number;
    isInJaen: boolean;
    findNearbyLocations: (locations: MarketLocation[], maxDistance?: number) => NearbyLocation[];
    clearError: () => void;
    hasLocation: boolean;
    isLocationInJaen: boolean;
    location: LocationData | null;
    loading: boolean;
    error: string | null;
    permission: PermissionState | null;
};
export {};
//# sourceMappingURL=useGeolocation.d.ts.map