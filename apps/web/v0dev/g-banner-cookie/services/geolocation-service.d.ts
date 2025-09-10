export interface GeolocationResult {
    lat: number;
    lng: number;
    accuracy: number;
    address?: string;
}
export declare class GeolocationService {
    static getCurrentPosition(): Promise<GeolocationResult>;
    static reverseGeocode(lat: number, lng: number): Promise<string>;
}
//# sourceMappingURL=geolocation-service.d.ts.map