'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const separator_1 = require("@/components/ui/separator");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const navItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: lucide_react_1.LayoutDashboard,
        href: '/admin',
        badge: 0,
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: lucide_react_1.BarChart3,
        href: '/admin/analytics',
    },
    {
        id: 'products',
        label: 'Productos',
        icon: lucide_react_1.Package,
        href: '/admin/products',
        badge: 3, // Low stock items
    },
    {
        id: 'orders',
        label: 'Pedidos',
        icon: lucide_react_1.ShoppingCart,
        href: '/admin/orders',
        badge: 5, // Pending orders
    },
    {
        id: 'settings',
        label: 'Configuración',
        icon: lucide_react_1.Settings,
        href: '/admin/settings',
    },
];
function Sidebar({ className }) {
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(false);
    const [isMobileOpen, setIsMobileOpen] = (0, react_1.useState)(false);
    const [hoveredItem, setHoveredItem] = (0, react_1.useState)(null);
    const pathname = (0, navigation_1.usePathname)();
    // Close mobile sidebar when route changes
    (0, react_1.useEffect)(() => {
        setIsMobileOpen(false);
    }, [pathname]);
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    const toggleMobile = () => {
        setIsMobileOpen(!isMobileOpen);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isMobileOpen && ((0, jsx_runtime_1.jsx)("button", { type: "button", className: "fixed inset-0 z-40 cursor-pointer border-none bg-black/50 p-0 lg:hidden", onClick: () => setIsMobileOpen(false), "aria-label": "Cerrar men\u00FA m\u00F3vil" })), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: toggleMobile, className: "shadow-natural-lg hover:shadow-natural-xl fixed left-4 top-4 z-50 bg-white transition-all duration-300 hover:scale-110 lg:hidden", children: isMobileOpen ? (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsxs)("aside", { className: (0, utils_1.cn)('shadow-natural-lg fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out', isCollapsed ? 'w-16' : 'w-64', isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0', className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-gray-200 p-4", children: [!isCollapsed && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "from-a4co-olive-500 to-a4co-clay-500 shadow-mixed flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br", children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-white", children: "A4" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "font-semibold text-gray-900", children: "Panel Admin" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "Artesano" })] })] })), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: toggleCollapse, className: "hidden transition-all duration-300 hover:rotate-180 hover:scale-110 hover:bg-gray-100 lg:flex", children: isCollapsed ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-4 w-4" })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "border-b border-gray-200 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)('from-a4co-olive-50 to-a4co-clay-50 border-a4co-olive-200 hover:shadow-natural-md flex cursor-pointer items-center space-x-3 rounded-lg border bg-gradient-to-r p-3 transition-all duration-300 hover:scale-105', isCollapsed && 'justify-center'), children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "from-a4co-olive-400 to-a4co-clay-400 shadow-mixed flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5 text-white" }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-500" })] }), !isCollapsed && ((0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "truncate font-medium text-gray-900", children: "Mar\u00EDa Garc\u00EDa" }), (0, jsx_runtime_1.jsx)("p", { className: "truncate text-sm text-gray-500", children: "Panader\u00EDa El Och\u00EDo" })] }))] }) }), (0, jsx_runtime_1.jsx)("nav", { className: "flex-1 space-y-2 p-4", children: navItems.map(item => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            const isHovered = hoveredItem === item.id;
                            return ((0, jsx_runtime_1.jsxs)(link_1.default, { href: item.href, onMouseEnter: () => setHoveredItem(item.id), onMouseLeave: () => setHoveredItem(null), className: (0, utils_1.cn)('group relative flex items-center space-x-3 overflow-hidden rounded-lg px-3 py-3 transition-all duration-300', isActive
                                    ? 'from-a4co-olive-500 to-a4co-clay-500 shadow-mixed-lg bg-gradient-to-r text-white'
                                    : 'hover:text-a4co-olive-600 hover:shadow-natural-md text-gray-700 hover:bg-gray-100', isHovered && 'translate-x-2 scale-105', isCollapsed && 'justify-center'), children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('from-a4co-olive-100 to-a4co-clay-100 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300', isHovered && !isActive && 'opacity-50') }), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10", children: item.id === 'products' ? ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Package, { className: (0, utils_1.cn)('h-5 w-5 transition-all duration-300', isHovered && 'animate-spin', isActive && 'text-white') }), (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('border-a4co-olive-400 absolute inset-0 h-5 w-5 animate-spin rounded-full border-2', isActive ? 'border-white/30' : 'border-a4co-olive-400/30'), style: {
                                                        animation: 'spin 2s linear infinite',
                                                    } })] })) : item.id === 'analytics' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: (0, utils_1.cn)('h-5 w-5 transition-all duration-300', isHovered && 'scale-110 animate-pulse', isActive && 'text-white') })) : ((0, jsx_runtime_1.jsx)(Icon, { className: (0, utils_1.cn)('h-5 w-5 transition-all duration-300', isHovered && 'scale-110', isActive && 'text-white') })) }), !isCollapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "relative z-10 flex-1 font-medium", children: item.label }), item.badge && item.badge > 0 && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: isActive ? 'secondary' : 'default', className: (0, utils_1.cn)('relative z-10 transition-all duration-300', isActive
                                                    ? 'bg-white/20 text-white hover:bg-white/30'
                                                    : 'bg-a4co-olive-500 hover:bg-a4co-olive-600', isHovered && 'scale-110 animate-pulse'), children: item.badge }))] })), (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('from-a4co-olive-500 to-a4co-clay-500 absolute left-0 top-0 h-full w-1 transform bg-gradient-to-b transition-transform duration-300', isHovered ? 'scale-y-100' : 'scale-y-0') })] }, item.id));
                        }) }), (0, jsx_runtime_1.jsx)(separator_1.Separator, {}), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 p-4", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", className: (0, utils_1.cn)('hover:shadow-natural-md group w-full justify-start transition-all duration-300 hover:scale-105', isCollapsed && 'justify-center'), children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "h-4 w-4 transition-all duration-300 group-hover:animate-bounce" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-red-500" })] }), !isCollapsed && (0, jsx_runtime_1.jsx)("span", { className: "ml-3", children: "Notificaciones" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", className: (0, utils_1.cn)('hover:shadow-natural-md group w-full justify-start text-red-600 transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:text-red-700', isCollapsed && 'justify-center'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { className: "h-4 w-4 transition-all duration-300 group-hover:translate-x-1" }), !isCollapsed && (0, jsx_runtime_1.jsx)("span", { className: "ml-3", children: "Cerrar Sesi\u00F3n" })] })] })] })] }));
}
//# sourceMappingURL=sidebar.js.map