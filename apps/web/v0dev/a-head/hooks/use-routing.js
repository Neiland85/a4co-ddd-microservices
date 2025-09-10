'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRouting = useRouting;
const react_1 = require("react");
const routing_service_1 = require("@/services/routing-service");
function useRouting() {
    const [currentRoute, setCurrentRoute] = (0, react_1.useState)(null);
    const [isCalculating, setIsCalculating] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const calculateRoute = (0, react_1.useCallback)(async (start, end, waypoints = [], options) => {
        setIsCalculating(true);
        setError(null);
        try {
            const route = await routing_service_1.routingService.calculateRoute(start, end, waypoints, options);
            setCurrentRoute(route);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error calculating route');
        }
        finally {
            setIsCalculating(false);
        }
    }, []);
    const optimizeRoute = (0, react_1.useCallback)(async (points, options) => {
        setIsCalculating(true);
        setError(null);
        try {
            const route = await routing_service_1.routingService.getOptimizedRoute(points, options);
            setCurrentRoute(route);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error optimizing route');
        }
        finally {
            setIsCalculating(false);
        }
    }, []);
    const clearRoute = (0, react_1.useCallback)(() => {
        setCurrentRoute(null);
        setError(null);
    }, []);
    return {
        currentRoute,
        isCalculating,
        error,
        calculateRoute,
        optimizeRoute,
        clearRoute,
    };
}
//# sourceMappingURL=use-routing.js.map