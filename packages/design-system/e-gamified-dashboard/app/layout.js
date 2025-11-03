"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const google_1 = require("next/font/google");
require("./globals.css");
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: 'Dashboard Gamificado - Navegador Épico',
    description: 'Dashboard altamente gamificado para usuarios navegadores con ofertas, mapas interactivos y actividades',
    generator: 'v0.app',
};
function RootLayout({ children }) {
    return ((0, jsx_runtime_1.jsx)("html", { lang: "es", children: (0, jsx_runtime_1.jsx)("body", { className: inter.className, children: children }) }));
}
//# sourceMappingURL=layout.js.map