import type { RoutePoint, RoutingOptions } from '../types/routing-types';
export declare function useRouting(): {
    calculateRoute: (start: RoutePoint, end: RoutePoint, options?: RoutingOptions) => Promise<import("../types/routing-types").Route>;
    clearRoute: () => void;
    isCalculating: boolean;
    route: import("../types/routing-types").Route | null;
    error: string | null;
    startPoint: RoutePoint | null;
    endPoint: RoutePoint | null;
};
//# sourceMappingURL=use-routing.d.ts.map