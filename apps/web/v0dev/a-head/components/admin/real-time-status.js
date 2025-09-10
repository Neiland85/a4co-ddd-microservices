'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeStatus = RealTimeStatus;
const jsx_runtime_1 = require("react/jsx-runtime");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const use_websocket_1 = require("@/hooks/use-websocket");
function RealTimeStatus() {
    const { connectionStatus, connect, disconnect } = (0, use_websocket_1.useWebSocket)();
    const getStatusIcon = () => {
        if (connectionStatus.isConnected) {
            return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" });
        }
        else if (connectionStatus.error) {
            return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4 text-red-600" });
        }
        else {
            return (0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "h-4 w-4 text-yellow-600" });
        }
    };
    const getStatusText = () => {
        if (connectionStatus.isConnected) {
            return 'Conectado';
        }
        else if (connectionStatus.error) {
            return 'Error de conexión';
        }
        else {
            return 'Desconectado';
        }
    };
    const getStatusColor = () => {
        if (connectionStatus.isConnected) {
            return 'bg-green-100 text-green-800';
        }
        else if (connectionStatus.error) {
            return 'bg-red-100 text-red-800';
        }
        else {
            return 'bg-yellow-100 text-yellow-800';
        }
    };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-5 w-5 text-blue-600" }), "Estado de Conexi\u00F3n en Tiempo Real"] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [getStatusIcon(), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-gray-900", children: getStatusText() }), connectionStatus.lastConnected && ((0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: ["\u00DAltima conexi\u00F3n: ", connectionStatus.lastConnected.toLocaleTimeString()] }))] })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: getStatusColor(), children: connectionStatus.isConnected ? 'Online' : 'Offline' })] }), connectionStatus.error && ((0, jsx_runtime_1.jsx)("div", { className: "rounded-md border border-red-200 bg-red-50 p-3", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: connectionStatus.error }) })), connectionStatus.reconnectAttempts > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "rounded-md border border-yellow-200 bg-yellow-50 p-3", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-yellow-700", children: ["Intentos de reconexi\u00F3n: ", connectionStatus.reconnectAttempts] }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [connectionStatus.isConnected ? ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: disconnect, className: "border-red-200 bg-transparent text-red-600 hover:bg-red-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "mr-2 h-4 w-4" }), "Desconectar"] })) : ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: connect, className: "border-green-200 bg-transparent text-green-600 hover:bg-green-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { className: "mr-2 h-4 w-4" }), "Conectar"] })), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: () => window.location.reload(), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "mr-2 h-4 w-4" }), "Actualizar"] })] })] })] }));
}
//# sourceMappingURL=real-time-status.js.map