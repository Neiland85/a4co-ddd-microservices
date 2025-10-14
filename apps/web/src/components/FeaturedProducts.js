'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturedProducts = FeaturedProducts;
const jsx_runtime_1 = require("react/jsx-runtime");
function FeaturedProducts() {
    const featuredProducts = [
        {
            id: 1,
            name: 'Jarrón de Cerámica Artesanal',
            price: '45.00',
            artisan: 'María González',
            image: '/placeholder.svg',
            category: 'Cerámica',
        },
        {
            id: 2,
            name: 'Manta de Lana Natural',
            price: '89.00',
            artisan: 'Carlos Ruiz',
            image: '/placeholder.svg',
            category: 'Textil',
        },
        {
            id: 3,
            name: 'Cesta de Mimbre',
            price: '32.00',
            artisan: 'Ana Martín',
            image: '/placeholder.svg',
            category: 'Mimbre',
        },
        {
            id: 4,
            name: 'Joya de Plata',
            price: '156.00',
            artisan: 'Pedro Sánchez',
            image: '/placeholder.svg',
            category: 'Joyería',
        },
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4", children: featuredProducts.map(product => ((0, jsx_runtime_1.jsxs)("div", { className: "overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-48 items-center justify-center bg-gray-200", children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-500", children: "Imagen del Producto" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-lg font-semibold", children: product.name }), (0, jsx_runtime_1.jsxs)("p", { className: "mb-2 text-sm text-gray-600", children: ["Por ", product.artisan] }), (0, jsx_runtime_1.jsx)("p", { className: "mb-3 text-xs text-gray-500", children: product.category }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-2xl font-bold text-blue-600", children: ["\u20AC", product.price] }), (0, jsx_runtime_1.jsx)("button", { className: "rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700", children: "Ver Detalles" })] })] })] }, product.id))) }));
}
//# sourceMappingURL=FeaturedProducts.js.map