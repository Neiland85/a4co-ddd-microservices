export interface RoutePoint {
    lat: number;
    lng: number;
    name: string;
    type: 'start' | 'waypoint' | 'end';
}
export interface RouteSegment {
    distance: number;
    duration: number;
    instructions: string;
    coordinates: [number, number][];
}
export interface Route {
    id: string;
    name: string;
    description: string;
    totalDistance: number;
    totalDuration: number;
    difficulty: 'easy' | 'medium' | 'hard';
    points: RoutePoint[];
    segments: RouteSegment[];
    highlights: string[];
}
export interface RoutingOptions {
    mode: 'walking' | 'cycling' | 'driving';
    avoidTolls: boolean;
    avoidHighways: boolean;
    optimize: boolean;
}
//# sourceMappingURL=routing-types.d.ts.map