"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Header_1 = require("@/components/Header");
const Hero_1 = require("@/components/Hero");
const FeaturedProducts_1 = require("@/components/FeaturedProducts");
const InteractiveMap_1 = require("@/components/InteractiveMap");
const Testimonials_1 = require("@/components/Testimonials");
const Footer_1 = require("@/components/Footer");
function HomePage() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-background min-h-screen", children: [(0, jsx_runtime_1.jsx)(Header_1.Header, {}), (0, jsx_runtime_1.jsxs)("main", { children: [(0, jsx_runtime_1.jsx)(Hero_1.Hero, {}), (0, jsx_runtime_1.jsx)("section", { className: "py-16", children: (0, jsx_runtime_1.jsxs)("div", { className: "container", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-12 text-center text-3xl font-bold", children: "Productos Destacados" }), (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { className: "text-center", children: "Cargando productos..." }), children: (0, jsx_runtime_1.jsx)(FeaturedProducts_1.FeaturedProducts, {}) })] }) }), (0, jsx_runtime_1.jsx)("section", { className: "bg-muted/50 py-16", children: (0, jsx_runtime_1.jsxs)("div", { className: "container", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-12 text-center text-3xl font-bold", children: "Mapa de Productores" }), (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { className: "text-center", children: "Cargando mapa..." }), children: (0, jsx_runtime_1.jsx)(InteractiveMap_1.InteractiveMap, {}) })] }) }), (0, jsx_runtime_1.jsx)("section", { className: "py-16", children: (0, jsx_runtime_1.jsxs)("div", { className: "container", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-12 text-center text-3xl font-bold", children: "Testimonios de Nuestros Clientes" }), (0, jsx_runtime_1.jsx)(Testimonials_1.Testimonials, {})] }) })] }), (0, jsx_runtime_1.jsx)(Footer_1.Footer, {})] }));
}
//# sourceMappingURL=page.js.map