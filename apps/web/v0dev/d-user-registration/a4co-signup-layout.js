'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = A4coSignupLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const a4co_branding_1 = require("./components/a4co-branding");
const a4co_signup_form_1 = require("./components/a4co-signup-form");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
function A4coSignupLayout() {
    const [isSuccess, setIsSuccess] = (0, react_1.useState)(false);
    const [userData, setUserData] = (0, react_1.useState)(null);
    const handleSignupSuccess = (data) => {
        setUserData(data);
        setIsSuccess(true);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-blob absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-400 opacity-20 mix-blend-multiply blur-xl filter" }), (0, jsx_runtime_1.jsx)("div", { className: "animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-400 opacity-20 mix-blend-multiply blur-xl filter" }), (0, jsx_runtime_1.jsx)("div", { className: "animate-blob animation-delay-4000 absolute left-40 top-40 h-80 w-80 rounded-full bg-purple-400 opacity-20 mix-blend-multiply blur-xl filter" })] }), (0, jsx_runtime_1.jsx)("div", { className: "container relative z-10 mx-auto px-4 py-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto grid min-h-screen max-w-7xl gap-8 lg:grid-cols-5", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-col justify-center lg:col-span-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "sticky top-8", children: [(0, jsx_runtime_1.jsx)(a4co_branding_1.A4coBranding, {}), (0, jsx_runtime_1.jsx)("div", { className: "hidden lg:block", children: (0, jsx_runtime_1.jsx)(a4co_branding_1.A4coFeatures, {}) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, className: "mt-8 rounded-lg border border-gray-100 bg-white/60 p-6 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-3 flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 font-semibold text-white", children: "M" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-gray-900", children: "Mar\u00EDa Gonz\u00E1lez" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "CEO, TechStart" })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm italic text-gray-700", children: "\"a4co transform\u00F3 completamente nuestra operaci\u00F3n. Las herramientas son intuitivas y el soporte es excepcional.\"" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2 flex text-yellow-400", children: '★'.repeat(5) })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center lg:col-span-3", children: (0, jsx_runtime_1.jsx)("div", { className: "w-full max-w-2xl", children: (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { mode: "wait", children: !isSuccess ? ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, children: (0, jsx_runtime_1.jsx)(a4co_signup_form_1.A4coSignupForm, { onSuccess: handleSignupSuccess }) }, "signup-form")) : ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, className: "text-center", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border border-gray-200 bg-white/95 p-8 shadow-xl backdrop-blur-lg", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { scale: [1, 1.1, 1] }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY }, className: "mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 40 }) }), (0, jsx_runtime_1.jsxs)("h2", { className: "mb-4 text-3xl font-bold text-gray-900", children: ["\u00A1Bienvenido a a4co, ", userData?.firstName, "!"] }), (0, jsx_runtime_1.jsxs)("p", { className: "mx-auto mb-6 max-w-md text-gray-600", children: ["Tu cuenta ha sido creada exitosamente. Hemos enviado un correo de confirmaci\u00F3n a", ' ', (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-blue-600", children: userData?.email })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6 rounded-lg bg-blue-50 p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-2 font-semibold text-blue-900", children: "Pr\u00F3ximos pasos:" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-1 text-left text-sm text-blue-800", children: [(0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-blue-600", children: "1." }), "Verifica tu correo electr\u00F3nico"] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-blue-600", children: "2." }), "Completa la configuraci\u00F3n de tu perfil"] }), (0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-blue-600", children: "3." }), "Explora nuestras herramientas empresariales"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { className: "w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 16, className: "mr-2" }), "Acceder a mi Dashboard"] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "outline", className: "w-full border-gray-300 bg-transparent", children: "Reenviar correo de confirmaci\u00F3n" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 border-t border-gray-200 pt-6", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: ["\u00BFNecesitas ayuda?", ' ', (0, jsx_runtime_1.jsx)("a", { href: "#", className: "font-medium text-blue-600 hover:underline", children: "Contacta a nuestro equipo de soporte" })] }) })] }) }, "success")) }) }) })] }) }), (0, jsx_runtime_1.jsx)("footer", { className: "relative z-10 border-t border-gray-200 bg-white/80 backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4 py-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-between gap-4 md:flex-row", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600", children: (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-white", children: "a4" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "\u00A9 2024 a4co. Todos los derechos reservados." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-6 text-sm", children: [(0, jsx_runtime_1.jsx)("a", { href: "#", className: "text-gray-600 transition-colors hover:text-blue-600", children: "T\u00E9rminos" }), (0, jsx_runtime_1.jsx)("a", { href: "#", className: "text-gray-600 transition-colors hover:text-blue-600", children: "Privacidad" }), (0, jsx_runtime_1.jsx)("a", { href: "#", className: "text-gray-600 transition-colors hover:text-blue-600", children: "Soporte" }), (0, jsx_runtime_1.jsx)("a", { href: "#", className: "text-gray-600 transition-colors hover:text-blue-600", children: "Contacto" })] })] }) }) }), (0, jsx_runtime_1.jsx)("style", { jsx: true, children: `
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      ` })] }));
}
//# sourceMappingURL=a4co-signup-layout.js.map