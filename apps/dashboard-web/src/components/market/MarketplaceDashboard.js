// Página principal integrada del Mercado Local de Jaén
'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useGeolocation_1 = require("../../hooks/useGeolocation");
const useSalesOpportunities_1 = require("../../hooks/useSalesOpportunities");
const useProducts_1 = require("../../hooks/useProducts");
const useArtisans_1 = require("../../hooks/useArtisans");
const ProductCatalog_1 = __importDefault(require("./ProductCatalog"));
const ProductSearch_1 = __importDefault(require("./ProductSearch"));
const LocationInfo = ({ location, isInJaen, loading, error, onRequestLocation, }) => {
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-blue-800", children: "Obteniendo tu ubicaci\u00F3n..." })] }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-amber-800", children: ["\uD83D\uDCCD ", error] }), (0, jsx_runtime_1.jsx)("button", { onClick: onRequestLocation, className: "rounded bg-amber-600 px-3 py-1 text-sm text-white hover:bg-amber-700", children: "Reintentar" })] }) }));
    }
    if (!location) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 rounded-lg border border-green-200 bg-green-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-green-800", children: "\uD83D\uDCCD Habilita la ubicaci\u00F3n para ver productos cercanos" }), (0, jsx_runtime_1.jsx)("button", { onClick: onRequestLocation, className: "rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700", children: "Activar ubicaci\u00F3n" })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: `mb-6 rounded-lg border p-4 ${isInJaen ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: isInJaen ? 'text-green-800' : 'text-blue-800', children: [(0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: ["\uD83D\uDCCD ", location.municipality ? `${location.municipality}, ` : '', location.province || 'Tu ubicación'] }), isInJaen && (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-sm", children: "\uD83C\uDF89 \u00A1Est\u00E1s en la provincia de Ja\u00E9n!" })] }), !isInJaen && ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-blue-600", children: "Visita Ja\u00E9n para disfrutar de productos locales" }))] }) }));
};
const StatsCard = ({ title, value, subtitle, icon, color }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: `border-l-4 bg-white ${color} rounded-lg p-4 shadow-sm`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mr-3 text-2xl", children: icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-800", children: value }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-600", children: title }), subtitle && (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: subtitle })] })] }) }));
};
const MarketStats = ({ productsCount, artisansCount, opportunitiesCount, loading, }) => {
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "mb-8 grid grid-cols-1 gap-4 md:grid-cols-3", children: [1, 2, 3].map(i => ((0, jsx_runtime_1.jsxs)("div", { className: "animate-pulse rounded-lg bg-white p-4 shadow-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-2 h-8 rounded bg-gray-200" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 rounded bg-gray-200" })] }, i))) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mb-8 grid grid-cols-1 gap-4 md:grid-cols-3", children: [(0, jsx_runtime_1.jsx)(StatsCard, { title: "Productos Locales", value: productsCount, subtitle: "Disponibles ahora", icon: "\uD83D\uDED2", color: "border-green-500" }), (0, jsx_runtime_1.jsx)(StatsCard, { title: "Productores Verificados", value: artisansCount, subtitle: "En toda la provincia", icon: "\uD83D\uDC68\u200D\uD83C\uDF3E", color: "border-blue-500" }), (0, jsx_runtime_1.jsx)(StatsCard, { title: "Oportunidades de Venta", value: opportunitiesCount, subtitle: "Eventos y mercados", icon: "\uD83D\uDCC5", color: "border-amber-500" })] }));
};
const QuickActions = ({ onSearchProducts, onViewOpportunities, onContactArtisans, }) => {
    const actions = [
        {
            title: 'Buscar Productos',
            description: 'Encuentra productos locales de temporada',
            icon: '🔍',
            action: onSearchProducts,
            color: 'bg-green-600 hover:bg-green-700',
        },
        {
            title: 'Ver Oportunidades',
            description: 'Mercados, ferias y eventos locales',
            icon: '📅',
            action: onViewOpportunities,
            color: 'bg-blue-600 hover:bg-blue-700',
        },
        {
            title: 'Conectar Artesanos',
            description: 'Contacta directamente con productores',
            icon: '🤝',
            action: onContactArtisans,
            color: 'bg-amber-600 hover:bg-amber-700',
        },
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: "mb-8 grid grid-cols-1 gap-4 md:grid-cols-3", children: actions.map(action => ((0, jsx_runtime_1.jsxs)("button", { onClick: action.action, className: `${action.color} transform rounded-lg p-6 text-white shadow-md transition-all duration-200 hover:scale-105`, children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-2 text-3xl", children: action.icon }), (0, jsx_runtime_1.jsx)("h3", { className: "mb-1 text-lg font-bold", children: action.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm opacity-90", children: action.description })] }, action.title))) }));
};
const MarketplaceDashboard = () => {
    const [activeView, setActiveView] = (0, react_1.useState)('dashboard');
    // Hooks para datos
    const geolocation = (0, useGeolocation_1.useMarketLocations)();
    const seasonalProducts = (0, useProducts_1.useSeasonalProducts)();
    const availableProducts = (0, useProducts_1.useAvailableProducts)();
    const verifiedArtisans = (0, useArtisans_1.useVerifiedArtisans)();
    const highPriorityOpportunities = (0, useSalesOpportunities_1.useHighPriorityOpportunities)();
    const isLoading = seasonalProducts.loading ||
        availableProducts.loading ||
        verifiedArtisans.loading ||
        highPriorityOpportunities.loading;
    const renderContent = () => {
        switch (activeView) {
            case 'search':
                return (0, jsx_runtime_1.jsx)(ProductSearch_1.default, { title: "Buscar Productos Locales de Ja\u00E9n" });
            case 'catalog':
                return (0, jsx_runtime_1.jsx)(ProductCatalog_1.default, { title: "Cat\u00E1logo de Productos Locales" });
            default:
                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(LocationInfo, { location: geolocation.location, isInJaen: geolocation.isLocationInJaen, loading: geolocation.loading, error: geolocation.error, onRequestLocation: geolocation.getCurrentLocation }), (0, jsx_runtime_1.jsx)(MarketStats, { productsCount: availableProducts.products.length, artisansCount: verifiedArtisans.artisans.length, opportunitiesCount: highPriorityOpportunities.count, loading: isLoading }), (0, jsx_runtime_1.jsx)(QuickActions, { onSearchProducts: () => setActiveView('search'), onViewOpportunities: () => window.open('/api/sales-opportunities', '_blank'), onContactArtisans: () => alert('Funcionalidad en desarrollo') }), seasonalProducts.products.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-gray-800", children: "\uD83C\uDF3F Productos de Temporada" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveView('catalog'), className: "font-medium text-green-600 hover:text-green-700", children: "Ver todos \u2192" })] }), (0, jsx_runtime_1.jsx)(ProductCatalog_1.default, { title: "", showFilters: false, maxItems: 4 })] })), geolocation.nearbyLocations.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg bg-blue-50 p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-4 text-xl font-bold text-blue-800", children: "\uD83D\uDCCD Lugares de Inter\u00E9s Cercanos" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: geolocation.nearbyLocations.slice(0, 4).map(location => {
                                        // Destructuración segura para evitar problemas de tipos
                                        const { name, type, distance, ...extraProps } = location;
                                        const description = extraProps.description;
                                        return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg bg-white p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-800", children: name }), (0, jsx_runtime_1.jsx)("p", { className: "mb-1 text-sm text-gray-600", children: type }), description && (0, jsx_runtime_1.jsx)("p", { className: "mb-2 text-xs text-gray-500", children: description }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-blue-600", children: ["\uD83D\uDCCD ", distance?.toFixed(1), " km de distancia"] })] }, name));
                                    }) })] }))] }));
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-green-50 to-amber-50", children: [(0, jsx_runtime_1.jsx)("header", { className: "border-b bg-white shadow-sm", children: (0, jsx_runtime_1.jsx)("div", { className: "mx-auto max-w-7xl px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-4", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveView('dashboard'), className: `text-2xl font-bold transition-colors ${activeView === 'dashboard'
                                        ? 'text-green-700'
                                        : 'text-gray-600 hover:text-green-600'}`, children: "\uD83C\uDF3F Mercado Local de Ja\u00E9n" }) }), (0, jsx_runtime_1.jsxs)("nav", { className: "flex space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveView('dashboard'), className: `rounded-lg px-4 py-2 font-medium transition-colors ${activeView === 'dashboard'
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-600 hover:text-green-600'}`, children: "Inicio" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveView('search'), className: `rounded-lg px-4 py-2 font-medium transition-colors ${activeView === 'search'
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-600 hover:text-green-600'}`, children: "Buscar" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveView('catalog'), className: `rounded-lg px-4 py-2 font-medium transition-colors ${activeView === 'catalog'
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-600 hover:text-green-600'}`, children: "Cat\u00E1logo" })] })] }) }) }), (0, jsx_runtime_1.jsx)("main", { className: "mx-auto max-w-7xl px-4 py-8", children: renderContent() }), (0, jsx_runtime_1.jsx)("footer", { className: "mt-16 border-t bg-white", children: (0, jsx_runtime_1.jsx)("div", { className: "mx-auto max-w-7xl px-4 py-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center text-gray-600", children: [(0, jsx_runtime_1.jsx)("p", { className: "mb-2", children: "\uD83C\uDF3F Mercado Local de Ja\u00E9n - Conectando productores y consumidores" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: "Promoviendo el comercio sostenible y los productos artesanales de nuestra regi\u00F3n" })] }) }) })] }));
};
exports.default = MarketplaceDashboard;
//# sourceMappingURL=MarketplaceDashboard.js.map