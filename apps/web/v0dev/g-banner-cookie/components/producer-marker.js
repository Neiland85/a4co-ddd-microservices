'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProducerMarker;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_leaflet_1 = require("react-leaflet");
const leaflet_1 = require("leaflet");
const lucide_react_1 = require("lucide-react");
// Custom marker icons for different categories
const createCustomIcon = (category, isSelected = false) => {
    const iconColor = isSelected ? '#4a934a' : getCategoryColor(category);
    const iconSize = isSelected ? 35 : 30;
    return new leaflet_1.Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${iconColor}" stroke="white" strokeWidth="2"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          ${getCategoryEmoji(category)}
        </text>
      </svg>
    `)}`,
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize],
        popupAnchor: [0, -iconSize],
    });
};
const getCategoryColor = (category) => {
    const colors = {
        panaderia: '#b08968',
        queseria: '#f4d03f',
        aceite: '#8a9b73',
        embutidos: '#cd6155',
        miel: '#f7dc6f',
        conservas: '#85c1e9',
        vinos: '#8e44ad',
        dulces: '#f1948a',
        artesania: '#82e0aa',
    };
    return colors[category] || '#8a9b73';
};
const getCategoryEmoji = (category) => {
    const emojis = {
        panaderia: '🥖',
        queseria: '🧀',
        aceite: '🫒',
        embutidos: '🥓',
        miel: '🍯',
        conservas: '🥫',
        vinos: '🍷',
        dulces: '🍰',
        artesania: '🏺',
    };
    return emojis[category] || '🏪';
};
const getCategoryName = (category) => {
    const names = {
        panaderia: 'Panadería',
        queseria: 'Quesería',
        aceite: 'Almazara',
        embutidos: 'Embutidos',
        miel: 'Apicultor',
        conservas: 'Conservas',
        vinos: 'Bodega',
        dulces: 'Repostería',
        artesania: 'Artesanía',
    };
    return names[category] || 'Productor';
};
function ProducerMarker({ producer, onClick }) {
    const handleMarkerClick = () => {
        onClick?.(producer);
    };
    return ((0, jsx_runtime_1.jsx)(react_leaflet_1.Marker, { position: [producer.coordinates.lat, producer.coordinates.lng], icon: createCustomIcon(producer.category), eventHandlers: {
            click: handleMarkerClick,
        }, "aria-label": `Productor ${producer.name} en ${producer.address}`, children: (0, jsx_runtime_1.jsx)(react_leaflet_1.Tooltip, { direction: "top", offset: [0, -10], opacity: 0.95, className: "producer-tooltip", permanent: false, children: (0, jsx_runtime_1.jsxs)("div", { className: "shadow-natural-lg max-w-sm rounded-lg border border-gray-200 bg-white p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-3 flex items-start justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-1 text-lg font-semibold text-gray-900", children: producer.name }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "bg-a4co-olive-100 text-a4co-olive-700 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", children: [getCategoryEmoji(producer.category), " ", getCategoryName(producer.category)] }), producer.distance && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "mr-1 h-3 w-3" }), producer.distance.toFixed(1), " km"] }))] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mb-3 flex items-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [[...Array(5)].map((_, i) => ((0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: `h-4 w-4 ${i < Math.floor(producer.rating)
                                        ? 'fill-current text-yellow-400'
                                        : 'text-gray-300'}` }, i))), (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-sm font-medium text-gray-700", children: producer.rating.toFixed(1) })] }) }), (0, jsx_runtime_1.jsx)("p", { className: "mb-3 line-clamp-2 text-sm text-gray-600", children: producer.description }), producer.specialties.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-1 text-xs font-semibold text-gray-700", children: "Especialidades:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1", children: [producer.specialties.slice(0, 3).map((specialty, index) => ((0, jsx_runtime_1.jsx)("span", { className: "bg-a4co-clay-100 text-a4co-clay-700 inline-block rounded px-2 py-1 text-xs", children: specialty }, index))), producer.specialties.length > 3 && ((0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-500", children: ["+", producer.specialties.length - 3, " m\u00E1s"] }))] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-xs text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "mr-2 h-3 w-3 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: producer.address })] }), producer.phone && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "mr-2 h-3 w-3 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { children: producer.phone })] })), producer.established && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "mr-2 h-3 w-3 text-gray-400" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Desde ", producer.established] })] }))] }), producer.certifications.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "mt-3 border-t border-gray-200 pt-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Award, { className: "text-a4co-olive-600 h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { className: "text-a4co-olive-700 text-xs font-medium", children: producer.certifications.join(' • ') })] }) })), (0, jsx_runtime_1.jsx)("button", { onClick: handleMarkerClick, className: "from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 shadow-natural hover:shadow-natural-md mt-3 w-full rounded-md bg-gradient-to-r px-3 py-2 text-xs font-medium text-white transition-all duration-200", "aria-label": `Ver más detalles de ${producer.name}`, children: "Ver Detalles" }), (0, jsx_runtime_1.jsxs)("button", { onClick: e => {
                            e.stopPropagation();
                            // This will be handled by the parent MapView component
                            if (onClick) {
                                onClick(producer);
                            }
                        }, className: "bg-a4co-olive-500 hover:bg-a4co-olive-600 shadow-natural hover:shadow-natural-md mt-2 flex w-full items-center justify-center rounded-md px-3 py-2 text-xs font-medium text-white transition-all duration-200", "aria-label": `Calcular ruta hacia ${producer.name}`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Navigation, { className: "mr-1 h-3 w-3" }), "C\u00F3mo Llegar"] })] }) }) }));
}
//# sourceMappingURL=producer-marker.js.map