'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestHookSimple;
const jsx_runtime_1 = require("react/jsx-runtime");
const useProducts_1 = require("../../hooks/useProducts");
const react_1 = require("react");
// Función auxiliar para formatear la ubicación del producto
function formatProductLocation(location) {
    if (typeof location === 'string') {
        return location;
    }
    if (location && typeof location === 'object') {
        if (location.municipality) {
            return `Municipio: ${location.municipality}`;
        }
        return JSON.stringify(location);
    }
    return '';
}
function TestHookSimple() {
    const renderCount = (0, react_1.useRef)(0);
    renderCount.current += 1;
    const { products, loading, error } = (0, useProducts_1.useProducts)({
        autoFetch: true,
        limit: 5,
    });
    (0, react_1.useEffect)(() => {
        console.log('Hook renderizado:', renderCount.current, 'veces');
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto p-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "mb-4 text-2xl font-bold", children: "Prueba Simple del Hook useProducts" }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4 rounded-lg bg-white p-4 shadow", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-2 font-semibold", children: "Estado del Hook" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Renders: ", (0, jsx_runtime_1.jsx)("span", { className: "font-mono text-lg text-green-600", children: renderCount.current })] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Loading: ", loading ? 'Sí' : 'No'] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Productos: ", products.length] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Error: ", error || 'Ninguno'] })] }), loading && ((0, jsx_runtime_1.jsx)("div", { className: "py-4 text-center", children: (0, jsx_runtime_1.jsx)("p", { children: "Cargando productos..." }) })), error && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700", children: ["Error: ", error] })), products.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg bg-white p-4 shadow", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "mb-2 font-semibold", children: ["Productos (", products.length, ")"] }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-2", children: products.map((product, index) => ((0, jsx_runtime_1.jsxs)("li", { className: "border-b pb-2", children: [(0, jsx_runtime_1.jsx)("strong", { children: product.name }), " - ", product.category, (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: formatProductLocation(product.location) })] }, product.id || index))) })] })), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 text-sm text-gray-500", children: "Si ves que el n\u00FAmero de renders se mantiene estable (no aumenta constantemente), entonces el problema de renders infinitos est\u00E1 solucionado." })] }));
}
//# sourceMappingURL=page.js.map