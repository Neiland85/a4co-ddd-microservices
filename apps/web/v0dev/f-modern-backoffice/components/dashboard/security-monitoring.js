'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityMonitoring = SecurityMonitoring;
const jsx_runtime_1 = require("react/jsx-runtime");
const alert_1 = require("@/components/ui/alert");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const INITIAL_EVENTS = [
    {
        id: '1',
        type: 'unauthorized_access',
        severity: 'high',
        description: 'Intento de acceso fallido desde IP sospechosa',
        timestamp: new Date(Date.now() - 300000),
        ip: '192.168.1.100',
        resolved: false,
    },
    {
        id: '2',
        type: 'vulnerability',
        severity: 'medium',
        description: 'Dependencia con vulnerabilidad detectada',
        timestamp: new Date(Date.now() - 600000),
        resolved: true,
    },
    {
        id: '3',
        type: 'suspicious_activity',
        severity: 'low',
        description: 'Patrón de tráfico inusual detectado',
        timestamp: new Date(Date.now() - 900000),
        resolved: false,
    },
];
const INITIAL_STATS = {
    totalThreats: 12,
    blockedAttacks: 8,
    activeMonitoring: true,
    lastScan: new Date(),
};
const EVENT_TYPES = ['unauthorized_access', 'vulnerability', 'suspicious_activity'];
const SEVERITY_LEVELS = ['low', 'medium', 'high'];
const UPDATE_INTERVAL = 10000;
const EVENT_PROBABILITY = 0.1;
const MAX_EVENTS = 5;
function SecurityMonitoring() {
    const [events, setEvents] = (0, react_1.useState)(INITIAL_EVENTS);
    const [stats] = (0, react_1.useState)(INITIAL_STATS);
    const timeoutRef = (0, react_1.useRef)(null);
    const mountedRef = (0, react_1.useRef)(true);
    // Generador de eventos optimizado con useCallback
    const generateSecurityEvent = (0, react_1.useCallback)(() => ({
        id: Date.now().toString(),
        type: EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)],
        severity: SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)],
        description: 'Nuevo evento de seguridad detectado',
        timestamp: new Date(),
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        resolved: false,
    }), []);
    // Función recursiva con setTimeout optimizada
    const scheduleNextUpdate = (0, react_1.useCallback)(() => {
        if (!mountedRef.current)
            return;
        timeoutRef.current = setTimeout(() => {
            if (!mountedRef.current)
                return;
            // Simular nuevos eventos de seguridad ocasionalmente
            if (Math.random() < EVENT_PROBABILITY) {
                const newEvent = generateSecurityEvent();
                setEvents(prev => [newEvent, ...prev.slice(0, MAX_EVENTS - 1)]);
            }
            scheduleNextUpdate();
        }, UPDATE_INTERVAL);
    }, [generateSecurityEvent]);
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
    const getSeverityColor = (0, react_1.useCallback)((severity) => {
        switch (severity) {
            case 'critical':
            case 'high':
                return 'destructive';
            case 'medium':
                return 'secondary';
            case 'low':
            default:
                return 'outline';
        }
    }, []);
    const getTypeIcon = (0, react_1.useCallback)((type) => {
        switch (type) {
            case 'unauthorized_access':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Ban, { className: "h-4 w-4" });
            case 'vulnerability':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" });
            case 'suspicious_activity':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4" });
        }
    }, []);
    const resolveEvent = (0, react_1.useCallback)((id) => {
        setEvents(prev => prev.map(event => (event.id === id ? { ...event, resolved: true } : event)));
    }, []);
    // Eventos recientes memoizados
    const recentEvents = (0, react_1.useMemo)(() => events.slice(0, 3), [events]);
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "col-span-1", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Monitoreo de Seguridad" })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: stats.activeMonitoring ? 'default' : 'destructive', className: "bg-green-500", children: stats.activeMonitoring ? 'Activo' : 'Inactivo' })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Detecci\u00F3n y prevenci\u00F3n de amenazas en tiempo real" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-red-500", children: stats.totalThreats }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-xs", children: "Amenazas Detectadas" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-500", children: stats.blockedAttacks }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-xs", children: "Ataques Bloqueados" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-500", children: "99.8%" }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-xs", children: "Disponibilidad" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium", children: "Eventos Recientes" }), recentEvents.map(event => ((0, jsx_runtime_1.jsx)(alert_1.Alert, { className: "p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-2", children: [getTypeIcon(event.type), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getSeverityColor(event.severity), className: "text-xs", children: event.severity.toUpperCase() }), event.resolved ? ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-3 w-3 text-green-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-3 w-3 text-red-500" }))] }), (0, jsx_runtime_1.jsxs)(alert_1.AlertDescription, { className: "text-xs", children: [event.description, event.ip && ((0, jsx_runtime_1.jsxs)("span", { className: "text-muted-foreground block", children: ["IP: ", event.ip] })), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground block", children: event.timestamp.toLocaleString('es-ES') })] })] })] }), !event.resolved && ((0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", onClick: () => resolveEvent(event.id), className: "text-xs", children: "Resolver" }))] }) }, event.id)))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "outline", className: "flex-1 bg-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "mr-1 h-3 w-3" }), "Escanear"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "outline", className: "flex-1 bg-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-1 h-3 w-3" }), "Ver Todo"] })] })] })] }));
}
//# sourceMappingURL=security-monitoring.js.map