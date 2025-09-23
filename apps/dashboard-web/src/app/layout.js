"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const google_1 = require("next/font/google");
const theme_provider_1 = require("../components/theme-provider");
require("./globals.css");
const geistSans = (0, google_1.Geist)({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});
const geistMono = (0, google_1.Geist_Mono)({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});
exports.metadata = {
    title: 'A4CO Dashboard - Microservices',
    description: 'Dashboard para gestión de microservicios DDD',
};
function RootLayout({ children }) {
    return ((0, jsx_runtime_1.jsx)("html", { lang: "es", suppressHydrationWarning: true, children: (0, jsx_runtime_1.jsx)("body", { className: `${geistSans.variable} ${geistMono.variable} antialiased`, children: (0, jsx_runtime_1.jsx)(theme_provider_1.ThemeProvider, { children: children }) }) }));
}
//# sourceMappingURL=layout.js.map