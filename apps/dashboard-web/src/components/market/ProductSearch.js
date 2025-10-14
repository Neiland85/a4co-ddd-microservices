// Componente para búsqueda de productos con integración API
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResults = exports.QuickFilters = exports.SearchBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useProducts_1 = require("../../hooks/useProducts");
const ProductCatalog_1 = require("./ProductCatalog");
const SearchBar = ({ onSearch, placeholder = 'Buscar productos locales...', loading = false, }) => {
    const [localTerm, setLocalTerm] = (0, react_1.useState)('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(localTerm);
    };
    const handleChange = (e) => {
        const value = e.target.value;
        setLocalTerm(value);
        onSearch(value); // Búsqueda en tiempo real
    };
    return ((0, jsx_runtime_1.jsx)("form", { onSubmit: handleSubmit, className: "relative", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: localTerm, onChange: handleChange, placeholder: placeholder, className: "w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 text-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500" }), (0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3", children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "h-5 w-5 animate-spin rounded-full border-b-2 border-green-600" })) : ((0, jsx_runtime_1.jsx)("svg", { className: "h-5 w-5 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })) })] }) }));
};
exports.SearchBar = SearchBar;
const QuickFilters = ({ onCategorySelect, selectedCategory }) => {
    const categories = [
        { value: '', label: 'Todo', icon: '🛒' },
        { value: 'aceite', label: 'Aceite', icon: '🫒' },
        { value: 'queso', label: 'Quesos', icon: '🧀' },
        { value: 'jamón', label: 'Jamón', icon: '🥓' },
        { value: 'miel', label: 'Miel', icon: '🍯' },
        { value: 'vino', label: 'Vinos', icon: '🍷' },
        { value: 'artesanía', label: 'Artesanía', icon: '🏺' },
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 flex flex-wrap gap-2", children: categories.map(category => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => onCategorySelect(category.value), className: `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${selectedCategory === category.value
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-1", children: category.icon }), category.label] }, category.value))) }));
};
exports.QuickFilters = QuickFilters;
const SearchResults = ({ searchTerm, onClearSearch }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("p", { className: "text-blue-800", children: ["Resultados para: ", (0, jsx_runtime_1.jsxs)("strong", { children: ["\"", searchTerm, "\""] })] }) }), (0, jsx_runtime_1.jsx)("button", { onClick: onClearSearch, className: "text-sm text-blue-600 underline hover:text-blue-800", children: "Limpiar b\u00FAsqueda" })] }) }));
};
exports.SearchResults = SearchResults;
const ProductSearch = ({ title = 'Buscar Productos Locales', showQuickFilters = true, maxResults = 20, }) => {
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('');
    const { products, loading, error, searchTerm, setSearchTerm, isSearching, isEmpty, hasData } = (0, useProducts_1.useProductSearch)();
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        // Si hay un término de búsqueda, mantenerlo y filtrar por categoría
        // En una implementación real, aquí combinarías la búsqueda con el filtro de categoría
        if (searchTerm) {
            setSearchTerm(searchTerm); // Trigger re-search with category
        }
    };
    const handleClearSearch = () => {
        setSearchTerm('');
        setSelectedCategory('');
    };
    const filteredProducts = selectedCategory
        ? products.filter(product => product.category === selectedCategory)
        : products;
    const displayedProducts = maxResults ? filteredProducts.slice(0, maxResults) : filteredProducts;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-7xl px-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-6 text-center text-3xl font-bold text-gray-800", children: title }), (0, jsx_runtime_1.jsx)("div", { className: "mx-auto mb-8 max-w-2xl", children: (0, jsx_runtime_1.jsx)(SearchBar, { onSearch: setSearchTerm, loading: loading, placeholder: "Buscar aceite, queso, miel, artesan\u00EDa..." }) }), showQuickFilters && ((0, jsx_runtime_1.jsx)("div", { className: "mb-8 text-center", children: (0, jsx_runtime_1.jsx)(QuickFilters, { onCategorySelect: handleCategorySelect, selectedCategory: selectedCategory }) })), isSearching && (0, jsx_runtime_1.jsx)(SearchResults, { searchTerm: searchTerm, onClearSearch: handleClearSearch }), error && ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-red-600", children: ["Error: ", error] }) })), loading && !hasData && ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-green-600" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-gray-600", children: "Buscando productos..." })] })), !isSearching && !selectedCategory && ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 text-6xl", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-xl font-medium text-gray-700", children: "Busca productos locales de Ja\u00E9n" }), (0, jsx_runtime_1.jsx)("p", { className: "mx-auto max-w-md text-gray-500", children: "Encuentra aceite de oliva, quesos artesanales, miel, jam\u00F3n ib\u00E9rico y productos \u00FAnicos de nuestra regi\u00F3n." })] })), (isSearching || selectedCategory) && isEmpty && !loading && ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 text-6xl", children: "\uD83E\uDD37\u200D\u2642\uFE0F" }), (0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-xl font-medium text-gray-700", children: "No se encontraron productos" }), (0, jsx_runtime_1.jsx)("p", { className: "mb-4 text-gray-500", children: "Intenta con otros t\u00E9rminos de b\u00FAsqueda o explora diferentes categor\u00EDas." }), (0, jsx_runtime_1.jsx)("button", { onClick: handleClearSearch, className: "rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700", children: "Ver todos los productos" })] })), displayedProducts.length > 0 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: displayedProducts.map(product => ((0, jsx_runtime_1.jsx)(ProductCatalog_1.ProductCard, { product: product, onViewDetails: product => {
                                // Aquí podrías abrir un modal o navegar a una página de detalle
                                console.log('Ver detalles de:', product.name);
                            } }, product.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "text-center text-sm text-gray-600", children: filteredProducts.length > maxResults ? ((0, jsx_runtime_1.jsxs)("p", { children: ["Mostrando ", displayedProducts.length, " de ", filteredProducts.length, " productos encontrados"] })) : ((0, jsx_runtime_1.jsxs)("p", { children: [displayedProducts.length, " productos encontrados"] })) })] })), !isSearching && !selectedCategory && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-12 rounded-lg bg-gray-50 p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-4 text-center text-lg font-medium text-gray-800", children: "Productos populares" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap justify-center gap-2", children: [
                            'Aceite Picual',
                            'Queso de cabra',
                            'Miel de azahar',
                            'Jamón ibérico',
                            'Cerámica de Úbeda',
                            'Aceitunas aliñadas',
                        ].map(suggestion => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setSearchTerm(suggestion), className: "rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-100", children: suggestion }, suggestion))) })] }))] }));
};
exports.default = ProductSearch;
//# sourceMappingURL=ProductSearch.js.map