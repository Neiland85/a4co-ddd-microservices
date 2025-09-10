// 🔒 CÓDIGO ORIGINAL V0.DEV - NO MODIFICAR DIRECTAMENTE
// Fuente: Componente de catálogo de productos para mercado local
// Fecha de creación: 2025-08-02 02:22:33
// Tipo de componente: catalog
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProductCatalogV0Raw;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const separator_1 = require("@/components/ui/separator");
// Datos de ejemplo para demostración
const sampleProducts = [
    {
        id: '1',
        name: 'Aceite de Oliva Virgen Extra Picual',
        category: 'aceites',
        price: 12.5,
        unit: '500ml',
        producer: 'Olivares del Guadalquivir',
        location: 'Úbeda',
        stock: 25,
        available: true,
        seasonal: true,
        certifications: ['Ecológico', 'DO Jaén', 'Primera Cosecha'],
        image: '/images/aceite-picual.jpg',
    },
    {
        id: '2',
        name: 'Aceitunas Gordales de Jaén',
        category: 'aceitunas',
        price: 8.9,
        unit: '1kg',
        producer: 'Aceitunas del Sur',
        location: 'Jaén',
        stock: 15,
        available: true,
        seasonal: false,
        certifications: ['Ecológico', 'DO Jaén'],
        image: '/images/aceitunas-gordales.jpg',
    },
    {
        id: '3',
        name: 'Miel de Romero de Sierra Mágina',
        category: 'mieles',
        price: 15.0,
        unit: '500g',
        producer: 'Apicultura Mágina',
        location: 'Sierra Mágina',
        stock: 8,
        available: true,
        seasonal: true,
        certifications: ['Ecológico', 'Miel de Montaña'],
        image: '/images/miel-romero.jpg',
    },
    {
        id: '4',
        name: 'Queso de Cabra Artesanal',
        category: 'lácteos',
        price: 18.5,
        unit: '400g',
        producer: 'Quesería Sierra de Cazorla',
        location: 'Cazorla',
        stock: 0,
        available: false,
        seasonal: false,
        certifications: ['Artesanal', 'DO Queso de Cabra'],
        image: '/images/queso-cabra.jpg',
    },
];
function ProductCatalogV0Raw({ products = sampleProducts, onProductSelect, showFilters = true, maxItems, loading = false, title = '🫒 Productos Locales de Jaén', }) {
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('');
    const [showOnlyAvailable, setShowOnlyAvailable] = (0, react_1.useState)(false);
    const [showOnlySeasonal, setShowOnlySeasonal] = (0, react_1.useState)(false);
    // Generar IDs únicos para los skeleton items
    const skeletonIds = (0, react_1.useMemo)(() => {
        return Array.from({ length: 8 }, (_, index) => `skeleton-item-${index}`);
    }, []);
    // Filtrado de productos
    const filteredProducts = products
        .filter(product => !selectedCategory || product.category === selectedCategory)
        .filter(product => !showOnlyAvailable || product.available)
        .filter(product => !showOnlySeasonal || product.seasonal)
        .slice(0, maxItems || products.length);
    // Categorías únicas
    const categories = [...new Set(products.map(p => p.category))];
    const handleProductClick = (product) => {
        onProductSelect?.(product);
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "mx-auto w-full max-w-6xl p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8 text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-2 text-3xl font-bold text-amber-800", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "text-amber-600", children: "Cargando productos..." })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: skeletonIds.map(skeletonId => ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "animate-pulse", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-2 h-4 w-3/4 rounded bg-gray-200" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-1/2 rounded bg-gray-200" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 h-32 rounded bg-gray-200" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 rounded bg-gray-200" }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-2/3 rounded bg-gray-200" })] })] })] }, skeletonId))) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mx-auto w-full max-w-6xl p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8 text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-2 bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-800 bg-clip-text text-3xl font-bold text-transparent md:text-4xl", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-amber-700", children: "Descubre los mejores productos artesanales de la provincia de Ja\u00E9n" })] }), showFilters && ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "mb-6", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Filtros" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "category-filter", className: "text-sm font-medium text-gray-700", children: "Categor\u00EDa" }), (0, jsx_runtime_1.jsxs)("select", { id: "category-filter", value: selectedCategory, onChange: e => setSelectedCategory(e.target.value), className: "rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500", "aria-label": "Filtrar por categor\u00EDa de producto", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Todas las categor\u00EDas" }), categories.map(category => ((0, jsx_runtime_1.jsx)("option", { value: category, children: category.charAt(0).toUpperCase() + category.slice(1) }, category)))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "available-filter", className: "flex cursor-pointer items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { id: "available-filter", type: "checkbox", checked: showOnlyAvailable, onChange: e => setShowOnlyAvailable(e.target.checked), className: "rounded border-gray-300 text-amber-600 focus:ring-amber-500", "aria-label": "Mostrar solo productos disponibles" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Solo disponibles" })] }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "seasonal-filter", className: "flex cursor-pointer items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { id: "seasonal-filter", type: "checkbox", checked: showOnlySeasonal, onChange: e => setShowOnlySeasonal(e.target.checked), className: "rounded border-gray-300 text-amber-600 focus:ring-amber-500", "aria-label": "Mostrar solo productos de temporada" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "De temporada" })] })] })] }) })] })), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: filteredProducts.map(product => ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: `group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${!product.available ? 'opacity-60' : ''}`, onClick: () => handleProductClick(product), children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "pb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg font-semibold text-gray-900 group-hover:text-amber-800", children: product.name }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: product.available ? 'default' : 'secondary', className: product.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600', children: product.available ? 'Disponible' : 'Agotado' })] }), (0, jsx_runtime_1.jsxs)(card_1.CardDescription, { className: "text-sm text-gray-600", children: [product.producer, " \u2022 ", product.location] })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "pt-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100", children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl text-amber-600", children: "\uD83E\uDED2" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-3 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-2xl font-bold text-amber-800", children: [product.price.toFixed(2), "\u20AC"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-500", children: ["/", product.unit] })] }), product.certifications.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-3 flex flex-wrap gap-1", children: [product.certifications.slice(0, 2).map(cert => ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: cert }, `${product.id}-cert-${cert}`))), product.certifications.length > 2 && ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-xs", children: ["+", product.certifications.length - 2] }, `${product.id}-cert-more`))] })), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex items-center gap-2", children: [product.seasonal && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "border-green-200 bg-green-50 text-xs text-green-700", children: "\uD83C\uDF3F Temporada" })), product.stock < 10 && product.stock > 0 && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "border-orange-200 bg-orange-50 text-xs text-orange-700", children: "\u26A0\uFE0F \u00DAltimas unidades" }))] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, { className: "mb-4" }), (0, jsx_runtime_1.jsx)(button_1.Button, { className: "w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-700 hover:to-yellow-700", disabled: !product.available, children: product.available ? '👁️ Ver Detalles' : 'Agotado' })] })] }, product.id))) }), filteredProducts.length === 0 && ((0, jsx_runtime_1.jsx)(card_1.Card, { className: "py-12 text-center", children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 text-6xl", children: "\uD83E\uDED2" }), (0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-xl font-semibold text-gray-900", children: "No se encontraron productos" }), (0, jsx_runtime_1.jsx)("p", { className: "mb-4 text-gray-600", children: "Intenta ajustar los filtros para ver m\u00E1s productos" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: () => {
                                setSelectedCategory('');
                                setShowOnlyAvailable(false);
                                setShowOnlySeasonal(false);
                            }, variant: "outline", children: "Limpiar filtros" })] }) })), filteredProducts.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-8 text-center text-sm text-gray-600", children: ["Mostrando ", filteredProducts.length, " de ", products.length, " productos"] }))] }));
}
// Metadata del componente
ProductCatalogV0Raw.displayName = 'ProductCatalogV0Raw';
//# sourceMappingURL=ProductCatalogV0Raw.js.map