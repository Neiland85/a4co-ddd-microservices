'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BannerCookie;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const cookie_preferences_dialog_1 = require("./components/cookie-preferences-dialog");
const COOKIE_CONSENT_KEY = 'a4co-cookie-consent-v2';
const CONSENT_VERSION = '2.1';
function BannerCookie({ companyName = 'A4CO', privacyPolicyUrl = '/privacy-policy', cookiePolicyUrl = '/cookie-policy', contactEmail = 'privacy@a4co.com', onPreferencesChange, position = 'bottom', theme = 'auto', }) {
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const [showPreferences, setShowPreferences] = (0, react_1.useState)(false);
    const [isMinimized, setIsMinimized] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Check if user has already made a choice with current version
        const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (savedConsent) {
            try {
                const consent = JSON.parse(savedConsent);
                // Show banner again if version changed or consent is older than 13 months
                const consentDate = new Date(consent.timestamp);
                const thirteenMonthsAgo = new Date();
                thirteenMonthsAgo.setMonth(thirteenMonthsAgo.getMonth() - 13);
                if (consent.version !== CONSENT_VERSION || consentDate < thirteenMonthsAgo) {
                    setIsVisible(true);
                }
            }
            catch {
                setIsVisible(true);
            }
        }
        else {
            setIsVisible(true);
        }
    }, []);
    const savePreferences = (preferences) => {
        const consent = {
            preferences,
            timestamp: new Date().toISOString(),
            version: CONSENT_VERSION,
            userAgent: navigator.userAgent,
        };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
        setIsVisible(false);
        setShowPreferences(false);
        onPreferencesChange?.(preferences);
        // Dispatch custom event for other parts of the app
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }));
    };
    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true,
            personalization: true,
            social: true,
        };
        savePreferences(allAccepted);
    };
    const handleRejectNonEssential = () => {
        const essentialOnly = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false,
            personalization: false,
            social: false,
        };
        savePreferences(essentialOnly);
    };
    const handleConfigurePreferences = () => {
        setShowPreferences(true);
    };
    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };
    if (!isVisible) {
        return null;
    }
    const positionClasses = {
        bottom: 'bottom-0 left-0 right-0',
        top: 'top-0 left-0 right-0',
        center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("div", { role: "dialog", "aria-labelledby": "cookie-banner-title", "aria-describedby": "cookie-banner-description", "aria-modal": "true", className: `fixed ${positionClasses[position]} z-50 p-4 transition-all duration-500 ease-out sm:p-6 ${isMinimized ? 'translate-y-2 transform' : ''}`, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "mx-auto max-w-5xl overflow-hidden border-0 bg-gradient-to-br from-white via-green-50/50 to-amber-50/30 shadow-2xl backdrop-blur-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 pb-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Cookie, { className: "h-8 w-8 text-amber-600 drop-shadow-sm" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "absolute -right-1 -top-1 h-4 w-4 animate-pulse text-green-600" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { id: "cookie-banner-title", className: "text-xl font-bold text-green-800 drop-shadow-sm", children: "\uD83C\uDF6A Gesti\u00F3n de Cookies y Privacidad" }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "border-green-300 bg-green-50/50 text-xs text-green-700", children: ["RGPD Compliant \u2022 Versi\u00F3n ", CONSENT_VERSION] })] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: handleMinimize, className: "text-gray-500 hover:bg-gray-100/50 hover:text-gray-700", "aria-label": isMinimized ? 'Expandir banner' : 'Minimizar banner', children: isMinimized ? (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: `transition-all duration-300 ${isMinimized ? 'p-4 pt-2' : 'p-6 pt-4'}`, children: [!isMinimized && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("p", { id: "cookie-banner-description", className: "text-sm leading-relaxed text-gray-700", children: ["En ", (0, jsx_runtime_1.jsx)("strong", { children: companyName }), ", respetamos tu privacidad y cumplimos estrictamente con el", (0, jsx_runtime_1.jsx)("strong", { children: " Reglamento General de Protecci\u00F3n de Datos (RGPD)" }), ". Utilizamos cookies y tecnolog\u00EDas similares para mejorar tu experiencia, analizar el uso del sitio y personalizar contenido."] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 text-xs md:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2 rounded-lg border border-green-200/50 bg-green-50/50 p-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-green-800", children: "Transparencia Total" }), (0, jsx_runtime_1.jsx)("p", { className: "text-green-700", children: "Control completo sobre tus datos personales" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2 rounded-lg border border-amber-200/50 bg-amber-50/50 p-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-amber-800", children: "Seguridad Garantizada" }), (0, jsx_runtime_1.jsx)("p", { className: "text-amber-700", children: "Encriptaci\u00F3n y protecci\u00F3n de datos" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2 rounded-lg border border-blue-200/50 bg-blue-50/50 p-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-blue-800", children: "Tus Derechos" }), (0, jsx_runtime_1.jsx)("p", { className: "text-blue-700", children: "Acceso, rectificaci\u00F3n y eliminaci\u00F3n" })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-4 text-xs", children: [(0, jsx_runtime_1.jsxs)("a", { href: privacyPolicyUrl, className: "inline-flex items-center gap-1 text-green-600 underline transition-colors hover:text-green-700", target: "_blank", rel: "noopener noreferrer", "aria-label": "Pol\u00EDtica de Privacidad (se abre en nueva pesta\u00F1a)", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-3 w-3" }), "Pol\u00EDtica de Privacidad", (0, jsx_runtime_1.jsx)(lucide_react_1.ExternalLink, { className: "h-3 w-3" })] }), (0, jsx_runtime_1.jsxs)("a", { href: cookiePolicyUrl, className: "inline-flex items-center gap-1 text-amber-600 underline transition-colors hover:text-amber-700", target: "_blank", rel: "noopener noreferrer", "aria-label": "Pol\u00EDtica de Cookies (se abre en nueva pesta\u00F1a)", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Cookie, { className: "h-3 w-3" }), "Pol\u00EDtica de Cookies", (0, jsx_runtime_1.jsx)(lucide_react_1.ExternalLink, { className: "h-3 w-3" })] }), (0, jsx_runtime_1.jsxs)("a", { href: `mailto:${contactEmail}`, className: "inline-flex items-center gap-1 text-blue-600 underline transition-colors hover:text-blue-700", "aria-label": "Contactar sobre privacidad", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-3 w-3" }), "Contacto Privacidad"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-3 border-t border-gray-200/50 pt-4 sm:flex-row", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", size: "sm", onClick: handleRejectNonEssential, className: "flex-1 border-red-300 bg-white/50 text-red-700 shadow-sm transition-all duration-300 hover:bg-red-50 hover:shadow-md sm:flex-none", "aria-label": "Rechazar cookies no esenciales", children: "\u274C Rechazar No Esenciales" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", size: "sm", onClick: handleConfigurePreferences, className: "inline-flex flex-1 items-center gap-2 border-blue-300 bg-white/50 text-blue-700 shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md sm:flex-none", "aria-label": "Configurar preferencias de cookies", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-4 w-4" }), "\u2699\uFE0F Configurar Preferencias"] }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", onClick: handleAcceptAll, className: "flex-1 bg-gradient-to-r from-green-600 via-green-500 to-amber-500 text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:via-green-600 hover:to-amber-600 hover:shadow-xl sm:flex-none", "aria-label": "Aceptar todas las cookies", children: "\u2705 Aceptar Todo" })] })] }) })), isMinimized && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "\uD83C\uDF6A Gesti\u00F3n de cookies - Haz clic para expandir" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "outline", onClick: handleRejectNonEssential, children: "Rechazar" }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", onClick: handleAcceptAll, children: "Aceptar" })] })] }))] })] }) }), (0, jsx_runtime_1.jsx)(cookie_preferences_dialog_1.CookiePreferencesDialog, { open: showPreferences, onOpenChange: setShowPreferences, onSave: savePreferences, onAcceptAll: handleAcceptAll, onRejectAll: handleRejectNonEssential, companyName: companyName, contactEmail: contactEmail })] }));
}
//# sourceMappingURL=banner-cookie.js.map