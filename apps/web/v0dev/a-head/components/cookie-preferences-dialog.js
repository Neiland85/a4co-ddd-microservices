'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookiePreferencesDialog = CookiePreferencesDialog;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const switch_1 = require("@/components/ui/switch");
const lucide_react_1 = require("lucide-react");
function CookiePreferencesDialog({ isOpen, onClose, onSave, currentPreferences, }) {
    const [preferences, setPreferences] = (0, react_1.useState)(currentPreferences);
    const handleSave = () => {
        onSave(preferences);
    };
    const cookieCategories = [
        {
            key: 'necessary',
            title: 'Cookies Necesarias',
            description: 'Esenciales para el funcionamiento básico del sitio web. No se pueden desactivar.',
            icon: lucide_react_1.Shield,
            color: 'text-green-600',
            disabled: true,
        },
        {
            key: 'functional',
            title: 'Cookies Funcionales',
            description: 'Permiten funcionalidades mejoradas y personalización, como recordar tus preferencias.',
            icon: lucide_react_1.Zap,
            color: 'text-blue-600',
            disabled: false,
        },
        {
            key: 'analytics',
            title: 'Cookies de Análisis',
            description: 'Nos ayudan a entender cómo los visitantes interactúan con el sitio web.',
            icon: lucide_react_1.BarChart3,
            color: 'text-purple-600',
            disabled: false,
        },
        {
            key: 'marketing',
            title: 'Cookies de Marketing',
            description: 'Se utilizan para mostrar anuncios relevantes y medir la efectividad de las campañas.',
            icon: lucide_react_1.Target,
            color: 'text-orange-600',
            disabled: false,
        },
    ];
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white shadow-2xl", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-xl font-semibold text-gray-900", children: "Preferencias de Cookies" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: onClose, variant: "ghost", size: "sm", className: "text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-5 w-5" }) })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-6 p-6", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm leading-relaxed text-gray-600", children: "Gestiona tus preferencias de cookies. Puedes activar o desactivar diferentes tipos de cookies seg\u00FAn tus necesidades. Las cookies necesarias siempre est\u00E1n activas para garantizar el funcionamiento b\u00E1sico del sitio." }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: cookieCategories.map(category => {
                                const Icon = category.icon;
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300", children: [(0, jsx_runtime_1.jsx)("div", { className: `flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 ${category.color}`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: category.title }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: preferences[category.key], onCheckedChange: checked => setPreferences(prev => ({ ...prev, [category.key]: checked })), disabled: category.disabled })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm leading-relaxed text-gray-600", children: category.description })] })] }, category.key));
                            }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleSave, className: "flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl", children: "Guardar Preferencias" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: onClose, variant: "outline", className: "flex-1 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50", children: "Cancelar" })] })] })] }) }));
}
//# sourceMappingURL=cookie-preferences-dialog.js.map