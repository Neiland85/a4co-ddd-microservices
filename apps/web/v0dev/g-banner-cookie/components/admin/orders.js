'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Orders;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const badge_1 = require("@/components/ui/badge");
const card_1 = require("@/components/ui/card");
const select_1 = require("@/components/ui/select");
const dialog_1 = require("@/components/ui/dialog");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
// Mock orders data
const mockOrders = [
    {
        id: 'ORD-001',
        customerName: 'Ana Martínez',
        customerEmail: 'ana@email.com',
        products: [
            { productId: '1', productName: 'Ochío Tradicional', quantity: 2, price: 3.5 },
            { productId: '2', productName: 'Miel de Azahar', quantity: 1, price: 8.5 },
        ],
        total: 15.5,
        status: 'pending',
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22'),
    },
    {
        id: 'ORD-002',
        customerName: 'Carlos López',
        customerEmail: 'carlos@email.com',
        products: [{ productId: '3', productName: 'Aceite de Oliva Virgen', quantity: 1, price: 12.0 }],
        total: 12.0,
        status: 'processing',
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-22'),
    },
    {
        id: 'ORD-003',
        customerName: 'María García',
        customerEmail: 'maria@email.com',
        products: [{ productId: '4', productName: 'Queso Semicurado', quantity: 1, price: 15.5 }],
        total: 15.5,
        status: 'shipped',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-21'),
    },
    {
        id: 'ORD-004',
        customerName: 'José Ruiz',
        customerEmail: 'jose@email.com',
        products: [
            { productId: '1', productName: 'Ochío Tradicional', quantity: 3, price: 3.5 },
            { productId: '2', productName: 'Miel de Azahar', quantity: 2, price: 8.5 },
        ],
        total: 27.5,
        status: 'delivered',
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-20'),
    },
];
const statusLabels = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};
const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'processing':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'shipped':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'delivered':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};
const getStatusIcon = (status) => {
    switch (status) {
        case 'pending':
            return lucide_react_1.Clock;
        case 'processing':
            return lucide_react_1.Package;
        case 'shipped':
            return lucide_react_1.Truck;
        case 'delivered':
            return lucide_react_1.CheckCircle;
        case 'cancelled':
            return lucide_react_1.XCircle;
        default:
            return lucide_react_1.Clock;
    }
};
function Orders() {
    const orders = mockOrders;
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('all');
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [itemsPerPage] = (0, react_1.useState)(10);
    const [hoveredRow, setHoveredRow] = (0, react_1.useState)(null);
    const [selectedOrder, setSelectedOrder] = (0, react_1.useState)(null);
    // Filter and search orders
    const filteredOrders = (0, react_1.useMemo)(() => {
        return orders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);
    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    // Stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    };
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Pedidos" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-gray-600", children: "Gestiona todos los pedidos de tu tienda" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6", children: [
                    {
                        label: 'Total',
                        value: stats.total,
                        icon: lucide_react_1.Package,
                        color: 'text-gray-600',
                        bgColor: 'bg-gray-50',
                    },
                    {
                        label: 'Pendientes',
                        value: stats.pending,
                        icon: lucide_react_1.Clock,
                        color: 'text-yellow-600',
                        bgColor: 'bg-yellow-50',
                    },
                    {
                        label: 'Procesando',
                        value: stats.processing,
                        icon: lucide_react_1.Package,
                        color: 'text-blue-600',
                        bgColor: 'bg-blue-50',
                    },
                    {
                        label: 'Enviados',
                        value: stats.shipped,
                        icon: lucide_react_1.Truck,
                        color: 'text-purple-600',
                        bgColor: 'bg-purple-50',
                    },
                    {
                        label: 'Entregados',
                        value: stats.delivered,
                        icon: lucide_react_1.CheckCircle,
                        color: 'text-green-600',
                        bgColor: 'bg-green-50',
                    },
                    {
                        label: 'Ingresos',
                        value: `€${stats.totalRevenue.toFixed(2)}`,
                        icon: lucide_react_1.Euro,
                        color: 'text-a4co-olive-600',
                        bgColor: 'bg-a4co-olive-50',
                    },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: "hover:shadow-natural-lg group cursor-pointer transition-all duration-300 hover:scale-105", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium text-gray-600", children: stat.label }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg font-bold text-gray-900", children: stat.value })] }), (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('rounded-lg p-2 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110', stat.bgColor), children: (0, jsx_runtime_1.jsx)(Icon, { className: (0, utils_1.cn)('h-4 w-4', stat.color) }) })] }) }) }, stat.label));
                }) }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "mr-2 h-5 w-5" }), "Filtros y B\u00FAsqueda"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 sm:flex-row", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Buscar por ID, cliente o email...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), className: "pl-10" })] }) }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: statusFilter, onValueChange: setStatusFilter, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-full sm:w-48", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Todos los estados" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todos los estados" }), Object.entries(statusLabels).map(([value, label]) => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: value, children: label }, value)))] })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Lista de Pedidos" }), (0, jsx_runtime_1.jsxs)(card_1.CardDescription, { children: ["Mostrando ", paginatedOrders.length, " de ", filteredOrders.length, " pedidos"] })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "ID Pedido" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Cliente" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Productos" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Total" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Estado" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Fecha" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Acciones" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: paginatedOrders.map(order => {
                                                const StatusIcon = getStatusIcon(order.status);
                                                return ((0, jsx_runtime_1.jsxs)("tr", { onMouseEnter: () => setHoveredRow(order.id), onMouseLeave: () => setHoveredRow(null), className: (0, utils_1.cn)('cursor-pointer border-b border-gray-100 transition-all duration-300 hover:bg-gray-50', hoveredRow === order.id &&
                                                        'shadow-natural-md bg-a4co-olive-50/30 scale-[1.02]'), children: [(0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsx)("div", { className: "font-mono font-medium text-gray-900", children: order.id }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: order.customerName }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: order.customerEmail })] }) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-4 py-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [order.products.length, " producto", order.products.length > 1 ? 's' : ''] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: [order.products
                                                                            .slice(0, 2)
                                                                            .map(p => p.productName)
                                                                            .join(', '), order.products.length > 2 && '...'] })] }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-gray-900", children: ["\u20AC", order.total.toFixed(2)] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: (0, utils_1.cn)('border text-xs', getStatusColor(order.status)), children: [(0, jsx_runtime_1.jsx)(StatusIcon, { className: "mr-1 h-3 w-3" }), statusLabels[order.status]] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-900", children: formatDate(order.createdAt) }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)(dialog_1.Dialog, { children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => setSelectedOrder(order), className: "transition-all duration-300 hover:scale-110 hover:bg-blue-50 hover:text-blue-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }) }), (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogTitle, { children: ["Detalles del Pedido ", order.id] }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: "Informaci\u00F3n completa del pedido" })] }), selectedOrder && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Cliente" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-900", children: selectedOrder.customerName })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-4 w-4 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Email" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-900", children: selectedOrder.customerEmail })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Package, { className: "h-4 w-4 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Estado del Pedido" })] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: (0, utils_1.cn)('text-sm', getStatusColor(selectedOrder.status)), children: [(0, jsx_runtime_1.jsx)(StatusIcon, { className: "mr-2 h-4 w-4" }), statusLabels[selectedOrder.status]] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Productos" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: selectedOrder.products.map(product => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded-lg bg-gray-50 p-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: product.productName }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["Cantidad: ", product.quantity] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-semibold", children: ["\u20AC", (product.price * product.quantity).toFixed(2)] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["\u20AC", product.price.toFixed(2), " c/u"] })] })] }, product.productId))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "border-t pt-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg font-semibold", children: "Total" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-a4co-olive-600 text-xl font-bold", children: ["\u20AC", selectedOrder.total.toFixed(2)] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-500", children: "Fecha de pedido:" }), (0, jsx_runtime_1.jsx)("p", { children: formatDate(selectedOrder.createdAt) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-500", children: "\u00DAltima actualizaci\u00F3n:" }), (0, jsx_runtime_1.jsx)("p", { children: formatDate(selectedOrder.updatedAt) })] })] })] }))] })] }) })] }, order.id));
                                            }) })] }) }), totalPages > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["Mostrando ", startIndex + 1, " a", ' ', Math.min(startIndex + itemsPerPage, filteredOrders.length), " de", ' ', filteredOrders.length, " pedidos"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(Math.max(1, currentPage - 1)), disabled: currentPage === 1, className: "transition-all duration-300 hover:scale-105", children: "Anterior" }), Array.from({ length: totalPages }, (_, i) => i + 1).map(page => ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: currentPage === page ? 'default' : 'outline', size: "sm", onClick: () => setCurrentPage(page), className: (0, utils_1.cn)('transition-all duration-300 hover:scale-110', currentPage === page &&
                                                    'from-a4co-olive-500 to-a4co-clay-500 bg-gradient-to-r'), children: page }, page))), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(Math.min(totalPages, currentPage + 1)), disabled: currentPage === totalPages, className: "transition-all duration-300 hover:scale-105", children: "Siguiente" })] })] }))] })] })] }));
}
//# sourceMappingURL=orders.js.map