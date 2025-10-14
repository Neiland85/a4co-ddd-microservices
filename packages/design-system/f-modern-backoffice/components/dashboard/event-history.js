'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHistory = EventHistory;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const lucide_react_1 = require("lucide-react");
function EventHistory() {
    const [events, setEvents] = (0, react_1.useState)([
        {
            id: '1',
            type: 'error',
            title: 'Error de conexión a base de datos',
            description: 'Timeout al conectar con PostgreSQL',
            timestamp: new Date(Date.now() - 300000),
            details: { database: 'main', timeout: '30s' },
        },
        {
            id: '2',
            type: 'security',
            title: 'Intento de acceso no autorizado',
            description: 'Múltiples intentos fallidos de login',
            timestamp: new Date(Date.now() - 600000),
            user: 'usuario_sospechoso',
            ip: '192.168.1.100',
        },
        {
            id: '3',
            type: 'config',
            title: 'Configuración actualizada',
            description: 'Límites de rate limiting modificados',
            timestamp: new Date(Date.now() - 900000),
            user: 'admin@example.com',
        },
        {
            id: '4',
            type: 'success',
            title: 'Backup completado',
            description: 'Backup automático ejecutado correctamente',
            timestamp: new Date(Date.now() - 1200000),
            details: { size: '2.3GB', duration: '45s' },
        },
        {
            id: '5',
            type: 'warning',
            title: 'Alto uso de CPU',
            description: 'CPU al 85% durante 10 minutos',
            timestamp: new Date(Date.now() - 1500000),
            details: { cpu: '85%', duration: '10min' },
        },
        {
            id: '6',
            type: 'user',
            title: 'Usuario bloqueado',
            description: 'Usuario bloqueado por actividad sospechosa',
            timestamp: new Date(Date.now() - 1800000),
            user: 'moderador1',
            details: { blocked_user: 'spam_user_123' },
        },
    ]);
    const [filteredEvents, setFilteredEvents] = (0, react_1.useState)(events);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [typeFilter, setTypeFilter] = (0, react_1.useState)('all');
    (0, react_1.useEffect)(() => {
        let filtered = events;
        if (searchTerm) {
            filtered = filtered.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (typeFilter !== 'all') {
            filtered = filtered.filter(event => event.type === typeFilter);
        }
        setFilteredEvents(filtered);
    }, [events, searchTerm, typeFilter]);
    const getEventIcon = (type) => {
        switch (type) {
            case 'error':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4 text-red-500" });
            case 'warning':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-yellow-500" });
            case 'info':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "h-4 w-4 text-blue-500" });
            case 'success':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" });
            case 'config':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-4 w-4 text-purple-500" });
            case 'security':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4 text-red-500" });
            case 'user':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-blue-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "h-4 w-4 text-gray-500" });
        }
    };
    const getEventBadgeColor = (type) => {
        switch (type) {
            case 'error':
                return 'destructive';
            case 'warning':
                return 'secondary';
            case 'success':
                return 'default';
            case 'security':
                return 'destructive';
            default:
                return 'outline';
        }
    };
    const exportEvents = () => {
        const dataStr = JSON.stringify(filteredEvents, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `events_${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "col-span-full", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Historial de Eventos" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "outline", onClick: exportEvents, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "mr-2 h-4 w-4" }), "Exportar"] })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Registro detallado de eventos del sistema y actividad de usuarios" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "text-muted-foreground absolute left-2 top-2.5 h-4 w-4" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Buscar eventos...", value: searchTerm, onChange: e => setSearchTerm(e.target.value), className: "pl-8" })] }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: typeFilter, onValueChange: setTypeFilter, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-40", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "all", children: "Todos los tipos" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "error", children: "Errores" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "warning", children: "Advertencias" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "info", children: "Informaci\u00F3n" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "success", children: "\u00C9xito" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "config", children: "Configuraci\u00F3n" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "security", children: "Seguridad" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "user", children: "Usuario" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-96 space-y-2 overflow-y-auto", children: filteredEvents.map(event => ((0, jsx_runtime_1.jsxs)("div", { className: "hover:bg-muted/50 flex items-start space-x-3 rounded-lg border p-3 transition-colors", children: [(0, jsx_runtime_1.jsx)("div", { className: "mt-0.5", children: getEventIcon(event.type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: event.title }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getEventBadgeColor(event.type), className: "text-xs", children: event.type })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-xs", children: event.timestamp.toLocaleString('es-ES') })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground text-sm", children: event.description }), (event.user || event.ip || event.details) && ((0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground space-y-1 text-xs", children: [event.user && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Usuario:" }), " ", event.user] })), event.ip && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "IP:" }), " ", event.ip] })), event.details && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Detalles:" }), " ", JSON.stringify(event.details)] }))] }))] })] }, event.id))) }), filteredEvents.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground py-8 text-center", children: "No se encontraron eventos que coincidan con los filtros" })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 border-t pt-4 md:grid-cols-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold text-red-500", children: events.filter(e => e.type === 'error').length }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-xs", children: "Errores" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold text-yellow-500", children: events.filter(e => e.type === 'warning').length }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-xs", children: "Advertencias" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold text-green-500", children: events.filter(e => e.type === 'success').length }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-xs", children: "\u00C9xitos" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-lg font-semibold text-blue-500", children: events.filter(e => e.type === 'security').length }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-xs", children: "Seguridad" })] })] })] })] }));
}
//# sourceMappingURL=event-history.js.map