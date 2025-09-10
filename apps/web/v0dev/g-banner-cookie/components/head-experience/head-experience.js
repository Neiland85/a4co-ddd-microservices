'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HeadExperience;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const framer_motion_1 = require("framer-motion");
const navigation_1 = require("./navigation");
const search_bar_1 = require("./search-bar");
const language_selector_1 = require("./language-selector");
const theme_toggle_1 = require("./theme-toggle");
const sound_controls_1 = require("./sound-controls");
const cookie_banner_1 = require("./cookie-banner");
const use_sound_effects_1 = require("../../hooks/use-sound-effects");
const defaultLanguages = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
];
const defaultSoundSettings = {
    enabled: true,
    volume: 0.3,
    clickSound: true,
    hoverSound: true,
    menuSound: true,
};
function HeadExperience({ logo = '/images/logo-green.jpeg', companyName = 'A4CO', navigationItems, languages = defaultLanguages, currentLanguage = 'es', onLanguageChange, onSearch, soundSettings = defaultSoundSettings, onSoundSettingsChange, }) {
    const [currentPath, setCurrentPath] = (0, react_1.useState)('/');
    const [localSoundSettings, setLocalSoundSettings] = (0, react_1.useState)(soundSettings);
    const { setGlobalVolume, setEnabled } = (0, use_sound_effects_1.useSoundEffects)();
    (0, react_1.useEffect)(() => {
        setCurrentPath(window.location.pathname);
    }, []);
    (0, react_1.useEffect)(() => {
        setGlobalVolume(localSoundSettings.volume);
        setEnabled(localSoundSettings.enabled);
    }, [localSoundSettings, setGlobalVolume, setEnabled]);
    const handleSoundSettingsChange = (settings) => {
        setLocalSoundSettings(settings);
        onSoundSettingsChange?.(settings);
    };
    const handleSearch = (query) => {
        console.log('Searching for:', query);
        onSearch?.(query);
    };
    const handleLanguageChange = (language) => {
        console.log('Language changed to:', language);
        onLanguageChange?.(language);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.header, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: 'easeOut' }, className: "border-a4co-olive-200 shadow-natural-sm sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-sm", role: "banner", children: (0, jsx_runtime_1.jsx)("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex h-16 items-center justify-between", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "flex items-center gap-3", children: (0, jsx_runtime_1.jsxs)(link_1.default, { href: "/", className: "flex items-center gap-3", "aria-label": `Ir a inicio de ${companyName}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "shadow-natural relative h-10 w-10 overflow-hidden rounded-lg", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: logo || '/placeholder.svg', alt: `Logo de ${companyName}`, fill: true, className: "object-cover", priority: true }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden sm:block", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-a4co-olive-700 text-xl font-bold tracking-tight", children: companyName }), (0, jsx_runtime_1.jsx)("p", { className: "text-a4co-clay-600 -mt-1 text-xs", children: "Artesan\u00EDa Aut\u00E9ntica" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-1 justify-center", children: (0, jsx_runtime_1.jsx)(navigation_1.Navigation, { items: navigationItems, currentPath: currentPath }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(search_bar_1.SearchBar, { onSearch: handleSearch }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden items-center gap-1 sm:flex", children: [(0, jsx_runtime_1.jsx)(language_selector_1.LanguageSelector, { languages: languages, currentLanguage: currentLanguage, onLanguageChange: handleLanguageChange }), (0, jsx_runtime_1.jsx)(theme_toggle_1.ThemeToggle, {}), (0, jsx_runtime_1.jsx)(sound_controls_1.SoundControls, { settings: localSoundSettings, onSettingsChange: handleSoundSettingsChange })] })] })] }) }) }), (0, jsx_runtime_1.jsx)(cookie_banner_1.CookieBanner, { companyName: companyName, privacyPolicyUrl: "/politica-privacidad" })] }));
}
//# sourceMappingURL=head-experience.js.map