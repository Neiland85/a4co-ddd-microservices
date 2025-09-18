'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
const jsx_runtime_1 = require("react/jsx-runtime");
const banner_cookie_1 = __importDefault(require("../banner-cookie"));
function HomePage() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50", children: [(0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4 py-16", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-8 text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-green-800", children: "\uD83C\uDF6A Banner de Cookies Moderno RGPD" }), (0, jsx_runtime_1.jsx)("p", { className: "mx-auto max-w-2xl text-lg text-gray-700", children: "Un banner de cookies completamente moderno y conforme al RGPD con opciones detalladas, explicaciones claras y un dise\u00F1o atractivo." }), (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-green-200 bg-white/50 p-6 shadow-lg", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-2 font-semibold text-green-800", children: "\u2705 RGPD Compliant" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Cumple completamente con todas las regulaciones del RGPD" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-amber-200 bg-white/50 p-6 shadow-lg", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-2 font-semibold text-amber-800", children: "\uD83C\uDFA8 Dise\u00F1o Moderno" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Interfaz atractiva con gradientes y efectos visuales" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border border-blue-200 bg-white/50 p-6 shadow-lg", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-2 font-semibold text-blue-800", children: "\u2699\uFE0F Configuraci\u00F3n Granular" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Control detallado sobre cada categor\u00EDa de cookies" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)("p", { children: "Recarga la p\u00E1gina para ver el banner de cookies en acci\u00F3n" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                            localStorage.removeItem('a4co-cookie-consent-v2');
                                            window.location.reload();
                                        }, className: "text-blue-600 underline hover:text-blue-700", children: "Borrar cookies y mostrar banner" }) })] })] }) }), (0, jsx_runtime_1.jsx)(banner_cookie_1.default, { companyName: "A4CO", privacyPolicyUrl: "/privacy-policy", cookiePolicyUrl: "/cookie-policy", contactEmail: "privacy@a4co.com", position: "bottom", theme: "auto", onPreferencesChange: preferences => {
                    console.log('Preferencias actualizadas:', preferences);
                } })] }));
}
//# sourceMappingURL=page.js.map