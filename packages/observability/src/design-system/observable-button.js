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
exports.ObservableButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Observable Button component with integrated logging and tracing
 */
const react_1 = __importStar(require("react"));
const react_hooks_1 = require("../logging/react-hooks");
const react_tracing_1 = require("../tracing/react-tracing");
exports.ObservableButton = react_1.default.forwardRef(({ children, variant = 'primary', size = 'medium', loading = false, trackingId, trackingMetadata, onClick, ...props }, ref) => {
    // Logging hook
    const logInteraction = (0, react_hooks_1.useInteractionLogger)('button.click', {
        throttle: 300, // Prevent spam clicking from flooding logs
    });
    // Tracing hook
    const traceInteraction = (0, react_tracing_1.useInteractionTracing)('button-click', trackingId || 'button', {
        throttle: 300,
        attributes: {
            'ui.component': 'Button',
            'ui.variant': variant,
            'ui.size': size,
            ...trackingMetadata,
        },
    });
    const handleClick = (0, react_1.useCallback)((event) => {
        // Log the interaction
        logInteraction({
            variant,
            size,
            trackingId,
            text: typeof children === 'string' ? children : undefined,
            ...trackingMetadata,
        });
        // Trace the interaction
        traceInteraction({
            timestamp: new Date().toISOString(),
            eventType: event.type,
            position: {
                x: event.clientX,
                y: event.clientY,
            },
        });
        // Call original onClick handler
        if (onClick) {
            onClick(event);
        }
    }, [
        onClick,
        variant,
        size,
        trackingId,
        children,
        trackingMetadata,
        logInteraction,
        traceInteraction,
    ]);
    const classNames = [
        'ds-button',
        `ds-button--${variant}`,
        `ds-button--${size}`,
        loading && 'ds-button--loading',
        props.disabled && 'ds-button--disabled',
    ]
        .filter(Boolean)
        .join(' ');
    return ((0, jsx_runtime_1.jsxs)("button", { ref: ref, className: classNames, onClick: handleClick, disabled: loading || props.disabled, "data-tracking-id": trackingId, ...props, children: [loading && (0, jsx_runtime_1.jsx)("span", { className: "ds-button__spinner" }), children] }));
});
exports.ObservableButton.displayName = 'ObservableButton';
//# sourceMappingURL=observable-button.js.map