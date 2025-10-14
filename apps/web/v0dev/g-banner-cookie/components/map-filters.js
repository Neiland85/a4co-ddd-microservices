'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProducerFilters;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const slider_1 = require("@/components/ui/slider");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const categoryOptions = [
    { value: 'panaderia', label: 'Panaderías', emoji: '🥖' },
    { value: 'queseria', label: 'Queserías', emoji: '🧀' },
    { value: 'aceite', label: 'Almazaras', emoji: '🫒' },
    { value: 'embutidos', label: 'Embutidos', emoji: '🥓' },
    { value: 'miel', label: 'Apicultores', emoji: '🍯' },
    { value: 'conservas', label: 'Conservas', emoji: '🥫' },
    { value: 'vinos', label: 'Bodegas', emoji: '🍷' },
    { value: 'dulces', label: 'Repostería', emoji: '🍰' },
    { value: 'artesania', label: 'Artesanía', emoji: '🏺' },
];
function ProducerFilters({ filters, onFiltersChange, isOpen, onToggle, className = '', }) {
    const [searchInput, setSearchInput] = (0, react_1.useState)(filters.searchQuery);
    const handleCategoryToggle = (category) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        onFiltersChange({
            ...filters,
            categories: newCategories,
        });
    };
    const handleDistanceChange = (value) => {
        onFiltersChange({
            ...filters,
            maxDistance: value[0],
        });
    };
    const handleRatingChange = (value) => {
        onFiltersChange({
            ...filters,
            minRating: value[0],
        });
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onFiltersChange({
            ...filters,
            searchQuery: searchInput,
        });
    };
    const clearAllFilters = () => {
        setSearchInput('');
        onFiltersChange({
            categories: [],
            maxDistance: 50,
            searchQuery: '',
            minRating: 0,
        });
    };
    const activeFiltersCount = filters.categories.length +
        (filters.searchQuery ? 1 : 0) +
        (filters.maxDistance < 50 ? 1 : 0) +
        (filters.minRating > 0 ? 1 : 0);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: onToggle, variant: "outline", size: "sm", className: `border-a4co-olive-200 hover:bg-a4co-olive-50 shadow-natural-lg fixed left-4 top-20 z-[1000] bg-white/95 backdrop-blur-sm ${className}`, "aria-label": `${isOpen ? 'Cerrar' : 'Abrir'} filtros del mapa`, "aria-expanded": isOpen, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "mr-2 h-4 w-4" }), "Filtros", activeFiltersCount > 0 && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: "bg-a4co-olive-500 ml-2 px-1.5 py-0.5 text-xs text-white", children: activeFiltersCount }))] }), isOpen && ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-xl border-a4co-olive-200 fixed left-4 top-20 z-[1000] max-h-[calc(100vh-6rem)] w-80 overflow-y-auto bg-white/95 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "pb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center text-lg font-semibold text-gray-900", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "text-a4co-olive-600 mr-2 h-5 w-5" }), "Filtrar Productores"] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: onToggle, className: "h-8 w-8 p-0", "aria-label": "Cerrar panel de filtros", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }), activeFiltersCount > 0 && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: clearAllFilters, className: "border-gray-300 bg-transparent text-xs hover:bg-gray-50", children: "Limpiar filtros" }))] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "search-input", className: "mb-2 block text-sm font-medium text-gray-700", children: "Buscar por nombre" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSearchSubmit, className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "search-input", type: "text", placeholder: "Ej: Panader\u00EDa El Och\u00EDo...", value: searchInput, onChange: e => setSearchInput(e.target.value), className: "focus:border-a4co-olive-500 focus:ring-a4co-olive-500 border-gray-300 pl-10", "aria-describedby": "search-help" })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", size: "sm", className: "bg-a4co-olive-500 hover:bg-a4co-olive-600 text-white", "aria-label": "Buscar productores", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsx)("p", { id: "search-help", className: "mt-1 text-xs text-gray-500", children: "Busca por nombre del productor o descripci\u00F3n" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "mb-3 block text-sm font-medium text-gray-700", children: "Categor\u00EDas de Productores" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-2", children: categoryOptions.map(option => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handleCategoryToggle(option.value), className: `flex items-center rounded-lg border-2 p-3 text-left transition-all duration-200 ${filters.categories.includes(option.value)
                                                ? 'border-a4co-olive-500 bg-a4co-olive-50 text-a4co-olive-700'
                                                : 'hover:border-a4co-olive-300 border-gray-200 hover:bg-gray-50'}`, "aria-pressed": filters.categories.includes(option.value), "aria-label": `Filtrar por ${option.label}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-2 text-lg", role: "img", "aria-hidden": "true", children: option.emoji }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: option.label })] }, option.value))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(label_1.Label, { className: "mb-3 block flex items-center text-sm font-medium text-gray-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "mr-1 h-4 w-4" }), "Distancia m\u00E1xima: ", filters.maxDistance, " km"] }), (0, jsx_runtime_1.jsx)(slider_1.Slider, { value: [filters.maxDistance], onValueChange: handleDistanceChange, max: 50, min: 1, step: 1, className: "w-full", "aria-label": `Distancia máxima: ${filters.maxDistance} kilómetros` }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 flex justify-between text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: "1 km" }), (0, jsx_runtime_1.jsx)("span", { children: "50 km" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(label_1.Label, { className: "mb-3 block flex items-center text-sm font-medium text-gray-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "mr-1 h-4 w-4" }), "Valoraci\u00F3n m\u00EDnima:", ' ', filters.minRating > 0 ? `${filters.minRating.toFixed(1)} estrellas` : 'Cualquiera'] }), (0, jsx_runtime_1.jsx)(slider_1.Slider, { value: [filters.minRating], onValueChange: handleRatingChange, max: 5, min: 0, step: 0.5, className: "w-full", "aria-label": `Valoración mínima: ${filters.minRating} estrellas` }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 flex justify-between text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: "Cualquiera" }), (0, jsx_runtime_1.jsx)("span", { children: "5 estrellas" })] })] }), activeFiltersCount > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "border-t border-gray-200 pt-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-2 text-sm font-medium text-gray-700", children: "Filtros activos:" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-xs text-gray-600", children: [filters.categories.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: ["\u2022 ", filters.categories.length, " categor\u00EDa", filters.categories.length > 1 ? 's' : '', " seleccionada", filters.categories.length > 1 ? 's' : ''] })), filters.searchQuery && (0, jsx_runtime_1.jsxs)("div", { children: ["\u2022 B\u00FAsqueda: \"", filters.searchQuery, "\""] }), filters.maxDistance < 50 && ((0, jsx_runtime_1.jsxs)("div", { children: ["\u2022 M\u00E1ximo ", filters.maxDistance, " km de distancia"] })), filters.minRating > 0 && (0, jsx_runtime_1.jsxs)("div", { children: ["\u2022 M\u00EDnimo ", filters.minRating, " estrellas"] })] })] }))] })] }))] }));
}
//# sourceMappingURL=map-filters.js.map