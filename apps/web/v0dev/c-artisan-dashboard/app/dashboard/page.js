'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const header_1 = require("@/components/dashboard/header");
const user_settings_1 = require("@/components/dashboard/user-settings");
const activity_monitor_1 = require("@/components/dashboard/activity-monitor");
const interactive_recommendations_1 = require("@/components/dashboard/interactive-recommendations");
const comments_and_ratings_1 = require("@/components/dashboard/comments-and-ratings");
const footer_1 = require("@/components/dashboard/footer");
const notification_system_1 = require("@/components/dashboard/notification-system");
const animated_circles_1 = require("@/components/dashboard/animated-circles");
const use_section_transition_1 = require("@/hooks/use-section-transition");
const use_dashboard_metrics_1 = require("@/hooks/use-dashboard-metrics");
function Dashboard() {
    const [activeSection, setActiveSection] = (0, react_1.useState)('monitor');
    const [notifications, setNotifications] = (0, react_1.useState)([]);
    const { isTransitioning } = (0, use_section_transition_1.useSectionTransition)(activeSection);
    const metrics = (0, use_dashboard_metrics_1.useDashboardMetrics)();
    // Simulación de notificaciones basadas en métricas
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            const messages = [];
            // Notificaciones basadas en métricas del monitor
            if (metrics.monitor.activityLevel === 'critical') {
                messages.push({
                    message: `¡Actividad crítica! ${metrics.monitor.activeUsers} usuarios activos`,
                    type: 'warning',
                });
            }
            // Notificaciones basadas en recomendaciones
            if (metrics.recommendations.campaignActivity === 'peak') {
                messages.push({
                    message: `Campaña en pico: ${metrics.recommendations.sentOffers} ofertas enviadas`,
                    type: 'success',
                });
            }
            // Notificaciones basadas en comentarios
            if (metrics.comments.sentiment === 'excellent') {
                messages.push({
                    message: `Excelente feedback: ${metrics.comments.averageRating.toFixed(1)} estrellas promedio`,
                    type: 'success',
                });
            }
            else if (metrics.comments.sentiment === 'negative') {
                messages.push({
                    message: `Atención: Rating bajo ${metrics.comments.averageRating.toFixed(1)} estrellas`,
                    type: 'warning',
                });
            }
            // Notificaciones basadas en configuración del sistema
            if (metrics.settings.stabilityIndex === 'unstable') {
                messages.push({
                    message: `Sistema inestable: ${metrics.settings.systemHealth}% de salud`,
                    type: 'warning',
                });
            }
            if (messages.length > 0) {
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                setNotifications(prev => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        ...randomMessage,
                    },
                ]);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [metrics]);
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative flex min-h-screen flex-col", children: [(0, jsx_runtime_1.jsx)(animated_circles_1.AnimatedCircles, { activeSection: activeSection, metrics: metrics }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: isTransitioning && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 0.1 }, exit: { opacity: 0 }, transition: { duration: 0.4 }, className: "z-5 pointer-events-none fixed inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" })) }), (0, jsx_runtime_1.jsx)(header_1.Header, { activeSection: activeSection, setActiveSection: setActiveSection, metrics: metrics }), (0, jsx_runtime_1.jsx)("main", { className: "container relative z-10 mx-auto flex-1 px-4 py-8", children: (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { mode: "wait", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.95 }, transition: {
                            duration: 0.6,
                            ease: 'easeOut',
                            scale: { duration: 0.4 },
                        }, className: "space-y-8", children: [activeSection === 'settings' && (0, jsx_runtime_1.jsx)(user_settings_1.UserSettings, { metrics: metrics.settings }), activeSection === 'monitor' && (0, jsx_runtime_1.jsx)(activity_monitor_1.ActivityMonitor, { metrics: metrics.monitor }), activeSection === 'recommendations' && ((0, jsx_runtime_1.jsx)(interactive_recommendations_1.InteractiveRecommendations, { metrics: metrics.recommendations })), activeSection === 'comments' && (0, jsx_runtime_1.jsx)(comments_and_ratings_1.CommentsAndRatings, { metrics: metrics.comments })] }, activeSection) }) }), (0, jsx_runtime_1.jsx)(footer_1.Footer, {}), (0, jsx_runtime_1.jsx)(notification_system_1.NotificationSystem, { notifications: notifications, onRemove: removeNotification })] }));
}
//# sourceMappingURL=page.js.map