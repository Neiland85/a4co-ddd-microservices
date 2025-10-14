export interface RoutePoint {
    lat: number;
    lng: number;
    address?: string;
}
export interface RouteSegment {
    distance: number;
    duration: number;
    instruction: string;
    type: string;
}
export interface Route {
    id: string;
    distance: number;
    duration: number;
    geometry: [number, number][];
    segments: RouteSegment[];
    summary: {
        distance: string;
        duration: string;
    };
}
export interface RoutingState {
    isCalculating: boolean;
    route: Route | null;
    error: string | null;
    startPoint: RoutePoint | null;
    endPoint: RoutePoint | null;
}
export type TransportMode = 'driving-car' | 'cycling-regular' | 'foot-walking';
export interface RoutingOptions {
    mode: TransportMode;
    avoidTolls?: boolean;
    avoidHighways?: boolean;
}
//# sourceMappingURL=routing-types.d.ts.map