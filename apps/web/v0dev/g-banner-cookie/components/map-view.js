'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MapView;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const react_leaflet_1 = require("react-leaflet");
const leaflet_1 = require("leaflet");
const lucide_react_2 = require("lucide-react");
const alert_1 = require("@/components/ui/alert");
const map_filters_1 = __importDefault(require("./map-filters"));
const producer_marker_1 = __importDefault(require("./producer-marker"));
const route_display_1 = __importDefault(require("./route-display"));
const routing_panel_1 = __importDefault(require("./routing-panel"));
const use_producers_1 = require("../hooks/use-producers");
const use_routing_1 = require("../hooks/use-routing");
// Component to fit map bounds to markers
function MapBounds({ producers }) {
    const map = (0, react_leaflet_1.useMap)();
    (0, react_1.useEffect)(() => {
        if (producers.length > 0) {
            const bounds = new leaflet_1.LatLngBounds(producers.map(p => [p.coordinates.lat, p.coordinates.lng]));
            map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [producers, map]);
    return null;
}
function MapView({ className = '', defaultCenter = { lat: 38.0138, lng: -3.3706 }, // Úbeda, Jaén
defaultZoom = 10, }) {
    const [filters, setFilters] = (0, react_1.useState)({
        categories: [],
        maxDistance: 50,
        searchQuery: '',
        minRating: 0,
    });
    const [filtersOpen, setFiltersOpen] = (0, react_1.useState)(false);
    const [selectedProducer, setSelectedProducer] = (0, react_1.useState)(null);
    const [userLocation, setUserLocation] = (0, react_1.useState)(null);
    const mapRef = (0, react_1.useRef)(null);
    const { route, isCalculating, error: routingError, startPoint, endPoint, calculateRoute, clearRoute, } = (0, use_routing_1.useRouting)();
    const [showRoutingPanel, setShowRoutingPanel] = (0, react_1.useState)(false);
    const [selectedProducerForRoute, setSelectedProducerForRoute] = (0, react_1.useState)(null);
    const { producers, isLoading, error } = (0, use_producers_1.useProducers)(filters);
    const [isLocating, setIsLocating] = (0, react_1.useState)(false);
    // Get user location
    const getUserLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setIsLocating(false);
            }, error => {
                console.warn('Could not get user location:', error);
                setIsLocating(false);
            });
        }
        else {
            console.warn('Geolocation is not supported by this browser.');
            setIsLocating(false);
        }
    };
    const handleProducerClick = (producer) => {
        setSelectedProducer(producer);
        setSelectedProducerForRoute(producer);
        setShowRoutingPanel(true);
        console.log('Selected producer:', producer);
    };
    const handleCalculateRoute = async (options) => {
        if (!userLocation || !selectedProducerForRoute) {
            alert('Necesitamos tu ubicación para calcular la ruta');
            return;
        }
        const start = {
            lat: userLocation.lat,
            lng: userLocation.lng,
            address: 'Tu ubicación',
        };
        const end = {
            lat: selectedProducerForRoute.coordinates.lat,
            lng: selectedProducerForRoute.coordinates.lng,
            address: selectedProducerForRoute.address,
        };
        try {
            await calculateRoute(start, end, options);
        }
        catch (error) {
            console.error('Error calculating route:', error);
        }
    };
    const toggleFilters = () => {
        setFiltersOpen(!filtersOpen);
    };
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: `relative h-96 ${className}`, children: (0, jsx_runtime_1.jsxs)(alert_1.Alert, { className: "m-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_2.AlertCircle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)(alert_1.AlertDescription, { children: ["Error al cargar el mapa de productores: ", error] })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `relative h-96 overflow-hidden rounded-lg bg-gray-100 ${className}`, children: [isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 z-[999] flex items-center justify-center bg-white/80 backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-a4co-olive-600 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_2.Loader2, { className: "h-6 w-6 animate-spin" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Cargando productores..." })] }) })), (0, jsx_runtime_1.jsx)(map_filters_1.default, { filters: filters, onFiltersChange: setFilters, isOpen: filtersOpen, onToggle: toggleFilters }), !isLoading && ((0, jsx_runtime_1.jsx)("div", { className: "shadow-natural border-a4co-olive-200 absolute right-4 top-4 z-[1000] rounded-lg border bg-white/95 px-3 py-2 backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm text-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_2.MapPin, { className: "text-a4co-olive-600 mr-1 h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: [producers.length, " productor", producers.length !== 1 ? 'es' : '', " encontrado", producers.length !== 1 ? 's' : ''] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: getUserLocation, disabled: isLocating, className: "border-a4co-olive-300 text-a4co-olive-700 hover:bg-a4co-olive-50 bg-transparent", "aria-label": "Obtener mi ubicaci\u00F3n", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Locate, { className: `mr-2 h-4 w-4 ${isLocating ? 'animate-spin' : ''}` }), isLocating ? 'Localizando...' : 'Mi ubicación'] }), route && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: () => {
                                        clearRoute();
                                        setShowRoutingPanel(false);
                                    }, className: "border-red-300 bg-transparent text-red-700 hover:bg-red-50", children: "Limpiar Ruta" }))] })] }) })), showRoutingPanel && selectedProducerForRoute && ((0, jsx_runtime_1.jsx)(routing_panel_1.default, { route: route, isCalculating: isCalculating, error: routingError, onCalculateRoute: handleCalculateRoute, onClearRoute: () => {
                    clearRoute();
                    setShowRoutingPanel(false);
                    setSelectedProducerForRoute(null);
                }, startAddress: "Tu ubicaci\u00F3n", endAddress: selectedProducerForRoute.name, className: "absolute right-4 top-4 z-[1000] max-h-[calc(100vh-2rem)] w-80 overflow-y-auto" })), (0, jsx_runtime_1.jsxs)(react_leaflet_1.MapContainer, { center: [defaultCenter.lat, defaultCenter.lng], zoom: defaultZoom, className: "h-full w-full", ref: mapRef, "aria-label": "Mapa interactivo de productores artesanales", children: [(0, jsx_runtime_1.jsx)(react_leaflet_1.TileLayer, { attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), (0, jsx_runtime_1.jsx)(MapBounds, { producers: producers }), producers.map(producer => ((0, jsx_runtime_1.jsx)(producer_marker_1.default, { producer: producer, onClick: handleProducerClick }, producer.id))), route && startPoint && endPoint && ((0, jsx_runtime_1.jsx)(route_display_1.default, { route: route, startPoint: startPoint, endPoint: endPoint, color: "#8a9b73" }))] }), !isLoading && producers.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_2.MapPin, { className: "mx-auto mb-4 h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-lg font-semibold text-gray-900", children: "No se encontraron productores" }), (0, jsx_runtime_1.jsx)("p", { className: "mb-4 text-gray-600", children: "Intenta ajustar los filtros para encontrar m\u00E1s resultados" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setFilters({
                                categories: [],
                                maxDistance: 50,
                                searchQuery: '',
                                minRating: 0,
                            }), className: "text-a4co-olive-600 hover:text-a4co-olive-700 text-sm font-medium", children: "Limpiar todos los filtros" })] }) }))] }));
}
//# sourceMappingURL=map-view.js.map