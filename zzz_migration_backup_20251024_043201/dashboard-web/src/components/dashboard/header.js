'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = Header;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
function Header({ activeSection, setActiveSection, metrics }) {
    const navItems = [
        {
            id: 'monitor',
            label: 'Monitor',
            icon: lucide_react_1.BarChart3,
            status: metrics.monitor.activityLevel,
            indicator: metrics.monitor.activityLevel === 'critical'
                ? 'critical'
                : metrics.monitor.activityLevel === 'high'
                    ? 'high'
                    : 'normal',
        },
        {
            id: 'settings',
            label: 'Configuración',
            icon: lucide_react_1.Settings,
            status: metrics.settings.stabilityIndex,
            indicator: metrics.settings.stabilityIndex === 'unstable'
                ? 'critical'
                : metrics.settings.stabilityIndex === 'stable'
                    ? 'normal'
                    : 'optimal',
        },
        {
            id: 'recommendations',
            label: 'Recomendaciones',
            icon: lucide_react_1.Zap,
            status: metrics.recommendations.campaignActivity,
            indicator: metrics.recommendations.campaignActivity === 'peak'
                ? 'high'
                : metrics.recommendations.campaignActivity === 'high'
                    ? 'normal'
                    : 'low',
        },
        {
            id: 'comments',
            label: 'Comentarios',
            icon: lucide_react_1.MessageSquare,
            status: metrics.comments.sentiment,
            indicator: metrics.comments.sentiment === 'excellent'
                ? 'optimal'
                : metrics.comments.sentiment === 'positive'
                    ? 'normal'
                    : metrics.comments.sentiment === 'negative'
                        ? 'critical'
                        : 'low',
        },
    ];
    const getIndicatorColor = (indicator) => {
        switch (indicator) {
            case 'critical':
                return 'bg-red-500';
            case 'high':
                return 'bg-orange-500';
            case 'normal':
                return 'bg-blue-500';
            case 'optimal':
                return 'bg-green-500';
            case 'low':
                return 'bg-gray-400';
            default:
                return 'bg-gray-400';
        }
    };
    const getTotalNotifications = () => {
        let count = 0;
        if (metrics.monitor.activityLevel === 'critical')
            count++;
        if (metrics.recommendations.campaignActivity === 'peak')
            count++;
        if (metrics.comments.sentiment === 'negative')
            count++;
        if (metrics.settings.stabilityIndex === 'unstable')
            count++;
        return Math.max(3, count); // Mínimo 3 para demo
    };
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.header, { initial: { y: -100 }, animate: { y: 0 }, transition: { duration: 0.6, ease: 'easeOut' }, className: "relative sticky top-0 z-50 overflow-hidden border-b border-slate-200/50 bg-white/70 backdrop-blur-md", children: [(0, jsx_runtime_1.jsxs)("div", { className: "pointer-events-none absolute inset-0 opacity-5", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute right-0 top-0 h-32 w-32 bg-gradient-to-bl from-yellow-600/40 to-transparent", animate: {
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1 + metrics.monitor.activeUsers / 5000, 1],
                        }, transition: {
                            duration: 4,
                            repeat: Number.POSITIVE_INFINITY,
                        } }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute bottom-0 left-0 h-24 w-24 bg-gradient-to-tr from-fuchsia-500/30 to-transparent", animate: {
                            opacity: [0.2, 0.5, 0.2],
                            rotate: [0, 360],
                        }, transition: {
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                        } })] }), (0, jsx_runtime_1.jsx)("div", { className: "container relative z-10 mx-auto px-4 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-4", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, className: "relative rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-bold text-white", children: ["A4CO Dashboard", (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: `absolute -right-1 -top-1 h-3 w-3 rounded-full ${metrics.monitor.activityLevel === 'critical'
                                            ? 'bg-red-500'
                                            : metrics.monitor.activityLevel === 'high'
                                                ? 'bg-orange-500'
                                                : 'bg-green-500'}`, animate: {
                                            scale: [1, 1.3, 1],
                                            opacity: [0.7, 1, 0.7],
                                        }, transition: {
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                        } })] }) }), (0, jsx_runtime_1.jsx)("nav", { className: "hidden items-center space-x-2 md:flex", children: navItems.map(item => {
                                const Icon = item.icon;
                                return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: activeSection === item.id ? 'default' : 'ghost', onClick: () => setActiveSection(item.id), className: "relative flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: item.label }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: `h-2 w-2 rounded-full ${getIndicatorColor(item.indicator)}`, animate: {
                                                    scale: item.indicator === 'critical' ? [1, 1.5, 1] : [1, 1.2, 1],
                                                    opacity: [0.6, 1, 0.6],
                                                }, transition: {
                                                    duration: item.indicator === 'critical' ? 1 : 3,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                } })] }) }, item.id));
                            }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [metrics.monitor.activityLevel === 'critical' && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "flex items-center space-x-1 text-sm text-red-600", animate: { opacity: [0.7, 1, 0.7] }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: metrics.monitor.activeUsers })] })), metrics.recommendations.campaignActivity === 'peak' && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "flex items-center space-x-1 text-sm text-orange-600", animate: { opacity: [0.8, 1, 0.8] }, transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: metrics.recommendations.sentOffers })] })), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.1 }, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "icon", className: "relative bg-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: 'spring', stiffness: 500, damping: 30 }, children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "absolute -right-2 -top-2 h-5 min-w-5 px-1", children: getTotalNotifications() }) }, getTotalNotifications())] }) })] })] }) })] }));
}
//# sourceMappingURL=header.js.map