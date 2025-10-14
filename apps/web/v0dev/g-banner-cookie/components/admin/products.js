'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Products;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const badge_1 = require("@/components/ui/badge");
const card_1 = require("@/components/ui/card");
const select_1 = require("@/components/ui/select");
const dialog_1 = require("@/components/ui/dialog");
const label_1 = require("@/components/ui/label");
const textarea_1 = require("@/components/ui/textarea");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
// Mock products data
const mockProducts = [
    {
        id: '1',
        name: 'Ochío Tradicional',
        category: 'panaderia',
        price: 3.5,
        stock: 25,
        description: 'Pan tradicional jiennense elaborado con masa madre',
        image: '/placeholder.svg?height=100&width=100',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
    },
    {
        id: '2',
        name: 'Aceite de Oliva Virgen Extra',
        category: 'aceite',
        price: 12.0,
        stock: 5,
        description: 'Aceite de oliva de primera presión en frío',
        image: '/placeholder.svg?height=100&width=100',
        status: 'active',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
    },
    {
        id: '3',
        name: 'Queso de Cabra Semicurado',
        category: 'queseria',
        price: 15.5,
        stock: 0,
        description: 'Queso artesanal de cabra con 6 meses de curación',
        image: '/placeholder.svg?height=100&width=100',
        status: 'out_of_stock',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-22'),
    },
    {
        id: '4',
        name: 'Miel de Azahar',
        category: 'miel',
        price: 8.5,
        stock: 15,
        description: 'Miel pura de flores de azahar',
        image: '/placeholder.svg?height=100&width=100',
        status: 'active',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-19'),
    },
];
const categoryLabels = {
    panaderia: 'Panadería',
    queseria: 'Quesería',
    aceite: 'Aceite',
    embutidos: 'Embutidos',
    miel: 'Miel',
    conservas: 'Conservas',
    vinos: 'Vinos',
    dulces: 'Dulces',
    artesania: 'Artesanía',
};
const statusLabels = {
    active: 'Activo',
    inactive: 'Inactivo',
    out_of_stock: 'Sin Stock',
};
const getStatusColor = (status) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'inactive':
            return 'bg-gray-100 text-gray-800';
        case 'out_of_stock':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
function Products() {
    const [products, setProducts] = (0, react_1.useState)(mockProducts);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [categoryFilter, setCategoryFilter] = (0, react_1.useState)('all');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('all');
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [itemsPerPage] = (0, react_1.useState)(10);
    const [hoveredRow, setHoveredRow] = (0, react_1.useState)(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = (0, react_1.useState)(false);
    // Filter and search products
    const filteredProducts = (0, react_1.useMemo)(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products, searchQuery, categoryFilter, statusFilter]);
    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    // Stats
    const stats = {
        total: products.length,
        active: products.filter(p => p.status === 'active').length,
        lowStock: products.filter(p => p.stock <= 5 && p.stock > 0).length,
        outOfStock: products.filter(p => p.stock === 0).length,
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Productos" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-gray-600", children: "Gestiona tu cat\u00E1logo de productos artesanales" })] }), (0, jsx_runtime_1.jsxs)(dialog_1.Dialog, { open: isAddDialogOpen, onOpenChange: setIsAddDialogOpen, children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { className: "from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 shadow-mixed hover:shadow-mixed-lg mt-4 bg-gradient-to-r text-white transition-all duration-300 hover:scale-105 sm:mt-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }), "Nuevo Producto"] }) }), (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: "Agregar Nuevo Producto" }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: "Completa la informaci\u00F3n del producto artesanal" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-4 py-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "name", className: "text-right", children: "Nombre" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "name", className: "col-span-3" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "category", className: "text-right", children: "Categor\u00EDa" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "col-span-3", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Seleccionar categor\u00EDa" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: Object.entries(categoryLabels).map(([value, label]) => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: value, children: label }, value))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "price", className: "text-right", children: "Precio" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "price", type: "number", step: "0.01", className: "col-span-3" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "stock", className: "text-right", children: "Stock" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "stock", type: "number", className: "col-span-3" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-4 items-center gap-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "description", className: "text-right", children: "Descripci\u00F3n" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "description", className: "col-span-3" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: () => setIsAddDialogOpen(false), children: "Cancelar" }), (0, jsx_runtime_1.jsx)(button_1.Button, { className: "from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 bg-gradient-to-r", children: "Guardar Producto" })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
                    {
                        label: 'Total Productos',
                        value: stats.total,
                        icon: lucide_react_1.Package,
                        color: 'text-blue-600',
                        bgColor: 'bg-blue-50',
                    },
                    {
                        label: 'Productos Activos',
                        value: stats.active,
                        icon: lucide_react_1.TrendingUp,
                        color: 'text-green-600',
                        bgColor: 'bg-green-50',
                    },
                    {
                        label: 'Stock Bajo',
                        value: stats.lowStock,
                        icon: lucide_react_1.AlertTriangle,
                        color: 'text-yellow-600',
                        bgColor: 'bg-yellow-50',
                    },
                    {
                        label: 'Sin Stock',
                        value: stats.outOfStock,
                        icon: lucide_react_1.AlertTriangle,
                        color: 'text-red-600',
                        bgColor: 'bg-red-50',
                    },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: "hover:shadow-natural-lg group cursor-pointer transition-all duration-300 hover:scale-105", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: stat.label }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: stat.value })] }), (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('rounded-lg p-3 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110', stat.bgColor), children: (0, jsx_runtime_1.jsx)(Icon, { className: (0, utils_1.cn)('h-6 w-6', stat.color) }) })] }) }) }, stat.label));
                }) }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "mr-2 h-5 w-5" }), "Filtros y B\u00FAsqueda"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 sm:flex-row", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Buscar productos...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), className: "pl-10" })] }) }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-full sm:w-48", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Todas las categor\u00EDas" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todas las categor\u00EDas" }), Object.entries(categoryLabels).map(([value, label]) => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: value, children: label }, value)))] })] }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: statusFilter, onValueChange: setStatusFilter, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-full sm:w-48", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Todos los estados" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todos los estados" }), Object.entries(statusLabels).map(([value, label]) => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: value, children: label }, value)))] })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Lista de Productos" }), (0, jsx_runtime_1.jsxs)(card_1.CardDescription, { children: ["Mostrando ", paginatedProducts.length, " de ", filteredProducts.length, " productos"] })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Producto" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Categor\u00EDa" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Precio" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Stock" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Estado" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Acciones" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: paginatedProducts.map(product => ((0, jsx_runtime_1.jsxs)("tr", { onMouseEnter: () => setHoveredRow(product.id), onMouseLeave: () => setHoveredRow(null), className: (0, utils_1.cn)('cursor-pointer border-b border-gray-100 transition-all duration-300 hover:bg-gray-50', hoveredRow === product.id &&
                                                    'shadow-natural-md bg-a4co-olive-50/30 scale-[1.02]'), children: [(0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-12 w-12 overflow-hidden rounded-lg bg-gray-200", children: (0, jsx_runtime_1.jsx)("img", { src: product.image || '/placeholder.svg', alt: product.name, className: "h-full w-full object-cover" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: product.name }), (0, jsx_runtime_1.jsx)("div", { className: "max-w-xs truncate text-sm text-gray-500", children: product.description })] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "bg-a4co-olive-50 text-a4co-olive-700 border-a4co-olive-200", children: categoryLabels[product.category] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-gray-900", children: ["\u20AC", product.price.toFixed(2)] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)('font-medium', product.stock === 0
                                                                        ? 'text-red-600'
                                                                        : product.stock <= 5
                                                                            ? 'text-yellow-600'
                                                                            : 'text-green-600'), children: product.stock }), product.stock <= 5 && product.stock > 0 && ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-yellow-500" }))] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: (0, utils_1.cn)('text-xs', getStatusColor(product.status)), children: statusLabels[product.status] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "transition-all duration-300 hover:scale-110 hover:bg-blue-50 hover:text-blue-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "transition-all duration-300 hover:scale-110 hover:bg-green-50 hover:text-green-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "transition-all duration-300 hover:scale-110 hover:bg-red-50 hover:text-red-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }) })] }) })] }, product.id))) })] }) }), totalPages > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["Mostrando ", startIndex + 1, " a", ' ', Math.min(startIndex + itemsPerPage, filteredProducts.length), " de", ' ', filteredProducts.length, " productos"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(Math.max(1, currentPage - 1)), disabled: currentPage === 1, className: "transition-all duration-300 hover:scale-105", children: "Anterior" }), Array.from({ length: totalPages }, (_, i) => i + 1).map(page => ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: currentPage === page ? 'default' : 'outline', size: "sm", onClick: () => setCurrentPage(page), className: (0, utils_1.cn)('transition-all duration-300 hover:scale-110', currentPage === page &&
                                                    'from-a4co-olive-500 to-a4co-clay-500 bg-gradient-to-r'), children: page }, page))), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(Math.min(totalPages, currentPage + 1)), disabled: currentPage === totalPages, className: "transition-all duration-300 hover:scale-105", children: "Siguiente" })] })] }))] })] })] }));
}
//# sourceMappingURL=products.js.map