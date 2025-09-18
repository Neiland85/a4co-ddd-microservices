/**
 * Observable Form component with integrated logging and tracing
 */
import React from 'react';
export interface ObservableFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    formId: string;
    trackFieldChanges?: boolean;
    trackingMetadata?: Record<string, any>;
    onSubmitSuccess?: (data: any) => void;
    onSubmitError?: (error: Error) => void;
}
export declare const ObservableForm: React.FC<ObservableFormProps>;
/**
 * Observable form field wrapper for custom field components
 */
export interface ObservableFieldProps {
    name: string;
    value: any;
    onChange: (value: any) => void;
    children: React.ReactNode;
    trackingMetadata?: Record<string, any>;
}
export declare const ObservableField: React.FC<ObservableFieldProps>;
//# sourceMappingURL=observable-form.d.ts.map