'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
function Header() {
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
        { name: 'Inicio', href: '/' },
        { name: 'Mapa', href: '/mapa' },
        { name: 'Productores', href: '/productores' },
        { name: 'Productos', href: '/productos' },
        { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
    ];
    return ((0, jsx_runtime_1.jsx)("header", { className: `fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${isScrolled
            ? 'border-b border-gray-200 bg-white/95 shadow-lg backdrop-blur-sm'
            : 'bg-transparent'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex h-16 items-center justify-between sm:h-20", children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: "/", className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-amber-500 sm:h-10 sm:w-10", children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-white sm:text-base", children: "J" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg font-bold text-gray-900 sm:text-xl", children: "Ja\u00E9n Artesanal" })] }), (0, jsx_runtime_1.jsx)("nav", { className: "hidden items-center space-x-8 md:flex", children: navigation.map(item => ((0, jsx_runtime_1.jsx)(link_1.default, { href: item.href, className: "font-medium text-gray-700 transition-colors duration-200 hover:text-green-600", children: item.name }, item.name))) }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden items-center space-x-4 md:flex", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ShoppingCart, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "mr-2 h-4 w-4" }), "Acceder"] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "md:hidden", onClick: () => setIsMenuOpen(!isMenuOpen), children: isMenuOpen ? (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-5 w-5" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "h-5 w-5" }) })] }), isMenuOpen && ((0, jsx_runtime_1.jsx)("div", { className: "absolute left-0 right-0 top-full border-b border-gray-200 bg-white shadow-lg md:hidden", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 px-4 py-6", children: [navigation.map(item => ((0, jsx_runtime_1.jsx)(link_1.default, { href: item.href, className: "block py-2 font-medium text-gray-700 transition-colors duration-200 hover:text-green-600", onClick: () => setIsMenuOpen(false), children: item.name }, item.name))), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 border-t border-gray-200 pt-4", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "w-full justify-start bg-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "mr-2 h-4 w-4" }), "Acceder"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-3", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "flex-1", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "flex-1", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "flex-1", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ShoppingCart, { className: "h-4 w-4" }) })] })] })] }) }))] }) }));
}
//# sourceMappingURL=header.js.map