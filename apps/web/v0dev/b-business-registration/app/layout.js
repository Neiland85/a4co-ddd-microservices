"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const sans_1 = require("geist/font/sans");
const mono_1 = require("geist/font/mono");
require("./globals.css");
exports.metadata = {
    title: 'v0 App',
    description: 'Created with v0',
    generator: 'v0.app',
};
function RootLayout({ children, }) {
    return ((0, jsx_runtime_1.jsxs)("html", { lang: "en", children: [(0, jsx_runtime_1.jsx)("head", { children: (0, jsx_runtime_1.jsx)("style", { children: `
html {
  font-family: ${sans_1.GeistSans.style.fontFamily};
  --font-sans: ${sans_1.GeistSans.variable};
  --font-mono: ${mono_1.GeistMono.variable};
}
        ` }) }), (0, jsx_runtime_1.jsx)("body", { children: children })] }));
}
//# sourceMappingURL=layout.js.map