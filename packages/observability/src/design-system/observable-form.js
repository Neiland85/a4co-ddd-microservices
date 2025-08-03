"use strict";
/**
 * Observable Form component with integrated logging and tracing
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.ObservableField = exports.ObservableForm = void 0;
var react_1 = require("react");
var react_hooks_1 = require("../logging/react-hooks");
var react_tracing_1 = require("../tracing/react-tracing");
var web_tracer_1 = require("../tracing/web-tracer");
var ObservableForm = function (_a) {
    var formId = _a.formId, _b = _a.trackFieldChanges, trackFieldChanges = _b === void 0 ? true : _b, trackingMetadata = _a.trackingMetadata, onSubmit = _a.onSubmit, onSubmitSuccess = _a.onSubmitSuccess, onSubmitError = _a.onSubmitError, children = _a.children, props = __rest(_a, ["formId", "trackFieldChanges", "trackingMetadata", "onSubmit", "onSubmitSuccess", "onSubmitError", "children"]);
    var logger = (0, react_hooks_1.useLogger)();
    var _c = (0, react_1.useState)({}), fieldValues = _c[0], setFieldValues = _c[1];
    var submitStartTime = (0, react_1.useRef)();
    var traceFormInteraction = (0, react_tracing_1.useInteractionTracing)('form-interaction', formId, {
        attributes: __assign({ 'ui.component': 'Form', 'form.id': formId }, trackingMetadata),
    });
    var handleFieldChange = (0, react_1.useCallback)(function (fieldName, value) {
        if (trackFieldChanges) {
            setFieldValues(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[fieldName] = value, _a)));
            });
            logger.trace('Form field changed', {
                custom: {
                    formId: formId,
                    fieldName: fieldName,
                    hasValue: !!value,
                    valueLength: typeof value === 'string' ? value.length : undefined,
                },
            });
            traceFormInteraction({
                action: 'field-change',
                fieldName: fieldName,
                timestamp: new Date().toISOString(),
            });
        }
    }, [formId, trackFieldChanges, logger, traceFormInteraction]);
    var handleSubmit = (0, react_1.useCallback)(function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var submitSpan, duration, error_1, duration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    submitStartTime.current = Date.now();
                    submitSpan = (0, web_tracer_1.traceUserInteraction)('form-submit', formId, __assign({ 'form.fields': Object.keys(fieldValues), 'form.field_count': Object.keys(fieldValues).length }, trackingMetadata));
                    logger.info('Form submission started', {
                        custom: {
                            formId: formId,
                            fieldCount: Object.keys(fieldValues).length,
                            fields: Object.keys(fieldValues),
                        },
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    if (!onSubmit) return [3 /*break*/, 3];
                    return [4 /*yield*/, onSubmit(event)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    duration = Date.now() - submitStartTime.current;
                    logger.info('Form submission successful', {
                        custom: {
                            formId: formId,
                            duration: duration,
                            fieldCount: Object.keys(fieldValues).length,
                        },
                    });
                    submitSpan.setAttribute('form.submit_success', true);
                    submitSpan.setAttribute('form.submit_duration', duration);
                    if (onSubmitSuccess) {
                        onSubmitSuccess(fieldValues);
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    duration = Date.now() - submitStartTime.current;
                    logger.error('Form submission failed', error_1, {
                        custom: {
                            formId: formId,
                            duration: duration,
                            fieldCount: Object.keys(fieldValues).length,
                        },
                    });
                    submitSpan.setAttribute('form.submit_success', false);
                    submitSpan.setAttribute('form.submit_duration', duration);
                    submitSpan.recordException(error_1);
                    if (onSubmitError) {
                        onSubmitError(error_1);
                    }
                    return [3 /*break*/, 6];
                case 5:
                    submitSpan.end();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [formId, fieldValues, trackingMetadata, onSubmit, onSubmitSuccess, onSubmitError, logger]);
    return (<form {...props} data-form-id={formId} onSubmit={handleSubmit}>
      {react_1.default.Children.map(children, function (child) {
            if (react_1.default.isValidElement(child) && trackFieldChanges) {
                // Inject onChange handler to track field changes
                if (child.props.name && (child.type === 'input' || child.type === 'textarea' || child.type === 'select')) {
                    return react_1.default.cloneElement(child, {
                        onChange: function (e) {
                            handleFieldChange(child.props.name, e.target.value);
                            if (child.props.onChange) {
                                child.props.onChange(e);
                            }
                        },
                    });
                }
            }
            return child;
        })}
    </form>);
};
exports.ObservableForm = ObservableForm;
var ObservableField = function (_a) {
    var name = _a.name, value = _a.value, onChange = _a.onChange, children = _a.children, trackingMetadata = _a.trackingMetadata;
    var logger = (0, react_hooks_1.useLogger)();
    var traceInteraction = (0, react_tracing_1.useInteractionTracing)('field-interaction', name);
    var handleChange = (0, react_1.useCallback)(function (newValue) {
        logger.trace('Field value changed', {
            custom: __assign({ fieldName: name, hasValue: !!newValue }, trackingMetadata),
        });
        traceInteraction({
            action: 'value-change',
            timestamp: new Date().toISOString(),
        });
        onChange(newValue);
    }, [name, onChange, trackingMetadata, logger, traceInteraction]);
    return (<div className="ds-field" data-field-name={name}>
      {react_1.default.Children.map(children, function (child) {
            if (react_1.default.isValidElement(child)) {
                return react_1.default.cloneElement(child, {
                    value: value,
                    onChange: handleChange,
                });
            }
            return child;
        })}
    </div>);
};
exports.ObservableField = ObservableField;
