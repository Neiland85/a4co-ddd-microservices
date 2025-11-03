'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieBanner = CookieBanner;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
function CookieBanner() {
    const [showBanner, setShowBanner] = (0, react_1.useState)(false);
    const [showSettings, setShowSettings] = (0, react_1.useState)(false);
    const [preferences, setPreferences] = (0, react_1.useState)({
        necessary: true,
        analytics: false,
        marketing: false,
        personalization: false,
    });
    (0, react_1.useEffect)(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);
    const acceptAll = () => {
        setPreferences({
            necessary: true,
            analytics: true,
            marketing: true,
            personalization: true,
        });
        localStorage.setItem('cookie-consent', JSON.stringify({
            ...preferences,
            analytics: true,
            marketing: true,
            personalization: true,
        }));
        setShowBanner(false);
    };
    const acceptSelected = () => {
        localStorage.setItem('cookie-consent', JSON.stringify(preferences));
        setShowBanner(false);
    };
    const rejectAll = () => {
        setPreferences({
            necessary: true,
            analytics: false,
            marketing: false,
            personalization: false,
        });
        localStorage.setItem('cookie-consent', JSON.stringify({
            necessary: true,
            analytics: false,
            marketing: false,
            personalization: false,
        }));
        setShowBanner(false);
    };
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: showBanner && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 100, opacity: 0 }, className: "fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border-2 border-purple-200 bg-white/95 p-6 shadow-2xl backdrop-blur-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4 flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { rotate: [0, 10, -10, 0] }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY }, className: "text-purple-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Cookie, { size: 24 }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-2 font-bold text-gray-900", children: "\uD83C\uDF6A \u00A1Cookies Deliciosas!" }), (0, jsx_runtime_1.jsx)("p", { className: "mb-4 text-sm text-gray-600", children: "Usamos cookies para mejorar tu experiencia. \u00BFNos permites usar algunas cookies opcionales para personalizar tu experiencia?" })] })] }), showSettings && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, className: "mb-4 space-y-3", children: Object.entries({
                            necessary: 'Necesarias (Requeridas)',
                            analytics: 'Analíticas',
                            marketing: 'Marketing',
                            personalization: 'Personalización',
                        }).map(([key, label]) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: label }), (0, jsx_runtime_1.jsx)("button", { onClick: () => key !== 'necessary' &&
                                        setPreferences(prev => ({
                                            ...prev,
                                            [key]: !prev[key],
                                        })), disabled: key === 'necessary', className: `h-6 w-12 rounded-full transition-colors ${preferences[key]
                                        ? 'bg-purple-600'
                                        : 'bg-gray-300'} ${key === 'necessary' ? 'opacity-50' : ''}`, children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: {
                                            x: preferences[key] ? 24 : 2,
                                        }, className: "h-5 w-5 rounded-full bg-white shadow-md" }) })] }, key))) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: acceptAll, className: "flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Check, { size: 16, className: "mr-1" }), "Aceptar Todo"] }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: () => setShowSettings(!showSettings), variant: "outline", size: "icon", className: "border-purple-200 hover:bg-purple-50", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { size: 16 }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { onClick: acceptSelected, variant: "outline", className: "flex-1 border-purple-200 bg-transparent hover:bg-purple-50", children: "Guardar Preferencias" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: rejectAll, variant: "outline", size: "icon", className: "border-red-200 bg-transparent text-red-600 hover:bg-red-50", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 16 }) })] })] })] }) })) }));
}
//# sourceMappingURL=cookie-banner.js.map