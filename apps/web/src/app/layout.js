"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const google_1 = require("next/font/google");
require("./globals.css");
const next_themes_1 = require("next-themes");
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: 'A4CO Marketplace - Productos Artesanales',
    description: 'Descubre productos únicos de artesanos locales en nuestro marketplace',
    keywords: 'marketplace, artesanías, productos locales, artesanos',
};
function RootLayout({ children }) {
    return ((0, jsx_runtime_1.jsx)("html", { lang: "es", suppressHydrationWarning: true, children: (0, jsx_runtime_1.jsx)("body", { className: inter.className, children: (0, jsx_runtime_1.jsx)(next_themes_1.ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, disableTransitionOnChange: true, children: children }) }) }));
}
//# sourceMappingURL=layout.js.map