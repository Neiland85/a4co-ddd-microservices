'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProducts = AdminProducts;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
function AdminProducts({ products, onEdit, onDelete, onView }) {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('all');
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.producer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'inactive':
                return 'Inactivo';
            case 'draft':
                return 'Borrador';
            default:
                return status;
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Gesti\u00F3n de Productos" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { className: "bg-green-600 hover:bg-green-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }), "Nuevo Producto"] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Lista de Productos" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex w-full gap-2 sm:w-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1 sm:w-64", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Buscar productos...", value: searchTerm, onChange: e => setSearchTerm(e.target.value), className: "pl-10" })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-4 w-4" }) })] })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b", children: [(0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Producto" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Productor" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Precio" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Stock" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Estado" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-600", children: "Acciones" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: filteredProducts.map(product => ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Package, { className: "h-6 w-6 text-gray-400" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-gray-900", children: product.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: product.category })] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4 text-gray-900", children: product.producer }), (0, jsx_runtime_1.jsxs)("td", { className: "px-4 py-4 font-medium text-gray-900", children: ["\u20AC", product.price] }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsx)("span", { className: `${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`, children: product.stock }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: getStatusColor(product.status), children: getStatusLabel(product.status) }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => onView?.(product), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => onEdit?.(product), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => onDelete?.(product.id), className: "text-red-600 hover:text-red-700", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }) })] }) })] }, product.id))) })] }) }), filteredProducts.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Package, { className: "mx-auto mb-4 h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-lg font-medium text-gray-900", children: "No se encontraron productos" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: searchTerm
                                            ? 'Intenta cambiar los filtros de búsqueda'
                                            : 'Comienza agregando tu primer producto' })] }))] })] })] }));
}
//# sourceMappingURL=products.js.map