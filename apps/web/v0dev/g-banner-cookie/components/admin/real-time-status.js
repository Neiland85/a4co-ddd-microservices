'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RealTimeStatus;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const use_websocket_1 = require("../../hooks/use-websocket");
function RealTimeStatus({ className, showDetails = false }) {
    const { connectionStatus, disconnect, isConnected } = (0, use_websocket_1.useWebSocket)();
    const [lastActivity, setLastActivity] = (0, react_1.useState)(new Date());
    (0, react_1.useEffect)(() => {
        if (isConnected) {
            setLastActivity(new Date());
        }
    }, [isConnected]);
    const getStatusColor = () => {
        if (connectionStatus.connected)
            return 'text-green-600';
        if (connectionStatus.reconnecting)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    const getStatusBadgeVariant = () => {
        if (connectionStatus.connected)
            return 'default';
        if (connectionStatus.reconnecting)
            return 'secondary';
        return 'destructive';
    };
    const getStatusIcon = () => {
        if (connectionStatus.connected)
            return lucide_react_1.CheckCircle;
        if (connectionStatus.reconnecting)
            return lucide_react_1.RefreshCw;
        return lucide_react_1.AlertCircle;
    };
    const getStatusText = () => {
        if (connectionStatus.connected)
            return 'Conectado';
        if (connectionStatus.reconnecting)
            return 'Reconectando...';
        return 'Desconectado';
    };
    const StatusIcon = getStatusIcon();
    if (!showDetails) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)('flex items-center space-x-2', className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('h-2 w-2 rounded-full', {
                                'animate-pulse bg-green-500': connectionStatus.connected,
                                'animate-pulse bg-yellow-500': connectionStatus.reconnecting,
                                'bg-red-500': !connectionStatus.connected && !connectionStatus.reconnecting,
                            }) }), (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)('text-sm font-medium', getStatusColor()), children: getStatusText() })] }), connectionStatus.connected && ((0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 animate-pulse text-green-600" }))] }));
    }
    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: (0, utils_1.cn)('shadow-natural-md', className), children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('rounded-lg p-2', {
                                        'bg-green-50': connectionStatus.connected,
                                        'bg-yellow-50': connectionStatus.reconnecting,
                                        'bg-red-50': !connectionStatus.connected && !connectionStatus.reconnecting,
                                    }), children: (0, jsx_runtime_1.jsx)(StatusIcon, { className: (0, utils_1.cn)('h-5 w-5', getStatusColor(), {
                                            'animate-spin': connectionStatus.reconnecting,
                                        }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Estado de Conexi\u00F3n" }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getStatusBadgeVariant(), children: getStatusText() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 flex items-center space-x-4 text-sm text-gray-600", children: [connectionStatus.connected && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsx)("span", { children: "Tiempo real activo" })] })), connectionStatus.lastConnected && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsxs)("span", { children: ["\u00DAltima conexi\u00F3n: ", connectionStatus.lastConnected.toLocaleTimeString()] })] })), connectionStatus.reconnectAttempts > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "h-3 w-3" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Intentos: ", connectionStatus.reconnectAttempts] })] }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [connectionStatus.connected && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1 text-green-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 animate-pulse" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Live" })] })), connectionStatus.error && ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: () => window.location.reload(), className: "border-red-200 text-red-600 hover:bg-red-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "mr-1 h-3 w-3" }), "Reintentar"] }))] })] }), connectionStatus.error && ((0, jsx_runtime_1.jsx)("div", { className: "mt-3 rounded-md border border-red-200 bg-red-50 p-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4 text-red-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-red-700", children: connectionStatus.error })] }) }))] }) }));
}
//# sourceMappingURL=real-time-status.js.map