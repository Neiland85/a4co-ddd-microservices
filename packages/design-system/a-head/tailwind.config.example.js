"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importar el preset del Design System
const tailwind_1 = __importDefault(require("@a4co/design-system/tailwind"));
const config = {
    // Usar el preset como base
    presets: [tailwind_1.default],
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        // Incluir el Design System en el content para que Tailwind procese sus clases
        '../../packages/design-system/src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
        // Aquí puedes extender o sobrescribir tokens específicos de esta app
        // Los tokens del Design System ya están incluidos desde el preset
        },
    },
    plugins: [
    // Plugins adicionales específicos de esta app
    ],
};
exports.default = config;
//# sourceMappingURL=tailwind.config.example.js.map