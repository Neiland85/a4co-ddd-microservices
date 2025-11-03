'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorVerification = TwoFactorVerification;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const validation_1 = require("@/lib/validation");
const lucide_react_1 = require("lucide-react");
function TwoFactorVerification({ email, phone, onBack, onSuccess, }) {
    const [method, setMethod] = (0, react_1.useState)('email');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [codeSent, setCodeSent] = (0, react_1.useState)(false);
    const [timeLeft, setTimeLeft] = (0, react_1.useState)(60);
    const { register, handleSubmit, formState: { errors }, watch, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(validation_1.verificationSchema),
    });
    const code = watch('code');
    const sendCode = async () => {
        setIsLoading(true);
        // Simular envío de código
        await new Promise(resolve => setTimeout(resolve, 2000));
        setCodeSent(true);
        setIsLoading(false);
        // Iniciar countdown
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
    const onSubmit = async (data) => {
        setIsLoading(true);
        // Simular verificación
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        onSuccess();
    };
    const resendCode = () => {
        setTimeLeft(60);
        sendCode();
    };
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "mx-auto w-full max-w-md", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border-2 border-purple-200 bg-white/95 p-8 shadow-2xl backdrop-blur-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6 text-center", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { rotate: [0, 10, -10, 0] }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY }, className: "mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { size: 32 }) }), (0, jsx_runtime_1.jsx)("h2", { className: "mb-2 text-2xl font-bold text-gray-900", children: "Verificaci\u00F3n de Seguridad" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Para proteger tu cuenta, necesitamos verificar tu identidad" })] }), !codeSent ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { className: "text-sm font-medium text-gray-700", children: "Elige tu m\u00E9todo de verificaci\u00F3n:" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => setMethod('email'), className: `w-full rounded-lg border-2 p-4 transition-all ${method === 'email'
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: `h-5 w-5 ${method === 'email' ? 'text-purple-600' : 'text-gray-500'}` }), (0, jsx_runtime_1.jsxs)("div", { className: "text-left", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: "Correo Electr\u00F3nico" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: email })] })] }) }), phone && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => setMethod('phone'), className: `w-full rounded-lg border-2 p-4 transition-all ${method === 'phone'
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: `h-5 w-5 ${method === 'phone' ? 'text-purple-600' : 'text-gray-500'}` }), (0, jsx_runtime_1.jsxs)("div", { className: "text-left", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: "N\u00FAmero de Tel\u00E9fono" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: phone })] })] }) }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: onBack, variant: "outline", className: "flex-1 border-gray-300 bg-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 16, className: "mr-2" }), "Volver"] }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: sendCode, disabled: isLoading, className: "flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700", children: isLoading ? 'Enviando...' : 'Enviar Código' })] })] })) : ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("p", { className: "mb-4 text-sm text-gray-600", children: ["Hemos enviado un c\u00F3digo de 6 d\u00EDgitos a tu", ' ', method === 'email' ? 'correo' : 'teléfono'] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: method === 'email' ? email : phone })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "code", children: "C\u00F3digo de Verificaci\u00F3n" }), (0, jsx_runtime_1.jsx)(input_1.Input, { ...register('code'), id: "code", placeholder: "000000", className: "text-center font-mono text-2xl tracking-widest", maxLength: 6 }), errors.code && (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-600", children: errors.code.message })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-center", children: timeLeft > 0 ? ((0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: ["Reenviar c\u00F3digo en ", timeLeft, "s"] })) : ((0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "link", onClick: resendCode, className: "text-purple-600 hover:text-purple-700", children: "Reenviar c\u00F3digo" })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { type: "button", onClick: onBack, variant: "outline", className: "flex-1 border-gray-300 bg-transparent", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 16, className: "mr-2" }), "Volver"] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", disabled: isLoading || !code || code.length !== 6, className: "flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700", children: isLoading ? 'Verificando...' : 'Verificar' })] })] }))] }) }));
}
//# sourceMappingURL=two-factor-verification.js.map