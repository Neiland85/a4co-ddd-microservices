'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeToggle = ThemeToggle;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const framer_motion_1 = require("framer-motion");
const use_sound_effects_1 = require("../../hooks/use-sound-effects");
function ThemeToggle() {
    const [theme, setTheme] = (0, react_1.useState)('light');
    const { playClick } = (0, use_sound_effects_1.useSoundEffects)();
    (0, react_1.useEffect)(() => {
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        playClick();
    };
    return ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: toggleTheme, className: "hover:bg-a4co-olive-50 h-9 w-9 p-0 transition-colors", "aria-label": `Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`, children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, initial: false, animate: { rotate: theme === 'dark' ? 180 : 0 }, transition: { duration: 0.3, ease: 'easeInOut' }, children: theme === 'light' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Moon, { className: "text-a4co-olive-600 h-4 w-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Sun, { className: "h-4 w-4 text-yellow-500" })) }) }));
}
//# sourceMappingURL=theme-toggle.js.map