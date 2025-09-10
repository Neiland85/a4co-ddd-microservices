'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieBanner = CookieBanner;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const dialog_1 = require("@/components/ui/dialog");
const switch_1 = require("@/components/ui/switch");
const lucide_react_1 = require("lucide-react");
const framer_motion_1 = require("framer-motion");
const use_sound_effects_1 = require("../../hooks/use-sound-effects");
const COOKIE_CONSENT_KEY = 'a4co-cookie-consent';
function CookieBanner({ companyName = 'A4CO', privacyPolicyUrl = '/politica-privacidad', onPreferencesChange, }) {
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const [showPreferences, setShowPreferences] = (0, react_1.useState)(false);
    const [preferences, setPreferences] = (0, react_1.useState)({
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
    });
    const { playClick, playSuccess } = (0, use_sound_effects_1.useSoundEffects)();
    (0, react_1.useEffect)(() => {
        const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!savedConsent) {
            setIsVisible(true);
        }
    }, []);
    const savePreferences = (prefs) => {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
            preferences: prefs,
            timestamp: new Date().toISOString(),
        }));
        setIsVisible(false);
        setShowPreferences(false);
        onPreferencesChange?.(prefs);
        playSuccess();
    };
    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true,
        };
        savePreferences(allAccepted);
    };
    const handleRejectNonEssential = () => {
        const essentialOnly = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false,
        };
        savePreferences(essentialOnly);
    };
    const handleConfigurePreferences = () => {
        setShowPreferences(true);
        playClick();
    };
    const handlePreferenceChange = (key, value) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };
    const handleSavePreferences = () => {
        savePreferences(preferences);
    };
    if (!isVisible) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.AnimatePresence, { children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-40 bg-black/20", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 100 }, transition: { type: 'spring', damping: 25, stiffness: 300 }, role: "dialog", "aria-labelledby": "cookie-banner-title", "aria-describedby": "cookie-banner-description", "aria-modal": "true", className: "fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6", children: (0, jsx_runtime_1.jsx)(card_1.Card, { className: "border-a4co-olive-200 shadow-natural-xl mx-auto max-w-4xl bg-white/95 backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-1 items-start gap-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: 0.2, type: 'spring' }, className: "mt-1 flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Cookie, { className: "text-a4co-clay-600 h-6 w-6 drop-shadow-sm", "aria-hidden": "true" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-2", children: [(0, jsx_runtime_1.jsx)("h2", { id: "cookie-banner-title", className: "text-a4co-olive-700 text-lg font-semibold drop-shadow-sm", children: "Valoramos tu Privacidad" }), (0, jsx_runtime_1.jsxs)("p", { id: "cookie-banner-description", className: "text-sm leading-relaxed text-gray-700", children: [companyName, " utiliza cookies y tecnolog\u00EDas similares para mejorar tu experiencia de navegaci\u00F3n, analizar el tr\u00E1fico del sitio y personalizar el contenido. Puedes gestionar tus preferencias o obtener m\u00E1s informaci\u00F3n en nuestra", ' ', (0, jsx_runtime_1.jsxs)("a", { href: privacyPolicyUrl, className: "text-a4co-clay-600 hover:text-a4co-clay-700 inline-flex items-center gap-1 underline transition-colors", target: "_blank", rel: "noopener noreferrer", "aria-label": "Pol\u00EDtica de Privacidad (se abre en nueva pesta\u00F1a)", children: ["Pol\u00EDtica de Privacidad", (0, jsx_runtime_1.jsx)(lucide_react_1.ExternalLink, { className: "h-3 w-3", "aria-hidden": "true" })] })] })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.3 }, className: "flex flex-col gap-3 sm:flex-row lg:flex-shrink-0", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: handleRejectNonEssential, onMouseEnter: () => playClick({ volume: 0.3 }), className: "border-a4co-olive-600 text-a4co-olive-600 hover:bg-a4co-olive-50 shadow-natural hover:shadow-natural-md bg-transparent text-xs transition-all duration-300 sm:text-sm", "aria-label": "Rechazar cookies no esenciales", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.span, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: "Rechazar No Esenciales" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: handleConfigurePreferences, className: "border-a4co-clay-600 text-a4co-clay-600 hover:bg-a4co-clay-50 shadow-natural hover:shadow-natural-md inline-flex items-center gap-2 bg-transparent text-xs transition-all duration-300 sm:text-sm", "aria-label": "Configurar preferencias de cookies", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.05, rotate: 90 }, whileTap: { scale: 0.95 }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-4 w-4", "aria-hidden": "true" }), "Configurar"] }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", onClick: handleAcceptAll, className: "from-a4co-olive-600 to-a4co-clay-600 hover:from-a4co-olive-700 hover:to-a4co-clay-700 shadow-mixed hover:shadow-mixed-lg bg-gradient-to-r text-xs text-white transition-all duration-300 sm:text-sm", "aria-label": "Aceptar todas las cookies", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.span, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: "Aceptar Todo" }) })] })] }) }) }) })] }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { open: showPreferences, onOpenChange: setShowPreferences, children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogContent, { className: "border-a4co-olive-200 max-w-2xl bg-white/95 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)(dialog_1.DialogTitle, { className: "text-a4co-olive-700 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-5 w-5" }), "Configuraci\u00F3n de Cookies"] }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-6 py-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded-lg bg-gray-50 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900", children: "Cookies Necesarias" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Esenciales para el funcionamiento b\u00E1sico del sitio web." })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: true, disabled: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded-lg bg-gray-50 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900", children: "Cookies de An\u00E1lisis" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Nos ayudan a entender c\u00F3mo interact\u00FAas con nuestro sitio web." })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: preferences.analytics, onCheckedChange: checked => handlePreferenceChange('analytics', checked) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded-lg bg-gray-50 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900", children: "Cookies de Marketing" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Utilizadas para mostrar anuncios relevantes y medir su efectividad." })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: preferences.marketing, onCheckedChange: checked => handlePreferenceChange('marketing', checked) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded-lg bg-gray-50 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900", children: "Cookies Funcionales" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Permiten funcionalidades mejoradas y personalizaci\u00F3n." })] }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: preferences.functional, onCheckedChange: checked => handlePreferenceChange('functional', checked) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 border-t pt-4", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", onClick: () => setShowPreferences(false), className: "flex-1", children: "Cancelar" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleSavePreferences, className: "from-a4co-olive-600 to-a4co-clay-600 hover:from-a4co-olive-700 hover:to-a4co-clay-700 flex-1 bg-gradient-to-r", children: "Guardar Preferencias" })] })] })] }) })] }));
}
//# sourceMappingURL=cookie-banner.js.map