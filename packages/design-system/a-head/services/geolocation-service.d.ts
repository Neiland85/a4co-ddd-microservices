interface GeolocationPosition {
    lat: number;
    lng: number;
    accuracy: number;
}
declare class GeolocationService {
    getCurrentPosition(): Promise<GeolocationPosition>;
    watchPosition(onPositionChange: (position: GeolocationPosition) => void, onError?: (error: Error) => void): Promise<number>;
    clearWatch(watchId: number): void;
    calculateDistance(pos1: GeolocationPosition, pos2: GeolocationPosition): number;
    private toRadians;
}
export declare const geolocationService: GeolocationService;
export {};
//# sourceMappingURL=geolocation-service.d.ts.map