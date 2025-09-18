"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CatalogPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const CatalogHeader_1 = require("@/components/CatalogHeader");
const ProductFilters_1 = require("@/components/ProductFilters");
const ProductGrid_1 = require("@/components/ProductGrid");
const Pagination_1 = require("@/components/Pagination");
function CatalogPage() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-background min-h-screen", children: [(0, jsx_runtime_1.jsx)(CatalogHeader_1.CatalogHeader, {}), (0, jsx_runtime_1.jsx)("main", { className: "py-8", children: (0, jsx_runtime_1.jsx)("div", { className: "container", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-4", children: [(0, jsx_runtime_1.jsx)("aside", { className: "lg:col-span-1", children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { children: "Cargando filtros..." }), children: (0, jsx_runtime_1.jsx)(ProductFilters_1.ProductFilters, {}) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "mb-2 text-3xl font-bold", children: "Cat\u00E1logo de Productos" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground", children: "Descubre productos \u00FAnicos de artesanos locales" })] }), (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { children: "Cargando productos..." }), children: (0, jsx_runtime_1.jsx)(ProductGrid_1.ProductGrid, {}) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8", children: (0, jsx_runtime_1.jsx)(Pagination_1.Pagination, {}) })] })] }) }) })] }));
}
//# sourceMappingURL=page.js.map