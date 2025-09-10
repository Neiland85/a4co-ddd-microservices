"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackedTabs = exports.TrackedModal = exports.TrackedCard = exports.TrackedSelect = exports.TrackedInput = exports.TrackedButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const index_1 = require("./index");
const TrackedButton = ({ children, onClick, variant = 'primary', size = 'medium', trackingName, trackingMetadata, ...props }) => {
    const { trackClick } = (0, index_1.useEventTracking)();
    const componentName = trackingName || 'ds-button';
    (0, index_1.useComponentTracking)(componentName, {
        trackProps: ['variant', 'size'],
    });
    const handleClick = (e) => {
        trackClick(`${componentName}.${variant}`, {
            size,
            text: typeof children === 'string' ? children : undefined,
            ...trackingMetadata,
        });
        if (onClick) {
            onClick(e);
        }
    };
    return ((0, jsx_runtime_1.jsx)("button", { ...props, onClick: handleClick, className: `ds-button ds-button--${variant} ds-button--${size} ${props.className || ''}`, "data-tracking-component": componentName, "data-tracking-variant": variant, "data-tracking-size": size, children: children }));
};
exports.TrackedButton = TrackedButton;
const TrackedInput = ({ label, error, onChange, onBlur, trackingName, trackingMetadata, debounceMs = 500, ...props }) => {
    const { trackInput, trackCustom } = (0, index_1.useEventTracking)();
    const componentName = trackingName || 'ds-input';
    const debounceTimer = react_1.default.useRef();
    (0, index_1.useComponentTracking)(componentName, {
        trackProps: ['type', 'required', 'disabled'],
    });
    const handleChange = (e) => {
        // Clear existing timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        // Debounce tracking
        debounceTimer.current = setTimeout(() => {
            trackInput(componentName, e.target.value, {
                type: props.type,
                hasError: !!error,
                ...trackingMetadata,
            });
        }, debounceMs);
        if (onChange) {
            onChange(e);
        }
    };
    const handleBlur = (e) => {
        trackCustom(componentName, 'blur', {
            hasValue: !!e.target.value,
            hasError: !!error,
            ...trackingMetadata,
        });
        if (onBlur) {
            onBlur(e);
        }
    };
    react_1.default.useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ds-input-wrapper", children: [label && ((0, jsx_runtime_1.jsx)("label", { className: "ds-input-label", htmlFor: props.id, children: label })), (0, jsx_runtime_1.jsx)("input", { ...props, onChange: handleChange, onBlur: handleBlur, className: `ds-input ${error ? 'ds-input--error' : ''} ${props.className || ''}`, "data-tracking-component": componentName, "aria-invalid": !!error, "aria-describedby": error ? `${props.id}-error` : undefined }), error && ((0, jsx_runtime_1.jsx)("span", { id: `${props.id}-error`, className: "ds-input-error", role: "alert", children: error }))] }));
};
exports.TrackedInput = TrackedInput;
const TrackedSelect = ({ label, options, onChange, trackingName, trackingMetadata, ...props }) => {
    const { trackCustom } = (0, index_1.useEventTracking)();
    const componentName = trackingName || 'ds-select';
    (0, index_1.useComponentTracking)(componentName, {
        trackProps: ['required', 'disabled'],
    });
    const handleChange = (e) => {
        const selectedOption = options.find(opt => opt.value === e.target.value);
        trackCustom(componentName, 'change', {
            value: e.target.value,
            label: selectedOption?.label,
            ...trackingMetadata,
        });
        if (onChange) {
            onChange(e);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ds-select-wrapper", children: [label && ((0, jsx_runtime_1.jsx)("label", { className: "ds-select-label", htmlFor: props.id, children: label })), (0, jsx_runtime_1.jsx)("select", { ...props, onChange: handleChange, className: `ds-select ${props.className || ''}`, "data-tracking-component": componentName, children: options.map(option => ((0, jsx_runtime_1.jsx)("option", { value: option.value, children: option.label }, option.value))) })] }));
};
exports.TrackedSelect = TrackedSelect;
const TrackedCard = ({ title, children, onClick, trackingName, trackingMetadata, variant = 'default', }) => {
    const { trackClick, trackCustom } = (0, index_1.useEventTracking)();
    const componentName = trackingName || 'ds-card';
    (0, index_1.useComponentTracking)(componentName, {
        trackProps: ['variant'],
    });
    const handleClick = () => {
        if (onClick) {
            trackClick(componentName, {
                title,
                variant,
                ...trackingMetadata,
            });
            onClick();
        }
    };
    const handleMouseEnter = () => {
        trackCustom(componentName, 'hover', {
            title,
            variant,
            ...trackingMetadata,
        });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `ds-card ds-card--${variant} ${onClick ? 'ds-card--clickable' : ''}`, onClick: handleClick, onMouseEnter: handleMouseEnter, role: onClick ? 'button' : undefined, tabIndex: onClick ? 0 : undefined, "data-tracking-component": componentName, "data-tracking-variant": variant, children: [title && (0, jsx_runtime_1.jsx)("h3", { className: "ds-card-title", children: title }), (0, jsx_runtime_1.jsx)("div", { className: "ds-card-content", children: children })] }));
};
exports.TrackedCard = TrackedCard;
const TrackedModal = ({ isOpen, onClose, title, children, trackingName, trackingMetadata, }) => {
    const { trackCustom } = (0, index_1.useEventTracking)();
    const componentName = trackingName || 'ds-modal';
    const openTime = react_1.default.useRef();
    react_1.default.useEffect(() => {
        if (isOpen) {
            openTime.current = Date.now();
            trackCustom(componentName, 'open', {
                title,
                ...trackingMetadata,
            });
        }
        else if (openTime.current) {
            const duration = Date.now() - openTime.current;
            trackCustom(componentName, 'close', {
                title,
                duration,
                ...trackingMetadata,
            });
            openTime.current = undefined;
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            trackCustom(componentName, 'backdrop_click', {
                title,
                ...trackingMetadata,
            });
            onClose();
        }
    };
    const handleCloseClick = () => {
        trackCustom(componentName, 'close_button_click', {
            title,
            ...trackingMetadata,
        });
        onClose();
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "ds-modal-backdrop", onClick: handleBackdropClick, "data-tracking-component": componentName, children: (0, jsx_runtime_1.jsxs)("div", { className: "ds-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title", children: [title && ((0, jsx_runtime_1.jsxs)("div", { className: "ds-modal-header", children: [(0, jsx_runtime_1.jsx)("h2", { id: "modal-title", className: "ds-modal-title", children: title }), (0, jsx_runtime_1.jsx)("button", { className: "ds-modal-close", onClick: handleCloseClick, "aria-label": "Close modal", children: "\u00D7" })] })), (0, jsx_runtime_1.jsx)("div", { className: "ds-modal-content", children: children })] }) }));
};
exports.TrackedModal = TrackedModal;
const TrackedTabs = ({ tabs, defaultTab, trackingName, trackingMetadata, }) => {
    const { trackCustom } = (0, index_1.useEventTracking)();
    const componentName = trackingName || 'ds-tabs';
    const [activeTab, setActiveTab] = react_1.default.useState(defaultTab || tabs[0]?.id);
    (0, index_1.useComponentTracking)(componentName, {
        trackProps: ['defaultTab'],
    });
    const handleTabClick = (tabId) => {
        const tab = tabs.find(t => t.id === tabId);
        trackCustom(componentName, 'tab_change', {
            fromTab: activeTab,
            toTab: tabId,
            tabLabel: tab?.label,
            ...trackingMetadata,
        });
        setActiveTab(tabId);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ds-tabs", "data-tracking-component": componentName, children: [(0, jsx_runtime_1.jsx)("div", { className: "ds-tabs-header", role: "tablist", children: tabs.map(tab => ((0, jsx_runtime_1.jsx)("button", { className: `ds-tab ${activeTab === tab.id ? 'ds-tab--active' : ''}`, onClick: () => handleTabClick(tab.id), role: "tab", "aria-selected": activeTab === tab.id, "aria-controls": `tabpanel-${tab.id}`, children: tab.label }, tab.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "ds-tabs-content", children: tabs.map(tab => ((0, jsx_runtime_1.jsx)("div", { id: `tabpanel-${tab.id}`, className: `ds-tab-panel ${activeTab === tab.id ? 'ds-tab-panel--active' : ''}`, role: "tabpanel", hidden: activeTab !== tab.id, children: tab.content }, tab.id))) })] }));
};
exports.TrackedTabs = TrackedTabs;
//# sourceMappingURL=components.js.map