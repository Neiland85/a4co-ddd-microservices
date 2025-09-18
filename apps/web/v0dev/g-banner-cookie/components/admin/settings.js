'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminSettings;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const textarea_1 = require("@/components/ui/textarea");
const switch_1 = require("@/components/ui/switch");
const card_1 = require("@/components/ui/card");
const tabs_1 = require("@/components/ui/tabs");
const badge_1 = require("@/components/ui/badge");
const alert_1 = require("@/components/ui/alert");
const dialog_1 = require("@/components/ui/dialog");
const select_1 = require("@/components/ui/select");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const admin_types_1 = require("../../types/admin-types");
// Mock data
const mockSettings = {
    businessName: 'Panadería El Ochío',
    email: 'info@panaderia-ochio.com',
    phone: '+34 953 123 456',
    address: 'Calle Real 45, Úbeda, Jaén',
    description: 'Panadería tradicional especializada en ochíos y pan artesanal desde 1952. Elaboramos nuestros productos con ingredientes locales y técnicas ancestrales.',
    notifications: {
        email: true,
        sms: false,
        push: true,
    },
    privacy: {
        dataRetention: 24,
        cookieConsent: true,
        analyticsEnabled: true,
    },
};
const mockDataRequests = [
    {
        id: 'REQ-001',
        type: 'access',
        customerEmail: 'ana@email.com',
        status: 'completed',
        requestDate: new Date('2024-01-20'),
        completedDate: new Date('2024-01-22'),
        notes: 'Datos enviados por email',
    },
    {
        id: 'REQ-002',
        type: 'deletion',
        customerEmail: 'carlos@email.com',
        status: 'processing',
        requestDate: new Date('2024-01-22'),
        notes: 'Verificando pedidos pendientes',
    },
    {
        id: 'REQ-003',
        type: 'export',
        customerEmail: 'maria@email.com',
        status: 'pending',
        requestDate: new Date('2024-01-23'),
    },
];
const requestTypeLabels = {
    access: 'Acceso a datos',
    deletion: 'Eliminación de datos',
    export: 'Exportación de datos',
};
const requestStatusLabels = {
    pending: 'Pendiente',
    processing: 'Procesando',
    completed: 'Completado',
    rejected: 'Rechazado',
};
const getRequestStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'processing':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'completed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'rejected':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};
const getRequestStatusIcon = (status) => {
    switch (status) {
        case 'pending':
            return lucide_react_1.Clock;
        case 'processing':
            return lucide_react_1.Database;
        case 'completed':
            return lucide_react_1.CheckCircle;
        case 'rejected':
            return lucide_react_1.XCircle;
        default:
            return lucide_react_1.Clock;
    }
};
function AdminSettings() {
    const [settingsData, setSettingsData] = (0, react_1.useState)(mockSettings);
    const [dataRequestsData, setDataRequestsData] = (0, react_1.useState)(mockDataRequests);
    const [hoveredCardData, setHoveredCardData] = (0, react_1.useState)(null);
    const [isExportDialogOpenData, setIsExportDialogOpenData] = (0, react_1.useState)(false);
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(admin_types_1.SettingsSchema),
        defaultValues: settingsData,
    });
    const onSubmit = (data) => {
        setSettingsData(data);
        // Here you would typically save to your backend
        console.log('Settings saved:', data);
    };
    const handleDataRequest = (requestId, action) => {
        setDataRequestsData(prev => prev.map(req => req.id === requestId
            ? {
                ...req,
                status: action === 'approve' ? 'completed' : 'rejected',
                completedDate: new Date(),
                notes: action === 'approve' ? 'Solicitud aprobada' : 'Solicitud rechazada',
            }
            : req));
    };
    const exportPersonalData = (email) => {
        // Mock data export
        const userData = {
            personalInfo: {
                email: email,
                registrationDate: '2024-01-15',
                lastLogin: '2024-01-23',
            },
            orders: [
                { id: 'ORD-001', date: '2024-01-22', total: 15.5 },
                { id: 'ORD-002', date: '2024-01-20', total: 12.0 },
            ],
            preferences: {
                notifications: true,
                marketing: false,
            },
        };
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `datos-personales-${email}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Configuraci\u00F3n" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-gray-600", children: "Gestiona la configuraci\u00F3n de tu negocio y privacidad" })] }) }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "business", className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-4", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "business", className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Negocio" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "notifications", className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Notificaciones" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "privacy", className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Privacidad" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "gdpr", className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "GDPR" })] })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "business", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "mr-2 h-5 w-5" }), "Informaci\u00F3n del Negocio"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Configura la informaci\u00F3n b\u00E1sica de tu negocio artesanal" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "businessName", children: "Nombre del Negocio" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "businessName", ...form.register('businessName'), className: "transition-all duration-300 focus:scale-105" }), form.formState.errors.businessName && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: form.formState.errors.businessName.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "email", children: "Email de Contacto" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "email", type: "email", ...form.register('email'), className: "transition-all duration-300 focus:scale-105" }), form.formState.errors.email && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: form.formState.errors.email.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "phone", children: "Tel\u00E9fono" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "phone", ...form.register('phone'), className: "transition-all duration-300 focus:scale-105" }), form.formState.errors.phone && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: form.formState.errors.phone.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "address", children: "Direcci\u00F3n" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "address", ...form.register('address'), className: "transition-all duration-300 focus:scale-105" }), form.formState.errors.address && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: form.formState.errors.address.message }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "description", children: "Descripci\u00F3n del Negocio" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "description", ...form.register('description'), rows: 4, className: "transition-all duration-300 focus:scale-105" }), form.formState.errors.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: form.formState.errors.description.message }))] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "submit", className: "from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 shadow-mixed hover:shadow-mixed-lg bg-gradient-to-r text-white transition-all duration-300 hover:scale-105", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "mr-2 h-4 w-4" }), "Guardar Cambios"] })] }) })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "notifications", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "mr-2 h-5 w-5" }), "Configuraci\u00F3n de Notificaciones"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Controla c\u00F3mo y cu\u00E1ndo recibir notificaciones" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-6", children: [
                                        {
                                            key: 'email',
                                            label: 'Notificaciones por Email',
                                            description: 'Recibir notificaciones de pedidos y mensajes por email',
                                        },
                                        {
                                            key: 'sms',
                                            label: 'Notificaciones por SMS',
                                            description: 'Recibir alertas importantes por mensaje de texto',
                                        },
                                        {
                                            key: 'push',
                                            label: 'Notificaciones Push',
                                            description: 'Recibir notificaciones en tiempo real en el navegador',
                                        },
                                    ].map(notification => ((0, jsx_runtime_1.jsxs)("div", { className: "hover:scale-102 hover:shadow-natural-md flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: notification.label }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: notification.description })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settingsData.notifications[notification.key] || false, onCheckedChange: checked => {
                                                    setSettingsData(prev => ({
                                                        ...prev,
                                                        notifications: {
                                                            ...prev.notifications,
                                                            [notification.key]: checked,
                                                        },
                                                    }));
                                                }, className: "transition-all duration-300 hover:scale-110" })] }, notification.key))) })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "privacy", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "mr-2 h-5 w-5" }), "Configuraci\u00F3n de Privacidad"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Gestiona la privacidad y retenci\u00F3n de datos" })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Retenci\u00F3n de Datos (meses)" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: settingsData.privacy.dataRetention.toString(), onValueChange: value => {
                                                                setSettingsData(prev => ({
                                                                    ...prev,
                                                                    privacy: {
                                                                        ...prev.privacy,
                                                                        dataRetention: Number.parseInt(value),
                                                                    },
                                                                }));
                                                            }, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "transition-all duration-300 hover:scale-105", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "12", children: "12 meses" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "24", children: "24 meses" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "36", children: "36 meses" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "60", children: "60 meses" })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Tiempo que se conservar\u00E1n los datos de clientes inactivos" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "hover:scale-102 flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: "Consentimiento de Cookies" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Solicitar consentimiento para cookies no esenciales" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settingsData.privacy.cookieConsent, onCheckedChange: checked => {
                                                                setSettingsData(prev => ({
                                                                    ...prev,
                                                                    privacy: {
                                                                        ...prev.privacy,
                                                                        cookieConsent: checked,
                                                                    },
                                                                }));
                                                            }, className: "transition-all duration-300 hover:scale-110" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "hover:scale-102 flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: "Analytics Habilitado" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Permitir recopilaci\u00F3n de datos anal\u00EDticos" })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: settingsData.privacy.analyticsEnabled, onCheckedChange: checked => {
                                                                setSettingsData(prev => ({
                                                                    ...prev,
                                                                    privacy: {
                                                                        ...prev.privacy,
                                                                        analyticsEnabled: checked,
                                                                    },
                                                                }));
                                                            }, className: "transition-all duration-300 hover:scale-110" })] })] })] }), (0, jsx_runtime_1.jsxs)(alert_1.Alert, { className: "border-yellow-200 bg-yellow-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-yellow-600" }), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { className: "text-yellow-800", children: "Los cambios en la configuraci\u00F3n de privacidad pueden afectar la funcionalidad de tu tienda. Aseg\u00FArate de cumplir con las regulaciones locales de protecci\u00F3n de datos." })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "gdpr", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg hover:shadow-natural-xl transition-all duration-300", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "mr-2 h-5 w-5" }), "Solicitudes de Datos GDPR"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Gestiona las solicitudes de acceso, exportaci\u00F3n y eliminaci\u00F3n de datos" })] }), (0, jsx_runtime_1.jsxs)(dialog_1.Dialog, { open: isExportDialogOpenData, onOpenChange: setIsExportDialogOpenData, children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", className: "bg-transparent transition-all duration-300 hover:scale-105", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "mr-2 h-4 w-4" }), "Exportar Datos"] }) }), (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: "Exportar Datos Personales" }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: "Introduce el email del cliente para exportar sus datos personales" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "export-email", children: "Email del Cliente" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "export-email", type: "email", placeholder: "cliente@email.com" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: () => setIsExportDialogOpenData(false), children: "Cancelar" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: () => {
                                                                                            exportPersonalData('cliente@email.com');
                                                                                            setIsExportDialogOpenData(false);
                                                                                        }, className: "from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 bg-gradient-to-r", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "mr-2 h-4 w-4" }), "Exportar"] })] })] })] })] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: dataRequestsData.map(request => {
                                                    const StatusIcon = getRequestStatusIcon(request.status);
                                                    return ((0, jsx_runtime_1.jsx)("div", { onMouseEnter: () => setHoveredCardData(request.id), onMouseLeave: () => setHoveredCardData(null), className: (0, utils_1.cn)('hover:shadow-natural-md cursor-pointer rounded-lg border p-4 transition-all duration-300', hoveredCardData === request.id && 'scale-102 shadow-natural-lg'), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "bg-a4co-olive-50 text-a4co-olive-700", children: requestTypeLabels[request.type] || request.type }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: (0, utils_1.cn)('border text-xs', getRequestStatusColor(request.status)), children: [(0, jsx_runtime_1.jsx)(StatusIcon, { className: "mr-1 h-3 w-3" }), requestStatusLabels[request.status] || request.status] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: request.customerEmail }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: ["Solicitado: ", formatDate(request.requestDate), request.completedDate &&
                                                                                    ` • Completado: ${formatDate(request.completedDate)}`] }), request.notes && ((0, jsx_runtime_1.jsx)("div", { className: "mt-1 text-xs text-gray-600", children: request.notes }))] }), request.status === 'pending' && ((0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", onClick: () => handleDataRequest(request.id, 'approve'), className: "transition-all duration-300 hover:scale-110 hover:border-green-300 hover:bg-green-50 hover:text-green-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", onClick: () => handleDataRequest(request.id, 'reject'), className: "transition-all duration-300 hover:scale-110 hover:border-red-300 hover:bg-red-50 hover:text-red-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4" }) })] }))] }) }, request.id));
                                                }) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "mr-2 h-5 w-5" }), "Cumplimiento GDPR"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Derechos del Usuario" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("li", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" }), (0, jsx_runtime_1.jsx)("span", { children: "Derecho de acceso a datos personales" })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" }), (0, jsx_runtime_1.jsx)("span", { children: "Derecho de rectificaci\u00F3n" })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" }), (0, jsx_runtime_1.jsx)("span", { children: "Derecho de supresi\u00F3n" })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" }), (0, jsx_runtime_1.jsx)("span", { children: "Derecho de portabilidad" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Medidas Implementadas" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("li", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4 text-blue-600" }), (0, jsx_runtime_1.jsx)("span", { children: "Cifrado de datos sensibles" })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4 text-blue-600" }), (0, jsx_runtime_1.jsx)("span", { children: "Consentimiento expl\u00EDcito" })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4 text-blue-600" }), (0, jsx_runtime_1.jsx)("span", { children: "Retenci\u00F3n limitada de datos" })] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4 text-blue-600" }), (0, jsx_runtime_1.jsx)("span", { children: "Registro de actividades" })] })] })] })] }) })] })] }) })] })] }));
}
//# sourceMappingURL=settings.js.map