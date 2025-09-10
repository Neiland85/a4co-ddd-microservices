'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdvantagesSection;
const jsx_runtime_1 = require("react/jsx-runtime");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
function AdvantagesSection() {
    const advantages = [
        {
            icon: lucide_react_1.Leaf,
            title: 'Productos Ecológicos',
            description: 'Alimentos cultivados de forma sostenible, respetando el medio ambiente y sin químicos dañinos.',
            color: 'from-green-500 to-emerald-600',
        },
        {
            icon: lucide_react_1.MapPin,
            title: 'Origen Local',
            description: 'Conoce exactamente de dónde vienen tus alimentos y apoya a los productores de tu región.',
            color: 'from-blue-500 to-cyan-600',
        },
        {
            icon: lucide_react_1.Users,
            title: 'Comunidad',
            description: 'Forma parte de una red que conecta productores y consumidores conscientes.',
            color: 'from-purple-500 to-pink-600',
        },
        {
            icon: lucide_react_1.Shield,
            title: 'Calidad Garantizada',
            description: 'Todos nuestros productores pasan por un proceso de verificación riguroso.',
            color: 'from-orange-500 to-red-600',
        },
        {
            icon: lucide_react_1.Heart,
            title: 'Tradición Familiar',
            description: 'Preservamos las técnicas artesanales transmitidas de generación en generación.',
            color: 'from-pink-500 to-rose-600',
        },
        {
            icon: lucide_react_1.Truck,
            title: 'Entrega Directa',
            description: 'Recibe productos frescos directamente del productor a tu mesa.',
            color: 'from-indigo-500 to-blue-600',
        },
    ];
    return ((0, jsx_runtime_1.jsx)("section", { className: "bg-gray-50 py-16 sm:py-24", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-16 text-center", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "mb-4 text-3xl font-bold text-gray-900 sm:text-4xl", children: ["\u00BFPor qu\u00E9 elegir", ' ', (0, jsx_runtime_1.jsx)("span", { className: "bg-gradient-to-r from-green-600 to-amber-500 bg-clip-text text-transparent", children: "Ja\u00E9n Artesanal" }), "?"] }), (0, jsx_runtime_1.jsx)("p", { className: "mx-auto max-w-2xl text-lg text-gray-600", children: "Descubre las ventajas de conectar directamente con los productores locales y formar parte de una comunidad comprometida con la calidad y la sostenibilidad." })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3", children: advantages.map((advantage, index) => {
                        const Icon = advantage.icon;
                        return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: "group transform border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl", children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: `h-16 w-16 bg-gradient-to-r ${advantage.color} mx-auto mb-6 flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-8 w-8 text-white" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "mb-4 text-xl font-semibold text-gray-900", children: advantage.title }), (0, jsx_runtime_1.jsx)("p", { className: "leading-relaxed text-gray-600", children: advantage.description })] }) }, index));
                    }) })] }) }));
}
//# sourceMappingURL=advantages-section.js.map