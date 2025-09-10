'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CookieBanner;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const cookie_preferences_dialog_1 = require("./components/cookie-preferences-dialog");
const cookie_types_1 = require("./types/cookie-types");
function CookieBanner() {
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const [showPreferences, setShowPreferences] = (0, react_1.useState)(false);
    const [consentState, setConsentState] = (0, react_1.useState)({
        hasConsented: false,
        preferences: cookie_types_1.DEFAULT_COOKIE_PREFERENCES,
        version: cookie_types_1.COOKIE_CONSENT_VERSION,
    });
    (0, react_1.useEffect)(() => {
        const savedConsent = localStorage.getItem(cookie_types_1.COOKIE_CONSENT_KEY);
        if (savedConsent) {
            try {
                const parsed = JSON.parse(savedConsent);
                if (parsed.version === cookie_types_1.COOKIE_CONSENT_VERSION) {
                    setConsentState(parsed);
                    setIsVisible(false);
                }
                else {
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
    const handleAcceptAll = () => {
        const newState = {
            hasConsented: true,
            preferences: {
                necessary: true,
                analytics: true,
                marketing: true,
                functional: true,
            },
            consentDate: new Date(),
            version: cookie_types_1.COOKIE_CONSENT_VERSION,
        };
        setConsentState(newState);
        localStorage.setItem(cookie_types_1.COOKIE_CONSENT_KEY, JSON.stringify(newState));
        setIsVisible(false);
    };
    const handleAcceptNecessary = () => {
        const newState = {
            hasConsented: true,
            preferences: cookie_types_1.DEFAULT_COOKIE_PREFERENCES,
            consentDate: new Date(),
            version: cookie_types_1.COOKIE_CONSENT_VERSION,
        };
        setConsentState(newState);
        localStorage.setItem(cookie_types_1.COOKIE_CONSENT_KEY, JSON.stringify(newState));
        setIsVisible(false);
    };
    const handleSavePreferences = (preferences) => {
        const newState = {
            hasConsented: true,
            preferences,
            consentDate: new Date(),
            version: cookie_types_1.COOKIE_CONSENT_VERSION,
        };
        setConsentState(newState);
        localStorage.setItem(cookie_types_1.COOKIE_CONSENT_KEY, JSON.stringify(newState));
        setIsVisible(false);
        setShowPreferences(false);
    };
    const handleDismiss = () => {
        setIsVisible(false);
    };
    if (!isVisible)
        return null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/20 to-transparent p-4", children: (0, jsx_runtime_1.jsx)(card_1.Card, { className: "pointer-events-auto mx-auto max-w-4xl border bg-white/95 shadow-2xl backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Cookie, { className: "h-6 w-6 text-white" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-lg font-semibold text-gray-900", children: "Respetamos tu privacidad" }), (0, jsx_runtime_1.jsx)("p", { className: "mb-4 text-sm leading-relaxed text-gray-600", children: "Utilizamos cookies para mejorar tu experiencia, analizar el tr\u00E1fico del sitio y personalizar el contenido. Puedes elegir qu\u00E9 tipos de cookies aceptar." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-3 sm:flex-row", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleAcceptAll, className: "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl", children: "Aceptar todas" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleAcceptNecessary, variant: "outline", className: "border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50", children: "Solo necesarias" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: () => setShowPreferences(true), variant: "ghost", className: "text-gray-600 hover:text-gray-900", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "mr-2 h-4 w-4" }), "Personalizar"] })] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: handleDismiss, variant: "ghost", size: "sm", className: "flex-shrink-0 text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }) }) }) }), (0, jsx_runtime_1.jsx)(cookie_preferences_dialog_1.CookiePreferencesDialog, { isOpen: showPreferences, onClose: () => setShowPreferences(false), onSave: handleSavePreferences, currentPreferences: consentState.preferences })] }));
}
//# sourceMappingURL=banner-cookie.js.map