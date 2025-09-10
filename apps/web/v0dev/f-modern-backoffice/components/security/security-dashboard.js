'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityDashboard = SecurityDashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const alert_1 = require("@/components/ui/alert");
const progress_1 = require("@/components/ui/progress");
const lucide_react_1 = require("lucide-react");
function SecurityDashboard() {
    const [metrics, setMetrics] = (0, react_1.useState)({
        threatLevel: 'low',
        blockedIPs: 12,
        failedLogins: 45,
        suspiciousActivities: 8,
        activeThreats: 3,
        systemHealth: 98,
        lastScan: new Date(),
    });
    const [alerts, setAlerts] = (0, react_1.useState)([
        {
            id: '1',
            type: 'brute_force',
            severity: 'high',
            source: '192.168.1.100',
            description: 'Múltiples intentos de login fallidos detectados',
            timestamp: new Date(Date.now() - 300000),
            blocked: true,
            resolved: false,
        },
        {
            id: '2',
            type: 'sql_injection',
            severity: 'critical',
            source: '10.0.0.50',
            description: 'Intento de inyección SQL en endpoint /api/users',
            timestamp: new Date(Date.now() - 600000),
            blocked: true,
            resolved: false,
        },
        {
            id: '3',
            type: 'suspicious_activity',
            severity: 'medium',
            source: '172.16.0.25',
            description: 'Patrón de navegación anómalo detectado',
            timestamp: new Date(Date.now() - 900000),
            blocked: false,
            resolved: true,
        },
    ]);
    (0, react_1.useEffect)(() => {
        // Simular actualizaciones en tiempo real
        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                failedLogins: prev.failedLogins + Math.floor(Math.random() * 3),
                suspiciousActivities: Math.max(0, prev.suspiciousActivities + Math.floor(Math.random() * 2) - 1),
                systemHealth: Math.max(90, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
                lastScan: new Date(),
            }));
            // Simular nuevas alertas ocasionalmente
            if (Math.random() < 0.1) {
                const newAlert = {
                    id: Date.now().toString(),
                    type: ['brute_force', 'sql_injection', 'xss_attempt', 'suspicious_activity'][Math.floor(Math.random() * 4)],
                    severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
                    source: `192.168.1.${Math.floor(Math.random() * 255)}`,
                    description: 'Nueva amenaza detectada por el sistema',
                    timestamp: new Date(),
                    blocked: Math.random() > 0.3,
                    resolved: false,
                };
                setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    const getThreatLevelColor = (level) => {
        switch (level) {
            case 'critical':
                return 'destructive';
            case 'high':
                return 'destructive';
            case 'medium':
                return 'secondary';
            case 'low':
                return 'default';
            default:
                return 'outline';
        }
    };
    const getThreatLevelIcon = (level) => {
        switch (level) {
            case 'critical':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-500" });
            case 'high':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-orange-500" });
            case 'medium':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4 text-yellow-500" });
            case 'low':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4" });
        }
    };
    const getAlertIcon = (type) => {
        switch (type) {
            case 'brute_force':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Ban, { className: "h-4 w-4" });
            case 'sql_injection':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" });
            case 'xss_attempt':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4" });
            case 'suspicious_activity':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4" });
        }
    };
    const resolveAlert = (id) => {
        setAlerts(prev => prev.map(alert => (alert.id === id ? { ...alert, resolved: true } : alert)));
    };
    const blockIP = (ip) => {
        console.log(`Bloqueando IP: ${ip}`);
        setMetrics(prev => ({ ...prev, blockedIPs: prev.blockedIPs + 1 }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Nivel de Amenaza" }), getThreatLevelIcon(metrics.threatLevel)] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold capitalize", children: metrics.threatLevel }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: getThreatLevelColor(metrics.threatLevel), className: "mt-2", children: [metrics.activeThreats, " amenazas activas"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "IPs Bloqueadas" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Ban, { className: "h-4 w-4 text-red-500" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: metrics.blockedIPs }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground text-xs", children: "\u00DAltimas 24 horas" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Logins Fallidos" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "h-4 w-4 text-orange-500" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: metrics.failedLogins }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground text-xs", children: "\u00DAltimas 24 horas" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Salud del Sistema" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 text-green-500" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold", children: [metrics.systemHealth, "%"] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: metrics.systemHealth, className: "mt-2" })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Alertas de Seguridad" })] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", children: [alerts.filter(a => !a.resolved).length, " activas"] })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Amenazas detectadas y acciones de seguridad en tiempo real" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "max-h-96 space-y-3 overflow-y-auto", children: alerts.slice(0, 5).map(alert => ((0, jsx_runtime_1.jsx)(alert_1.Alert, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [getAlertIcon(alert.type), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getThreatLevelColor(alert.severity), className: "text-xs", children: alert.severity.toUpperCase() }), alert.blocked ? ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "destructive", className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Ban, { className: "mr-1 h-3 w-3" }), "BLOQUEADO"] })) : ((0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-1 h-3 w-3" }), "MONITOREANDO"] })), alert.resolved && (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" })] }), (0, jsx_runtime_1.jsxs)(alert_1.AlertDescription, { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: alert.description }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground mt-1", children: ["IP: ", alert.source, " \u2022 ", alert.timestamp.toLocaleString('es-ES')] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [!alert.blocked && ((0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "destructive", onClick: () => blockIP(alert.source), className: "text-xs", children: "Bloquear IP" })), !alert.resolved && ((0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", onClick: () => resolveAlert(alert.id), className: "text-xs", children: "Resolver" }))] })] }) }, alert.id))) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2 border-t pt-4", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "outline", className: "flex-1 bg-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "mr-2 h-4 w-4" }), "Escaneo Completo"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "outline", className: "flex-1 bg-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "mr-2 h-4 w-4" }), "Ver Logs"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "outline", className: "flex-1 bg-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "mr-2 h-4 w-4" }), "Configurar Alertas"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm", children: "Firewall" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "default", className: "bg-green-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "mr-1 h-3 w-3" }), "Activo"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-muted-foreground text-sm", children: [metrics.blockedIPs, " IPs bloqueadas"] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm", children: "Detecci\u00F3n de Intrusiones" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "default", className: "bg-green-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-1 h-3 w-3" }), "Monitoreando"] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-muted-foreground text-sm", children: [metrics.suspiciousActivities, " actividades sospechosas"] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm", children: "An\u00E1lisis de Vulnerabilidades" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "mr-1 h-3 w-3" }), "\u00DAltimo escaneo"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-sm", children: metrics.lastScan.toLocaleTimeString('es-ES') })] }) })] })] })] }));
}
//# sourceMappingURL=security-dashboard.js.map