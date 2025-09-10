'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersSection = OffersSection;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
function OffersSection() {
    const offers = [
        {
            id: 1,
            title: '¡Bienvenida Especial!',
            description: 'Obtén 30% de descuento en tu primera compra',
            discount: '30% OFF',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Gift, { className: "h-6 w-6" }),
            color: 'text-pink-600',
            bgGradient: 'from-pink-500 to-rose-500',
        },
        {
            id: 2,
            title: 'Evento Flash',
            description: 'Solo por hoy: Envío gratis en todos los pedidos',
            discount: 'GRATIS',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-6 w-6" }),
            color: 'text-yellow-600',
            bgGradient: 'from-yellow-500 to-orange-500',
        },
        {
            id: 3,
            title: 'Miembro Premium',
            description: 'Únete y obtén beneficios exclusivos',
            discount: 'VIP',
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-6 w-6" }),
            color: 'text-purple-600',
            bgGradient: 'from-purple-500 to-indigo-500',
        },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "h-5 w-5 text-yellow-500" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-gray-900", children: "Ofertas Especiales" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: offers.map((offer, index) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, whileHover: { scale: 1.02 }, className: "group", children: (0, jsx_runtime_1.jsx)(card_1.Card, { className: "border-2 border-gray-100 bg-white/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-purple-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: `rounded-full bg-gradient-to-r p-2 ${offer.bgGradient} text-white`, children: offer.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-gray-900 transition-colors group-hover:text-purple-700", children: offer.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: offer.description })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { className: `bg-gradient-to-r ${offer.bgGradient} mb-2 border-0 text-white`, children: offer.discount }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", className: "block border-purple-200 bg-transparent text-xs hover:bg-purple-50", children: "Reclamar" })] })] }) }) }, offer.id))) })] }));
}
//# sourceMappingURL=offers-section.js.map