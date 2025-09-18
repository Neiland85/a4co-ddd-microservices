'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundControls = SoundControls;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const popover_1 = require("@/components/ui/popover");
const slider_1 = require("@/components/ui/slider");
const switch_1 = require("@/components/ui/switch");
const lucide_react_1 = require("lucide-react");
const framer_motion_1 = require("framer-motion");
const use_sound_effects_1 = require("../../hooks/use-sound-effects");
function SoundControls({ settings, onSettingsChange }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const { setGlobalVolume, setEnabled, playClick } = (0, use_sound_effects_1.useSoundEffects)();
    const handleVolumeChange = (value) => {
        const newVolume = value[0] / 100;
        const newSettings = { ...settings, volume: newVolume };
        onSettingsChange(newSettings);
        setGlobalVolume(newVolume);
    };
    const handleEnabledChange = (enabled) => {
        const newSettings = { ...settings, enabled };
        onSettingsChange(newSettings);
        setEnabled(enabled);
        if (enabled)
            playClick();
    };
    const handleSettingChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        onSettingsChange(newSettings);
        if (settings.enabled)
            playClick();
    };
    return ((0, jsx_runtime_1.jsxs)(popover_1.Popover, { open: isOpen, onOpenChange: setIsOpen, children: [(0, jsx_runtime_1.jsx)(popover_1.PopoverTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", className: "hover:bg-a4co-olive-50 h-9 w-9 p-0 transition-colors", "aria-label": settings.enabled ? 'Sonido activado' : 'Sonido desactivado', onMouseEnter: () => settings.enabled && playClick({ volume: 0.3 }), children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, children: settings.enabled ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Volume2, { className: "text-a4co-olive-600 h-4 w-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.VolumeX, { className: "h-4 w-4 text-gray-400" })) }) }) }), (0, jsx_runtime_1.jsx)(popover_1.PopoverContent, { className: "border-a4co-olive-200 shadow-natural-lg w-80 bg-white/95 p-4 backdrop-blur-sm", align: "end", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("h3", { className: "text-a4co-olive-700 flex items-center gap-2 text-sm font-semibold", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-4 w-4" }), "Configuraci\u00F3n de Sonido"] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "sound-enabled", className: "text-sm text-gray-700", children: "Activar sonidos" }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { id: "sound-enabled", checked: settings.enabled, onCheckedChange: handleEnabledChange })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("label", { className: "text-sm text-gray-700", children: ["Volumen: ", Math.round(settings.volume * 100), "%"] }), (0, jsx_runtime_1.jsx)(slider_1.Slider, { value: [settings.volume * 100], onValueChange: handleVolumeChange, max: 100, step: 5, disabled: !settings.enabled, className: "w-full" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-a4co-olive-200 space-y-3 border-t pt-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-medium uppercase tracking-wide text-gray-600", children: "Efectos de Sonido" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "click-sound", className: "text-sm text-gray-700", children: "Clicks" }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { id: "click-sound", checked: settings.clickSound, onCheckedChange: checked => handleSettingChange('clickSound', checked), disabled: !settings.enabled })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "hover-sound", className: "text-sm text-gray-700", children: "Hover" }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { id: "hover-sound", checked: settings.hoverSound, onCheckedChange: checked => handleSettingChange('hoverSound', checked), disabled: !settings.enabled })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "menu-sound", className: "text-sm text-gray-700", children: "Men\u00FAs" }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { id: "menu-sound", checked: settings.menuSound, onCheckedChange: checked => handleSettingChange('menuSound', checked), disabled: !settings.enabled })] })] })] })] }) })] }));
}
//# sourceMappingURL=sound-controls.js.map