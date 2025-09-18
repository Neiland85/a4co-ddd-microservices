'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IconGrid;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const select_1 = require("@/components/ui/select");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const icon_item_1 = __importDefault(require("./icon-item"));
/**
 * IconGrid Component
 *
 * A responsive grid component that displays a collection of icon buttons.
 * Supports filtering, searching, and customizable grid layouts.
 *
 * Installation: pnpm install lucide-react
 *
 * @param icons - Array of icon configurations to display
 * @param columns - Responsive column configuration
 * @param size - Default icon size (default: 24)
 * @param color - Default icon color (default: "currentColor")
 * @param strokeWidth - Default icon stroke width (default: 2)
 * @param variant - Button variant style
 * @param showLabels - Whether to show icon labels (default: true)
 * @param className - Additional CSS classes
 * @param onIconClick - Callback when an icon is clicked
 */
function IconGrid({ icons, columns = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
}, size = 24, color = 'currentColor', strokeWidth = 2, variant = 'default', showLabels = true, className = '', onIconClick, }) {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
    // Get unique categories from icons
    const categories = (0, react_1.useMemo)(() => {
        const uniqueCategories = Array.from(new Set(icons.map(icon => icon.category).filter(Boolean)));
        return uniqueCategories.sort();
    }, [icons]);
    // Filter icons based on search and category
    const filteredIcons = (0, react_1.useMemo)(() => {
        return icons.filter(icon => {
            const matchesSearch = searchQuery === '' ||
                icon.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                icon.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [icons, searchQuery, selectedCategory]);
    const handleIconClick = (config) => {
        onIconClick?.(config);
    };
    const getGridClasses = () => {
        const { mobile = 2, tablet = 3, desktop = 4 } = columns;
        return `
      grid gap-4
      grid-cols-${mobile}
      md:grid-cols-${tablet}
      lg:grid-cols-${desktop}
    `;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `w-full space-y-6 ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Grid3X3, { className: "text-a4co-olive-600 h-6 w-6" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "Biblioteca de Iconos" }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "secondary", className: "bg-a4co-olive-100 text-a4co-olive-700", children: [filteredIcons.length, " iconos"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 sm:flex-row", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "search-icons", className: "sr-only", children: "Buscar iconos" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "search-icons", type: "text", placeholder: "Buscar iconos por nombre o descripci\u00F3n...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), className: "focus:border-a4co-olive-500 focus:ring-a4co-olive-500 border-gray-300 pl-10" })] })] }), categories.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "sm:w-48", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "category-filter", className: "sr-only", children: "Filtrar por categor\u00EDa" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: selectedCategory, onValueChange: setSelectedCategory, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "focus:border-a4co-olive-500 focus:ring-a4co-olive-500 border-gray-300", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "mr-2 h-4 w-4" }), (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Todas las categor\u00EDas" })] }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todas las categor\u00EDas" }), categories.map(category => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: category || '', children: category }, category)))] })] })] }))] }), filteredIcons.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: getGridClasses(), children: filteredIcons.map(iconConfig => ((0, jsx_runtime_1.jsx)(icon_item_1.default, { config: {
                        ...iconConfig,
                        onClick: () => handleIconClick(iconConfig),
                    }, size: size, color: color, strokeWidth: strokeWidth, variant: variant }, iconConfig.id))) })) : ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-8 w-8 text-gray-400" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-lg font-medium text-gray-900 dark:text-gray-100", children: "No se encontraron iconos" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-400", children: "Intenta ajustar los filtros de b\u00FAsqueda o categor\u00EDa" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "text-center text-sm text-gray-500 dark:text-gray-400", children: ["Mostrando ", filteredIcons.length, " de ", icons.length, " iconos disponibles"] })] }));
}
//# sourceMappingURL=icon-grid.js.map