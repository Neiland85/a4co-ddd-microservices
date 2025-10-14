'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSystem = NotificationSystem;
const jsx_runtime_1 = require("react/jsx-runtime");
const alert_1 = require("@/components/ui/alert");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const NOTIFICATION_TEMPLATES = [
    {
        type: 'warning',
        title: 'Alto uso de CPU',
        message: 'El servidor está experimentando un alto uso de CPU (85%)',
    },
    {
        type: 'error',
        title: 'Error de conexión',
        message: 'Falló la conexión con el servicio de autenticación',
    },
    {
        type: 'info',
        title: 'Actualización disponible',
        message: 'Nueva versión del sistema disponible (v2.1.3)',
    },
    {
        type: 'success',
        title: 'Backup completado',
        message: 'El backup automático se completó exitosamente',
    },
];
function NotificationSystem() {
    const [notifications, setNotifications] = (0, react_1.useState)([]);
    const [connectionStatus, setConnectionStatus] = (0, react_1.useState)('online');
    const addNotification = (0, react_1.useCallback)((notification) => {
        const newNotification = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Mantener solo 5 notificaciones
        // Auto-remove non-persistent notifications
        if (!notification.persistent) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
            }, 5000);
        }
    }, []);
    const removeNotification = (0, react_1.useCallback)((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);
    // Optimized notification simulation
    (0, react_1.useEffect)(() => {
        let timeoutId;
        const scheduleNextNotification = () => {
            // Random delay between 10-30 seconds
            const delay = Math.random() * 20000 + 10000;
            timeoutId = setTimeout(() => {
                if (Math.random() < 0.3) {
                    // 30% chance
                    const template = NOTIFICATION_TEMPLATES[Math.floor(Math.random() * NOTIFICATION_TEMPLATES.length)];
                    addNotification(template);
                }
                scheduleNextNotification();
            }, delay);
        };
        scheduleNextNotification();
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [addNotification]);
    // Connection status simulation
    (0, react_1.useEffect)(() => {
        let connectivityTimeoutId;
        const scheduleConnectivityChange = () => {
            const delay = Math.random() * 30000 + 20000; // 20-50 seconds
            connectivityTimeoutId = setTimeout(() => {
                if (Math.random() < 0.1) {
                    // 10% chance
                    const newStatus = connectionStatus === 'online' ? 'offline' : 'online';
                    setConnectionStatus(newStatus);
                    addNotification({
                        type: newStatus === 'online' ? 'success' : 'error',
                        title: newStatus === 'online' ? 'Conexión restaurada' : 'Conexión perdida',
                        message: newStatus === 'online'
                            ? 'La conexión con los servicios se ha restaurado'
                            : 'Se perdió la conexión con los servicios principales',
                        persistent: newStatus === 'offline',
                    });
                }
                scheduleConnectivityChange();
            }, delay);
        };
        scheduleConnectivityChange();
        return () => {
            if (connectivityTimeoutId) {
                clearTimeout(connectivityTimeoutId);
            }
        };
    }, [connectionStatus, addNotification]);
    const notificationIcon = (0, react_1.useMemo)(() => ({
        error: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" }),
        warning: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" }),
        info: (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "h-4 w-4" }),
        success: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }),
    }), []);
    const notificationColors = (0, react_1.useMemo)(() => ({
        error: 'border-red-500 bg-red-50 dark:bg-red-950',
        warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
        info: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
        success: 'border-green-500 bg-green-50 dark:bg-green-950',
    }), []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed right-4 top-16 z-40", children: (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: connectionStatus === 'online' ? 'default' : 'destructive', className: "flex items-center space-x-1", children: [connectionStatus === 'online' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { className: "h-3 w-3" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "h-3 w-3" })), (0, jsx_runtime_1.jsx)("span", { children: connectionStatus === 'online' ? 'En línea' : 'Sin conexión' })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "fixed right-4 top-20 z-50 w-80 space-y-2", children: notifications.map(notification => ((0, jsx_runtime_1.jsx)(alert_1.Alert, { className: `relative border-l-4 ${notificationColors[notification.type]} transition-all duration-300 ease-in-out`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "mt-0.5 flex-shrink-0", children: notificationIcon[notification.type] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-grow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-semibold", children: notification.title }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "h-6 w-6 p-0 hover:bg-transparent", onClick: () => removeNotification(notification.id), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3" }) })] }), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { className: "mt-1 text-xs", children: notification.message }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: notification.timestamp.toLocaleTimeString() }), notification.action && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", className: "h-6 text-xs", onClick: notification.action.onClick, children: notification.action.label }))] })] })] }) }, notification.id))) })] }));
}
//# sourceMappingURL=notification-system.js.map