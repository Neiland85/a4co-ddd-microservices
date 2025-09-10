"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
exports.Button = react_1.default.forwardRef(({ className, variant = 'primary', size = 'medium', isLoading = false, leftIcon, rightIcon, fullWidth = false, disabled, children, ...props }, ref) => {
    const baseStyles = 'btn-a4co inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary',
        secondary: 'bg-secondary text-white hover:bg-secondary/90 focus-visible:ring-secondary',
        danger: 'bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger',
        success: 'bg-success text-white hover:bg-success/90 focus-visible:ring-success',
        ghost: 'hover:bg-gray-100 focus-visible:ring-gray-500',
        outline: 'border-2 border-current hover:bg-gray-50 focus-visible:ring-current',
    };
    const sizes = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };
    const isDisabled = disabled || isLoading;
    return ((0, jsx_runtime_1.jsxs)("button", { ref: ref, className: (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(baseStyles, variants[variant], sizes[size], {
            'cursor-not-allowed opacity-50': isDisabled,
            'w-full': fullWidth,
        }, className)), disabled: isDisabled, ...props, children: [isLoading && ((0, jsx_runtime_1.jsxs)("svg", { className: "-ml-1 mr-2 h-4 w-4 animate-spin", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0, jsx_runtime_1.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0, jsx_runtime_1.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })), !isLoading && leftIcon && (0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: leftIcon }), children, !isLoading && rightIcon && (0, jsx_runtime_1.jsx)("span", { className: "ml-2", children: rightIcon })] }));
});
exports.Button.displayName = 'Button';
//# sourceMappingURL=Button.js.map