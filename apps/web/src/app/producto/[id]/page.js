"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProductPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ProductDetail_1 = require("@/components/ProductDetail");
const RelatedProducts_1 = require("@/components/RelatedProducts");
const ProductReviews_1 = require("@/components/ProductReviews");
const BackButton_1 = require("@/components/BackButton");
function ProductPage({ params }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-background min-h-screen", children: (0, jsx_runtime_1.jsxs)("div", { className: "container py-8", children: [(0, jsx_runtime_1.jsx)(BackButton_1.BackButton, {}), (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { className: "py-12 text-center", children: "Cargando producto..." }), children: (0, jsx_runtime_1.jsx)(ProductDetail_1.ProductDetail, { productId: params.id }) }), (0, jsx_runtime_1.jsxs)("section", { className: "mt-16", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-8 text-2xl font-bold", children: "Productos Relacionados" }), (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { children: "Cargando productos relacionados..." }), children: (0, jsx_runtime_1.jsx)(RelatedProducts_1.RelatedProducts, { productId: params.id }) })] }), (0, jsx_runtime_1.jsxs)("section", { className: "mt-16", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-8 text-2xl font-bold", children: "Rese\u00F1as y Comentarios" }), (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { children: "Cargando rese\u00F1as..." }), children: (0, jsx_runtime_1.jsx)(ProductReviews_1.ProductReviews, { productId: params.id }) })] })] }) }));
}
//# sourceMappingURL=page.js.map