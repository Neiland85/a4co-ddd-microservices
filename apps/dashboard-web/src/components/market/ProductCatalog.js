// 🫒 Catálogo de Productos del Mercado Local de Jaén 🫒
// Diseño auténtico inspirado en la tradición olivarera de Jaén
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFilters = exports.ProductCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useProducts_1 = require("../../hooks/useProducts");
const ProductCard = ({ product, onViewDetails }) => {
    const getCategoryIcon = (category) => {
        const icons = {
            aceite: '🫒',
            queso: '🧀',
            jamón: '🥓',
            miel: '🍯',
            vino: '🍷',
            aceitunas: '🫒',
            artesanía: '🏺',
            conservas: '🥫',
            embutidos: '🥓',
            aceites: '🫒',
        };
        return icons[category] || '🌾';
    };
    const getCategoryGradient = (category) => {
        const gradients = {
            aceite: 'from-amber-200 via-yellow-200 to-amber-300',
            aceites: 'from-amber-200 via-yellow-200 to-amber-300',
            queso: 'from-orange-100 via-yellow-100 to-orange-200',
            jamón: 'from-red-100 via-pink-100 to-red-200',
            miel: 'from-yellow-200 via-amber-200 to-yellow-300',
            vino: 'from-purple-100 via-red-100 to-purple-200',
            aceitunas: 'from-green-200 via-olive-200 to-green-300',
            artesanía: 'from-orange-200 via-amber-200 to-orange-300',
            conservas: 'from-green-100 via-lime-100 to-green-200',
            embutidos: 'from-red-200 via-orange-200 to-red-300',
        };
        return (gradients[category] || 'from-stone-100 via-amber-50 to-stone-200');
    };
    const getAvailabilityStatus = () => {
        if (!product.available)
            return { text: 'No disponible', color: 'text-red-600' };
        if (product.stock <= 5)
            return { text: 'Pocas unidades', color: 'text-orange-600' };
        return { text: 'Disponible', color: 'text-green-600' };
    };
    const availability = getAvailabilityStatus();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "group transform overflow-hidden rounded-xl border border-amber-100 bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: `h-52 bg-gradient-to-br ${getCategoryGradient(product.category)} relative flex items-center justify-center`, children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-amber-200/20" }), (0, jsx_runtime_1.jsx)("span", { className: "z-10 text-7xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110", children: getCategoryIcon(product.category) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute right-3 top-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg", children: product.category }), product.seasonal && ((0, jsx_runtime_1.jsx)("div", { className: "absolute left-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg", children: "\uD83C\uDF3F Temporada" })), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-3 left-3 rounded-full border border-amber-200 bg-white/90 px-2 py-1 text-xs font-medium text-amber-800 backdrop-blur-sm", children: "\uD83C\uDFDB\uFE0F Ja\u00E9n" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 p-5", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-1 line-clamp-2 text-xl font-bold text-amber-900 transition-colors group-hover:text-amber-800", children: product.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-medium text-amber-700", children: ["\uD83D\uDC68\u200D\uD83C\uDF3E ", product.producer] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm text-amber-600", children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: "\uD83D\uDCCD" }), (0, jsx_runtime_1.jsx)("span", { children: product.location.municipality })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between py-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-2xl font-bold text-amber-800", children: ["\u20AC", product.price.toFixed(2)] }), (0, jsx_runtime_1.jsxs)("span", { className: "ml-1 text-sm text-amber-600", children: ["/ ", product.unit] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("span", { className: `text-sm font-semibold ${availability.color}`, children: availability.text }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-amber-600", children: ["Stock: ", product.stock] })] })] }), product.certifications.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1.5", children: [product.certifications.slice(0, 2).map(cert => ((0, jsx_runtime_1.jsxs)("span", { className: "rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800", children: ["\u2713 ", cert] }, cert))), product.certifications.length > 2 && ((0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-medium text-amber-600", children: ["+", product.certifications.length - 2, " m\u00E1s certificaciones"] }))] }) })), (0, jsx_runtime_1.jsx)("button", { onClick: () => onViewDetails?.(product), className: "flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-amber-700 hover:via-yellow-700 hover:to-amber-700 hover:shadow-xl", children: "\uD83D\uDC41\uFE0F Ver Detalles" })] })] }));
};
exports.ProductCard = ProductCard;
const ProductFilters = ({ onCategoryChange, onLocationChange, onSeasonalToggle, onAvailableToggle, filters, }) => {
    const categories = [
        { value: '', label: 'Todas las categorías', icon: '🌾' },
        { value: 'aceite', label: 'Aceite de Oliva', icon: '🫒' },
        { value: 'aceites', label: 'Aceites Varietales', icon: '🫒' },
        { value: 'queso', label: 'Quesos Artesanos', icon: '🧀' },
        { value: 'jamón', label: 'Jamón Serrano', icon: '🥓' },
        { value: 'miel', label: 'Miel Natural', icon: '🍯' },
        { value: 'vino', label: 'Vinos de Jaén', icon: '🍷' },
        { value: 'aceitunas', label: 'Aceitunas Frescas', icon: '🫒' },
        { value: 'artesanía', label: 'Artesanía Local', icon: '🏺' },
        { value: 'conservas', label: 'Conservas Gourmet', icon: '🥫' },
        { value: 'embutidos', label: 'Embutidos Caseros', icon: '🥓' },
    ];
    const municipalities = [
        { value: '', label: 'Toda la Provincia', icon: '🏛️' },
        { value: 'Jaén', label: 'Jaén Capital', icon: '🏛️' },
        { value: 'Úbeda', label: 'Úbeda', icon: '🏰' },
        { value: 'Baeza', label: 'Baeza', icon: '⛪' },
        { value: 'Cazorla', label: 'Cazorla', icon: '🏔️' },
        { value: 'Andújar', label: 'Andújar', icon: '🌸' },
        { value: 'Linares', label: 'Linares', icon: '⚒️' },
        { value: 'Martos', label: 'Martos', icon: '🫒' },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mb-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6 shadow-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-amber-900", children: "Filtros del Mercado" }), (0, jsx_runtime_1.jsx)("div", { className: "h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "category-select", className: "mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800", children: "\uD83C\uDFF7\uFE0F Categor\u00EDa" }), (0, jsx_runtime_1.jsx)("select", { id: "category-select", value: filters.category || '', onChange: e => onCategoryChange(e.target.value), className: "w-full rounded-xl border-2 border-amber-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-amber-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500", children: categories.map(category => ((0, jsx_runtime_1.jsxs)("option", { value: category.value, children: [category.icon, " ", category.label] }, category.value))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "location-select", className: "mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800", children: "\uD83D\uDCCD Ubicaci\u00F3n" }), (0, jsx_runtime_1.jsx)("select", { id: "location-select", value: filters.location || '', onChange: e => onLocationChange(e.target.value), className: "w-full rounded-xl border-2 border-amber-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-amber-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500", children: municipalities.map(municipality => ((0, jsx_runtime_1.jsxs)("option", { value: municipality.value, children: [municipality.icon, " ", municipality.label] }, municipality.value))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("label", { className: "flex cursor-pointer items-center gap-3 rounded-xl border-2 border-green-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-green-300", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: filters.seasonal || false, onChange: e => onSeasonalToggle(e.target.checked), className: "h-5 w-5 rounded border-2 border-green-300 text-green-600 focus:ring-2 focus:ring-green-500" }), (0, jsx_runtime_1.jsx)("span", { className: "flex items-center gap-2 text-sm font-medium text-green-800", children: "\uD83C\uDF3F Solo Temporada" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("label", { className: "flex cursor-pointer items-center gap-3 rounded-xl border-2 border-emerald-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-emerald-300", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: filters.available || false, onChange: e => onAvailableToggle(e.target.checked), className: "h-5 w-5 rounded border-2 border-emerald-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500" }), (0, jsx_runtime_1.jsx)("span", { className: "flex items-center gap-2 text-sm font-medium text-emerald-800", children: "\u2705 Solo Disponibles" })] }) })] })] }));
};
exports.ProductFilters = ProductFilters;
const ProductCatalog = ({ title = 'Productos Locales de Jaén', showFilters = true, maxItems, }) => {
    const [selectedProduct, setSelectedProduct] = (0, react_1.useState)(null);
    const [filters, setFilters] = (0, react_1.useState)({
        category: '',
        location: '',
        seasonal: false,
        available: true,
    });
    const { products, loading, error, pagination, fetchProducts, loadMore, canLoadMore } = (0, useProducts_1.useProducts)({
        ...filters,
        category: filters.category || undefined,
        location: filters.location || undefined,
        limit: maxItems || 12,
        autoFetch: true,
    });
    const handleFilterChange = (newFilters) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        fetchProducts(updatedFilters);
    };
    const displayedProducts = maxItems ? products.slice(0, maxItems) : products;
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-red-200 bg-red-50 p-4 text-center", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-red-600", children: ["Error: ", error] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => fetchProducts(), className: "mt-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700", children: "Reintentar" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-7xl px-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative inline-block", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-2 bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-800 bg-clip-text text-4xl font-bold text-transparent md:text-5xl", children: title }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" })] }), (0, jsx_runtime_1.jsx)("p", { className: "mx-auto mt-4 max-w-2xl text-lg text-amber-700", children: "\uD83E\uDED2 Descubre los mejores productos artesanales de la provincia de Ja\u00E9n, directamente de nuestros productores locales \uD83C\uDFFA" })] }), showFilters && ((0, jsx_runtime_1.jsx)(ProductFilters, { filters: filters, onCategoryChange: category => handleFilterChange({ category }), onLocationChange: location => handleFilterChange({ location }), onSeasonalToggle: seasonal => handleFilterChange({ seasonal }), onAvailableToggle: available => handleFilterChange({ available }) })), loading && products.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative inline-block", children: [(0, jsx_runtime_1.jsx)("div", { className: "mx-auto h-16 w-16 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" }), (0, jsx_runtime_1.jsx)("span", { className: "absolute inset-0 flex items-center justify-center text-2xl", children: "\uD83E\uDED2" })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-6 text-lg font-medium text-amber-700", children: "Cargando productos del mercado..." }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-amber-600", children: "Buscando los mejores productos de Ja\u00E9n" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-6 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-amber-800", children: [(0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-2 font-medium", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDCCA" }), displayedProducts.length, " producto", displayedProducts.length !== 1 ? 's' : '', " encontrado", displayedProducts.length !== 1 ? 's' : ''] }), filters.category && ((0, jsx_runtime_1.jsxs)("span", { className: "rounded-full bg-amber-200 px-3 py-1 text-sm", children: ["\uD83D\uDCC2 ", filters.category] })), filters.location && ((0, jsx_runtime_1.jsxs)("span", { className: "rounded-full bg-amber-200 px-3 py-1 text-sm", children: ["\uD83D\uDCCD ", filters.location] }))] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: displayedProducts.map(product => ((0, jsx_runtime_1.jsx)(ProductCard, { product: product, onViewDetails: setSelectedProduct }, product.id))) }), displayedProducts.length === 0 && !loading && ((0, jsx_runtime_1.jsx)("div", { className: "py-8 text-center", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "No se encontraron productos con los filtros aplicados." }) })), canLoadMore && !maxItems && ((0, jsx_runtime_1.jsx)("div", { className: "mt-8 text-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: loadMore, disabled: loading, className: "rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50", children: loading ? 'Cargando...' : 'Cargar más productos' }) })), pagination.total > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 text-center text-sm text-gray-600", children: ["Mostrando ", displayedProducts.length, " de ", pagination.total, " productos"] }))] })), selectedProduct && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-md rounded-lg bg-white p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex items-start justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold", children: selectedProduct.name }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedProduct(null), className: "text-gray-500 hover:text-gray-700", children: "\u2715" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Productor:" }), " ", selectedProduct.producer] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Ubicaci\u00F3n:" }), " ", selectedProduct.location.municipality] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Precio:" }), " \u20AC", selectedProduct.price.toFixed(2), " /", ' ', selectedProduct.unit] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Descripci\u00F3n:" }), " ", selectedProduct.description] }), selectedProduct.certifications.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Certificaciones:" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-1 flex flex-wrap gap-2", children: selectedProduct.certifications.map(cert => ((0, jsx_runtime_1.jsx)("span", { className: "rounded-full bg-green-100 px-2 py-1 text-sm text-green-800", children: cert }, cert))) })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 flex space-x-3", children: [(0, jsx_runtime_1.jsx)("button", { className: "flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700", children: "Contactar Productor" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedProduct(null), className: "flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300", children: "Cerrar" })] })] }) }))] }));
};
exports.default = ProductCatalog;
//# sourceMappingURL=ProductCatalog.js.map