'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MapaPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const dynamic_1 = __importDefault(require("next/dynamic"));
const header_1 = require("@/components/header");
const footer_1 = require("@/components/footer");
const map_filters_1 = __importDefault(require("@/components/map-filters"));
const use_producers_1 = require("@/hooks/use-producers");
// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = (0, dynamic_1.default)(() => import('@/components/map-view'), {
    ssr: false,
    loading: () => ((0, jsx_runtime_1.jsx)("div", { className: "flex h-96 items-center justify-center rounded-lg bg-gray-100", children: (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Cargando mapa..." }) })),
});
function MapaPage() {
    const [filters, setFilters] = (0, react_1.useState)({
        search: '',
        category: 'all',
        maxDistance: 10,
        minRating: 0,
        onlyOpen: false,
    });
    const [selectedProducer, setSelectedProducer] = (0, react_1.useState)(null);
    const { producers, stats, isLoading } = (0, use_producers_1.useProducers)(filters);
    const handleFiltersChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };
    const handleReset = () => {
        setFilters({
            search: '',
            category: 'all',
            maxDistance: 10,
            minRating: 0,
            onlyOpen: false,
        });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gray-50", children: [(0, jsx_runtime_1.jsx)(header_1.Header, {}), (0, jsx_runtime_1.jsx)("main", { className: "pt-16", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 sm:mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "mb-2 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl", children: "Mapa de Productores Artesanales" }), (0, jsx_runtime_1.jsx)("p", { className: "max-w-3xl text-base text-gray-600 sm:text-lg", children: "Descubre productores locales cerca de ti. Utiliza los filtros para encontrar exactamente lo que buscas." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "xl:col-span-1", children: (0, jsx_runtime_1.jsx)("div", { className: "sticky top-24", children: (0, jsx_runtime_1.jsx)(map_filters_1.default, { filters: filters, stats: stats, onFiltersChange: handleFiltersChange, onReset: handleReset }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "xl:col-span-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "shadow-natural-lg overflow-hidden rounded-lg bg-white", children: (0, jsx_runtime_1.jsx)("div", { className: "h-96 sm:h-[500px] lg:h-[600px] xl:h-[700px]", children: isLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex h-full items-center justify-center bg-gray-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "border-a4co-olive-600 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Cargando productores..." })] }) })) : ((0, jsx_runtime_1.jsx)(MapView, { producers: producers, selectedProducer: selectedProducer, onProducerSelect: setSelectedProducer, className: "h-full" })) }) }), (0, jsx_runtime_1.jsx)("div", { className: "shadow-natural mt-4 rounded-lg border border-gray-200 bg-white p-4 sm:mt-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-gray-900", children: [producers.length, " productor", producers.length !== 1 ? 'es' : '', " encontrado", producers.length !== 1 ? 's' : ''] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [filters.category !== 'all' && `Categoría: ${filters.category} • `, filters.search && `Búsqueda: "${filters.search}" • `, "Radio: ", filters.maxDistance, "km"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["Valoraci\u00F3n promedio:", ' ', (0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: stats.averageRating.toFixed(1) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["Abiertos ahora: ", (0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: stats.openNow })] })] })] }) })] })] })] }) }), (0, jsx_runtime_1.jsx)(footer_1.Footer, {})] }));
}
//# sourceMappingURL=page.js.map