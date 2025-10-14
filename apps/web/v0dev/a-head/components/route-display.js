'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteDisplay = RouteDisplay;
const jsx_runtime_1 = require("react/jsx-runtime");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
function RouteDisplay({ route, onStartNavigation }) {
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'hard':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getDifficultyLabel = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 'Fácil';
            case 'medium':
                return 'Moderada';
            case 'hard':
                return 'Difícil';
            default:
                return 'Desconocida';
        }
    };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "w-full", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RouteIcon, { className: "h-5 w-5 text-green-600" }), route.name] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: getDifficultyColor(route.difficulty), children: getDifficultyLabel(route.difficulty) })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: route.description })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RouteIcon, { className: "h-4 w-4 text-blue-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Distancia" }), (0, jsx_runtime_1.jsxs)("p", { className: "font-semibold", children: [route.totalDistance.toFixed(1), " km"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-orange-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Duraci\u00F3n" }), (0, jsx_runtime_1.jsxs)("p", { className: "font-semibold", children: [Math.round(route.totalDuration), " min"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700", children: "Puntos de la ruta" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: route.points.map((point, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: `h-3 w-3 ${point.type === 'start'
                                                ? 'text-green-600'
                                                : point.type === 'end'
                                                    ? 'text-red-600'
                                                    : 'text-blue-600'}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-700", children: point.name }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: point.type === 'start' ? 'Inicio' : point.type === 'end' ? 'Final' : 'Parada' })] }, index))) })] }), route.highlights.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "flex items-center gap-1 text-sm font-medium text-gray-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-3 w-3 text-yellow-500" }), "Destacados de la ruta"] }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-1", children: route.highlights.map((highlight, index) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-1 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)("span", { className: "mt-1 text-yellow-500", children: "\u2022" }), highlight] }, index))) })] })), onStartNavigation && ((0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: onStartNavigation, className: "w-full bg-green-600 hover:bg-green-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Navigation, { className: "mr-2 h-4 w-4" }), "Iniciar Navegaci\u00F3n"] }))] })] }));
}
//# sourceMappingURL=route-display.js.map