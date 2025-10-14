"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const google_1 = require("next/font/google");
require("./globals.css");
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: 'Dashboard Moderno - A4CO',
    description: 'Dashboard funcional para gestión de usuarios y análisis',
    generator: 'v0.dev',
};
function RootLayout({ children }) {
    return ((0, jsx_runtime_1.jsx)("html", { lang: "es", children: (0, jsx_runtime_1.jsx)("body", { className: inter.className, children: (0, jsx_runtime_1.jsxs)("div", { className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-100", children: [(0, jsx_runtime_1.jsxs)("div", { className: "pointer-events-none absolute inset-0 opacity-10", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-radial absolute left-0 top-0 h-96 w-96 rounded-full from-yellow-600/30 via-orange-500/20 to-transparent blur-3xl" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-radial absolute right-0 top-1/3 h-80 w-80 rounded-full from-fuchsia-500/20 via-pink-400/10 to-transparent blur-3xl" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-radial absolute bottom-0 left-1/3 h-72 w-72 rounded-full from-amber-600/25 via-yellow-500/15 to-transparent blur-3xl" })] }), (0, jsx_runtime_1.jsx)("div", { className: "relative z-10", children: children })] }) }) }));
}
//# sourceMappingURL=layout.js.map