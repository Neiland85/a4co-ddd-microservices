'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArtisanalHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function ArtisanalHeader() {
    const [isMenuOpen, setIsMenuOpen] = (0, react_1.useState)(false);
    const [isScrolled, setIsScrolled] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const navigation = [
        {
            name: 'Inicio',
            href: '/',
            icon: lucide_react_1.Sparkles,
            description: 'Página principal',
        },
        {
            name: 'Mapa',
            href: '/mapa',
            icon: lucide_react_1.MapPin,
            description: 'Explora productores locales',
        },
        {
            name: 'Productores',
            href: '/productores',
            icon: lucide_react_1.Users,
            description: 'Conoce a nuestros artesanos',
        },
        {
            name: 'Productos',
            href: '/productos',
            icon: lucide_react_1.Palette,
            description: 'Catálogo artesanal',
        },
        {
            name: 'Eventos',
            href: '/eventos',
            icon: lucide_react_1.Calendar,
            description: 'Talleres y festivales',
        },
        {
            name: 'Sobre Nosotros',
            href: '/sobre-nosotros',
            icon: lucide_react_1.Award,
            description: 'Nuestra historia',
        },
    ];
    return ((0, jsx_runtime_1.jsx)("header", { className: `fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${isScrolled
            ? 'border-b border-green-200/50 bg-white/95 shadow-xl backdrop-blur-md'
            : 'bg-transparent'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex h-16 items-center justify-between sm:h-20", children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: "/", className: "group flex items-center space-x-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 via-green-500 to-amber-500 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl sm:h-12 sm:w-12", children: (0, jsx_runtime_1.jsx)("span", { className: "text-lg font-bold text-white sm:text-xl", children: "J" }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden sm:block", children: [(0, jsx_runtime_1.jsx)("span", { className: "bg-gradient-to-r from-green-700 to-amber-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl", children: "Ja\u00E9n Artesanal" }), (0, jsx_runtime_1.jsx)("p", { className: "-mt-1 text-xs text-gray-600", children: "Tradici\u00F3n & Calidad" })] })] }), (0, jsx_runtime_1.jsx)("nav", { className: "hidden items-center space-x-1 lg:flex", children: navigation.map(item => {
                                const IconComponent = item.icon;
                                return ((0, jsx_runtime_1.jsxs)(link_1.default, { href: item.href, className: "group relative rounded-xl px-4 py-2 font-medium text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(IconComponent, { className: "h-4 w-4 transition-transform duration-300 group-hover:scale-110" }), (0, jsx_runtime_1.jsx)("span", { children: item.name })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transform bg-gradient-to-r from-green-600 to-amber-500 transition-all duration-300 group-hover:w-full" })] }, item.name));
                            }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden items-center space-x-2 md:flex", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", size: "sm", className: "group relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-4 w-4 transition-transform duration-300 group-hover:scale-110" }), (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Buscar" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", size: "sm", className: "group relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "h-4 w-4 transition-transform duration-300 group-hover:scale-110" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "absolute -right-2 -top-2 h-5 w-5 rounded-full border-2 border-white bg-red-500 p-0 text-xs text-white", children: "2" }), (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Favoritos" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", size: "sm", className: "group relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShoppingCart, { className: "h-4 w-4 transition-transform duration-300 group-hover:scale-110" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "absolute -right-2 -top-2 h-5 w-5 rounded-full border-2 border-white bg-green-600 p-0 text-xs text-white", children: "3" }), (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Carrito" })] }), (0, jsx_runtime_1.jsx)(link_1.default, { href: "/auth", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", className: "group border-green-200 bg-transparent transition-all duration-300 hover:border-green-300 hover:bg-green-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" }), "Acceder"] }) })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "group relative lg:hidden", onClick: () => setIsMenuOpen(!isMenuOpen), children: (0, jsx_runtime_1.jsxs)("div", { className: "relative h-5 w-5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: `absolute inset-0 h-5 w-5 transition-all duration-300 ${isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}` }), (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: `absolute inset-0 h-5 w-5 transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}` })] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: `transition-all duration-500 ease-in-out lg:hidden ${isMenuOpen ? 'visible max-h-screen opacity-100' : 'invisible max-h-0 opacity-0'}`, children: (0, jsx_runtime_1.jsx)("div", { className: "absolute left-0 right-0 top-full border-b border-gray-200 bg-white/95 shadow-xl backdrop-blur-md", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 px-4 py-6", children: [navigation.map((item, index) => {
                                    const IconComponent = item.icon;
                                    return ((0, jsx_runtime_1.jsxs)(link_1.default, { href: item.href, className: "group flex items-center space-x-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600", onClick: () => setIsMenuOpen(false), style: { animationDelay: `${index * 50}ms` }, children: [(0, jsx_runtime_1.jsx)(IconComponent, { className: "h-5 w-5 transition-transform duration-300 group-hover:scale-110" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "block", children: item.name }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500 group-hover:text-green-500", children: item.description })] })] }, item.name));
                                }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 border-t border-gray-200 pt-4", children: [(0, jsx_runtime_1.jsx)(link_1.default, { href: "/auth", onClick: () => setIsMenuOpen(false), children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "w-full justify-start border-green-200 bg-transparent hover:bg-green-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "mr-3 h-4 w-4" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-left", children: [(0, jsx_runtime_1.jsx)("span", { className: "block", children: "Acceder" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: "Inicia sesi\u00F3n o reg\u00EDstrate" })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-3", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", size: "sm", className: "h-auto flex-col space-y-1 py-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "Buscar" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", size: "sm", className: "relative h-auto flex-col space-y-1 py-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "Favoritos" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "absolute right-1 top-1 h-4 w-4 rounded-full bg-red-500 p-0 text-xs", children: "2" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", size: "sm", className: "relative h-auto flex-col space-y-1 py-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShoppingCart, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "Carrito" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "absolute right-1 top-1 h-4 w-4 rounded-full bg-green-600 p-0 text-xs", children: "3" })] })] })] })] }) }) })] }) }));
}
//# sourceMappingURL=artisanal-header.js.map