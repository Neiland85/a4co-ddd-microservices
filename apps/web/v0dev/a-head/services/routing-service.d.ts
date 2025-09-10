import type { Route, RoutePoint, RoutingOptions } from '@/types/routing-types';
declare class RoutingService {
    private apiKey;
    calculateRoute(start: RoutePoint, end: RoutePoint, waypoints: RoutePoint[] | undefined, options: RoutingOptions): Promise<Route>;
    getOptimizedRoute(points: RoutePoint[], options: RoutingOptions): Promise<Route>;
    private generateMockSegments;
    private generateMockCoordinates;
}
export declare const routingService: RoutingService;
export {};
//# sourceMappingURL=routing-service.d.ts.map