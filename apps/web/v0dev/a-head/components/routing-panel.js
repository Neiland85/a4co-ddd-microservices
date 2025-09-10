'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingPanel = RoutingPanel;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const switch_1 = require("@/components/ui/switch");
const select_1 = require("@/components/ui/select");
const lucide_react_1 = require("lucide-react");
const use_routing_1 = require("@/hooks/use-routing");
const route_display_1 = require("./route-display");
function RoutingPanel() {
    const { currentRoute, isCalculating, error, calculateRoute, optimizeRoute, clearRoute } = (0, use_routing_1.useRouting)();
    const [startPoint, setStartPoint] = (0, react_1.useState)({
        name: '',
        lat: 37.7749,
        lng: -3.7849,
    });
    const [endPoint, setEndPoint] = (0, react_1.useState)({
        name: '',
        lat: 37.7849,
        lng: -3.7749,
    });
    const [waypoints, setWaypoints] = (0, react_1.useState)([]);
    const [options, setOptions] = (0, react_1.useState)({
        mode: 'driving',
        avoidTolls: false,
        avoidHighways: false,
        optimize: true,
    });
    const addWaypoint = () => {
        setWaypoints([...waypoints, { name: '', lat: 37.7799, lng: -3.7799 }]);
    };
    const removeWaypoint = (index) => {
        setWaypoints(waypoints.filter((_, i) => i !== index));
    };
    const updateWaypoint = (index, field, value) => {
        const updated = [...waypoints];
        updated[index] = { ...updated[index], [field]: value };
        setWaypoints(updated);
    };
    const handleCalculateRoute = async () => {
        if (!startPoint.name || !endPoint.name)
            return;
        const validWaypoints = waypoints.filter(wp => wp.name);
        if (options.optimize && validWaypoints.length > 0) {
            await optimizeRoute([startPoint, ...validWaypoints, endPoint], options);
        }
        else {
            await calculateRoute({ ...startPoint, type: 'start' }, { ...endPoint, type: 'end' }, validWaypoints.map(wp => ({ ...wp, type: 'waypoint' })), options);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RouteIcon, { className: "h-5 w-5 text-green-600" }), "Planificador de Rutas Artesanales"] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "start", children: "Punto de inicio" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "start", placeholder: "Ej: Ja\u00E9n Centro", value: startPoint.name, onChange: e => setStartPoint({ ...startPoint, name: e.target.value }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "end", children: "Destino" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "end", placeholder: "Ej: \u00DAbeda", value: endPoint.name, onChange: e => setEndPoint({ ...endPoint, name: e.target.value }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Paradas intermedias" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "button", variant: "outline", size: "sm", onClick: addWaypoint, className: "border-green-200 bg-transparent text-green-600 hover:bg-green-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "mr-1 h-4 w-4" }), "A\u00F1adir parada"] })] }), waypoints.map((waypoint, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4 flex-shrink-0 text-blue-600" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: `Parada ${index + 1}`, value: waypoint.name, onChange: e => updateWaypoint(index, 'name', e.target.value) }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeWaypoint(index), className: "text-red-600 hover:bg-red-50", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }, index)))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 border-t pt-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-sm font-medium", children: "Opciones de ruta" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "mode", className: "text-sm", children: "Modo de transporte" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: options.mode, onValueChange: (value) => setOptions({ ...options, mode: value }), children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "walking", children: "\uD83D\uDEB6 A pie" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "cycling", children: "\uD83D\uDEB4 En bicicleta" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "driving", children: "\uD83D\uDE97 En coche" })] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "optimize", className: "text-sm", children: "Optimizar ruta" }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { id: "optimize", checked: options.optimize, onCheckedChange: checked => setOptions({ ...options, optimize: checked }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "avoid-tolls", className: "text-sm", children: "Evitar peajes" }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { id: "avoid-tolls", checked: options.avoidTolls, onCheckedChange: checked => setOptions({ ...options, avoidTolls: checked }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "avoid-highways", className: "text-sm", children: "Evitar autopistas" }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { id: "avoid-highways", checked: options.avoidHighways, onCheckedChange: checked => setOptions({ ...options, avoidHighways: checked }) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 border-t pt-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleCalculateRoute, disabled: !startPoint.name || !endPoint.name || isCalculating, className: "flex-1 bg-green-600 hover:bg-green-700", children: isCalculating ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Calculando..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RouteIcon, { className: "mr-2 h-4 w-4" }), "Calcular Ruta"] })) }), currentRoute && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: clearRoute, className: "border-red-200 bg-transparent text-red-600 hover:bg-red-50", children: "Limpiar" }))] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "rounded-md border border-red-200 bg-red-50 p-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: error }) }))] })] }), currentRoute && ((0, jsx_runtime_1.jsx)(route_display_1.RouteDisplay, { route: currentRoute, onStartNavigation: () => {
                    // Handle navigation start
                    console.log('Starting navigation for route:', currentRoute.id);
                } }))] }));
}
//# sourceMappingURL=routing-panel.js.map