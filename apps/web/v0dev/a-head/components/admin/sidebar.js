'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSidebar = AdminSidebar;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const navigationItems = [
    {
        name: 'Dashboard',
        href: '/admin',
        icon: lucide_react_1.LayoutDashboard,
        badge: null,
    },
    {
        name: 'Productos',
        href: '/admin/products',
        icon: lucide_react_1.Package,
        badge: '89',
    },
    {
        name: 'Pedidos',
        href: '/admin/orders',
        icon: lucide_react_1.ShoppingCart,
        badge: '12',
    },
    {
        name: 'Usuarios',
        href: '/admin/users',
        icon: lucide_react_1.Users,
        badge: null,
    },
    {
        name: 'Análisis',
        href: '/admin/analytics',
        icon: lucide_react_1.BarChart3,
        badge: null,
    },
    {
        name: 'Configuración',
        href: '/admin/settings',
        icon: lucide_react_1.Settings,
        badge: null,
    },
];
function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(false);
    const pathname = (0, navigation_1.usePathname)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!isCollapsed && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden", onClick: () => setIsCollapsed(true) })), (0, jsx_runtime_1.jsx)("div", { className: `
        fixed left-0 top-0 z-50 h-full border-r border-gray-200 bg-white transition-all duration-300
        ${isCollapsed ? '-translate-x-full lg:w-16 lg:translate-x-0' : 'w-64'}
      `, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex h-full flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b p-4", children: [!isCollapsed && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-amber-500", children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-white", children: "J" }) }), (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-gray-900", children: "Admin Panel" })] })), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => setIsCollapsed(!isCollapsed), className: "lg:hidden", children: isCollapsed ? (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "h-4 w-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsx)("nav", { className: "flex-1 space-y-2 p-4", children: navigationItems.map(item => {
                                const IconComponent = item.icon;
                                const isActive = pathname === item.href;
                                return ((0, jsx_runtime_1.jsx)(link_1.default, { href: item.href, children: (0, jsx_runtime_1.jsxs)("div", { className: `
                    flex items-center gap-3 rounded-lg px-3 py-2 transition-colors
                    ${isActive
                                            ? 'border border-green-200 bg-green-100 text-green-700'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `, children: [(0, jsx_runtime_1.jsx)(IconComponent, { className: "h-5 w-5 flex-shrink-0" }), !isCollapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: item.name }), item.badge && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "ml-auto bg-red-100 text-xs text-red-800", children: item.badge }))] }))] }) }, item.name));
                            }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 border-t p-4", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", className: "w-full justify-start text-gray-600 hover:text-gray-900", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "mr-3 h-4 w-4" }), !isCollapsed && 'Notificaciones'] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", className: "w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { className: "mr-3 h-4 w-4" }), !isCollapsed && 'Cerrar Sesión'] })] })] }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => setIsCollapsed(!isCollapsed), className: "fixed left-4 top-4 z-40 hidden lg:flex", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "h-4 w-4" }) })] }));
}
//# sourceMappingURL=sidebar.js.map