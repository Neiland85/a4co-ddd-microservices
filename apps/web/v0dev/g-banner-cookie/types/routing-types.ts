export interface RoutePoint {
  lat: number;
  lng: number;
  address?: string;
}

export interface RouteSegment {
  distance: number; // in meters
  duration: number; // in seconds
  instruction: string;
  type: string;
}

export interface Route {
  id: string;
  distance: number; // total distance in meters
  duration: number; // total duration in seconds
  geometry: [number, number][]; // array of [lng, lat] coordinates
  segments: RouteSegment[];
  summary: {
    distance: string; // formatted distance
    duration: string; // formatted duration
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
