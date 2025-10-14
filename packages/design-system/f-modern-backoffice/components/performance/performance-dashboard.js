'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceDashboard = PerformanceDashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const progress_1 = require("@/components/ui/progress");
const tabs_1 = require("@/components/ui/tabs");
const chart_1 = require("@/components/ui/chart");
const recharts_1 = require("recharts");
const lucide_react_1 = require("lucide-react");
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
function PerformanceDashboard() {
    const [metrics, setMetrics] = (0, react_1.useState)({
        cpu: 67,
        memory: 54,
        disk: 32,
        network: 45,
        responseTime: 245,
        throughput: 1250,
        errorRate: 0.8,
        uptime: 99.97,
    });
    const [chartData, setChartData] = (0, react_1.useState)([]);
    const [realTimeData, setRealTimeData] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        // Generar datos iniciales
        const initialData = Array.from({ length: 30 }, (_, i) => ({
            time: new Date(Date.now() - (29 - i) * 60000).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            cpu: Math.floor(Math.random() * 30 + 50),
            memory: Math.floor(Math.random() * 20 + 40),
            responseTime: Math.floor(Math.random() * 100 + 200),
            requests: Math.floor(Math.random() * 500 + 1000),
            errors: Math.floor(Math.random() * 10 + 2),
        }));
        setChartData(initialData);
        // Datos para gráfico de distribución
        const distributionData = [
            { name: 'API Calls', value: 45, color: '#0088FE' },
            { name: 'Database', value: 25, color: '#00C49F' },
            { name: 'Cache', value: 15, color: '#FFBB28' },
            { name: 'External', value: 10, color: '#FF8042' },
            { name: 'Other', value: 5, color: '#8884D8' },
        ];
        setRealTimeData(distributionData);
        // Actualizar datos en tiempo real
        const interval = setInterval(() => {
            const newPoint = {
                time: new Date().toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                cpu: Math.floor(Math.random() * 30 + 50),
                memory: Math.floor(Math.random() * 20 + 40),
                responseTime: Math.floor(Math.random() * 100 + 200),
                requests: Math.floor(Math.random() * 500 + 1000),
                errors: Math.floor(Math.random() * 10 + 2),
            };
            setChartData(prev => [...prev.slice(1), newPoint]);
            setMetrics(prev => ({
                ...prev,
                cpu: newPoint.cpu,
                memory: newPoint.memory,
                responseTime: newPoint.responseTime,
                throughput: newPoint.requests,
                errorRate: (newPoint.errors / newPoint.requests) * 100,
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    const getStatusColor = (value, thresholds) => {
        if (value >= thresholds.critical)
            return 'text-red-500';
        if (value >= thresholds.warning)
            return 'text-yellow-500';
        return 'text-green-500';
    };
    const getStatusIcon = (value, thresholds) => {
        if (value >= thresholds.critical)
            return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-500" });
        if (value >= thresholds.warning)
            return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-yellow-500" });
        return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "CPU" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Cpu, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold", children: [metrics.cpu, "%"] }), getStatusIcon(metrics.cpu, { warning: 70, critical: 85 })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: metrics.cpu, className: "mt-2" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground mt-1 text-xs", children: (0, jsx_runtime_1.jsx)("span", { className: getStatusColor(metrics.cpu, { warning: 70, critical: 85 }), children: metrics.cpu < 70 ? 'Normal' : metrics.cpu < 85 ? 'Advertencia' : 'Crítico' }) })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Memoria" }), (0, jsx_runtime_1.jsx)(lucide_react_1.HardDrive, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold", children: [metrics.memory, "%"] }), getStatusIcon(metrics.memory, { warning: 75, critical: 90 })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: metrics.memory, className: "mt-2" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground mt-1 text-xs", children: (0, jsx_runtime_1.jsx)("span", { className: getStatusColor(metrics.memory, { warning: 75, critical: 90 }), children: metrics.memory < 75 ? 'Normal' : metrics.memory < 90 ? 'Advertencia' : 'Crítico' }) })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Tiempo de Respuesta" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold", children: [metrics.responseTime, "ms"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center", children: [metrics.responseTime < 300 ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "mr-1 h-3 w-3 text-green-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-3 w-3 text-red-500" })), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-xs", children: metrics.responseTime < 300 ? 'Excelente' : 'Necesita atención' })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Disponibilidad" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Server, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold", children: [metrics.uptime, "%"] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "mr-1 h-3 w-3 text-green-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-xs", children: "Operativo" })] })] })] })] }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "overview", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-4", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "overview", children: "Resumen" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "performance", children: "Rendimiento" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "requests", children: "Solicitudes" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "distribution", children: "Distribuci\u00F3n" })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "overview", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "M\u00E9tricas del Sistema" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "CPU y Memoria en tiempo real" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                                    cpu: { label: 'CPU (%)', color: 'hsl(var(--chart-1))' },
                                                    memory: { label: 'Memoria (%)', color: 'hsl(var(--chart-2))' },
                                                }, className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.AreaChart, { data: chartData, children: [(0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "time", fontSize: 10 }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { fontSize: 10 }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "cpu", stackId: "1", stroke: "var(--color-cpu)", fill: "var(--color-cpu)", fillOpacity: 0.6 }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "memory", stackId: "1", stroke: "var(--color-memory)", fill: "var(--color-memory)", fillOpacity: 0.6 })] }) }) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Tiempo de Respuesta" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Latencia promedio por minuto" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                                    responseTime: { label: 'Tiempo (ms)', color: 'hsl(var(--chart-3))' },
                                                }, className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: chartData, children: [(0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "time", fontSize: 10 }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { fontSize: 10 }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "responseTime", stroke: "var(--color-responseTime)", strokeWidth: 2, dot: false })] }) }) }) })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "performance", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "An\u00E1lisis de Rendimiento Detallado" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "M\u00E9tricas avanzadas del sistema" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: "Recursos del Sistema" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "CPU" }), (0, jsx_runtime_1.jsxs)("span", { children: [metrics.cpu, "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: metrics.cpu, className: "mt-1" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Memoria" }), (0, jsx_runtime_1.jsxs)("span", { children: [metrics.memory, "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: metrics.memory, className: "mt-1" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Disco" }), (0, jsx_runtime_1.jsxs)("span", { children: [metrics.disk, "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: metrics.disk, className: "mt-1" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { children: "Red" }), (0, jsx_runtime_1.jsxs)("span", { children: [metrics.network, "%"] })] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: metrics.network, className: "mt-1" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-2", children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                                        cpu: { label: 'CPU', color: 'hsl(var(--chart-1))' },
                                                        memory: { label: 'Memoria', color: 'hsl(var(--chart-2))' },
                                                        responseTime: { label: 'Respuesta', color: 'hsl(var(--chart-3))' },
                                                    }, className: "h-[250px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: chartData, children: [(0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "time", fontSize: 10 }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { fontSize: 10 }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "cpu", stroke: "var(--color-cpu)", strokeWidth: 2, dot: false }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "memory", stroke: "var(--color-memory)", strokeWidth: 2, dot: false })] }) }) }) })] }) })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "requests", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "An\u00E1lisis de Solicitudes" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Tr\u00E1fico y errores en tiempo real" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                            requests: { label: 'Solicitudes', color: 'hsl(var(--chart-1))' },
                                            errors: { label: 'Errores', color: 'hsl(var(--chart-4))' },
                                        }, className: "h-[400px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: chartData, children: [(0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "time", fontSize: 10 }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { fontSize: 10 }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "requests", fill: "var(--color-requests)" }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "errors", fill: "var(--color-errors)" })] }) }) }) })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "distribution", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Distribuci\u00F3n de Carga" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "An\u00E1lisis de uso por componente" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                                        value: { label: 'Porcentaje', color: 'hsl(var(--chart-1))' },
                                                    }, className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.PieChart, { children: [(0, jsx_runtime_1.jsx)(recharts_1.Pie, { data: realTimeData, cx: "50%", cy: "50%", labelLine: false, outerRadius: 80, fill: "#8884d8", dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, children: realTimeData.map((entry, index) => ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, {})] }) }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: "Desglose por Componente" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: realTimeData.map((item, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-3 w-3 rounded-full", style: { backgroundColor: COLORS[index % COLORS.length] } }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: item.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm font-medium", children: [item.value, "%"] })] }, item.name))) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 space-y-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { className: "w-full", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "mr-2 h-4 w-4" }), "Optimizar Rendimiento"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "w-full bg-transparent", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "mr-2 h-4 w-4" }), "Generar Reporte"] })] })] })] }) })] }) })] })] }));
}
//# sourceMappingURL=performance-dashboard.js.map