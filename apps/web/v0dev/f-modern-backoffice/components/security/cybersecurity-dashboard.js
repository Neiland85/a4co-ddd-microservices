'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CybersecurityDashboard = CybersecurityDashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const progress_1 = require("@/components/ui/progress");
const tabs_1 = require("@/components/ui/tabs");
const alert_1 = require("@/components/ui/alert");
const table_1 = require("@/components/ui/table");
const chart_1 = require("@/components/ui/chart");
const recharts_1 = require("recharts");
const lucide_react_1 = require("lucide-react");
function CybersecurityDashboard() {
    const [threats, setThreats] = (0, react_1.useState)([
        {
            id: '1',
            type: 'brute_force',
            severity: 'high',
            source: '192.168.1.100',
            target: '/api/auth/login',
            timestamp: new Date(Date.now() - 300000),
            status: 'blocked',
            description: 'Múltiples intentos de login fallidos desde IP sospechosa',
        },
        {
            id: '2',
            type: 'sql_injection',
            severity: 'critical',
            source: '10.0.0.50',
            target: '/api/users',
            timestamp: new Date(Date.now() - 600000),
            status: 'blocked',
            description: 'Intento de inyección SQL detectado y bloqueado',
        },
        {
            id: '3',
            type: 'ddos',
            severity: 'medium',
            source: 'Multiple IPs',
            target: 'Main Server',
            timestamp: new Date(Date.now() - 900000),
            status: 'investigating',
            description: 'Tráfico anómalo detectado desde múltiples fuentes',
        },
    ]);
    const [metrics, setMetrics] = (0, react_1.useState)({
        threatLevel: 75,
        blockedAttacks: 1247,
        vulnerabilities: 3,
        securityScore: 92,
        uptime: 99.97,
        lastScan: new Date(),
    });
    const [realTimeData, setRealTimeData] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        // Generar datos de tiempo real
        const generateRealTimeData = () => {
            const data = Array.from({ length: 24 }, (_, i) => ({
                hour: `${i.toString().padStart(2, '0')}:00`,
                threats: Math.floor(Math.random() * 50 + 10),
                blocked: Math.floor(Math.random() * 45 + 5),
                allowed: Math.floor(Math.random() * 1000 + 500),
            }));
            setRealTimeData(data);
        };
        generateRealTimeData();
        // Simular actualizaciones en tiempo real
        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                threatLevel: Math.max(0, Math.min(100, prev.threatLevel + (Math.random() - 0.5) * 10)),
                blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 3),
                securityScore: Math.max(80, Math.min(100, prev.securityScore + (Math.random() - 0.5) * 2)),
                lastScan: new Date(),
            }));
            // Simular nuevas amenazas ocasionalmente
            if (Math.random() < 0.1) {
                const newThreat = {
                    id: Date.now().toString(),
                    type: ['malware', 'phishing', 'ddos', 'brute_force', 'sql_injection', 'xss'][Math.floor(Math.random() * 6)],
                    severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
                    source: `192.168.1.${Math.floor(Math.random() * 255)}`,
                    target: ['/api/auth', '/api/users', '/api/data', 'Main Server'][Math.floor(Math.random() * 4)],
                    timestamp: new Date(),
                    status: ['detected', 'blocked', 'investigating'][Math.floor(Math.random() * 3)],
                    description: 'Nueva amenaza detectada por el sistema de monitoreo',
                };
                setThreats(prev => [newThreat, ...prev.slice(0, 9)]);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    const getThreatIcon = (type) => {
        switch (type) {
            case 'malware':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Skull, { className: "h-4 w-4" });
            case 'phishing':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-4 w-4" });
            case 'ddos':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-4 w-4" });
            case 'brute_force':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "h-4 w-4" });
            case 'sql_injection':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Database, { className: "h-4 w-4" });
            case 'xss':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "h-4 w-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" });
        }
    };
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return 'destructive';
            case 'high':
                return 'destructive';
            case 'medium':
                return 'secondary';
            case 'low':
                return 'outline';
            default:
                return 'outline';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'blocked':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Ban, { className: "h-3 w-3 text-red-500" });
            case 'resolved':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-3 w-3 text-green-500" });
            case 'investigating':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-3 w-3 text-yellow-500" });
            case 'detected':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-3 w-3 text-orange-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3 text-gray-500" });
        }
    };
    const getThreatLevelColor = (level) => {
        if (level >= 80)
            return 'text-red-500';
        if (level >= 60)
            return 'text-yellow-500';
        return 'text-green-500';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Nivel de Amenaza" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: `text-2xl font-bold ${getThreatLevelColor(metrics.threatLevel)}`, children: [metrics.threatLevel, "%"] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: metrics.threatLevel, className: "mt-2" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground mt-1 text-xs", children: metrics.threatLevel >= 80
                                            ? 'Crítico'
                                            : metrics.threatLevel >= 60
                                                ? 'Alto'
                                                : 'Normal' })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Ataques Bloqueados" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Ban, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-red-500", children: metrics.blockedAttacks }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-1 h-3 w-3 text-green-500" }), "+15% \u00FAltimas 24h"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Vulnerabilidades" }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-yellow-500", children: metrics.vulnerabilities }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "mr-1 h-3 w-3 text-green-500" }), "-2 resueltas hoy"] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Puntuaci\u00F3n Seguridad" }), (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-green-500", children: [metrics.securityScore, "/100"] }), (0, jsx_runtime_1.jsx)(progress_1.Progress, { value: metrics.securityScore, className: "mt-2" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground mt-1 text-xs", children: "Excelente" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-sm font-medium", children: "Disponibilidad" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "text-muted-foreground h-4 w-4" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-2xl font-bold text-green-500", children: [metrics.uptime, "%"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground flex items-center text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "mr-1 h-3 w-3 text-green-500" }), "Sistema operativo"] })] })] })] }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "monitoring", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-4", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "monitoring", children: "Monitoreo en Tiempo Real" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "threats", children: "Detecci\u00F3n de Amenazas" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "firewall", children: "Firewall y Protecci\u00F3n" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "analysis", children: "An\u00E1lisis Forense" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsContent, { value: "monitoring", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Radar, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Monitoreo de Tr\u00E1fico" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "An\u00E1lisis de tr\u00E1fico en tiempo real" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                                        threats: { label: 'Amenazas', color: 'hsl(var(--chart-4))' },
                                                        blocked: { label: 'Bloqueadas', color: 'hsl(var(--chart-1))' },
                                                        allowed: { label: 'Permitidas', color: 'hsl(var(--chart-2))' },
                                                    }, className: "h-[300px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.AreaChart, { data: realTimeData, children: [(0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "hour", fontSize: 10 }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { fontSize: 10 }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "allowed", stackId: "1", stroke: "var(--color-allowed)", fill: "var(--color-allowed)", fillOpacity: 0.6 }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "blocked", stackId: "1", stroke: "var(--color-blocked)", fill: "var(--color-blocked)", fillOpacity: 0.8 }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "threats", stackId: "1", stroke: "var(--color-threats)", fill: "var(--color-threats)", fillOpacity: 0.9 })] }) }) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Amenazas Activas" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "\u00DAltimas amenazas detectadas" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "max-h-[300px] space-y-3 overflow-y-auto", children: threats.slice(0, 5).map(threat => ((0, jsx_runtime_1.jsx)(alert_1.Alert, { className: "p-3", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-start justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-2", children: [getThreatIcon(threat.type), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getSeverityColor(threat.severity), className: "text-xs", children: threat.severity.toUpperCase() }), getStatusIcon(threat.status), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-xs capitalize", children: threat.status })] }), (0, jsx_runtime_1.jsxs)(alert_1.AlertDescription, { className: "text-xs", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: threat.description }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground mt-1", children: [threat.source, " \u2192 ", threat.target] }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground", children: threat.timestamp.toLocaleString('es-ES') })] })] })] }) }) }, threat.id))) }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center space-x-2 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Firewall" })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "default", className: "bg-green-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "mr-1 h-3 w-3" }), "Activo"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-sm", children: "1,247 bloqueados" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-muted-foreground mt-2 text-xs", children: ["\u00DAltima actualizaci\u00F3n: ", new Date().toLocaleTimeString('es-ES')] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center space-x-2 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Radar, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "IDS/IPS" })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "default", className: "bg-green-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-1 h-3 w-3" }), "Monitoreando"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-sm", children: "3 amenazas activas" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground mt-2 text-xs", children: "Sensibilidad: Alta" })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center space-x-2 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Cifrado" })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "default", className: "bg-green-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "mr-1 h-3 w-3" }), "TLS 1.3"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-sm", children: "256-bit AES" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground mt-2 text-xs", children: "Certificado v\u00E1lido hasta 2025" })] })] })] })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "threats", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Centro de Detecci\u00F3n de Amenazas" })] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "mr-2 h-4 w-4" }), "Escaneo Completo"] })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Sistema avanzado de detecci\u00F3n y an\u00E1lisis de amenazas" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)(table_1.Table, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHeader, { children: (0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Tipo" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Severidad" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Origen" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Objetivo" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Estado" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Timestamp" }), (0, jsx_runtime_1.jsx)(table_1.TableHead, { children: "Acciones" })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableBody, { children: threats.map(threat => ((0, jsx_runtime_1.jsxs)(table_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [getThreatIcon(threat.type), (0, jsx_runtime_1.jsx)("span", { className: "capitalize", children: threat.type.replace('_', ' ') })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getSeverityColor(threat.severity), children: threat.severity }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { className: "font-mono text-sm", children: threat.source }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { className: "font-mono text-sm", children: threat.target }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [getStatusIcon(threat.status), (0, jsx_runtime_1.jsx)("span", { className: "text-sm capitalize", children: threat.status })] }) }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { className: "text-sm", children: threat.timestamp.toLocaleString('es-ES') }), (0, jsx_runtime_1.jsx)(table_1.TableCell, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-1", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-3 w-3" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Ban, { className: "h-3 w-3" }) })] }) })] }, threat.id))) })] }) })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "firewall", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Configuraci\u00F3n del Firewall" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Reglas y pol\u00EDticas de seguridad activas" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded border p-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: "Bloqueo de IPs Sospechosas" }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-sm", children: "Bloqueo autom\u00E1tico tras 5 intentos fallidos" })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "default", className: "bg-green-500", children: "Activo" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded border p-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: "Filtrado de Contenido" }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-sm", children: "An\u00E1lisis de payloads maliciosos" })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "default", className: "bg-green-500", children: "Activo" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded border p-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: "Rate Limiting" }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-sm", children: "100 requests/min por IP" })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "default", className: "bg-green-500", children: "Activo" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded border p-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: "Geo-blocking" }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-sm", children: "Bloqueo de pa\u00EDses de alto riesgo" })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", children: "Configurar" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 pt-4", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { className: "w-full", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "mr-2 h-4 w-4" }), "Configurar Reglas"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "w-full bg-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "mr-2 h-4 w-4" }), "Ver Logs del Firewall"] })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Ban, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "IPs Bloqueadas" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Lista de direcciones IP bloqueadas" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "max-h-[300px] space-y-2 overflow-y-auto", children: [
                                                    { ip: '192.168.1.100', reason: 'Brute force attack', time: '2 min ago' },
                                                    { ip: '10.0.0.50', reason: 'SQL injection attempt', time: '5 min ago' },
                                                    { ip: '172.16.0.25', reason: 'Suspicious activity', time: '12 min ago' },
                                                    { ip: '203.0.113.45', reason: 'DDoS attempt', time: '18 min ago' },
                                                    { ip: '198.51.100.30', reason: 'Malware distribution', time: '25 min ago' },
                                                ].map((blocked, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded border p-2 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-mono font-medium", children: blocked.ip }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground", children: blocked.reason })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground", children: blocked.time }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", className: "h-6 px-2", children: "Desbloquear" })] })] }, index))) }) })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "analysis", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "An\u00E1lisis Forense y Tendencias" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "An\u00E1lisis detallado de patrones de ataque y tendencias de seguridad" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-3 font-medium", children: "Tipos de Amenazas (\u00DAltimos 30 d\u00EDas)" }), (0, jsx_runtime_1.jsx)(chart_1.ChartContainer, { config: {
                                                            count: { label: 'Cantidad', color: 'hsl(var(--chart-1))' },
                                                        }, className: "h-[250px]", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: [
                                                                    { type: 'Brute Force', count: 45 },
                                                                    { type: 'SQL Injection', count: 23 },
                                                                    { type: 'XSS', count: 18 },
                                                                    { type: 'DDoS', count: 12 },
                                                                    { type: 'Malware', count: 8 },
                                                                    { type: 'Phishing', count: 5 },
                                                                ], children: [(0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "type", fontSize: 10 }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { fontSize: 10 }), (0, jsx_runtime_1.jsx)(chart_1.ChartTooltip, { content: (0, jsx_runtime_1.jsx)(chart_1.ChartTooltipContent, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "count", fill: "var(--color-count)" })] }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-3 font-medium", children: "Estad\u00EDsticas de Seguridad" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded border p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-red-500", children: "1,247" }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-sm", children: "Ataques Bloqueados" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded border p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-500", children: "99.2%" }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-sm", children: "Tasa de Detecci\u00F3n" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded border p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-500", children: "0.8s" }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-sm", children: "Tiempo de Respuesta" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded border p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-purple-500", children: "156" }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-sm", children: "IPs Bloqueadas" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { className: "w-full", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "mr-2 h-4 w-4" }), "Generar Reporte Completo"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "w-full bg-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "mr-2 h-4 w-4" }), "Exportar M\u00E9tricas"] })] })] })] })] }) })] }) })] })] }));
}
//# sourceMappingURL=cybersecurity-dashboard.js.map