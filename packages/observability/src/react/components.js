"use strict";
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
exports.TrackedTabs = exports.TrackedModal = exports.TrackedCard = exports.TrackedSelect = exports.TrackedInput = exports.TrackedButton = void 0;
var react_1 = require("react");
var index_1 = require("./index");
var TrackedButton = function (_a) {
    var children = _a.children, onClick = _a.onClick, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'medium' : _c, trackingName = _a.trackingName, trackingMetadata = _a.trackingMetadata, props = __rest(_a, ["children", "onClick", "variant", "size", "trackingName", "trackingMetadata"]);
    var trackClick = (0, index_1.useEventTracking)().trackClick;
    var componentName = trackingName || 'ds-button';
    (0, index_1.useComponentTracking)(componentName, {
        trackProps: ['variant', 'size'],
    });
    var handleClick = function (e) {
        trackClick("".concat(componentName, ".").concat(variant), __assign({ size: size, text: typeof children === 'string' ? children : undefined }, trackingMetadata));
        if (onClick) {
            onClick(e);
        }
    };
    return (<button {...props} onClick={handleClick} className={"ds-button ds-button--".concat(variant, " ds-button--").concat(size, " ").concat(props.className || '')} data-tracking-component={componentName} data-tracking-variant={variant} data-tracking-size={size}>
      {children}
    </button>);
};
exports.TrackedButton = TrackedButton;
var TrackedInput = function (_a) {
    var label = _a.label, error = _a.error, onChange = _a.onChange, onBlur = _a.onBlur, trackingName = _a.trackingName, trackingMetadata = _a.trackingMetadata, _b = _a.debounceMs, debounceMs = _b === void 0 ? 500 : _b, props = __rest(_a, ["label", "error", "onChange", "onBlur", "trackingName", "trackingMetadata", "debounceMs"]);
    var _c = (0, index_1.useEventTracking)(), trackInput = _c.trackInput, trackCustom = _c.trackCustom;
    var componentName = trackingName || 'ds-input';
    var debounceTimer = react_1.default.useRef();
    (0, index_1.useComponentTracking)(componentName, {
        trackProps: ['type', 'required', 'disabled'],
    });
    var handleChange = function (e) {
        // Clear existing timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        // Debounce tracking
        debounceTimer.current = setTimeout(function () {
            trackInput(componentName, e.target.value, __assign({ type: props.type, hasError: !!error }, trackingMetadata));
        }, debounceMs);
        if (onChange) {
            onChange(e);
        }
    };
    var handleBlur = function (e) {
        trackCustom(componentName, 'blur', __assign({ hasValue: !!e.target.value, hasError: !!error }, trackingMetadata));
        if (onBlur) {
            onBlur(e);
        }
    };
    react_1.default.useEffect(function () {
        return function () {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);
    return (<div className="ds-input-wrapper">
      {label && (<label className="ds-input-label" htmlFor={props.id}>
          {label}
        </label>)}
      <input {...props} onChange={handleChange} onBlur={handleBlur} className={"ds-input ".concat(error ? 'ds-input--error' : '', " ").concat(props.className || '')} data-tracking-component={componentName} aria-invalid={!!error} aria-describedby={error ? "".concat(props.id, "-error") : undefined}/>
      {error && (<span id={"".concat(props.id, "-error")} className="ds-input-error" role="alert">
          {error}
        </span>)}
    </div>);
};
exports.TrackedInput = TrackedInput;
var TrackedSelect = function (_a) {
    var label = _a.label, options = _a.options, onChange = _a.onChange, trackingName = _a.trackingName, trackingMetadata = _a.trackingMetadata, props = __rest(_a, ["label", "options", "onChange", "trackingName", "trackingMetadata"]);
    var trackCustom = (0, index_1.useEventTracking)().trackCustom;
    var componentName = trackingName || 'ds-select';
    (0, index_1.useComponentTracking)(componentName, {
        trackProps: ['required', 'disabled'],
    });
    var handleChange = function (e) {
        var selectedOption = options.find(function (opt) { return opt.value === e.target.value; });
        trackCustom(componentName, 'change', __assign({ value: e.target.value, label: selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.label }, trackingMetadata));
        if (onChange) {
            onChange(e);
        }
    };
    return (<div className="ds-select-wrapper">
      {label && (<label className="ds-select-label" htmlFor={props.id}>
          {label}
        </label>)}
      <select {...props} onChange={handleChange} className={"ds-select ".concat(props.className || '')} data-tracking-component={componentName}>
        {options.map(function (option) { return (<option key={option.value} value={option.value}>
            {option.label}
          </option>); })}
      </select>
    </div>);
};
exports.TrackedSelect = TrackedSelect;
var TrackedCard = function (_a) {
    var title = _a.title, children = _a.children, onClick = _a.onClick, trackingName = _a.trackingName, trackingMetadata = _a.trackingMetadata, _b = _a.variant, variant = _b === void 0 ? 'default' : _b;
    var _c = (0, index_1.useEventTracking)(), trackClick = _c.trackClick, trackCustom = _c.trackCustom;
    var componentName = trackingName || 'ds-card';
    (0, index_1.useComponentTracking)(componentName, {
        trackProps: ['variant'],
    });
    var handleClick = function () {
        if (onClick) {
            trackClick(componentName, __assign({ title: title, variant: variant }, trackingMetadata));
            onClick();
        }
    };
    var handleMouseEnter = function () {
        trackCustom(componentName, 'hover', __assign({ title: title, variant: variant }, trackingMetadata));
    };
    return (<div className={"ds-card ds-card--".concat(variant, " ").concat(onClick ? 'ds-card--clickable' : '')} onClick={handleClick} onMouseEnter={handleMouseEnter} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} data-tracking-component={componentName} data-tracking-variant={variant}>
      {title && <h3 className="ds-card-title">{title}</h3>}
      <div className="ds-card-content">{children}</div>
    </div>);
};
exports.TrackedCard = TrackedCard;
var TrackedModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, title = _a.title, children = _a.children, trackingName = _a.trackingName, trackingMetadata = _a.trackingMetadata;
    var trackCustom = (0, index_1.useEventTracking)().trackCustom;
    var componentName = trackingName || 'ds-modal';
    var openTime = react_1.default.useRef();
    react_1.default.useEffect(function () {
        if (isOpen) {
            openTime.current = Date.now();
            trackCustom(componentName, 'open', __assign({ title: title }, trackingMetadata));
        }
        else if (openTime.current) {
            var duration = Date.now() - openTime.current;
            trackCustom(componentName, 'close', __assign({ title: title, duration: duration }, trackingMetadata));
            openTime.current = undefined;
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    var handleBackdropClick = function (e) {
        if (e.target === e.currentTarget) {
            trackCustom(componentName, 'backdrop_click', __assign({ title: title }, trackingMetadata));
            onClose();
        }
    };
    var handleCloseClick = function () {
        trackCustom(componentName, 'close_button_click', __assign({ title: title }, trackingMetadata));
        onClose();
    };
    return (<div className="ds-modal-backdrop" onClick={handleBackdropClick} data-tracking-component={componentName}>
      <div className="ds-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {title && (<div className="ds-modal-header">
            <h2 id="modal-title" className="ds-modal-title">{title}</h2>
            <button className="ds-modal-close" onClick={handleCloseClick} aria-label="Close modal">
              ×
            </button>
          </div>)}
        <div className="ds-modal-content">{children}</div>
      </div>
    </div>);
};
exports.TrackedModal = TrackedModal;
var TrackedTabs = function (_a) {
    var _b;
    var tabs = _a.tabs, defaultTab = _a.defaultTab, trackingName = _a.trackingName, trackingMetadata = _a.trackingMetadata;
    var trackCustom = (0, index_1.useEventTracking)().trackCustom;
    var componentName = trackingName || 'ds-tabs';
    var _c = react_1.default.useState(defaultTab || ((_b = tabs[0]) === null || _b === void 0 ? void 0 : _b.id)), activeTab = _c[0], setActiveTab = _c[1];
    (0, index_1.useComponentTracking)(componentName, {
        trackProps: ['defaultTab'],
    });
    var handleTabClick = function (tabId) {
        var tab = tabs.find(function (t) { return t.id === tabId; });
        trackCustom(componentName, 'tab_change', __assign({ fromTab: activeTab, toTab: tabId, tabLabel: tab === null || tab === void 0 ? void 0 : tab.label }, trackingMetadata));
        setActiveTab(tabId);
    };
    return (<div className="ds-tabs" data-tracking-component={componentName}>
      <div className="ds-tabs-header" role="tablist">
        {tabs.map(function (tab) { return (<button key={tab.id} className={"ds-tab ".concat(activeTab === tab.id ? 'ds-tab--active' : '')} onClick={function () { return handleTabClick(tab.id); }} role="tab" aria-selected={activeTab === tab.id} aria-controls={"tabpanel-".concat(tab.id)}>
            {tab.label}
          </button>); })}
      </div>
      <div className="ds-tabs-content">
        {tabs.map(function (tab) { return (<div key={tab.id} id={"tabpanel-".concat(tab.id)} className={"ds-tab-panel ".concat(activeTab === tab.id ? 'ds-tab-panel--active' : '')} role="tabpanel" hidden={activeTab !== tab.id}>
            {tab.content}
          </div>); })}
      </div>
    </div>);
};
exports.TrackedTabs = TrackedTabs;
