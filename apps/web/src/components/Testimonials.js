'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonials = Testimonials;
const jsx_runtime_1 = require("react/jsx-runtime");
function Testimonials() {
    const testimonials = [
        {
            id: 1,
            name: 'Laura García',
            role: 'Cliente Frecuente',
            content: 'Los productos artesanales son de excelente calidad. Cada pieza tiene su historia y personalidad única.',
            rating: 5,
        },
        {
            id: 2,
            name: 'Miguel Torres',
            role: 'Coleccionista',
            content: 'He encontrado piezas increíbles que no conseguiría en ningún otro lugar. Los artesanos son muy talentosos.',
            rating: 5,
        },
        {
            id: 3,
            name: 'Ana Rodríguez',
            role: 'Diseñadora',
            content: 'La variedad de estilos y técnicas artesanales es impresionante. Siempre encuentro inspiración aquí.',
            rating: 5,
        },
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: testimonials.map(testimonial => ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg bg-white p-6 shadow-md", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 flex items-center", children: (0, jsx_runtime_1.jsx)("div", { className: "text-xl text-yellow-400", children: "\u2605\u2605\u2605\u2605\u2605" }) }), (0, jsx_runtime_1.jsxs)("p", { className: "mb-4 italic text-gray-700", children: ["\"", testimonial.content, "\""] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-gray-900", children: testimonial.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: testimonial.role })] })] }, testimonial.id))) }));
}
//# sourceMappingURL=Testimonials.js.map