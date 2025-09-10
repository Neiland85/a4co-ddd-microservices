'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigation = Navigation;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const sheet_1 = require("@/components/ui/sheet");
const lucide_react_1 = require("lucide-react");
const framer_motion_1 = require("framer-motion");
const use_sound_effects_1 = require("../../hooks/use-sound-effects");
const defaultItems = [
    { id: 'home', label: 'Inicio', href: '/', icon: lucide_react_1.Home },
    { id: 'catalog', label: 'Catálogo', href: '/catalogo', icon: lucide_react_1.Package },
    { id: 'map', label: 'Mapa', href: '/mapa', icon: lucide_react_1.Map },
    { id: 'contact', label: 'Contacto', href: '/contacto', icon: lucide_react_1.Mail },
];
function Navigation({ items = defaultItems, currentPath = '/' }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, react_1.useState)(false);
    const { playClick, playHover, playMenuOpen, playMenuClose } = (0, use_sound_effects_1.useSoundEffects)();
    const dragControls = (0, framer_motion_1.useDragControls)();
    const handleMobileMenuToggle = (open) => {
        setIsMobileMenuOpen(open);
        if (open) {
            playMenuOpen();
        }
        else {
            playMenuClose();
        }
    };
    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
        playClick();
    };
    return ((0, jsx_runtime_1.jsxs)("nav", { className: "flex items-center", role: "navigation", "aria-label": "Navegaci\u00F3n principal", children: [(0, jsx_runtime_1.jsx)("div", { className: "hidden items-center space-x-1 md:flex", children: items.map(item => {
                    const isActive = currentPath === item.href;
                    return ((0, jsx_runtime_1.jsx)(link_1.default, { href: item.href, passHref: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onMouseEnter: () => playHover(), onClick: () => playClick(), className: `h-9 px-4 transition-all duration-200 ${isActive
                                ? 'bg-a4co-olive-100 text-a4co-olive-700 font-medium'
                                : 'hover:bg-a4co-olive-50 text-gray-700'}`, "aria-current": isActive ? 'page' : undefined, children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "flex items-center gap-2", children: [item.icon && (0, jsx_runtime_1.jsx)(item.icon, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: item.label }), item.badge && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white", children: item.badge }))] }) }) }, item.id));
                }) }), (0, jsx_runtime_1.jsx)("div", { className: "md:hidden", children: (0, jsx_runtime_1.jsxs)(sheet_1.Sheet, { open: isMobileMenuOpen, onOpenChange: handleMobileMenuToggle, children: [(0, jsx_runtime_1.jsx)(sheet_1.SheetTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "hover:bg-a4co-olive-50 h-9 w-9 p-0", "aria-label": "Abrir men\u00FA de navegaci\u00F3n", onMouseEnter: () => playHover(), children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "text-a4co-olive-600 h-5 w-5" }) }) }) }), (0, jsx_runtime_1.jsxs)(sheet_1.SheetContent, { side: "top", className: "border-b-a4co-olive-200 h-full bg-white/95 backdrop-blur-sm", onPointerDownOutside: () => handleMobileMenuToggle(false), children: [(0, jsx_runtime_1.jsx)(sheet_1.SheetHeader, { className: "text-left", children: (0, jsx_runtime_1.jsx)(sheet_1.SheetTitle, { className: "text-a4co-olive-700", children: "Navegaci\u00F3n" }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { drag: "y", dragControls: dragControls, dragConstraints: { top: 0, bottom: 0 }, onDragEnd: (_, info) => {
                                        if (info.velocity.y < -500 || info.offset.y < -100) {
                                            handleMobileMenuToggle(false);
                                        }
                                    }, className: "mt-6 space-y-2", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: items.map((item, index) => {
                                                const isActive = currentPath === item.href;
                                                return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { delay: index * 0.1 }, children: (0, jsx_runtime_1.jsx)(link_1.default, { href: item.href, passHref: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "lg", onClick: handleLinkClick, onMouseEnter: () => playHover(), className: `h-12 w-full justify-start px-4 transition-all duration-200 ${isActive
                                                                ? 'bg-a4co-olive-100 text-a4co-olive-700 font-medium'
                                                                : 'hover:bg-a4co-olive-50 text-gray-700'}`, "aria-current": isActive ? 'page' : undefined, children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { x: 5 }, className: "flex w-full items-center gap-3", children: [item.icon && (0, jsx_runtime_1.jsx)(item.icon, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { className: "text-base", children: item.label }), item.badge && ((0, jsx_runtime_1.jsx)("span", { className: "ml-auto rounded-full bg-red-500 px-2 py-1 text-xs text-white", children: item.badge }))] }) }) }) }, item.id));
                                            }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "flex justify-center pt-4", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.5 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "h-1 w-12 rounded-full bg-gray-300" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-xs text-gray-500", children: "Desliza hacia arriba para cerrar" })] })] })] })] }) })] }));
}
//# sourceMappingURL=navigation.js.map