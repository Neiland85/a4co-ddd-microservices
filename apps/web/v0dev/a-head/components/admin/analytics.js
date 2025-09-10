'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Analytics;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const select_1 = require("@/components/ui/select");
const badge_1 = require("@/components/ui/badge");
const tabs_1 = require("@/components/ui/tabs");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const revenue_chart_1 = __importDefault(require("./charts/revenue-chart"));
const product_sales_chart_1 = __importDefault(require("./charts/product-sales-chart"));
const category_chart_1 = __importDefault(require("./charts/category-chart"));
const customer_chart_1 = __importDefault(require("./charts/customer-chart"));
const real_time_status_1 = __importDefault(require("./real-time-status"));
const real_time_activity_1 = __importDefault(require("./real-time-activity"));
// Mock data
const mockSalesData = [
    { date: '01 Ene', revenue: 245.5, orders: 12, customers: 8 },
    { date: '02 Ene', revenue: 189.25, orders: 9, customers: 7 },
    { date: '03 Ene', revenue: 312.75, orders: 15, customers: 12 },
    { date: '04 Ene', revenue: 278.9, orders: 13, customers: 10 },
    { date: '05 Ene', revenue: 425.6, orders: 18, customers: 15 },
    { date: '06 Ene', revenue: 356.8, orders: 16, customers: 13 },
    { date: '07 Ene', revenue: 298.45, orders: 14, customers: 11 },
    { date: '08 Ene', revenue: 387.2, orders: 17, customers: 14 },
    { date: '09 Ene', revenue: 445.75, orders: 19, customers: 16 },
    { date: '10 Ene', revenue: 523.9, orders: 22, customers: 18 },
    { date: '11 Ene', revenue: 467.35, orders: 20, customers: 17 },
    { date: '12 Ene', revenue: 398.6, orders: 18, customers: 15 },
    { date: '13 Ene', revenue: 512.8, orders: 21, customers: 19 },
    { date: '14 Ene', revenue: 634.25, orders: 25, customers: 22 },
];
const mockProductSalesData = [
    { name: 'Ochío Tradicional', sales: 45, revenue: 157.5, category: 'panaderia', growth: 12.5 },
    { name: 'Aceite de Oliva Virgen', sales: 32, revenue: 384.0, category: 'aceite', growth: 8.3 },
    { name: 'Queso Semicurado', sales: 28, revenue: 434.0, category: 'queseria', growth: -2.1 },
    { name: 'Miel de Azahar', sales: 24, revenue: 204.0, category: 'miel', growth: 15.7 },
    { name: 'Jamón Ibérico', sales: 18, revenue: 540.0, category: 'embutidos', growth: 22.4 },
    { name: 'Pan de Pueblo', sales: 35, revenue: 105.0, category: 'panaderia', growth: 5.8 },
    { name: 'Queso de Cabra', sales: 22, revenue: 264.0, category: 'queseria', growth: -5.2 },
    { name: 'Conserva de Tomate', sales: 16, revenue: 96.0, category: 'conservas', growth: 18.9 },
    { name: 'Vino Tinto Reserva', sales: 12, revenue: 360.0, category: 'vinos', growth: 31.2 },
    { name: 'Dulce de Membrillo', sales: 20, revenue: 140.0, category: 'dulces', growth: 7.6 },
];
const mockCategoryData = [
    { category: 'panaderia', value: 262.5, percentage: 25.2, color: '#b08968' },
    { category: 'aceite', value: 384.0, percentage: 36.8, color: '#8a9b73' },
    { category: 'queseria', value: 698.0, percentage: 18.5, color: '#f4d03f' },
    { category: 'miel', value: 204.0, percentage: 8.7, color: '#f7dc6f' },
    { category: 'embutidos', value: 540.0, percentage: 15.2, color: '#cd6155' },
    { category: 'conservas', value: 96.0, percentage: 3.1, color: '#85c1e9' },
    { category: 'vinos', value: 360.0, percentage: 12.8, color: '#8e44ad' },
    { category: 'dulces', value: 140.0, percentage: 4.7, color: '#f1948a' },
];
const mockCustomerData = [
    { month: 'Sep', newCustomers: 15, returningCustomers: 8, totalCustomers: 23 },
    { month: 'Oct', newCustomers: 22, returningCustomers: 12, totalCustomers: 34 },
    { month: 'Nov', newCustomers: 18, returningCustomers: 16, totalCustomers: 34 },
    { month: 'Dec', newCustomers: 25, returningCustomers: 19, totalCustomers: 44 },
    { month: 'Ene', newCustomers: 32, returningCustomers: 24, totalCustomers: 56 },
    { month: 'Feb', newCustomers: 28, returningCustomers: 31, totalCustomers: 59 },
];
function Analytics() {
    const [filters, setFilters] = (0, react_1.useState)({
        dateRange: '30d',
        category: 'all',
    });
    const [isRefreshing, setIsRefreshing] = (0, react_1.useState)(false);
    // Calculate summary statistics
    const summary = (0, react_1.useMemo)(() => {
        const totalRevenue = mockSalesData.reduce((sum, item) => sum + item.revenue, 0);
        const totalOrders = mockSalesData.reduce((sum, item) => sum + item.orders, 0);
        const totalCustomers = mockSalesData.reduce((sum, item) => sum + item.customers, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        // Mock calculations for other metrics
        const conversionRate = 3.2;
        const growthRate = 15.8;
        const topProduct = mockProductSalesData[0]?.name || 'N/A';
        const topCategory = mockCategoryData.sort((a, b) => b.value - a.value)[0]?.category || 'N/A';
        return {
            totalRevenue,
            totalOrders,
            totalCustomers,
            averageOrderValue,
            conversionRate,
            growthRate,
            topProduct,
            topCategory,
        };
    }, []);
    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsRefreshing(false);
    };
    const handleExport = () => {
        // Mock export functionality
        const data = {
            summary,
            salesData: mockSalesData,
            productSales: mockProductSalesData,
            categoryData: mockCategoryData,
            customerData: mockCustomerData,
            exportDate: new Date().toISOString(),
        };
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Analytics" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-gray-600", children: "An\u00E1lisis detallado de ventas y tendencias" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 flex items-center space-x-3 sm:mt-0", children: [(0, jsx_runtime_1.jsxs)(select_1.Select, { value: filters.dateRange, onValueChange: (value) => setFilters(prev => ({ ...prev, dateRange: value })), children: [(0, jsx_runtime_1.jsxs)(select_1.SelectTrigger, { className: "w-40", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "mr-2 h-4 w-4" }), (0, jsx_runtime_1.jsx)(select_1.SelectValue, {})] }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "7d", children: "\u00DAltimos 7 d\u00EDas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "30d", children: "\u00DAltimos 30 d\u00EDas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "90d", children: "\u00DAltimos 90 d\u00EDas" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "1y", children: "\u00DAltimo a\u00F1o" })] })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", onClick: handleRefresh, disabled: isRefreshing, className: "bg-transparent transition-all duration-300 hover:scale-105", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: (0, utils_1.cn)('mr-2 h-4 w-4', isRefreshing && 'animate-spin') }), "Actualizar"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: handleExport, className: "from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 shadow-mixed hover:shadow-mixed-lg bg-gradient-to-r text-white transition-all duration-300 hover:scale-105", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "mr-2 h-4 w-4" }), "Exportar"] }), (0, jsx_runtime_1.jsx)(real_time_status_1.default, {})] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4", children: [
                    {
                        title: 'Ingresos Totales',
                        value: `€${summary.totalRevenue.toFixed(2)}`,
                        change: `+${summary.growthRate.toFixed(1)}%`,
                        trend: 'up',
                        icon: lucide_react_1.DollarSign,
                        color: 'text-green-600',
                        bgColor: 'bg-green-50',
                        borderColor: 'border-green-200',
                    },
                    {
                        title: 'Pedidos Totales',
                        value: summary.totalOrders.toString(),
                        change: '+12.3%',
                        trend: 'up',
                        icon: lucide_react_1.ShoppingCart,
                        color: 'text-blue-600',
                        bgColor: 'bg-blue-50',
                        borderColor: 'border-blue-200',
                    },
                    {
                        title: 'Clientes Únicos',
                        value: summary.totalCustomers.toString(),
                        change: '+8.7%',
                        trend: 'up',
                        icon: lucide_react_1.Users,
                        color: 'text-purple-600',
                        bgColor: 'bg-purple-50',
                        borderColor: 'border-purple-200',
                    },
                    {
                        title: 'Valor Promedio',
                        value: `€${summary.averageOrderValue.toFixed(2)}`,
                        change: '+5.2%',
                        trend: 'up',
                        icon: lucide_react_1.Target,
                        color: 'text-a4co-olive-600',
                        bgColor: 'bg-a4co-olive-50',
                        borderColor: 'border-a4co-olive-200',
                    },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: (0, utils_1.cn)('hover:shadow-natural-lg group cursor-pointer border-2 transition-all duration-300 hover:scale-105', stat.borderColor), children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: stat.title }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-2xl font-bold text-gray-900", children: stat.value }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center", children: [stat.trend === 'up' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-4 w-4 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "mr-1 h-4 w-4 text-red-600" })), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)('text-sm font-medium', stat.trend === 'up' ? 'text-green-600' : 'text-red-600'), children: stat.change }), (0, jsx_runtime_1.jsx)("span", { className: "ml-1 text-sm text-gray-500", children: "vs mes anterior" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('rounded-lg p-3 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110', stat.bgColor), children: (0, jsx_runtime_1.jsx)(Icon, { className: (0, utils_1.cn)('h-6 w-6', stat.color) }) })] }) }) }, stat.title));
                }) }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "overview", className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-4", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "overview", className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Resumen" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "products", className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Productos" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "categories", className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Categor\u00EDas" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "customers", className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Clientes" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "realtime", className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Tiempo Real" })] })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "overview", className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsx)(revenue_chart_1.default, { data: mockSalesData }), (0, jsx_runtime_1.jsx)(category_chart_1.default, { data: mockCategoryData })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "products", className: "space-y-6", children: (0, jsx_runtime_1.jsx)(product_sales_chart_1.default, { data: mockProductSalesData }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "categories", className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6", children: [(0, jsx_runtime_1.jsx)(category_chart_1.default, { data: mockCategoryData }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Rendimiento por Categor\u00EDa" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "An\u00E1lisis detallado de cada categor\u00EDa de productos" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Categor\u00EDa" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Ventas" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Porcentaje" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left font-medium text-gray-900", children: "Tendencia" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: mockCategoryData
                                                                .sort((a, b) => b.value - a.value)
                                                                .map((category, index) => ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-100 transition-all duration-300 hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 w-4 rounded-full", style: { backgroundColor: category.color } }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-900", children: category.category })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-gray-900", children: ["\u20AC", category.value.toFixed(2)] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "bg-gray-50", children: [category.percentage.toFixed(1), "%"] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-green-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium", children: ["+", (Math.random() * 20).toFixed(1), "%"] })] }) })] }, category.category))) })] }) }) })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "customers", className: "space-y-6", children: (0, jsx_runtime_1.jsx)(customer_chart_1.default, { data: mockCustomerData }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "realtime", className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsx)(real_time_activity_1.default, {}), (0, jsx_runtime_1.jsx)(real_time_status_1.default, { showDetails: true })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "text-a4co-olive-600 mr-2 h-5 w-5" }), "Insights Clave"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "An\u00E1lisis autom\u00E1tico de tendencias y oportunidades" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-green-200 bg-green-50 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-5 w-5 text-green-600" }), (0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-green-800", children: "Crecimiento Positivo" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-green-700", children: ["Los ingresos han crecido un ", summary.growthRate.toFixed(1), "% comparado con el per\u00EDodo anterior. El producto \"", summary.topProduct, "\" lidera las ventas."] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-blue-200 bg-blue-50 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-5 w-5 text-blue-600" }), (0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-blue-800", children: "Retenci\u00F3n de Clientes" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-blue-700", children: ["La tasa de conversi\u00F3n actual es del ", summary.conversionRate, "%. Los clientes recurrentes representan el 65% de las ventas totales."] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-amber-200 bg-amber-50 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-5 w-5 text-amber-600" }), (0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-amber-800", children: "Oportunidad" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-amber-700", children: ["La categor\u00EDa \"", summary.topCategory, "\" tiene el mayor potencial de crecimiento. Considera expandir el inventario en esta \u00E1rea."] })] })] }) })] })] }));
}
//# sourceMappingURL=analytics.js.map