import type { RoutePoint, Route, RoutingOptions } from '../types/routing-types';
export declare class RoutingService {
    private static formatDistance;
    private static formatDuration;
    private static getProfileFromMode;
    static calculateRoute(start: RoutePoint, end: RoutePoint, options?: RoutingOptions): Promise<Route>;
    static calculateStraightLineRoute(start: RoutePoint, end: RoutePoint): Route;
    private static calculateDistance;
}
//# sourceMappingURL=routing-service.d.ts.map