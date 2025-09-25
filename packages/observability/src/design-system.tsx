import React, { ComponentType, forwardRef, useCallback, useEffect, useRef } from 'react';
import { getFrontendLogger, getFrontendTracer } from './frontend';

// Interfaz para props de observabilidad del DS
export interface DSObservabilityProps {
  onInteraction?: (action: string, data?: Record<string, any>) => void;
  componentName?: string;
  variant?: string;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
}

// Interfaz para eventos del DS
export interface DSEvent {
  component: string;
  action: string;
  variant?: string;
  size?: string;
  props?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  designToken?: string;
}

// Clase para logging del Design System
export class DesignSystemLogger {
  private logger = getFrontendLogger();
  private tracer = getFrontendTracer();

  logComponentEvent(event: Omit<DSEvent, 'timestamp' | 'sessionId'>): void {
    if (this.logger) {
      const dsEvent: DSEvent = {
        ...event,
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
      };
      
      this.logger.info(`DS Event: ${event.component}.${event.action}`, dsEvent);
    }
  }

  createComponentSpan(componentName: string, action: string, attributes?: Record<string, any>): any {
    if (this.tracer) {
      const span = this.tracer.createSpan(`ds.${componentName}.${action}`);
      
      if (attributes) {
        this.tracer.setAttributes(span, {
          'ds.component': componentName,
          'ds.action': action,
          ...attributes,
        });
      }
      
      return span;
    }
    return null;
  }

  private getSessionId(): string {
    // Obtener sessionId del logger si está disponible
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }
}

// Instancia global del logger del DS
const dsLogger = new DesignSystemLogger();

// HOC para instrumentar componentes del DS
export function withDSObservability<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string,
  defaultVariant?: string,
  defaultSize?: string
) {
  return forwardRef<any, P & DSObservabilityProps>((props, ref) => {
    const {
      onInteraction,
      componentName: propComponentName,
      variant = defaultVariant,
      size = defaultSize,
      disabled,
      loading,
      ...restProps
    } = props;

    const finalComponentName = propComponentName || componentName;
    const spanRef = useRef<any>(null);

    // Crear span al montar el componente
    useEffect(() => {
      spanRef.current = dsLogger.createComponentSpan(finalComponentName, 'mount', {
        'ds.variant': variant,
        'ds.size': size,
        'ds.disabled': disabled,
        'ds.loading': loading,
      });

      return () => {
        if (spanRef.current && dsLogger.tracer) {
          dsLogger.tracer.endSpan(spanRef.current);
        }
      };
    }, [finalComponentName, variant, size, disabled, loading]);

    // Handler para interacciones
    const handleInteraction = useCallback((action: string, data?: Record<string, any>) => {
      // Crear span para la interacción
      const interactionSpan = dsLogger.createComponentSpan(finalComponentName, action, {
        'ds.variant': variant,
        'ds.size': size,
        'ds.action': action,
        ...data,
      });

      // Loggear el evento
      dsLogger.logComponentEvent({
        component: finalComponentName,
        action,
        variant,
        size,
        props: {
          disabled,
          loading,
          ...data,
        },
        designToken: `${finalComponentName}.${variant}.${size}`,
      });

      // Llamar al callback original si existe
      if (onInteraction) {
        onInteraction(action, data);
      }

      // Finalizar el span
      if (interactionSpan && dsLogger.tracer) {
        dsLogger.tracer.endSpan(interactionSpan);
      }
    }, [finalComponentName, variant, size, disabled, loading, onInteraction]);

    return (
      <WrappedComponent
        {...(restProps as P)}
        ref={ref}
        onInteraction={handleInteraction}
      />
    );
  });
}

// Hook para componentes del DS
export function useDSObservability(
  componentName: string,
  variant?: string,
  size?: string
) {
  const spanRef = useRef<any>(null);

  useEffect(() => {
    spanRef.current = dsLogger.createComponentSpan(componentName, 'mount', {
      'ds.variant': variant,
      'ds.size': size,
    });

    return () => {
      if (spanRef.current && dsLogger.tracer) {
        dsLogger.tracer.endSpan(spanRef.current);
      }
    };
  }, [componentName, variant, size]);

  const logInteraction = useCallback((action: string, data?: Record<string, any>) => {
    const interactionSpan = dsLogger.createComponentSpan(componentName, action, {
      'ds.variant': variant,
      'ds.size': size,
      'ds.action': action,
      ...data,
    });

    dsLogger.logComponentEvent({
      component: componentName,
      action,
      variant,
      size,
      props: data,
      designToken: `${componentName}.${variant}.${size}`,
    });

    if (interactionSpan && dsLogger.tracer) {
      dsLogger.tracer.endSpan(interactionSpan);
    }
  }, [componentName, variant, size]);

  return { logInteraction };
}

// Componente Button con observabilidad integrada
export const ObservableButton = withDSObservability(
  forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & DSObservabilityProps & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
  }>(({ onInteraction, variant = 'primary', size = 'md', children, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Loggear el click
      onInteraction?.('click', {
        variant,
        size,
        eventType: 'click',
      });

      // Llamar al onClick original
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={`ds-button ds-button--${variant} ds-button--${size}`}
        {...props}
      >
        {children}
      </button>
    );
  }),
  'Button',
  'primary',
  'md'
);

// Componente Input con observabilidad integrada
export const ObservableInput = withDSObservability(
  forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & DSObservabilityProps & {
    variant?: 'default' | 'error' | 'success';
    size?: 'sm' | 'md' | 'lg';
  }>(({ onInteraction, variant = 'default', size = 'md', onChange, onFocus, onBlur, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onInteraction?.('change', {
        variant,
        size,
        value: e.target.value,
        eventType: 'change',
      });
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      onInteraction?.('focus', {
        variant,
        size,
        eventType: 'focus',
      });
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onInteraction?.('blur', {
        variant,
        size,
        value: e.target.value,
        eventType: 'blur',
      });
      onBlur?.(e);
    };

    return (
      <input
        ref={ref}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`ds-input ds-input--${variant} ds-input--${size}`}
        {...props}
      />
    );
  }),
  'Input',
  'default',
  'md'
);

// Componente Card con observabilidad integrada
export const ObservableCard = withDSObservability(
  forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & DSObservabilityProps & {
    variant?: 'default' | 'elevated' | 'outlined';
    size?: 'sm' | 'md' | 'lg';
  }>(({ onInteraction, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`ds-card ds-card--${variant} ds-card--${size}`}
        {...props}
      >
        {children}
      </div>
    );
  }),
  'Card',
  'default',
  'md'
);

// Función para crear tokens de diseño consistentes
export function createDesignToken(component: string, variant?: string, size?: string): string {
  const parts = [component];
  if (variant) parts.push(variant);
  if (size) parts.push(size);
  return parts.join('.');
}

// Función para extraer metadata de tokens de diseño
export function parseDesignToken(token: string): {
  component: string;
  variant?: string;
  size?: string;
} {
  const parts = token.split('.');
  return {
    component: parts[0],
    variant: parts[1],
    size: parts[2],
  };
}

// Hook para tracking de performance de componentes del DS
export function useDSPerformanceTracking(componentName: string) {
  const mountTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    mountTimeRef.current = performance.now();
    renderCountRef.current = 0;

    return () => {
      const unmountTime = performance.now();
      const totalTime = unmountTime - mountTimeRef.current;

      dsLogger.logComponentEvent({
        component: componentName,
        action: 'unmount',
        props: {
          totalRenderTime: totalTime,
          renderCount: renderCountRef.current,
        },
      });
    };
  }, [componentName]);

  useEffect(() => {
    renderCountRef.current += 1;
    
    dsLogger.logComponentEvent({
      component: componentName,
      action: 'render',
      props: {
        renderCount: renderCountRef.current,
      },
    });
  });

  return {
    renderCount: renderCountRef.current,
    mountTime: mountTimeRef.current,
  };
}

// Función para registrar errores de componentes del DS
export function logDSError(
  componentName: string,
  error: Error,
  context?: Record<string, any>
): void {
  dsLogger.logComponentEvent({
    component: componentName,
    action: 'error',
    props: {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
    },
  });
}

// Función para registrar métricas de uso del DS
export function logDSMetric(
  componentName: string,
  metricName: string,
  value: number,
  tags?: Record<string, string>
): void {
  dsLogger.logComponentEvent({
    component: componentName,
    action: 'metric',
    props: {
      metric: {
        name: metricName,
        value,
        tags,
      },
    },
  });
}

// Exportar tipos
export type { DSObservabilityProps, DSEvent };