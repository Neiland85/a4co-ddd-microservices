'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsOverview = MetricsOverview;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
function MetricsOverview() {
    const [metrics, setMetrics] = (0, react_1.useState)([
        {
            title: 'Usuarios Activos',
            value: '2,847',
            change: 12.5,
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-4 w-4" }),
            status: 'up',
        },
        {
            title: 'Tiempo de Respuesta',
            value: '245ms',
            change: -8.2,
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4" }),
            status: 'up',
        },
        {
            title: 'Uso del Servidor',
            value: '67%',
            change: 3.1,
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Server, { className: "h-4 w-4" }),
            status: 'stable',
        },
        {
            title: 'Alertas de Seguridad',
            value: '3',
            change: -50,
            icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4" }),
            status: 'up',
        },
    ]);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            setMetrics(prev => prev.map(metric => ({
                ...metric,
                value: metric.title === 'Usuarios Activos'
                    ? `${Math.floor(Math.random() * 1000 + 2500)}`
                    : metric.title === 'Tiempo de Respuesta'
                        ? `${Math.floor(Math.random() * 100 + 200)}ms`
                        : metric.title === 'Uso del Servidor'
                            ? `${Math.floor(Math.random() * 30 + 50)}%`
                            : metric.value,
                change: Math.random() * 20 - 10,
            })));
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    const getTrendIcon = (status, change) => {
        if (Math.abs(change) < 1)
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Minus, { className: "h-3 w-3" });
        return change > 0 ? (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-3 w-3" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "h-3 w-3" });
    };
    const getTrendColor = (status, change) => {
        if (Math.abs(change) < 1)
            return 'text-muted-foreground';
        if (status === 'up')
            return change > 0 ? 'text-green-600' : 'text-red-600';
        return change > 0 ? 'text-red-600' : 'text-green-600';
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: metrics.map((metric, index) => ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: metric.title }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground", children: metric.icon })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: metric.value }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1 text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: getTrendColor(metric.status, metric.change), children: getTrendIcon(metric.status, metric.change) }), (0, jsx_runtime_1.jsxs)("span", { className: getTrendColor(metric.status, metric.change), children: [Math.abs(metric.change).toFixed(1), "%"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground", children: "vs \u00FAltimo per\u00EDodo" })] })] })] }, index))) }));
}
//# sourceMappingURL=metrics-overview.js.map