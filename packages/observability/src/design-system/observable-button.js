"use strict";
/**
 * Observable Button component with integrated logging and tracing
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableButton = void 0;
var react_1 = require("react");
var react_hooks_1 = require("../logging/react-hooks");
var react_tracing_1 = require("../tracing/react-tracing");
exports.ObservableButton = react_1.default.forwardRef(function (_a, ref) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'medium' : _c, _d = _a.loading, loading = _d === void 0 ? false : _d, trackingId = _a.trackingId, trackingMetadata = _a.trackingMetadata, onClick = _a.onClick, props = __rest(_a, ["children", "variant", "size", "loading", "trackingId", "trackingMetadata", "onClick"]);
    // Logging hook
    var logInteraction = (0, react_hooks_1.useInteractionLogger)('button.click', {
        throttle: 300, // Prevent spam clicking from flooding logs
    });
    // Tracing hook
    var traceInteraction = (0, react_tracing_1.useInteractionTracing)('button-click', trackingId || 'button', {
        throttle: 300,
        attributes: __assign({ 'ui.component': 'Button', 'ui.variant': variant, 'ui.size': size }, trackingMetadata),
    });
    var handleClick = (0, react_1.useCallback)(function (event) {
        // Log the interaction
        logInteraction(__assign({ variant: variant, size: size, trackingId: trackingId, text: typeof children === 'string' ? children : undefined }, trackingMetadata));
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
    }, [onClick, variant, size, trackingId, children, trackingMetadata, logInteraction, traceInteraction]);
    var classNames = [
        'ds-button',
        "ds-button--".concat(variant),
        "ds-button--".concat(size),
        loading && 'ds-button--loading',
        props.disabled && 'ds-button--disabled',
    ].filter(Boolean).join(' ');
    return (<button ref={ref} className={classNames} onClick={handleClick} disabled={loading || props.disabled} data-tracking-id={trackingId} {...props}>
        {loading && <span className="ds-button__spinner"/>}
        {children}
      </button>);
});
exports.ObservableButton.displayName = 'ObservableButton';
