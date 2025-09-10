'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeActivity = RealTimeActivity;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const scroll_area_1 = require("@/components/ui/scroll-area");
const lucide_react_1 = require("lucide-react");
const use_websocket_1 = require("@/hooks/use-websocket");
function RealTimeActivity() {
    const { notifications, clearNotifications, removeNotification } = (0, use_websocket_1.useWebSocketNotifications)();
    const [activities, setActivities] = (0, react_1.useState)([]);
    // Simulate real-time activities for demo
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            const mockActivities = [
                {
                    id: Math.random().toString(),
                    type: 'notification',
                    data: {
                        title: 'Nuevo pedido',
                        message: 'Pedido #1234 recibido de María García',
                        severity: 'info',
                        icon: 'ShoppingCart',
                    },
                    timestamp: new Date(),
                },
                {
                    id: Math.random().toString(),
                    type: 'notification',
                    data: {
                        title: 'Producto agotado',
                        message: 'Aceite de Oliva Virgen Extra sin stock',
                        severity: 'warning',
                        icon: 'Package',
                    },
                    timestamp: new Date(),
                },
                {
                    id: Math.random().toString(),
                    type: 'notification',
                    data: {
                        title: 'Nuevo usuario',
                        message: 'Carlos López se ha registrado',
                        severity: 'success',
                        icon: 'User',
                    },
                    timestamp: new Date(),
                },
            ];
            const randomActivity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
            setActivities(prev => [randomActivity, ...prev.slice(0, 19)]); // Keep last 20
        }, 10000); // Every 10 seconds
        return () => clearInterval(interval);
    }, []);
    const getActivityIcon = (iconName, severity) => {
        const iconProps = {
            className: `w-4 h-4 ${severity === 'error'
                ? 'text-red-600'
                : severity === 'warning'
                    ? 'text-yellow-600'
                    : severity === 'success'
                        ? 'text-green-600'
                        : 'text-blue-600'}`,
        };
        switch (iconName) {
            case 'ShoppingCart':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.ShoppingCart, { ...iconProps });
            case 'Package':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Package, { ...iconProps });
            case 'User':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.User, { ...iconProps });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { ...iconProps });
        }
    };
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'error':
                return 'bg-red-100 text-red-800';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800';
            case 'success':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };
    const allActivities = [...notifications, ...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "h-5 w-5 text-orange-600" }), "Actividad en Tiempo Real", allActivities.length > 0 && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "bg-orange-100 text-orange-800", children: allActivities.length }))] }), allActivities.length > 0 && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: clearNotifications, className: "text-gray-600 hover:text-gray-900", children: "Limpiar todo" }))] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(scroll_area_1.ScrollArea, { className: "h-96", children: allActivities.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "py-8 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "mx-auto mb-4 h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "No hay actividad reciente" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: allActivities.map(activity => ((0, jsx_runtime_1.jsxs)("div", { className: "group flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("div", { className: "mt-0.5 flex-shrink-0", children: getActivityIcon(activity.data.icon || 'Bell', activity.data.severity) }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900", children: activity.data.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: activity.data.message })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { className: getSeverityColor(activity.data.severity), children: activity.data.severity }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => removeNotification(activity.id), className: "opacity-0 transition-opacity group-hover:opacity-100", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3" }) })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-xs text-gray-500", children: new Date(activity.timestamp).toLocaleTimeString() })] })] }, activity.id))) })) }) })] }));
}
//# sourceMappingURL=real-time-activity.js.map