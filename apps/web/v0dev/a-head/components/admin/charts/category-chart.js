'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoryChart;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const recharts_1 = require("recharts");
const card_1 = require("@/components/ui/card");
const ui_1 = require("@/components/ui");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
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
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return ((0, jsx_runtime_1.jsxs)("div", { className: "shadow-natural-lg rounded-lg border border-gray-200 bg-white p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 w-3 rounded-full", style: { backgroundColor: data.color } }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-900", children: categoryLabels[data.category] || data.category })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Ventas:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-semibold text-gray-900", children: ["\u20AC", data.value.toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: "Porcentaje:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-semibold text-gray-900", children: [data.percentage.toFixed(1), "%"] })] })] })] }));
    }
    return null;
};
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percentage < 5)
        return null;
    return ((0, jsx_runtime_1.jsx)("text", { x: x, y: y, fill: "white", textAnchor: x > cx ? 'start' : 'end', dominantBaseline: "central", fontSize: 12, fontWeight: "bold", style: { filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }, children: `${percentage.toFixed(0)}%` }));
};
function CategoryChart({ data, className }) {
    const [activeIndex, setActiveIndex] = (0, react_1.useState)(null);
    const [viewMode, setViewMode] = (0, react_1.useState)('chart');
    const maxRevenue = Math.max(...data.map(cat => cat.totalRevenue));
    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };
    const onPieLeave = () => {
        setActiveIndex(null);
    };
    const totalValue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: (0, utils_1.cn)('shadow-natural-lg hover:shadow-natural-xl transition-all duration-300', className), children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Palette, { className: "h-5 w-5 text-purple-600" }), "Rendimiento por Categor\u00EDa"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Distribuci\u00F3n de ventas por tipo de producto" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: viewMode === 'chart' ? 'default' : 'outline', size: "sm", onClick: () => setViewMode('chart'), className: "transition-all duration-300 hover:scale-105", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.PieChartIcon, { className: "mr-1 h-4 w-4" }), "Gr\u00E1fico"] }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: viewMode === 'list' ? 'default' : 'outline', size: "sm", onClick: () => setViewMode('list'), className: "transition-all duration-300 hover:scale-105", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "mr-1 h-4 w-4" }), "Lista"] })] })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [viewMode === 'chart' ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-80", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.PieChart, { children: [(0, jsx_runtime_1.jsx)(recharts_1.Pie, { data: data, cx: "50%", cy: "50%", labelLine: false, label: CustomLabel, outerRadius: 120, fill: "#8884d8", dataKey: "totalRevenue", onMouseEnter: onPieEnter, onMouseLeave: onPieLeave, children: data.map((entry, index) => ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: entry.color, stroke: activeIndex === index ? '#fff' : 'none', strokeWidth: activeIndex === index ? 3 : 0, style: {
                                                        filter: activeIndex === index
                                                            ? 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                                                            : 'none',
                                                        transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                                        transformOrigin: 'center',
                                                        transition: 'all 0.3s ease',
                                                    } }, `cell-${index}`))) }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { content: (0, jsx_runtime_1.jsx)(CustomTooltip, {}) })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-3", children: data.map((item, index) => {
                                    const revenuePercentage = (item.totalRevenue / maxRevenue) * 100;
                                    return ((0, jsx_runtime_1.jsxs)("div", { onMouseEnter: () => setActiveIndex(index), onMouseLeave: () => setActiveIndex(null), className: (0, utils_1.cn)('hover:shadow-natural-md flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all duration-300', activeIndex === index
                                            ? 'scale-105 border-gray-300 bg-gray-50'
                                            : 'border-gray-200 bg-white'), children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-4 flex-shrink-0 rounded-full", style: { backgroundColor: item.color } }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "truncate text-sm font-medium text-gray-900", children: categoryLabels[item.category] || item.category }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: ["\u20AC", item.totalRevenue.toLocaleString(), " (", item.percentage.toFixed(1), "%)"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-semibold text-gray-900", children: ["\u20AC", item.totalRevenue.toLocaleString()] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: [item.totalSales, " ventas"] })] }), (0, jsx_runtime_1.jsx)(ui_1.Progress, { value: revenuePercentage, className: "mt-2 h-2" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center justify-between text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Precio promedio: \u20AC", item.averagePrice.toFixed(2)] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Top: ", item.topProduct] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-green-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-3 w-3" }), revenuePercentage.toFixed(1), "%"] })] })] }, item.category));
                                }) })] })) : (
                    /* List View */
                    (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: data
                            .sort((a, b) => b.totalRevenue - a.totalRevenue)
                            .map((category, index) => {
                            const revenuePercentage = (category.totalRevenue / maxRevenue) * 100;
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "hover:scale-102 group flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "from-a4co-olive-400 to-a4co-clay-400 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white", children: index + 1 }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-4 rounded-full", style: { backgroundColor: category.color } }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "group-hover:text-a4co-olive-600 font-medium text-gray-900 transition-colors", children: categoryLabels[category.category] || category.category }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: [category.percentage.toFixed(1), "% del total"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-semibold text-gray-900", children: ["\u20AC", category.totalRevenue.toLocaleString()] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: [category.totalSales, " ventas"] })] }), (0, jsx_runtime_1.jsx)(ui_1.Progress, { value: revenuePercentage, className: "mt-2 h-2" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center justify-between text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Precio promedio: \u20AC", category.averagePrice.toFixed(2)] }), (0, jsx_runtime_1.jsxs)("span", { children: ["Top: ", category.topProduct] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-green-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-3 w-3" }), revenuePercentage.toFixed(1), "%"] })] })] }, category.category));
                        }) })), (0, jsx_runtime_1.jsx)("div", { className: "from-a4co-olive-50 to-a4co-clay-50 border-a4co-olive-200 mt-6 rounded-lg border bg-gradient-to-r p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Total de Ventas" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [data.length, " categor\u00EDas activas"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-a4co-olive-700 text-2xl font-bold", children: ["\u20AC", totalValue.toLocaleString()] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Ingresos totales" })] })] }) })] })] }));
}
//# sourceMappingURL=category-chart.js.map