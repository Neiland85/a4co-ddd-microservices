import { trace } from '@opentelemetry/api';
import React, { useEffect } from 'react';

export function ObservableForm({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  useEffect(() => {
    const span = trace.getTracer('ui-tracer').startSpan('form-submit', {
      attributes: {
        'ui.component': 'ObservableForm',
      },
    });

    span.end();
  }, []);

  return (
    <form {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && (child.props as any)?.name) {
          return React.cloneElement(child);
        }
        return child;
      })}
    </form>
  );
}
