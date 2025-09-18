/**
 * Observable Form component with integrated logging and tracing
 */

import React, { useCallback, useRef, useState } from 'react';
import { useLogger } from '../logging/react-hooks';
import { useInteractionTracing } from '../tracing/react-tracing';
import { traceUserInteraction } from '../tracing/web-tracer';

export interface ObservableFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  formId: string;
  trackFieldChanges?: boolean;
  trackingMetadata?: Record<string, any>;
  onSubmitSuccess?: (data: any) => void;
  onSubmitError?: (error: Error) => void;
}

export const ObservableForm: React.FC<ObservableFormProps> = ({
  formId,
  trackFieldChanges = true,
  trackingMetadata,
  onSubmit,
  onSubmitSuccess,
  onSubmitError,
  children,
  ...props
}) => {
  const logger = useLogger();
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const submitStartTime = useRef<number>();
  
  const traceFormInteraction = useInteractionTracing('form-interaction', formId, {
    attributes: {
      'ui.component': 'Form',
      'form.id': formId,
      ...trackingMetadata,
    },
  });

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
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

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    submitStartTime.current = Date.now();
    const submitSpan = traceUserInteraction('form-submit', formId, {
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
    } catch (error) {
      const duration = Date.now() - submitStartTime.current;
      
      logger.error('Form submission failed', error as Error, {
        custom: {
          formId,
          duration,
          fieldCount: Object.keys(fieldValues).length,
        },
      });

      submitSpan.setAttribute('form.submit_success', false);
      submitSpan.setAttribute('form.submit_duration', duration);
      submitSpan.recordException(error as Error);
      
      if (onSubmitError) {
        onSubmitError(error as Error);
      }
    } finally {
      submitSpan.end();
    }
  }, [formId, fieldValues, trackingMetadata, onSubmit, onSubmitSuccess, onSubmitError, logger]);

  return (
    <form
      {...props}
      data-form-id={formId}
      onSubmit={handleSubmit}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && trackFieldChanges) {
          // Inject onChange handler to track field changes
          if (child.props.name && (child.type === 'input' || child.type === 'textarea' || child.type === 'select')) {
            return React.cloneElement(child as any, {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
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
    </form>
  );
};

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

export const ObservableField: React.FC<ObservableFieldProps> = ({
  name,
  value,
  onChange,
  children,
  trackingMetadata,
}) => {
  const logger = useLogger();
  const traceInteraction = useInteractionTracing('field-interaction', name);

  const handleChange = useCallback((newValue: any) => {
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

  return (
    <div className="ds-field" data-field-name={name}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, {
            value,
            onChange: handleChange,
          });
        }
        return child;
      })}
    </div>
  );
};