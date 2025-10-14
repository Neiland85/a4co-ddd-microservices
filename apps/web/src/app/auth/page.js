'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const tabs_1 = require("@/components/ui/tabs");
const login_form_1 = require("@/components/auth/login-form");
const register_form_1 = require("@/components/auth/register-form");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
function AuthPage() {
    const [activeTab, setActiveTab] = (0, react_1.useState)('login');
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-amber-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-md", children: [(0, jsx_runtime_1.jsxs)(link_1.default, { href: "/", className: "mb-6 inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "mr-2 h-4 w-4" }), "Volver al inicio"] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border-0 shadow-2xl", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "pb-4 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-amber-500", children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl font-bold text-white", children: "J" }) }), (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-2xl font-bold text-gray-900", children: "Ja\u00E9n Artesanal" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-gray-600", children: "Accede a tu cuenta o crea una nueva" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "mb-6 grid w-full grid-cols-2", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "login", children: "Iniciar Sesi\u00F3n" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "register", children: "Registrarse" })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "login", className: "space-y-4", children: (0, jsx_runtime_1.jsx)(login_form_1.LoginForm, {}) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "register", className: "space-y-4", children: (0, jsx_runtime_1.jsx)(register_form_1.RegisterForm, {}) })] }) })] })] }) }));
}
//# sourceMappingURL=page.js.map