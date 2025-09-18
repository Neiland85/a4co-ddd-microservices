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
exports.ObservableField = exports.ObservableForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Observable Form component with integrated logging and tracing
 */
const react_1 = __importStar(require("react"));
const react_hooks_1 = require("../logging/react-hooks");
const react_tracing_1 = require("../tracing/react-tracing");
const web_tracer_1 = require("../tracing/web-tracer");
const ObservableForm = ({ formId, trackFieldChanges = true, trackingMetadata, onSubmit, onSubmitSuccess, onSubmitError, children, ...props }) => {
    const logger = (0, react_hooks_1.useLogger)();
    const [fieldValues, setFieldValues] = (0, react_1.useState)({});
    const submitStartTime = (0, react_1.useRef)();
    const traceFormInteraction = (0, react_tracing_1.useInteractionTracing)('form-interaction', formId, {
        attributes: {
            'ui.component': 'Form',
            'form.id': formId,
            ...trackingMetadata,
        },
    });
    const handleFieldChange = (0, react_1.useCallback)((fieldName, value) => {
        if (trackFieldChanges) {
            setFieldValues(prev => ({ ...prev, [fieldName]: value }));
            logger.trace('Form field changed', {
                custom: {
                    formId,
                    fieldName,
                    hasValue: !!value,
                    valueLength: typeof value === 'string' ? value.length : undefined,
                },
            });
            traceFormInteraction({
                action: 'field-change',
                fieldName,
                timestamp: new Date().toISOString(),
            });
        }
    }, [formId, trackFieldChanges, logger, traceFormInteraction]);
    const handleSubmit = (0, react_1.useCallback)(async (event) => {
        event.preventDefault();
        submitStartTime.current = Date.now();
        const submitSpan = (0, web_tracer_1.traceUserInteraction)('form-submit', formId, {
            'form.fields': Object.keys(fieldValues),
            'form.field_count': Object.keys(fieldValues).length,
            ...trackingMetadata,
        });
        logger.info('Form submission started', {
            custom: {
                formId,
                fieldCount: Object.keys(fieldValues).length,
                fields: Object.keys(fieldValues),
            },
        });
        try {
            if (onSubmit) {
                await onSubmit(event);
            }
            const duration = Date.now() - submitStartTime.current;
            logger.info('Form submission successful', {
                custom: {
                    formId,
                    duration,
                    fieldCount: Object.keys(fieldValues).length,
                },
            });
            submitSpan.setAttribute('form.submit_success', true);
            submitSpan.setAttribute('form.submit_duration', duration);
            if (onSubmitSuccess) {
                onSubmitSuccess(fieldValues);
            }
        }
        catch (error) {
            const duration = Date.now() - submitStartTime.current;
            logger.error('Form submission failed', error, {
                custom: {
                    formId,
                    duration,
                    fieldCount: Object.keys(fieldValues).length,
                },
            });
            submitSpan.setAttribute('form.submit_success', false);
            submitSpan.setAttribute('form.submit_duration', duration);
            submitSpan.recordException(error);
            if (onSubmitError) {
                onSubmitError(error);
            }
        }
        finally {
            submitSpan.end();
        }
    }, [formId, fieldValues, trackingMetadata, onSubmit, onSubmitSuccess, onSubmitError, logger]);
    return ((0, jsx_runtime_1.jsx)("form", { ...props, "data-form-id": formId, onSubmit: handleSubmit, children: react_1.default.Children.map(children, child => {
            if (react_1.default.isValidElement(child) && trackFieldChanges) {
                // Inject onChange handler to track field changes
                if (child.props.name &&
                    (child.type === 'input' || child.type === 'textarea' || child.type === 'select')) {
                    return react_1.default.cloneElement(child, {
                        onChange: (e) => {
                            handleFieldChange(child.props.name, e.target.value);
                            if (child.props.onChange) {
                                child.props.onChange(e);
                            }
                        },
                    });
                }
            }
            return child;
        }) }));
};
exports.ObservableForm = ObservableForm;
const ObservableField = ({ name, value, onChange, children, trackingMetadata, }) => {
    const logger = (0, react_hooks_1.useLogger)();
    const traceInteraction = (0, react_tracing_1.useInteractionTracing)('field-interaction', name);
    const handleChange = (0, react_1.useCallback)((newValue) => {
        logger.trace('Field value changed', {
            custom: {
                fieldName: name,
                hasValue: !!newValue,
                ...trackingMetadata,
            },
        });
        traceInteraction({
            action: 'value-change',
            timestamp: new Date().toISOString(),
        });
        onChange(newValue);
    }, [name, onChange, trackingMetadata, logger, traceInteraction]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "ds-field", "data-field-name": name, children: react_1.default.Children.map(children, child => {
            if (react_1.default.isValidElement(child)) {
                return react_1.default.cloneElement(child, {
                    value,
                    onChange: handleChange,
                });
            }
            return child;
        }) }));
};
exports.ObservableField = ObservableField;
//# sourceMappingURL=observable-form.js.map