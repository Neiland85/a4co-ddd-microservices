'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitoring = PerformanceMonitoring;
const jsx_runtime_1 = require("react/jsx-runtime");
const badge_1 = require("@/components/ui/badge");
const card_1 = require("@/components/ui/card");
const chart_1 = require("@/components/ui/chart");
const progress_1 = require("@/components/ui/progress");
const react_1 = require("react");
const recharts_1 = require("recharts");
const INITIAL_METRICS = {
    responseTime: 245,
    cpuUsage: 67,
    memoryUsage: 54,
    networkLatency: 12,
};
const DATA_POINTS_LIMIT = 20;
const UPDATE_INTERVAL = 3000;
function PerformanceMonitoring() {
    const [data, setData] = (0, react_1.useState)([]);
    const [currentMetrics, setCurrentMetrics] = (0, react_1.useState)(INITIAL_METRICS);
    const timeoutRef = (0, react_1.useRef)(null);
    const mountedRef = (0, react_1.useRef)(true);
    // Generador de datos optimizado con useCallback
    const generateInitialData = (0, react_1.useCallback)(() => {
        return Array.from({ length: DATA_POINTS_LIMIT }, (_, i) => ({
            time: new Date(Date.now() - (DATA_POINTS_LIMIT - 1 - i) * 60000).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            responseTime: Math.floor(Math.random() * 100 + 200),
            cpuUsage: Math.floor(Math.random() * 30 + 50),
            memoryUsage: Math.floor(Math.random() * 20 + 40),
        }));
    }, []);
    // Generador de punto de datos optimizado con useCallback
    const generateDataPoint = (0, react_1.useCallback)(() => ({
        time: new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        }),
        responseTime: Math.floor(Math.random() * 100 + 200),
        cpuUsage: Math.floor(Math.random() * 30 + 50),
        memoryUsage: Math.floor(Math.random() * 20 + 40),
    }), []);
    // Función recursiva con setTimeout optimizada
    const scheduleNextUpdate = (0, react_1.useCallback)(() => {
        if (!mountedRef.current)
            return;
        timeoutRef.current = setTimeout(() => {
            if (!mountedRef.current)
                return;
            const newPoint = generateDataPoint();
            setData(prev => [...prev.slice(1), newPoint]);
            setCurrentMetrics({
                responseTime: newPoint.responseTime,
                cpuUsage: newPoint.cpuUsage,
                memoryUsage: newPoint.memoryUsage,
                networkLatency: Math.floor(Math.random() * 10 + 8),
            });
            scheduleNextUpdate();
        }, UPDATE_INTERVAL);
    }, [generateDataPoint]);
    (0, react_1.useEffect)(() => {
        mountedRef.current = true;
        setData(generateInitialData());
        scheduleNextUpdate();
        return () => {
            mountedRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [generateInitialData, scheduleNextUpdate]);
    // Función de estado de badge memoizada
    const getStatusBadge = (0, react_1.useCallback)((value, thresholds) => {
        if (value >= thresholds.critical)
            return (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "destructive", children: "Cr\u00EDtico" });
        if (value >= thresholds.warning)
            return (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", children: "Advertencia" });
        return ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "default", className: "bg-green-500", children: "Normal" }));
    }, []);
    // Thresholds memoizados
    const cpuThresholds = (0, react_1.useMemo)(() => ({ warning: 70, critical: 85 }), []);
    const memoryThresholds = (0, react_1.useMemo)(() => ({ warning: 75, critical: 90 }), []);
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "col-span-1", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: ["Monitoreo de Rendimiento", (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", children: "Tiempo Real" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "M\u00E9tricas clave del sistema actualizadas cada 3 segundos" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "CPU" }), getStatusBadge(currentMetrics.cpuUsage, cpuThresholds)] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: currentMetrics.cpuUsage, className: "h-2" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-muted-foreground text-xs", children: [currentMetrics.cpuUsage, "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Memoria" }), getStatusBadge(currentMetrics.memoryUsage, memoryThresholds)] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: currentMetrics.memoryUsage, className: "h-2" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-muted-foreground text-xs", children: [currentMetrics.memoryUsage, "%"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground", children: "Tiempo de Respuesta" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-lg font-semibold", children: [currentMetrics.responseTime, "ms"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground", children: "Latencia de Red" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-lg font-semibold", children: [currentMetrics.networkLatency, "ms"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-[200px]", children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                responseTime: {
                                    label: 'Tiempo de Respuesta (ms)',
                                    color: 'hsl(var(--chart-1))',
                                },
                                cpuUsage: {
                                    label: 'Uso CPU (%)',
                                    color: 'hsl(var(--chart-2))',
                                },
                            }, className: "h-full", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: data, children: [(0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "time", fontSize: 10, tickLine: false, axisLine: false }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { fontSize: 10, tickLine: false, axisLine: false }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "responseTime", stroke: "var(--color-responseTime)", strokeWidth: 2, dot: false }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "cpuUsage", stroke: "var(--color-cpuUsage)", strokeWidth: 2, dot: false })] }) }) }) })] })] }));
}
//# sourceMappingURL=performance-monitoring.js.map