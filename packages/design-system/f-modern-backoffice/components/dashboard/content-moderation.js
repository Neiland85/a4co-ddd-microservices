'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModeration = ContentModeration;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const textarea_1 = require("@/components/ui/textarea");
const alert_1 = require("@/components/ui/alert");
const lucide_react_1 = require("lucide-react");
function ContentModeration() {
    const [reports, setReports] = (0, react_1.useState)([
        {
            id: '1',
            type: 'text',
            content: 'Comentario inapropiado sobre...',
            reason: 'Lenguaje ofensivo',
            reporter: 'usuario123',
            timestamp: new Date(Date.now() - 300000),
            status: 'pending',
            severity: 'medium',
        },
        {
            id: '2',
            type: 'image',
            content: 'Imagen reportada por contenido inapropiado',
            reason: 'Contenido explícito',
            reporter: 'moderador1',
            timestamp: new Date(Date.now() - 600000),
            status: 'pending',
            severity: 'high',
        },
        {
            id: '3',
            type: 'text',
            content: 'Spam repetitivo en múltiples publicaciones',
            reason: 'Spam',
            reporter: 'usuario456',
            timestamp: new Date(Date.now() - 900000),
            status: 'approved',
            severity: 'low',
        },
    ]);
    const [moderationNote, setModerationNote] = (0, react_1.useState)('');
    const getTypeIcon = (type) => {
        switch (type) {
            case 'text':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "h-4 w-4" });
            case 'image':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.ImageIcon, { className: "h-4 w-4" });
            case 'video':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Video, { className: "h-4 w-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { className: "h-4 w-4" });
        }
    };
    const getSeverityColor = (severity) => {
        switch (severity) {
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
            case 'approved':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-3 w-3 text-green-500" });
            case 'rejected':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-3 w-3 text-red-500" });
            case 'pending':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-3 w-3 text-yellow-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-3 w-3 text-yellow-500" });
        }
    };
    const moderateContent = (id, action) => {
        setReports(prev => prev.map(report => report.id === id
            ? { ...report, status: action === 'approve' ? 'approved' : 'rejected' }
            : report));
    };
    const pendingReports = reports.filter(r => r.status === 'pending');
    const totalReports = reports.length;
    const resolvedReports = reports.filter(r => r.status !== 'pending').length;
    return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "col-span-1", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Flag, { className: "h-5 w-5" }), (0, jsx_runtime_1.jsx)("span", { children: "Moderaci\u00F3n de Contenido" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Revisi\u00F3n y moderaci\u00F3n de contenido reportado" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4 text-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-yellow-500", children: pendingReports.length }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-xs", children: "Pendientes" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-500", children: resolvedReports }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-xs", children: "Resueltos" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold", children: totalReports }), (0, jsx_runtime_1.jsx)("div", { className: "text-muted-foreground text-xs", children: "Total" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium", children: "Reportes Pendientes" }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-48 space-y-2 overflow-y-auto", children: pendingReports.map(report => ((0, jsx_runtime_1.jsx)(alert_1.Alert, { className: "p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [getTypeIcon(report.type), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: getSeverityColor(report.severity), className: "text-xs", children: report.severity.toUpperCase() }), getStatusIcon(report.status)] }), (0, jsx_runtime_1.jsx)("span", { className: "text-muted-foreground text-xs", children: report.timestamp.toLocaleString('es-ES') })] }), (0, jsx_runtime_1.jsxs)(alert_1.AlertDescription, { className: "space-y-1 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Contenido:" }), " ", report.content] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Raz\u00F3n:" }), " ", report.reason] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Reportado por:" }), " ", report.reporter] })] }), report.status === 'pending' && ((0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "outline", onClick: () => moderateContent(report.id, 'approve'), className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "mr-1 h-3 w-3" }), "Aprobar"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "destructive", onClick: () => moderateContent(report.id, 'reject'), className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "mr-1 h-3 w-3" }), "Rechazar"] })] }))] }) }, report.id))) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium", children: "Notas de Moderaci\u00F3n" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { placeholder: "Agregar notas sobre la moderaci\u00F3n...", value: moderationNote, onChange: e => setModerationNote(e.target.value), className: "text-xs", rows: 2 }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", className: "w-full bg-transparent text-xs", children: "Guardar Notas" })] })] })] }));
}
//# sourceMappingURL=content-moderation.js.map