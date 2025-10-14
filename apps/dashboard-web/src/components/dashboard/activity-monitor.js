'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityMonitor = ActivityMonitor;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const chart_1 = require("@/components/ui/chart");
const recharts_1 = require("recharts");
const lucide_react_1 = require("lucide-react");
const section_circles_1 = require("./section-circles");
const metrics_to_animation_1 = require("@/utils/metrics-to-animation");
function ActivityMonitor({ metrics }) {
    // Datos para gráficos
    const visitorData = [
        { time: '00:00', users: 120 },
        { time: '04:00', users: 89 },
        { time: '08:00', users: 234 },
        { time: '12:00', users: 456 },
        { time: '16:00', users: 378 },
        { time: '20:00', users: 289 },
    ];
    const locationData = [
        { country: 'España', users: 450, color: '#3b82f6' },
        { country: 'México', users: 320, color: '#8b5cf6' },
        { country: 'Argentina', users: 280, color: '#06b6d4' },
        { country: 'Colombia', users: 197, color: '#10b981' },
    ];
    const productData = [
        { product: 'iPhone 15', clicks: 1234 },
        { product: 'MacBook Pro', clicks: 987 },
        { product: 'iPad Air', clicks: 756 },
        { product: 'Apple Watch', clicks: 543 },
        { product: 'AirPods Pro', clicks: 432 },
    ];
    const statsCards = [
        {
            title: 'Usuarios Activos',
            value: metrics.activeUsers.toLocaleString(),
            icon: lucide_react_1.Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Visitas Totales',
            value: metrics.totalVisits.toLocaleString(),
            icon: lucide_react_1.TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Tasa de Clics',
            value: `${metrics.clickRate.toFixed(1)}%`,
            icon: lucide_react_1.MousePointer,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Conversión',
            value: `${metrics.conversionRate.toFixed(1)}%`,
            icon: lucide_react_1.MapPin,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];
    const animationParams = (0, metrics_to_animation_1.getMonitorAnimationParams)(metrics);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative space-y-6", children: [(0, jsx_runtime_1.jsx)(section_circles_1.SectionCircles, { section: "monitor", animationParams: animationParams, metrics: { monitor: metrics } }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "relative z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-2 text-3xl font-bold text-gray-900", children: "Monitor de Actividad" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: metrics.activityLevel === 'critical'
                                    ? 'destructive'
                                    : metrics.activityLevel === 'high'
                                        ? 'secondary'
                                        : 'outline', children: metrics.activityLevel === 'critical'
                                    ? 'Crítico'
                                    : metrics.activityLevel === 'high'
                                        ? 'Alto'
                                        : metrics.activityLevel === 'medium'
                                            ? 'Medio'
                                            : 'Bajo' })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Estad\u00EDsticas en tiempo real de tu plataforma" })] }), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4", children: statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, whileHover: {
                            scale: 1.05,
                            y: -5,
                            transition: { duration: 0.2 },
                        }, transition: { duration: 0.5, delay: index * 0.1 }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none absolute inset-0 opacity-5", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute right-0 top-0 h-16 w-16 rounded-full bg-gradient-to-bl from-blue-500/60 to-transparent", animate: {
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0.8, 0.5],
                                        }, transition: {
                                            duration: 3,
                                            repeat: Number.POSITIVE_INFINITY,
                                            delay: index * 0.5,
                                        } }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "relative z-10 p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-600", children: stat.title }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { className: "text-2xl font-bold text-gray-900", initial: { scale: 1.1 }, animate: { scale: 1 }, transition: { duration: 0.3 }, children: stat.value }, stat.value)] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: `rounded-full p-3 ${stat.bgColor}`, whileHover: { rotate: 360 }, transition: { duration: 0.5 }, children: (0, jsx_runtime_1.jsx)(Icon, { className: `h-6 w-6 ${stat.color}` }) })] }) })] }) }, stat.title));
                }) }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6 }, whileHover: { scale: 1.02 }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "opacity-3 pointer-events-none absolute inset-0", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-blue-600/30 via-transparent to-cyan-500/20", animate: {
                                            opacity: [0.3, 0.6, 0.3],
                                        }, transition: {
                                            duration: 4,
                                            repeat: Number.POSITIVE_INFINITY,
                                        } }) }), (0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Visitantes por Hora" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Actividad de usuarios durante el d\u00EDa" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                            users: {
                                                label: 'Usuarios',
                                                color: 'hsl(var(--chart-1))',
                                            },
                                        }, className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.AreaChart, { data: visitorData, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "time" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "users", stroke: "var(--color-users)", fill: "var(--color-users)", fillOpacity: 0.3 })] }) }) }) })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6 }, whileHover: { scale: 1.02 }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "opacity-3 pointer-events-none absolute inset-0", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute bottom-0 right-0 h-2 w-full bg-gradient-to-l from-purple-500/25 via-transparent to-pink-400/15", animate: {
                                            opacity: [0.3, 0.6, 0.3],
                                        }, transition: {
                                            duration: 4,
                                            repeat: Number.POSITIVE_INFINITY,
                                            delay: 2,
                                        } }) }), (0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Usuarios por Ubicaci\u00F3n" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Distribuci\u00F3n geogr\u00E1fica de visitantes" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                            users: {
                                                label: 'Usuarios',
                                                color: 'hsl(var(--chart-2))',
                                            },
                                        }, className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.PieChart, { children: [(0, jsx_runtime_1.jsx)(recharts_1.Pie, { data: locationData, cx: "50%", cy: "50%", outerRadius: 80, dataKey: "users", label: ({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`, children: locationData.map((entry, index) => ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: entry.color }, `cell-${index}`))) }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) })] }) }) }) })] }) })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.2 }, whileHover: { scale: 1.01 }, className: "relative z-10", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "relative overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "opacity-3 pointer-events-none absolute inset-0", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-cyan-600/30 via-transparent to-blue-500/20", animate: {
                                    opacity: [0.3, 0.6, 0.3],
                                    x: ['-100%', '100%', '-100%'],
                                }, transition: {
                                    duration: 8,
                                    repeat: Number.POSITIVE_INFINITY,
                                } }) }), (0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Productos M\u00E1s Clicados" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Ranking de productos por n\u00FAmero de clics" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                    clicks: {
                                        label: 'Clics',
                                        color: 'hsl(var(--chart-3))',
                                    },
                                }, className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: productData, layout: "horizontal", children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { type: "number" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { dataKey: "product", type: "category", width: 100 }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "clicks", fill: "var(--color-clicks)", radius: [0, 4, 4, 0] })] }) }) }) })] }) })] }));
}
//# sourceMappingURL=activity-monitor.js.map