'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProducerMarker;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_leaflet_1 = require("react-leaflet");
const leaflet_1 = require("leaflet");
const lucide_react_1 = require("lucide-react");
const badge_1 = require("@/components/ui/badge");
const card_1 = require("@/components/ui/card");
const utils_1 = require("@/lib/utils");
const createCustomIcon = (category, color) => {
    const categoryInitial = category.charAt(0).toUpperCase();
    const svgContent = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="#fff" strokeWidth="2"/>
      <text x="16" y="21" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">
        ${categoryInitial}
      </text>
    </svg>
  `;
    const encodedSvg = encodeURIComponent(svgContent);
    return new leaflet_1.Icon({
        iconUrl: `data:image/svg+xml,${encodedSvg}`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};
const categoryColors = {
    panaderia: '#8B4513',
    queseria: '#FFD700',
    aceite: '#228B22',
    miel: '#FFA500',
    conservas: '#DC143C',
    vino: '#800080',
    embutidos: '#A0522D',
    dulces: '#FF69B4',
};
function ProducerMarker({ producer, isSelected, onClick }) {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const icon = createCustomIcon(producer.category, categoryColors[producer.category] || '#6B7280');
    const formatRating = (rating) => {
        return rating.toFixed(1);
    };
    const formatDistance = (distance) => {
        return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
    };
    return ((0, jsx_runtime_1.jsx)(react_leaflet_1.Marker, { position: [producer.lat, producer.lng], icon: icon, eventHandlers: {
            click: onClick,
            mouseover: () => setIsHovered(true),
            mouseout: () => setIsHovered(false),
        }, children: (0, jsx_runtime_1.jsx)(react_leaflet_1.Tooltip, { permanent: isSelected || isHovered, direction: "top", offset: [0, -10], className: "producer-tooltip", children: (0, jsx_runtime_1.jsx)(card_1.Card, { className: (0, utils_1.cn)('shadow-natural-lg min-w-[280px] border-0 transition-all duration-300', isSelected && 'ring-a4co-olive-500 shadow-natural-xl ring-2'), children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-3 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold leading-tight text-gray-900", children: producer.name }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-3 w-3 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: producer.location })] })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: (0, utils_1.cn)('px-2 py-1 text-xs', producer.isOpen
                                        ? 'border-green-200 bg-green-100 text-green-800'
                                        : 'border-red-200 bg-red-100 text-red-800'), children: producer.isOpen ? 'Abierto' : 'Cerrado' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-3 w-3 fill-current text-yellow-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium text-gray-900", children: formatRating(producer.rating) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-500", children: ["(", producer.reviewCount, " rese\u00F1as)"] })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: formatDistance(producer.distance) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium text-gray-700", children: "Especialidades:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1", children: [producer.specialties.slice(0, 3).map((specialty, index) => ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "bg-a4co-olive-50 text-a4co-olive-700 border-a4co-olive-200 px-2 py-0.5 text-xs", children: specialty }, index))), producer.specialties.length > 3 && ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "px-2 py-0.5 text-xs", children: ["+", producer.specialties.length - 3] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-t border-gray-100 pt-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [producer.phone && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-3 w-3 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: producer.phone })] })), producer.email && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-3 w-3 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: producer.email })] }))] }), producer.hours && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: producer.hours })] }))] })] }) }) }) }));
}
//# sourceMappingURL=producer-marker.js.map