import type { Route, RoutePoint, RoutingOptions } from '@/types/routing-types';
export declare function useRouting(): {
    currentRoute: Route | null;
    isCalculating: boolean;
    error: string | null;
    calculateRoute: (start: RoutePoint, end: RoutePoint, waypoints: RoutePoint[] | undefined, options: RoutingOptions) => Promise<void>;
    optimizeRoute: (points: RoutePoint[], options: RoutingOptions) => Promise<void>;
    clearRoute: () => void;
};
//# sourceMappingURL=use-routing.d.ts.map