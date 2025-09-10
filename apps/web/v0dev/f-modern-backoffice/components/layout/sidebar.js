'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = Sidebar;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const scroll_area_1 = require("@/components/ui/scroll-area");
const lucide_react_1 = require("lucide-react");
const menuItems = [
    {
        id: 'dashboard',
        label: 'Dashboard Principal',
        icon: lucide_react_1.Home,
        badge: null,
    },
    {
        id: 'performance',
        label: 'Monitoreo de Rendimiento',
        icon: lucide_react_1.BarChart3,
        badge: 'Live',
        children: [
            { id: 'performance-metrics', label: 'Métricas del Sistema', icon: lucide_react_1.Activity },
            { id: 'performance-analytics', label: 'Análisis de Rendimiento', icon: lucide_react_1.TrendingUp },
            { id: 'performance-database', label: 'Base de Datos', icon: lucide_react_1.Database },
        ],
    },
    {
        id: 'users',
        label: 'Gestión de Usuarios',
        icon: lucide_react_1.Users,
        badge: '2,847',
        children: [
            { id: 'users-businesses', label: 'Negocios y Artesanos', icon: lucide_react_1.Store },
            { id: 'users-customers', label: 'Usuarios Principales', icon: lucide_react_1.UserCheck },
            { id: 'users-analytics', label: 'Análisis de Usuarios', icon: lucide_react_1.BarChart3 },
        ],
    },
    {
        id: 'security',
        label: 'Ciberseguridad',
        icon: lucide_react_1.Shield,
        badge: '3',
        badgeVariant: 'destructive',
        children: [
            { id: 'security-monitoring', label: 'Monitoreo en Tiempo Real', icon: lucide_react_1.Eye },
            { id: 'security-threats', label: 'Detección de Amenazas', icon: lucide_react_1.Lock },
            { id: 'security-firewall', label: 'Firewall y Protección', icon: lucide_react_1.Zap },
        ],
    },
    {
        id: 'offers',
        label: 'Ofertas y Destacados',
        icon: lucide_react_1.Tag,
        badge: '12',
        children: [
            { id: 'offers-featured', label: 'Puestos Destacados', icon: lucide_react_1.Crown },
            { id: 'offers-promotions', label: 'Promociones Activas', icon: lucide_react_1.Tag },
            { id: 'offers-analytics', label: 'Análisis de Ofertas', icon: lucide_react_1.TrendingUp },
        ],
    },
    {
        id: 'settings',
        label: 'Configuración',
        icon: lucide_react_1.Settings,
        badge: null,
    },
    {
        id: 'notifications',
        label: 'Notificaciones',
        icon: lucide_react_1.Bell,
        badge: '5',
    },
];
function Sidebar({ activeSection, onSectionChange }) {
    const [collapsed, setCollapsed] = (0, react_1.useState)(false);
    const [expandedItems, setExpandedItems] = (0, react_1.useState)([
        'performance',
        'users',
        'security',
        'offers',
    ]);
    const toggleExpanded = (itemId) => {
        setExpandedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
    };
    const isExpanded = (itemId) => expandedItems.includes(itemId);
    return ((0, jsx_runtime_1.jsxs)("div", { className: `${collapsed ? 'w-16' : 'w-80'} bg-background sticky top-0 flex h-screen flex-col border-r border-gray-200 transition-all duration-300 dark:border-gray-800`, children: [(0, jsx_runtime_1.jsx)("div", { className: "border-b border-gray-200 p-4 dark:border-gray-800", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [!collapsed && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "text-primary h-8 w-8" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-lg font-bold", children: "Backoffice Pro" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground text-xs", children: "Panel de Control" })] })] })), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => setCollapsed(!collapsed), className: "h-8 w-8 p-0", children: collapsed ? (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-4 w-4" }) })] }) }), (0, jsx_runtime_1.jsx)(scroll_area_1.ScrollArea, { className: "flex-1 px-2 py-4", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: menuItems.map(item => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { variant: activeSection === item.id ? 'secondary' : 'ghost', className: `w-full justify-start ${collapsed ? 'px-2' : 'px-3'} h-10`, onClick: () => {
                                    if (item.children) {
                                        toggleExpanded(item.id);
                                    }
                                    else {
                                        onSectionChange(item.id);
                                    }
                                }, children: [(0, jsx_runtime_1.jsx)(item.icon, { className: `h-4 w-4 ${collapsed ? '' : 'mr-3'}` }), !collapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "flex-1 text-left text-sm", children: item.label }), item.badge && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: item.badgeVariant || 'secondary', className: "ml-2 h-5 px-1.5 py-0.5 text-xs", children: item.badge }))] }))] }), !collapsed && item.children && isExpanded(item.id) && ((0, jsx_runtime_1.jsx)("div", { className: "ml-4 mt-1 space-y-1", children: item.children.map(child => ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: activeSection === child.id ? 'secondary' : 'ghost', className: "h-8 w-full justify-start px-3 text-xs", onClick: () => onSectionChange(child.id), children: [(0, jsx_runtime_1.jsx)(child.icon, { className: "mr-2 h-3 w-3" }), child.label] }, child.id))) }))] }, item.id))) }) }), !collapsed && ((0, jsx_runtime_1.jsxs)("div", { className: "border-t border-gray-200 p-4 dark:border-gray-800", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center space-x-2 text-xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-2 w-2 animate-pulse rounded-full bg-green-500" }), (0, jsx_runtime_1.jsx)("span", { children: "Sistema Online" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground mt-1 text-xs", children: ["\u00DAltima actualizaci\u00F3n: ", new Date().toLocaleTimeString('es-ES')] })] }))] }));
}
//# sourceMappingURL=sidebar.js.map