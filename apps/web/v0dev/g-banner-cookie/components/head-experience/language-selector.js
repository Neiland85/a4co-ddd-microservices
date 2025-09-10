'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageSelector = LanguageSelector;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const popover_1 = require("@/components/ui/popover");
const lucide_react_1 = require("lucide-react");
const framer_motion_1 = require("framer-motion");
const use_sound_effects_1 = require("../../hooks/use-sound-effects");
function LanguageSelector({ languages, currentLanguage, onLanguageChange, }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { playClick, playHover } = (0, use_sound_effects_1.useSoundEffects)();
    const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
    const handleLanguageSelect = (languageCode) => {
        onLanguageChange(languageCode);
        setIsOpen(false);
        playClick();
    };
    return ((0, jsx_runtime_1.jsxs)(popover_1.Popover, { open: isOpen, onOpenChange: setIsOpen, children: [(0, jsx_runtime_1.jsx)(popover_1.PopoverTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "hover:bg-a4co-olive-50 h-9 px-3 transition-colors", "aria-label": `Idioma actual: ${currentLang.label}`, onMouseEnter: () => playHover(), children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "text-a4co-olive-600 h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-a4co-olive-700 text-sm font-medium", children: [currentLang.flag, " ", currentLang.code.toUpperCase()] }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: `text-a4co-olive-600 h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}` })] }) }) }), (0, jsx_runtime_1.jsx)(popover_1.PopoverContent, { className: "border-a4co-olive-200 shadow-natural-lg w-48 bg-white/95 p-1 backdrop-blur-sm", align: "end", children: (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "space-y-1", children: languages.map((language, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, onClick: () => handleLanguageSelect(language.code), onMouseEnter: () => playHover(), className: `flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${language.code === currentLanguage
                                ? 'bg-a4co-olive-100 text-a4co-olive-700'
                                : 'hover:bg-a4co-olive-50 text-gray-700'}`, role: "menuitem", "aria-selected": language.code === currentLanguage, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: language.flag }), (0, jsx_runtime_1.jsx)("span", { className: "flex-1 text-left", children: language.label }), language.code === currentLanguage && ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "text-a4co-olive-600 h-4 w-4" }))] }, language.code))) }) }) })] }));
}
//# sourceMappingURL=language-selector.js.map