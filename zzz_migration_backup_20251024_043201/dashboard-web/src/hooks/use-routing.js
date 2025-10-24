'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRouting = useRouting;
const react_1 = require("react");
const routing_service_1 = require("../services/routing-service");
function useRouting() {
    const [routingState, setRoutingState] = (0, react_1.useState)({
        isCalculating: false,
        route: null,
        error: null,
        startPoint: null,
        endPoint: null,
    });
    const calculateRoute = (0, react_1.useCallback)(async (start, end, options = { mode: 'driving-car' }) => {
        setRoutingState(prev => ({
            ...prev,
            isCalculating: true,
            error: null,
            startPoint: start,
            endPoint: end,
        }));
        try {
            const route = await routing_service_1.RoutingService.calculateRoute(start, end, options);
            setRoutingState(prev => ({
                ...prev,
                isCalculating: false,
                route,
                error: null,
            }));
            return route;
        }
        catch (error) {
            // Fallback to straight line if API fails
            try {
                const fallbackRoute = routing_service_1.RoutingService.calculateStraightLineRoute(start, end);
                setRoutingState(prev => ({
                    ...prev,
                    isCalculating: false,
                    route: fallbackRoute,
                    error: 'Usando ruta directa (API no disponible)',
                }));
                return fallbackRoute;
            }
            catch (fallbackError) {
                setRoutingState(prev => ({
                    ...prev,
                    isCalculating: false,
                    error: error instanceof Error ? error.message : 'Error calculando la ruta',
                }));
                throw error;
            }
        }
    }, []);
    const clearRoute = (0, react_1.useCallback)(() => {
        setRoutingState({
            isCalculating: false,
            route: null,
            error: null,
            startPoint: null,
            endPoint: null,
        });
    }, []);
    return {
        ...routingState,
        calculateRoute,
        clearRoute,
    };
}
//# sourceMappingURL=use-routing.js.map