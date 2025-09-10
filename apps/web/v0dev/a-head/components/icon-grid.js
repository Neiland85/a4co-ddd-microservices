'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconGrid = IconGrid;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
const select_1 = require("@/components/ui/select");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const icon_item_1 = require("./icon-item");
function IconGrid({ icons, columns = 4, gap = 4, showLabels = true, onIconClick, }) {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
    const [viewMode, setViewMode] = (0, react_1.useState)('grid');
    const categories = Array.from(new Set(icons.map(icon => icon.category)));
    const filteredIcons = icons.filter(icon => {
        const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            icon.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    const gridColumns = {
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
    }[columns] || 'grid-cols-4';
    const gapClass = {
        2: 'gap-2',
        4: 'gap-4',
        6: 'gap-6',
        8: 'gap-8',
    }[gap] || 'gap-4';
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-1 flex-col gap-3 sm:flex-row", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative max-w-md flex-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Buscar iconos...", value: searchTerm, onChange: e => setSearchTerm(e.target.value), className: "pl-10" })] }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: selectedCategory, onValueChange: setSelectedCategory, children: [(0, jsx_runtime_1.jsxs)(select_1.SelectTrigger, { className: "w-full sm:w-48", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "mr-2 h-4 w-4" }), (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Categor\u00EDa" })] }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todas las categor\u00EDas" }), categories.map(category => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: category, children: category.charAt(0).toUpperCase() + category.slice(1) }, category)))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: viewMode === 'grid' ? 'default' : 'outline', size: "sm", onClick: () => setViewMode('grid'), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Grid, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: viewMode === 'list' ? 'default' : 'outline', size: "sm", onClick: () => setViewMode('list'), children: (0, jsx_runtime_1.jsx)(lucide_react_1.List, { className: "h-4 w-4" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [filteredIcons.length, " icono", filteredIcons.length !== 1 ? 's' : '', " encontrado", filteredIcons.length !== 1 ? 's' : ''] }), selectedCategory !== 'all' && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: "capitalize", children: selectedCategory }))] }), viewMode === 'grid' ? ((0, jsx_runtime_1.jsx)("div", { className: `grid ${gridColumns} ${gapClass}`, children: filteredIcons.map(icon => ((0, jsx_runtime_1.jsx)(icon_item_1.IconItem, { config: icon, onClick: onIconClick }, icon.id))) })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: filteredIcons.map(icon => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 rounded-lg border p-3 hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)(icon_item_1.IconItem, { config: icon, onClick: onIconClick }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium", children: icon.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: icon.description })] })] }, icon.id))) })), filteredIcons.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 text-gray-400", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "mx-auto h-12 w-12" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-lg font-medium text-gray-900", children: "No se encontraron iconos" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Intenta cambiar los filtros o el t\u00E9rmino de b\u00FAsqueda" })] }))] }));
}
//# sourceMappingURL=icon-grid.js.map