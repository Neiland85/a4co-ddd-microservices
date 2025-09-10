'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrders = AdminOrders;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
function AdminOrders({ orders, onView, onUpdateStatus }) {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('all');
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Gesti\u00F3n de Pedidos" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "mr-2 h-4 w-4" }), "Filtros"] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Lista de Pedidos" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative w-full sm:w-64", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Buscar pedidos...", value: searchTerm, onChange: e => setSearchTerm(e.target.value), className: "pl-10" })] })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b", children: [(0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Pedido" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Cliente" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Total" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Estado" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Fecha" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Acciones" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: filteredOrders.map(order => {
                                                const StatusIcon = getStatusIcon(order.status);
                                                return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { className: "font-medium text-gray-900", children: ["#", order.id.slice(-8)] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: [order.items.length, " productos"] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-gray-900", children: order.customerName }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: order.customerEmail })] }) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-4 py-4 font-medium text-gray-900", children: ["\u20AC", order.total.toFixed(2)] }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: `${getStatusColor(order.status)} flex w-fit items-center gap-1`, children: [(0, jsx_runtime_1.jsx)(StatusIcon, { className: "h-3 w-3" }), getStatusLabel(order.status)] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4 text-gray-600", children: order.createdAt.toLocaleDateString() }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => onView?.(order), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }), order.status === 'pending' && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => onUpdateStatus?.(order.id, 'processing'), className: "text-blue-600 hover:text-blue-700", children: "Procesar" })), order.status === 'processing' && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => onUpdateStatus?.(order.id, 'shipped'), className: "text-purple-600 hover:text-purple-700", children: "Enviar" }))] }) })] }, order.id));
                                            }) })] }) }), filteredOrders.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Package, { className: "mx-auto mb-4 h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-lg font-medium text-gray-900", children: "No se encontraron pedidos" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: searchTerm
                                            ? 'Intenta cambiar los filtros de búsqueda'
                                            : 'Los pedidos aparecerán aquí cuando los clientes realicen compras' })] }))] })] })] }));
}
//# sourceMappingURL=orders.js.map