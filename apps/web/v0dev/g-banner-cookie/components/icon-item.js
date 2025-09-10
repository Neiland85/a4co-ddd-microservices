'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IconItem;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const tooltip_1 = require("@/components/ui/tooltip");
/**
 * IconItem Component
 *
 * A reusable icon button component that displays a Lucide icon with hover effects,
 * tooltips, and customizable styling. Designed to work within the IconGrid or standalone.
 *
 * @param config - Icon configuration object containing icon, label, and click handler
 * @param size - Icon size in pixels (default: 24)
 * @param color - Icon color (default: "currentColor")
 * @param strokeWidth - Icon stroke width (default: 2)
 * @param variant - Button variant style
 * @param className - Additional CSS classes
 */
function IconItem({ config, size = 24, color = 'currentColor', strokeWidth = 2, variant = 'default', className = '', }) {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const IconComponent = config.icon;
    const handleClick = () => {
        config.onClick?.();
    };
    const getVariantClasses = () => {
        const baseClasses = 'group relative overflow-hidden transition-all duration-300 ease-in-out';
        switch (variant) {
            case 'outline':
                return `${baseClasses} border-2 border-gray-200 dark:border-gray-700 bg-transparent hover:border-a4co-olive-400 hover:bg-a4co-olive-50 dark:hover:bg-a4co-olive-900/20`;
            case 'ghost':
                return `${baseClasses} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800`;
            case 'secondary':
                return `${baseClasses} bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700`;
            default:
                return `${baseClasses} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-a4co-olive-50 dark:hover:bg-a4co-olive-900/20 hover:border-a4co-olive-300 dark:hover:border-a4co-olive-600 shadow-natural hover:shadow-natural-md`;
        }
    };
    return ((0, jsx_runtime_1.jsx)(tooltip_1.TooltipProvider, { children: (0, jsx_runtime_1.jsxs)(tooltip_1.Tooltip, { children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "ghost", size: "lg", onClick: handleClick, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), className: `
              ${getVariantClasses()}
              focus:ring-a4co-olive-500 flex h-20 w-full flex-col items-center justify-center space-y-2
              p-4 focus:ring-2 focus:ring-offset-2
              active:scale-95
              ${className}
            `, "aria-label": config.label, children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(IconComponent, { size: isHovered ? size + 4 : size, color: color, strokeWidth: strokeWidth, className: `
                  transition-all duration-300 ease-in-out
                  ${isHovered ? 'text-a4co-olive-600 dark:text-a4co-olive-400' : 'text-gray-600 dark:text-gray-400'}
                `, "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("div", { className: `
                  border-a4co-olive-400 absolute inset-0 scale-75 rounded-full border-2 opacity-0
                  transition-all duration-300 ease-in-out
                  ${isHovered ? 'scale-110 opacity-30' : ''}
                `, style: {
                                            width: size + 16,
                                            height: size + 16,
                                            left: '50%',
                                            top: '50%',
                                            transform: 'translate(-50%, -50%)',
                                        } })] }), (0, jsx_runtime_1.jsx)("span", { className: `
              text-center text-xs font-medium leading-tight
              transition-colors duration-300
              ${isHovered ? 'text-a4co-olive-700 dark:text-a4co-olive-300' : 'text-gray-700 dark:text-gray-300'}
            `, children: config.label }), (0, jsx_runtime_1.jsx)("div", { className: `
                from-a4co-olive-100/50 to-a4co-clay-100/50 dark:from-a4co-olive-900/20 dark:to-a4co-clay-900/20 absolute 
                inset-0 bg-gradient-to-br
                opacity-0 transition-opacity duration-300
                ${isHovered ? 'opacity-100' : ''}
              ` })] }) }), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipContent, { side: "bottom", className: "max-w-xs", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: config.label }), config.description && ((0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-xs text-gray-600 dark:text-gray-400", children: config.description }))] }) })] }) }));
}
//# sourceMappingURL=icon-item.js.map