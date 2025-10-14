'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookiePreferencesDialog = CookiePreferencesDialog;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const dialog_1 = require("@/components/ui/dialog");
const switch_1 = require("@/components/ui/switch");
const separator_1 = require("@/components/ui/separator");
const badge_1 = require("@/components/ui/badge");
const tabs_1 = require("@/components/ui/tabs");
const accordion_1 = require("@shared/design-system/components/ui/accordion");
const lucide_react_1 = require("lucide-react");
const cookieCategories = [
    {
        id: 'necessary',
        name: 'Cookies Estrictamente Necesarias',
        description: 'Esenciales para el funcionamiento básico del sitio web. No se pueden desactivar.',
        detailedDescription: 'Estas cookies son fundamentales para que puedas navegar por el sitio web y utilizar sus funciones básicas. Incluyen cookies de sesión, autenticación y seguridad.',
        purposes: [
            'Mantener tu sesión activa',
            'Recordar tus preferencias de idioma',
            'Garantizar la seguridad del sitio',
            'Funcionalidad del carrito de compras',
        ],
        dataProcessed: [
            'ID de sesión',
            'Preferencias de idioma',
            'Tokens de seguridad',
            'Estado de autenticación',
        ],
        retention: 'Hasta el cierre del navegador o 24 horas',
        required: true,
        enabled: true,
        legalBasis: 'Interés legítimo (Art. 6.1.f RGPD)',
    },
    {
        id: 'analytics',
        name: 'Cookies de Análisis y Rendimiento',
        description: 'Nos ayudan a entender cómo interactúas con nuestro sitio para mejorarlo continuamente.',
        detailedDescription: 'Recopilamos información sobre cómo utilizas nuestro sitio web de forma anónima y agregada para mejorar la experiencia del usuario y optimizar nuestros servicios.',
        purposes: [
            'Analizar patrones de navegación',
            'Medir el rendimiento del sitio',
            'Identificar páginas populares',
            'Detectar errores técnicos',
        ],
        dataProcessed: [
            'Páginas visitadas',
            'Tiempo de permanencia',
            'Fuente de tráfico',
            'Dispositivo y navegador (anonimizado)',
        ],
        retention: '26 meses',
        required: false,
        enabled: false,
        vendors: ['Google Analytics', 'Hotjar'],
        legalBasis: 'Consentimiento (Art. 6.1.a RGPD)',
    },
    {
        id: 'marketing',
        name: 'Cookies de Marketing y Publicidad',
        description: 'Utilizadas para mostrarte anuncios relevantes y medir la efectividad de nuestras campañas.',
        detailedDescription: 'Estas cookies nos permiten mostrar publicidad personalizada y medir su efectividad. También nos ayudan a entender tus intereses para ofrecerte contenido más relevante.',
        purposes: [
            'Personalizar anuncios',
            'Medir efectividad publicitaria',
            'Remarketing y retargeting',
            'Análisis de audiencias',
        ],
        dataProcessed: [
            'Historial de navegación',
            'Interacciones con anuncios',
            'Intereses inferidos',
            'Datos demográficos aproximados',
        ],
        retention: '13 meses',
        required: false,
        enabled: false,
        vendors: ['Google Ads', 'Facebook Pixel', 'LinkedIn Insight'],
        legalBasis: 'Consentimiento (Art. 6.1.a RGPD)',
    },
    {
        id: 'functional',
        name: 'Cookies Funcionales',
        description: 'Mejoran la funcionalidad del sitio recordando tus elecciones y preferencias.',
        detailedDescription: 'Estas cookies permiten que el sitio web recuerde las elecciones que haces y proporcione funciones mejoradas y más personales.',
        purposes: [
            'Recordar preferencias de usuario',
            'Personalizar la interfaz',
            'Mantener configuraciones',
            'Funciones de chat en vivo',
        ],
        dataProcessed: [
            'Preferencias de visualización',
            'Configuraciones personalizadas',
            'Historial de chat',
            'Favoritos y listas guardadas',
        ],
        retention: '12 meses',
        required: false,
        enabled: false,
        legalBasis: 'Consentimiento (Art. 6.1.a RGPD)',
    },
    {
        id: 'personalization',
        name: 'Cookies de Personalización',
        description: 'Personalizan tu experiencia basándose en tu comportamiento y preferencias.',
        detailedDescription: 'Utilizamos estas cookies para adaptar el contenido, las recomendaciones y la experiencia general del sitio a tus intereses y comportamiento de navegación.',
        purposes: [
            'Recomendaciones personalizadas',
            'Contenido adaptado',
            'Experiencia personalizada',
            'Sugerencias relevantes',
        ],
        dataProcessed: [
            'Historial de productos vistos',
            'Preferencias de contenido',
            'Patrones de comportamiento',
            'Interacciones previas',
        ],
        retention: '24 meses',
        required: false,
        enabled: false,
        legalBasis: 'Consentimiento (Art. 6.1.a RGPD)',
    },
    {
        id: 'social',
        name: 'Cookies de Redes Sociales',
        description: 'Permiten compartir contenido en redes sociales y mostrar contenido social integrado.',
        detailedDescription: 'Estas cookies son establecidas por servicios de redes sociales que hemos añadido al sitio para permitirte compartir nuestro contenido con tus amigos y redes.',
        purposes: [
            'Compartir en redes sociales',
            'Mostrar contenido social',
            "Botones de 'Me gusta'",
            'Widgets sociales integrados',
        ],
        dataProcessed: [
            'Información de perfil social',
            'Contenido compartido',
            'Interacciones sociales',
            'Conexiones de red',
        ],
        retention: 'Según política de cada red social',
        required: false,
        enabled: false,
        vendors: ['Facebook', 'Twitter', 'LinkedIn', 'Instagram'],
        legalBasis: 'Consentimiento (Art. 6.1.a RGPD)',
    },
];
const categoryIcons = {
    necessary: lucide_react_1.Shield,
    analytics: lucide_react_1.BarChart3,
    marketing: lucide_react_1.Target,
    functional: lucide_react_1.Palette,
    personalization: lucide_react_1.Users,
    social: lucide_react_1.Share2,
};
function CookiePreferencesDialog({ open, onOpenChange, onSave, onAcceptAll, onRejectAll, companyName, contactEmail, }) {
    const [categories, setCategories] = (0, react_1.useState)(cookieCategories);
    const [activeTab, setActiveTab] = (0, react_1.useState)('overview');
    const handleToggle = (categoryId) => {
        setCategories(prev => prev.map(category => category.id === categoryId && !category.required
            ? { ...category, enabled: !category.enabled }
            : category));
    };
    const handleSave = () => {
        const preferences = {
            necessary: true,
            analytics: categories.find(c => c.id === 'analytics')?.enabled || false,
            marketing: categories.find(c => c.id === 'marketing')?.enabled || false,
            functional: categories.find(c => c.id === 'functional')?.enabled || false,
            personalization: categories.find(c => c.id === 'personalization')?.enabled || false,
            social: categories.find(c => c.id === 'social')?.enabled || false,
        };
        onSave(preferences);
    };
    const handleAcceptAll = () => {
        setCategories(prev => prev.map(category => ({ ...category, enabled: true })));
        onAcceptAll();
    };
    const handleRejectAll = () => {
        setCategories(prev => prev.map(category => ({
            ...category,
            enabled: category.required,
        })));
        onRejectAll();
    };
    const enabledCount = categories.filter(c => c.enabled).length;
    const totalCount = categories.length;
    return ((0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "max-h-[90vh] max-w-4xl overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-amber-50/20", children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { className: "pb-4", children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogTitle, { className: "flex items-center gap-3 text-2xl font-bold text-green-800", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-8 w-8 text-green-600" }), (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "absolute -bottom-1 -right-1 h-4 w-4 text-amber-500" })] }), "Centro de Preferencias de Privacidad"] }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { className: "text-base", children: "Gestiona tus preferencias de cookies y privacidad de forma granular. Tienes control total sobre tus datos personales seg\u00FAn el RGPD." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 pt-2", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "border-green-300 bg-green-50 text-green-700", children: [enabledCount, "/", totalCount, " Categor\u00EDas Activas"] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "border-blue-300 bg-blue-50 text-blue-700", children: "RGPD Compliant" })] })] }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "flex-1 overflow-hidden", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-3 bg-white/50", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "overview", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "h-4 w-4" }), "Resumen"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "categories", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4" }), "Categor\u00EDas"] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "rights", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Scale, { className: "h-4 w-4" }), "Tus Derechos"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 max-h-[60vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "overview", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border-green-200 bg-white/50", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2 text-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "h-5 w-5 text-blue-600" }), "Resumen de Privacidad"] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-700", children: ["En ", companyName, ", procesamos tus datos personales de acuerdo con el RGPD. Aqu\u00ED tienes un resumen de c\u00F3mo utilizamos las cookies:"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: categories.map(category => {
                                                            const Icon = categoryIcons[category.id];
                                                            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3 rounded-lg border bg-white/70 p-3", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium", children: category.name }), category.enabled ? ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4 text-gray-400" }))] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-xs text-gray-600", children: category.description }), category.required && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: "mt-2 text-xs", children: "Requerida" }))] })] }, category.id));
                                                        }) })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "categories", className: "space-y-4", children: categories.map(category => {
                                        const Icon = categoryIcons[category.id];
                                        return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border-green-200 bg-white/50", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-6 w-6 text-green-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-base", children: category.name }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { className: "text-sm", children: category.description })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [category.required && ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: "text-xs", children: "Requerida" })), (0, jsx_runtime_1.jsx)(switch_1.Switch, { id: category.id, checked: category.enabled, onCheckedChange: () => handleToggle(category.id), disabled: category.required, "aria-describedby": `${category.id}-description` })] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "pt-0", children: (0, jsx_runtime_1.jsx)(accordion_1.Accordion, { type: "single", collapsible: true, children: (0, jsx_runtime_1.jsxs)(accordion_1.AccordionItem, { value: "details", className: "border-0", children: [(0, jsx_runtime_1.jsx)(accordion_1.AccordionTrigger, { className: "py-2 text-sm hover:no-underline", children: "Ver detalles t\u00E9cnicos y legales" }), (0, jsx_runtime_1.jsxs)(accordion_1.AccordionContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 text-xs md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h5", { className: "mb-2 flex items-center gap-1 font-semibold text-gray-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Target, { className: "h-3 w-3" }), "Prop\u00F3sitos"] }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-1 text-gray-600", children: category.purposes.map((purpose, idx) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "mt-1 text-green-500", children: "\u2022" }), purpose] }, idx))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h5", { className: "mb-2 flex items-center gap-1 font-semibold text-gray-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "h-3 w-3" }), "Datos Procesados"] }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-1 text-gray-600", children: category.dataProcessed.map((data, idx) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "mt-1 text-amber-500", children: "\u2022" }), data] }, idx))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h5", { className: "mb-2 flex items-center gap-1 font-semibold text-gray-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-3 w-3" }), "Retenci\u00F3n"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: category.retention })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h5", { className: "mb-2 flex items-center gap-1 font-semibold text-gray-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Scale, { className: "h-3 w-3" }), "Base Legal"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: category.legalBasis })] })] }), category.vendors && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h5", { className: "mb-2 flex items-center gap-1 text-xs font-semibold text-gray-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "h-3 w-3" }), "Terceros Involucrados"] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: category.vendors.map((vendor, idx) => ((0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "text-xs", children: vendor }, idx))) })] }))] })] }) }) })] }, category.id));
                                    }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "rights", className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border-green-200 bg-white/50", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2 text-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Scale, { className: "h-5 w-5 text-blue-600" }), "Tus Derechos bajo el RGPD"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Como usuario, tienes derechos espec\u00EDficos sobre tus datos personales seg\u00FAn el RGPD." })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-blue-200 bg-blue-50/50 p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-2 font-semibold text-blue-800", children: "\uD83D\uDD0D Derecho de Acceso" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-blue-700", children: "Puedes solicitar una copia de todos los datos personales que tenemos sobre ti." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-green-200 bg-green-50/50 p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-2 font-semibold text-green-800", children: "\u270F\uFE0F Derecho de Rectificaci\u00F3n" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-green-700", children: "Puedes solicitar la correcci\u00F3n de datos personales inexactos o incompletos." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-red-200 bg-red-50/50 p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-2 font-semibold text-red-800", children: "\uD83D\uDDD1\uFE0F Derecho de Supresi\u00F3n" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700", children: "Puedes solicitar la eliminaci\u00F3n de tus datos personales en ciertas circunstancias." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-amber-200 bg-amber-50/50 p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-2 font-semibold text-amber-800", children: "\uD83D\uDCE6 Derecho de Portabilidad" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-amber-700", children: "Puedes solicitar tus datos en un formato estructurado y legible por m\u00E1quina." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-purple-200 bg-purple-50/50 p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-2 font-semibold text-purple-800", children: "\u26D4 Derecho de Oposici\u00F3n" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-purple-700", children: "Puedes oponerte al procesamiento de tus datos para marketing directo." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-indigo-200 bg-indigo-50/50 p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-2 font-semibold text-indigo-800", children: "\u23F8\uFE0F Derecho de Limitaci\u00F3n" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-indigo-700", children: "Puedes solicitar la limitaci\u00F3n del procesamiento en ciertas circunstancias." })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-gray-200 bg-gray-50 p-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-2 font-semibold text-gray-800", children: "\uD83D\uDCE7 Ejercer tus Derechos" }), (0, jsx_runtime_1.jsx)("p", { className: "mb-3 text-sm text-gray-700", children: "Para ejercer cualquiera de estos derechos, cont\u00E1ctanos en:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "outline", className: "bg-white", children: (0, jsx_runtime_1.jsx)("a", { href: `mailto:${contactEmail}`, className: "text-blue-600 hover:text-blue-700", children: contactEmail }) }) }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-xs text-gray-600", children: "Responderemos a tu solicitud dentro de 30 d\u00EDas seg\u00FAn lo establecido por el RGPD." })] })] })] }) })] })] }), (0, jsx_runtime_1.jsx)(separator_1.Separator, { className: "my-4" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col justify-end gap-3 sm:flex-row", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: handleRejectAll, className: "border-red-300 bg-white/50 text-red-700 transition-all duration-300 hover:bg-red-50", children: "\u274C Rechazar No Esenciales" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: handleSave, className: "border-blue-300 bg-white/50 text-blue-700 transition-all duration-300 hover:bg-blue-50", children: "\uD83D\uDCBE Guardar Preferencias" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleAcceptAll, className: "bg-gradient-to-r from-green-600 via-green-500 to-amber-500 text-white transition-all duration-300 hover:from-green-700 hover:via-green-600 hover:to-amber-600", children: "\u2705 Aceptar Todo" })] })] }) }));
}
//# sourceMappingURL=cookie-preferences-dialog.js.map