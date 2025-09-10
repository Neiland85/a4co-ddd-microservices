'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A4coBranding = A4coBranding;
exports.A4coFeatures = A4coFeatures;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
function A4coBranding() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "mb-8 text-center", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl font-bold text-white", children: "a4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xl font-light text-blue-200", children: "co" })] }), (0, jsx_runtime_1.jsx)("h1", { className: "mb-2 text-3xl font-bold text-gray-900", children: "\u00DAnete a a4co" }), (0, jsx_runtime_1.jsx)("p", { className: "mx-auto max-w-md text-gray-600", children: "Crea tu cuenta y accede a soluciones empresariales innovadoras dise\u00F1adas para impulsar tu negocio." })] }) }));
}
function A4coFeatures() {
    const features = [
        {
            icon: '🚀',
            title: 'Soluciones Innovadoras',
            description: 'Herramientas de vanguardia para tu empresa',
        },
        {
            icon: '🔒',
            title: 'Seguridad Empresarial',
            description: 'Protección de datos de nivel corporativo',
        },
        {
            icon: '📊',
            title: 'Analytics Avanzados',
            description: 'Insights profundos para tomar mejores decisiones',
        },
        {
            icon: '🤝',
            title: 'Soporte 24/7',
            description: 'Asistencia especializada cuando la necesites',
        },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-4 text-xl font-semibold text-gray-900", children: "\u00BFPor qu\u00E9 elegir a4co?" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: features.map((feature, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, className: "flex items-start gap-3 rounded-lg border border-gray-100 bg-white/60 p-4 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl", children: feature.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-1 font-semibold text-gray-900", children: feature.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: feature.description })] })] }, index))) })] }));
}
//# sourceMappingURL=a4co-branding.js.map