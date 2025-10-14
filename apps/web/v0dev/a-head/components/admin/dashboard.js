'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboard = AdminDashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
function AdminDashboard({ stats }) {
    const statCards = [
        {
            title: 'Total Usuarios',
            value: stats.totalUsers.toLocaleString(),
            change: stats.monthlyGrowth.users,
            icon: lucide_react_1.Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Productos',
            value: stats.totalProducts.toLocaleString(),
            change: stats.monthlyGrowth.products,
            icon: lucide_react_1.Package,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Pedidos',
            value: stats.totalOrders.toLocaleString(),
            change: stats.monthlyGrowth.orders,
            icon: lucide_react_1.ShoppingCart,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            title: 'Ingresos',
            value: `€${stats.totalRevenue.toLocaleString()}`,
            change: stats.monthlyGrowth.revenue,
            icon: lucide_react_1.DollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Panel de Administraci\u00F3n" }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: "bg-green-100 text-green-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "mr-1 h-3 w-3" }), "Sistema Activo"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4", children: statCards.map((stat, index) => {
                    const IconComponent = stat.icon;
                    const isPositive = stat.change >= 0;
                    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "transition-shadow duration-300 hover:shadow-lg", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium text-gray-600", children: stat.title }), (0, jsx_runtime_1.jsx)("div", { className: `rounded-lg p-2 ${stat.bgColor}`, children: (0, jsx_runtime_1.jsx)(IconComponent, { className: `h-4 w-4 ${stat.color}` }) })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-2 text-2xl font-bold text-gray-900", children: stat.value }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm", children: [isPositive ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-3 w-3 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "mr-1 h-3 w-3 text-red-600" })), (0, jsx_runtime_1.jsxs)("span", { className: isPositive ? 'text-green-600' : 'text-red-600', children: [Math.abs(stat.change), "%"] }), (0, jsx_runtime_1.jsx)("span", { className: "ml-1 text-gray-500", children: "vs mes anterior" })] })] })] }, index));
                }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Actividad Reciente" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: [
                                        { action: 'Nuevo usuario registrado', user: 'María García', time: 'Hace 5 min' },
                                        { action: 'Producto actualizado', user: 'Admin', time: 'Hace 12 min' },
                                        { action: 'Pedido completado', user: 'Carlos López', time: 'Hace 23 min' },
                                        { action: 'Nueva reseña', user: 'Ana Martín', time: 'Hace 1 hora' },
                                    ].map((activity, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b py-2 last:border-b-0", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900", children: activity.action }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: activity.user })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: activity.time })] }, index))) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Resumen del Sistema" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Estado del servidor" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "bg-green-100 text-green-800", children: "Operativo" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Base de datos" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "bg-green-100 text-green-800", children: "Conectada" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "\u00DAltima copia de seguridad" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-900", children: "Hace 2 horas" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Versi\u00F3n del sistema" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-900", children: "v2.1.0" })] })] }) })] })] })] }));
}
//# sourceMappingURL=dashboard.js.map