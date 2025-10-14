'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSystem = NotificationSystem;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
function NotificationSystem({ notifications, onRemove }) {
    (0, react_1.useEffect)(() => {
        notifications.forEach(notification => {
            const timer = setTimeout(() => {
                onRemove(notification.id);
            }, 5000);
            return () => clearTimeout(timer);
        });
    }, [notifications, onRemove]);
    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-5 w-5 text-green-600" });
            case 'warning':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-yellow-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "h-5 w-5 text-blue-600" });
        }
    };
    const getColors = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed right-4 top-4 z-50 space-y-2", children: (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: notifications.map(notification => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, x: 300, scale: 0.3 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }, className: `max-w-sm rounded-lg border p-4 shadow-lg ${getColors(notification.type)}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [getIcon(notification.type), (0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900", children: notification.message }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => onRemove(notification.id), className: "h-6 w-6 p-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }) }, notification.id))) }) }));
}
//# sourceMappingURL=notification-system.js.map