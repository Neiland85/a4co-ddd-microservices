'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RevenueChart;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const recharts_1 = require("recharts");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const use_websocket_1 = require("../../../hooks/use-websocket");
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "shadow-natural-lg rounded-lg border border-gray-200 bg-white p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "mb-2 font-medium text-gray-900", children: label }), payload.map((entry, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 w-3 rounded-full", style: { backgroundColor: entry.color } }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600", children: [entry.dataKey, ":"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-semibold text-gray-900", children: entry.dataKey === 'revenue' ? `€${entry.value.toFixed(2)}` : entry.value })] }, index)))] }));
    }
    return null;
};
function RevenueChart({ data, className }) {
    const [chartType, setChartType] = (0, react_1.useState)('area');
    const [hoveredPoint, setHoveredPoint] = (0, react_1.useState)(null);
    const [realtimeData, setRealtimeData] = (0, react_1.useState)(data);
    const [isLive, setIsLive] = (0, react_1.useState)(false);
    const salesUpdates = (0, use_websocket_1.useRealTimeData)('SALES_UPDATE');
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const previousRevenue = data.slice(0, -7).reduce((sum, item) => sum + item.revenue, 0);
    const growth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    // Handle real-time updates
    (0, react_1.useEffect)(() => {
        if (!isLive || salesUpdates.data.length === 0)
            return;
        const latestUpdate = salesUpdates.data[0];
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        });
        const newDataPoint = {
            date: timeString,
            revenue: latestUpdate.revenue,
            orders: latestUpdate.orders,
            customers: latestUpdate.customers,
        };
        setRealtimeData(prevData => {
            const updatedData = [...prevData, newDataPoint];
            // Keep only last 20 points for performance
            return updatedData.slice(-20);
        });
    }, [salesUpdates.data, isLive]);
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: (0, utils_1.cn)('shadow-natural-lg hover:shadow-natural-xl transition-all duration-300', className), children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Euro, { className: "text-a4co-olive-600 mr-2 h-5 w-5" }), "Ingresos por Ventas"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Evoluci\u00F3n de los ingresos en el tiempo" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: chartType === 'line' ? 'default' : 'outline', size: "sm", onClick: () => setChartType('line'), className: "transition-all duration-300 hover:scale-105", children: "L\u00EDnea" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: chartType === 'area' ? 'default' : 'outline', size: "sm", onClick: () => setChartType('area'), className: "transition-all duration-300 hover:scale-105", children: "\u00C1rea" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: isLive ? 'default' : 'outline', size: "sm", onClick: () => setIsLive(!isLive), className: (0, utils_1.cn)('transition-all duration-300 hover:scale-105', isLive && 'animate-pulse bg-green-600 text-white hover:bg-green-700'), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "mr-1 h-3 w-3" }), isLive ? 'En Vivo' : 'Activar Live'] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 grid grid-cols-1 gap-4 md:grid-cols-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "from-a4co-olive-50 to-a4co-clay-50 border-a4co-olive-200 rounded-lg border bg-gradient-to-r p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Ingresos Totales" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-a4co-olive-700 text-2xl font-bold", children: ["\u20AC", totalRevenue.toFixed(2)] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Euro, { className: "text-a4co-olive-600 h-8 w-8" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Promedio Diario" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-bold text-blue-700", children: ["\u20AC", (totalRevenue / data.length).toFixed(2)] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-8 w-8 text-blue-600" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Crecimiento" }), (0, jsx_runtime_1.jsxs)("p", { className: (0, utils_1.cn)('flex items-center text-2xl font-bold', growth >= 0 ? 'text-green-700' : 'text-red-700'), children: [growth >= 0 ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-5 w-5" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "mr-1 h-5 w-5" })), Math.abs(growth).toFixed(1), "%"] })] }) }) }), isLive && ((0, jsx_runtime_1.jsx)("div", { className: "rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Estado" }), (0, jsx_runtime_1.jsxs)("p", { className: "flex items-center text-lg font-bold text-green-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "mr-1 h-4 w-4 animate-pulse" }), "Tiempo Real"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-3 animate-pulse rounded-full bg-green-500" })] }) }))] })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "h-80", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: chartType === 'area' ? ((0, jsx_runtime_1.jsxs)(recharts_1.AreaChart, { data: realtimeData, onMouseMove: e => setHoveredPoint(typeof e?.activeTooltipIndex === 'number' ? e.activeTooltipIndex : null), onMouseLeave: () => setHoveredPoint(null), children: [(0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: "revenueGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "5%", stopColor: "#8a9b73", stopOpacity: 0.8 }), (0, jsx_runtime_1.jsx)("stop", { offset: "95%", stopColor: "#8a9b73", stopOpacity: 0.1 })] }) }), (0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "date", stroke: "#666", fontSize: 12, tickLine: false, axisLine: false }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { stroke: "#666", fontSize: 12, tickLine: false, axisLine: false, tickFormatter: value => `€${value}` }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { content: (0, jsx_runtime_1.jsx)(CustomTooltip, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "revenue", stroke: "#8a9b73", strokeWidth: 3, fill: "url(#revenueGradient)", dot: { fill: '#8a9b73', strokeWidth: 2, r: 4 }, activeDot: {
                                        r: 6,
                                        fill: '#8a9b73',
                                        strokeWidth: 2,
                                        stroke: '#fff',
                                        style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' },
                                    } })] })) : ((0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: realtimeData, onMouseMove: e => setHoveredPoint(typeof e?.activeTooltipIndex === 'number' ? e.activeTooltipIndex : null), onMouseLeave: () => setHoveredPoint(null), children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "date", stroke: "#666", fontSize: 12, tickLine: false, axisLine: false }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { stroke: "#666", fontSize: 12, tickLine: false, axisLine: false, tickFormatter: value => `€${value}` }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { content: (0, jsx_runtime_1.jsx)(CustomTooltip, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "revenue", stroke: "#8a9b73", strokeWidth: 3, dot: { fill: '#8a9b73', strokeWidth: 2, r: 4 }, activeDot: {
                                        r: 6,
                                        fill: '#8a9b73',
                                        strokeWidth: 2,
                                        stroke: '#fff',
                                        style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' },
                                    } })] })) }) }) })] }));
}
//# sourceMappingURL=revenue-chart.js.map