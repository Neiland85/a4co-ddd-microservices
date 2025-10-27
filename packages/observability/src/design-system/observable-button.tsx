import React, { useEffect } from 'react';
import { trace } from '@opentelemetry/api';

export function ObservableButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  useEffect(() => {
    const span = trace.getTracer('ui-tracer').startSpan('button-click', {
      attributes: {
        'ui.component': 'ObservableButton',
      },
    });

    span.end();
  }, []);

  return <button {...props}>{children}</button>;
}
