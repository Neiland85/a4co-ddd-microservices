'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Footer;
const jsx_runtime_1 = require("react/jsx-runtime");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function Footer() {
    const footerLinks = {
        company: [
            { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
            { name: 'Nuestra Misión', href: '/mision' },
            { name: 'Equipo', href: '/equipo' },
            { name: 'Contacto', href: '/contacto' },
        ],
        products: [
            { name: 'Aceite de Oliva', href: '/productos/aceite' },
            { name: 'Productos Ecológicos', href: '/productos/ecologicos' },
            { name: 'Conservas', href: '/productos/conservas' },
            { name: 'Artesanías', href: '/productos/artesanias' },
        ],
        support: [
            { name: 'Centro de Ayuda', href: '/ayuda' },
            { name: 'Términos de Servicio', href: '/terminos' },
            { name: 'Política de Privacidad', href: '/privacidad' },
            { name: 'Cookies', href: '/cookies' },
        ],
    };
    return ((0, jsx_runtime_1.jsx)("footer", { className: "bg-gray-900 text-white", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 py-16 sm:px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-amber-500", children: (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-white", children: "J" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-xl font-bold", children: "Ja\u00E9n Artesanal" })] }), (0, jsx_runtime_1.jsx)("p", { className: "leading-relaxed text-gray-400", children: "Conectamos productores locales con consumidores conscientes, promoviendo la econom\u00EDa local y los productos artesanales de Ja\u00E9n." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "text-gray-400 hover:text-white", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Facebook, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "text-gray-400 hover:text-white", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Twitter, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "text-gray-400 hover:text-white", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Instagram, { className: "h-5 w-5" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-6 text-lg font-semibold", children: "Empresa" }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-3", children: footerLinks.company.map(link => ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: link.href, className: "text-gray-400 transition-colors duration-200 hover:text-white", children: link.name }) }, link.name))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-6 text-lg font-semibold", children: "Productos" }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-3", children: footerLinks.products.map(link => ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(link_1.default, { href: link.href, className: "text-gray-400 transition-colors duration-200 hover:text-white", children: link.name }) }, link.name))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-6 text-lg font-semibold", children: "Newsletter" }), (0, jsx_runtime_1.jsx)("p", { className: "mb-4 text-gray-400", children: "Recibe las \u00FAltimas noticias y ofertas especiales." }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { type: "email", placeholder: "Tu email", className: "border-gray-700 bg-gray-800 text-white placeholder-gray-400" }), (0, jsx_runtime_1.jsx)(button_1.Button, { className: "w-full bg-gradient-to-r from-green-600 to-amber-500 hover:from-green-700 hover:to-amber-600", children: "Suscribirse" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-8 border-t border-gray-800 pt-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-5 w-5 text-green-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "info@jaenartesanal.com" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-5 w-5 text-green-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "+34 953 123 456" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-5 w-5 text-green-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Ja\u00E9n, Andaluc\u00EDa, Espa\u00F1a" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "border-t border-gray-800 pt-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "\u00A9 2024 Ja\u00E9n Artesanal. Todos los derechos reservados." }), (0, jsx_runtime_1.jsx)("div", { className: "flex space-x-6", children: footerLinks.support.map(link => ((0, jsx_runtime_1.jsx)(link_1.default, { href: link.href, className: "text-sm text-gray-400 transition-colors duration-200 hover:text-white", children: link.name }, link.name))) })] }) })] }) }));
}
//# sourceMappingURL=footer.js.map