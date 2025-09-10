'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
// Mock data
const mockStats = {
    totalProducts: 45,
    totalOrders: 128,
    totalRevenue: 3420.5,
    pendingOrders: 5,
    lowStockProducts: 3,
    recentOrders: [
        {
            id: 'ORD-001',
            customerName: 'Ana Martínez',
            customerEmail: 'ana@email.com',
            products: [{ productId: '1', productName: 'Ochío Tradicional', quantity: 2, price: 3.5 }],
            total: 7.0,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'ORD-002',
            customerName: 'Carlos López',
            customerEmail: 'carlos@email.com',
            products: [{ productId: '2', productName: 'Queso de Cabra', quantity: 1, price: 12.0 }],
            total: 12.0,
            status: 'processing',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
    topProducts: [
        { id: '1', name: 'Ochío Tradicional', sales: 45, revenue: 157.5 },
        { id: '2', name: 'Aceite de Oliva Virgen', sales: 32, revenue: 384.0 },
        { id: '3', name: 'Queso Semicurado', sales: 28, revenue: 336.0 },
    ],
};
const statCards = [
    {
        title: 'Productos Totales',
        value: mockStats.totalProducts,
        change: '+12%',
        trend: 'up',
        icon: lucide_react_1.Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
    {
        title: 'Pedidos Totales',
        value: mockStats.totalOrders,
        change: '+23%',
        trend: 'up',
        icon: lucide_react_1.ShoppingCart,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
    },
    {
        title: 'Ingresos Totales',
        value: `€${mockStats.totalRevenue.toFixed(2)}`,
        change: '+18%',
        trend: 'up',
        icon: lucide_react_1.Euro,
        color: 'text-a4co-olive-600',
        bgColor: 'bg-a4co-olive-50',
    },
    {
        title: 'Stock Bajo',
        value: mockStats.lowStockProducts,
        change: '-2',
        trend: 'down',
        icon: lucide_react_1.AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
    },
];
const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'shipped':
            return 'bg-purple-100 text-purple-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
const getStatusLabel = (status) => {
    switch (status) {
        case 'pending':
            return 'Pendiente';
        case 'processing':
            return 'Procesando';
        case 'shipped':
            return 'Enviado';
        case 'delivered':
            return 'Entregado';
        case 'cancelled':
            return 'Cancelado';
        default:
            return status;
    }
};
function Dashboard() {
    const [hoveredCard, setHoveredCard] = (0, react_1.useState)(null);
    const [stats, setStats] = (0, react_1.useState)(mockStats);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-gray-600", children: "Resumen de tu negocio artesanal" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 sm:mt-0", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { className: "from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 shadow-mixed hover:shadow-mixed-lg bg-gradient-to-r text-white transition-all duration-300 hover:scale-105", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-2 h-4 w-4" }), "Ver Tienda"] }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4", children: statCards.map((card, index) => {
                    const Icon = card.icon;
                    const isHovered = hoveredCard === index;
                    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { onMouseEnter: () => setHoveredCard(index), onMouseLeave: () => setHoveredCard(null), className: (0, utils_1.cn)('shadow-natural hover:shadow-natural-xl cursor-pointer border-0 transition-all duration-300', isHovered && '-translate-y-2 scale-105'), children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium text-gray-600", children: card.title }), (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('rounded-lg p-2 transition-all duration-300', card.bgColor, isHovered && 'rotate-12 scale-110'), children: (0, jsx_runtime_1.jsx)(Icon, { className: (0, utils_1.cn)('h-4 w-4', card.color) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-1 text-2xl font-bold text-gray-900", children: card.value }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm", children: [card.trend === 'up' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-4 w-4 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "mr-1 h-4 w-4 text-red-600" })), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)('font-medium', card.trend === 'up' ? 'text-green-600' : 'text-red-600'), children: card.change }), (0, jsx_runtime_1.jsx)("span", { className: "ml-1 text-gray-500", children: "vs mes anterior" })] })] })] }, card.title));
                }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg font-semibold", children: "Pedidos Recientes" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "\u00DAltimos pedidos recibidos" })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "transition-all duration-300 hover:scale-110", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, { className: "h-4 w-4" }) })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: stats.recentOrders.map((order, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "hover:scale-102 hover:shadow-natural-md group flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "group-hover:text-a4co-olive-600 font-medium text-gray-900 transition-colors", children: order.id }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: (0, utils_1.cn)('text-xs', getStatusColor(order.status)), children: getStatusLabel(order.status) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 text-sm text-gray-600", children: [order.customerName, " \u2022 \u20AC", order.total.toFixed(2)] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUpRight, { className: "group-hover:text-a4co-olive-600 h-4 w-4 text-gray-400 transition-all duration-300 group-hover:scale-110" })] }, order.id))) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg font-semibold", children: "Productos M\u00E1s Vendidos" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Productos con mejor rendimiento" })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "transition-all duration-300 hover:scale-110", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreHorizontal, { className: "h-4 w-4" }) })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: stats.topProducts.map((product, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "hover:scale-102 hover:shadow-natural-md group flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "from-a4co-olive-400 to-a4co-clay-400 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white transition-all duration-300 group-hover:scale-110", children: index + 1 }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "group-hover:text-a4co-olive-600 font-medium text-gray-900 transition-colors", children: product.name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: [product.sales, " ventas"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-semibold text-gray-900", children: ["\u20AC", product.revenue.toFixed(2)] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "ingresos" })] })] }, product.id))) }) })] })] })] }));
}
//# sourceMappingURL=dashboard.js.map