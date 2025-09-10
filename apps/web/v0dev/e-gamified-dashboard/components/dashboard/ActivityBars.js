'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActivityBars;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const INITIAL_ACTIVITIES = [
    {
        id: 'food',
        name: 'Actividades Alimenticias',
        value: 75,
        maxValue: 100,
        color: 'from-orange-400 to-red-500',
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Utensils, { className: "h-6 w-6" }),
        temperature: 75,
    },
    {
        id: 'ai',
        name: 'Actividades con IA',
        value: 60,
        maxValue: 100,
        color: 'from-blue-400 to-purple-500',
        icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Brain, { className: "h-6 w-6" }),
        temperature: 60,
    },
];
const UPDATE_INTERVAL = 3000;
const TEMPERATURE_MARKS = [25, 50, 75];
function ActivityBars() {
    const [activities, setActivities] = (0, react_1.useState)(INITIAL_ACTIVITIES);
    const timeoutRef = (0, react_1.useRef)(null);
    const mountedRef = (0, react_1.useRef)(true);
    // Función de actualización optimizada con useCallback
    const updateActivities = (0, react_1.useCallback)(() => {
        setActivities(prev => prev.map(activity => ({
            ...activity,
            value: Math.max(0, Math.min(100, activity.value + (Math.random() - 0.5) * 10)),
            temperature: Math.max(0, Math.min(100, activity.temperature + (Math.random() - 0.5) * 5)),
        })));
    }, []);
    // Función recursiva con setTimeout optimizada
    const scheduleNextUpdate = (0, react_1.useCallback)(() => {
        if (!mountedRef.current)
            return;
        timeoutRef.current = setTimeout(() => {
            if (!mountedRef.current)
                return;
            updateActivities();
            scheduleNextUpdate();
        }, UPDATE_INTERVAL);
    }, [updateActivities]);
    (0, react_1.useEffect)(() => {
        mountedRef.current = true;
        scheduleNextUpdate();
        return () => {
            mountedRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [scheduleNextUpdate]);
    // Funciones memoizadas para mejorar rendimiento
    const getTemperatureColor = (0, react_1.useCallback)((temp) => {
        if (temp < 30)
            return 'from-blue-400 to-cyan-500';
        if (temp < 60)
            return 'from-yellow-400 to-orange-500';
        return 'from-orange-500 to-red-600';
    }, []);
    const getTemperatureEmoji = (0, react_1.useCallback)((temp) => {
        if (temp < 30)
            return '🧊';
        if (temp < 60)
            return '🌡️';
        return '🔥';
    }, []);
    // Memoizar marcas de temperatura
    const temperatureMarks = (0, react_1.useMemo)(() => TEMPERATURE_MARKS, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border-4 border-emerald-400 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 shadow-2xl", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "flex items-center text-3xl font-bold text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-3 h-8 w-8 text-emerald-400" }), "Barras de Actividad"] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-emerald-200", children: "Term\u00F3metros gamificados de progreso" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-8", children: activities.map((activity, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { delay: index * 0.2 }, className: "rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { rotate: [0, 10, -10, 0] }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }, className: "text-white", children: activity.icon }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold text-white", children: activity.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-white", children: [Math.round(activity.value), "%"] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-emerald-200", children: "Completado" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative h-48 w-8 overflow-hidden rounded-full bg-gray-300", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 w-full rounded-full bg-gray-400", style: { height: '100%' } }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: `absolute bottom-0 w-full bg-gradient-to-t ${getTemperatureColor(activity.temperature)} rounded-full`, initial: { height: 0 }, animate: { height: `${activity.temperature}%` }, transition: { duration: 1.5, ease: 'easeOut' } }), (0, jsx_runtime_1.jsx)("div", { className: "absolute -bottom-2 left-1/2 h-12 w-12 -translate-x-1/2 transform rounded-full border-4 border-white bg-gradient-to-r from-red-500 to-orange-500 shadow-lg" }), temperatureMarks.map(mark => ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-0 h-0.5 w-2 bg-white", style: { bottom: `${mark}%` } }, mark)))] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { scale: [1, 1.1, 1] }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY }, className: "absolute -right-16 top-1/2 -translate-y-1/2 transform rounded-lg bg-white px-3 py-2 shadow-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl", children: getTemperatureEmoji(activity.temperature) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-lg font-bold text-gray-800", children: [Math.round(activity.temperature), "\u00B0"] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm text-white", children: [(0, jsx_runtime_1.jsx)("span", { children: "Progreso" }), (0, jsx_runtime_1.jsxs)("span", { children: [Math.round(activity.value), "/", activity.maxValue] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "h-6 w-full overflow-hidden rounded-full bg-white/20", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: `h-full bg-gradient-to-r ${activity.color} relative`, initial: { width: 0 }, animate: { width: `${(activity.value / activity.maxValue) * 100}%` }, transition: { duration: 1.5, ease: 'easeOut' }, children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent", animate: { x: ['-100%', '100%'] }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 } }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg bg-white/10 p-3 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-white", children: Math.round(activity.value * 0.8) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-emerald-200", children: "Puntos ganados" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg bg-white/10 p-3 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-white", children: Math.round(activity.value * 0.3) }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-emerald-200", children: "Logros desbloqueados" })] })] })] })] })] }, activity.id))) })] }));
}
//# sourceMappingURL=ActivityBars.js.map