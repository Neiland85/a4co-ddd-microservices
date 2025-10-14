'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconItem = IconItem;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const LucideIcons = __importStar(require("lucide-react"));
function IconItem({ config, onClick }) {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    // Get the icon component from Lucide
    const IconComponent = LucideIcons[config.icon] || LucideIcons.HelpCircle;
    const handleClick = () => {
        if (config.onClick) {
            config.onClick();
        }
        if (onClick) {
            onClick(config);
        }
    };
    const getSizeClasses = () => {
        switch (config.size) {
            case 'sm':
                return 'w-8 h-8';
            case 'lg':
                return 'w-12 h-12';
            default:
                return 'w-10 h-10';
        }
    };
    const getCardSize = () => {
        switch (config.size) {
            case 'sm':
                return 'p-3';
            case 'lg':
                return 'p-6';
            default:
                return 'p-4';
        }
    };
    return ((0, jsx_runtime_1.jsx)(card_1.Card, { className: `
        cursor-pointer transition-all duration-300 hover:shadow-lg
        ${config.isActive ? 'shadow-md ring-2 ring-blue-500' : ''}
        ${isHovered ? 'scale-105 shadow-xl' : ''}
      `, style: { backgroundColor: config.bgColor }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), onClick: handleClick, children: (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: `flex flex-col items-center justify-center space-y-2 ${getCardSize()}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(IconComponent, { className: `${getSizeClasses()} transition-all duration-300`, style: { color: config.color } }), config.isActive && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-center", children: [(0, jsx_runtime_1.jsx)("h3", { className: "max-w-full truncate text-sm font-medium text-gray-900", children: config.name }), (0, jsx_runtime_1.jsx)("p", { className: "line-clamp-2 text-xs text-gray-600", children: config.description }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: "secondary", className: "text-xs", style: {
                                backgroundColor: `${config.color}20`,
                                color: config.color,
                                borderColor: `${config.color}40`,
                            }, children: config.category })] })] }) }));
}
//# sourceMappingURL=icon-item.js.map