import { trace, SpanStatusCode, SpanKind } from '@opentelemetry/api';
import { getFrontendTracer } from './frontend';

// Interfaz para props de componentes del Design System
export interface DSComponentProps {
  variant?: string;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
  [key: string]: any;
}

// Interfaz para eventos del Design System
export interface DSEvent {
  componentName: string;
  eventType: 'click' | 'hover' | 'focus' | 'blur' | 'change' | 'submit' | 'mount' | 'unmount';
  props: DSComponentProps;
  metadata?: Record<string, any>;
  timestamp: number;
}

// Interfaz para configuración del plugin
export interface DSPluginConfig {
  enabled?: boolean;
  trackProps?: boolean;
  trackEvents?: string[];
  trackPerformance?: boolean;
  trackErrors?: boolean;
  customAttributes?: Record<string, string>;
}

// Plugin base para componentes del Design System
export class DSComponentPlugin {
  private config: DSPluginConfig;
  private tracer: any;

  constructor(config: DSPluginConfig = {}) {
    this.config = {
      enabled: true,
      trackProps: true,
      trackEvents: ['click', 'hover', 'focus', 'change', 'submit'],
      trackPerformance: true,
      trackErrors: true,
      ...config,
    };
    
    try {
      this.tracer = getFrontendTracer('design-system');
    } catch (error) {
      console.warn('Frontend tracer not available, using console logging');
      this.tracer = null;
    }
  }

  // Trackear evento de componente
  trackEvent(event: DSEvent) {
    if (!this.config.enabled) return;

    if (this.tracer) {
      const span = this.tracer.startSpan(`ds.${event.componentName}.${event.eventType}`, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'ds.component': event.componentName,
          'ds.event': event.eventType,
          'ds.props': JSON.stringify(event.props),
          'ds.metadata': JSON.stringify(event.metadata || {}),
          'ds.timestamp': event.timestamp,
          'ds.variant': event.props.variant,
          'ds.size': event.props.size,
          'ds.disabled': event.props.disabled,
          'ds.loading': event.props.loading,
          ...this.config.customAttributes,
        },
      });

      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    } else {
      // Fallback a console logging
      console.log('[DS Event]', {
        component: event.componentName,
        event: event.eventType,
        props: event.props,
        metadata: event.metadata,
        timestamp: new Date(event.timestamp).toISOString(),
      });
    }
  }

  // Trackear error de componente
  trackError(componentName: string, error: Error, props?: DSComponentProps) {
    if (!this.config.enabled || !this.config.trackErrors) return;

    if (this.tracer) {
      const span = this.tracer.startSpan(`ds.${componentName}.error`, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'ds.component': componentName,
          'ds.error.name': error.name,
          'ds.error.message': error.message,
          'ds.error.stack': error.stack,
          'ds.props': JSON.stringify(props || {}),
          ...this.config.customAttributes,
        },
      });

      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: error.message 
      });
      span.recordException(error);
      span.end();
    } else {
      console.error('[DS Error]', {
        component: componentName,
        error: error.message,
        stack: error.stack,
        props,
      });
    }
  }

  // Trackear performance de componente
  trackPerformance(componentName: string, metric: { name: string; value: number; unit: string }) {
    if (!this.config.enabled || !this.config.trackPerformance) return;

    if (this.tracer) {
      const span = this.tracer.startSpan(`ds.${componentName}.performance`, {
        kind: SpanKind.INTERNAL,
        attributes: {
          'ds.component': componentName,
          'ds.performance.metric': metric.name,
          'ds.performance.value': metric.value,
          'ds.performance.unit': metric.unit,
          ...this.config.customAttributes,
        },
      });

      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    }
  }
}

// HOC para componentes del Design System
export function withDSPlugin<P extends DSComponentProps>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string,
  config?: DSPluginConfig
) {
  const plugin = new DSComponentPlugin(config);

  return function DSComponentWithPlugin(props: P) {
    const handleEvent = (eventType: DSEvent['eventType'], eventProps?: any) => {
      plugin.trackEvent({
        componentName,
        eventType,
        props,
        metadata: eventProps,
        timestamp: Date.now(),
      });
    };

    const handleError = (error: Error) => {
      plugin.trackError(componentName, error, props);
    };

    // Trackear mount/unmount
    React.useEffect(() => {
      handleEvent('mount');
      return () => handleEvent('unmount');
    }, []);

    // Trackear cambios de props
    React.useEffect(() => {
      if (config?.trackProps) {
        handleEvent('change', { propsChanged: true });
      }
    }, [props]);

    // Crear props con event handlers
    const enhancedProps = {
      ...props,
      onClick: (e: React.MouseEvent) => {
        handleEvent('click', { event: e });
        props.onClick?.(e);
      },
      onMouseEnter: (e: React.MouseEvent) => {
        handleEvent('hover', { event: e });
        props.onMouseEnter?.(e);
      },
      onFocus: (e: React.FocusEvent) => {
        handleEvent('focus', { event: e });
        props.onFocus?.(e);
      },
      onBlur: (e: React.FocusEvent) => {
        handleEvent('blur', { event: e });
        props.onBlur?.(e);
      },
      onChange: (e: React.ChangeEvent) => {
        handleEvent('change', { event: e });
        props.onChange?.(e);
      },
      onSubmit: (e: React.FormEvent) => {
        handleEvent('submit', { event: e });
        props.onSubmit?.(e);
      },
    };

    try {
      return <WrappedComponent {...enhancedProps} />;
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  };
}

// Hook para usar el plugin en componentes funcionales
export function useDSPlugin(componentName: string, config?: DSPluginConfig) {
  const plugin = React.useMemo(() => new DSComponentPlugin(config), [componentName, config]);

  const trackEvent = React.useCallback((eventType: DSEvent['eventType'], props?: DSComponentProps, metadata?: Record<string, any>) => {
    plugin.trackEvent({
      componentName,
      eventType,
      props: props || {},
      metadata,
      timestamp: Date.now(),
    });
  }, [plugin, componentName]);

  const trackError = React.useCallback((error: Error, props?: DSComponentProps) => {
    plugin.trackError(componentName, error, props);
  }, [plugin, componentName]);

  const trackPerformance = React.useCallback((metric: { name: string; value: number; unit: string }) => {
    plugin.trackPerformance(componentName, metric);
  }, [plugin, componentName]);

  return { trackEvent, trackError, trackPerformance };
}

// Componente Button con tracking integrado
export const TrackedButton = withDSPlugin(
  ({ children, variant = 'primary', size = 'md', ...props }: any) => (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      {...props}
    >
      {children}
    </button>
  ),
  'Button',
  {
    trackProps: true,
    trackEvents: ['click', 'hover', 'focus'],
    customAttributes: {
      'ds.category': 'interaction',
      'ds.type': 'button',
    },
  }
);

// Componente Input con tracking integrado
export const TrackedInput = withDSPlugin(
  ({ variant = 'default', size = 'md', ...props }: any) => (
    <input 
      className={`input input-${variant} input-${size}`}
      {...props}
    />
  ),
  'Input',
  {
    trackProps: true,
    trackEvents: ['focus', 'blur', 'change'],
    customAttributes: {
      'ds.category': 'form',
      'ds.type': 'input',
    },
  }
);

// Componente Card con tracking integrado
export const TrackedCard = withDSPlugin(
  ({ variant = 'default', children, ...props }: any) => (
    <div 
      className={`card card-${variant}`}
      {...props}
    >
      {children}
    </div>
  ),
  'Card',
  {
    trackProps: true,
    trackEvents: ['click', 'hover'],
    customAttributes: {
      'ds.category': 'layout',
      'ds.type': 'card',
    },
  }
);

// Función helper para crear spans con nomenclatura del Design System
export function createDSSpan(
  componentName: string,
  eventType: string,
  props?: DSComponentProps,
  metadata?: Record<string, any>
) {
  const tracer = getFrontendTracer('design-system');
  const span = tracer.startSpan(`ds-${componentName}.${eventType}`, {
    kind: SpanKind.INTERNAL,
    attributes: {
      'ds.component': componentName,
      'ds.event': eventType,
      'ds.props': JSON.stringify(props || {}),
      'ds.metadata': JSON.stringify(metadata || {}),
      'ds.variant': props?.variant,
      'ds.size': props?.size,
      'ds.disabled': props?.disabled,
      'ds.loading': props?.loading,
    },
  });

  return span;
}

// Función para trackear eventos de formulario
export function trackFormEvent(
  formName: string,
  eventType: 'submit' | 'validation_error' | 'success',
  data?: Record<string, any>
) {
  const tracer = getFrontendTracer('design-system');
  const span = tracer.startSpan(`ds-form.${formName}.${eventType}`, {
    kind: SpanKind.INTERNAL,
    attributes: {
      'ds.form.name': formName,
      'ds.form.event': eventType,
      'ds.form.data': JSON.stringify(data || {}),
    },
  });

  span.setStatus({ code: SpanStatusCode.OK });
  span.end();
}

// Función para trackear navegación de usuario
export function trackUserNavigation(
  from: string,
  to: string,
  trigger: 'click' | 'programmatic' | 'browser'
) {
  const tracer = getFrontendTracer('design-system');
  const span = tracer.startSpan('ds-navigation.user', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'ds.navigation.from': from,
      'ds.navigation.to': to,
      'ds.navigation.trigger': trigger,
      'ds.navigation.timestamp': Date.now(),
    },
  });

  span.setStatus({ code: SpanStatusCode.OK });
  span.end();
}

// Función para trackear interacciones de usuario
export function trackUserInteraction(
  componentName: string,
  interactionType: string,
  props?: DSComponentProps,
  metadata?: Record<string, any>
) {
  const tracer = getFrontendTracer('design-system');
  const span = tracer.startSpan(`ds-interaction.${componentName}.${interactionType}`, {
    kind: SpanKind.INTERNAL,
    attributes: {
      'ds.interaction.component': componentName,
      'ds.interaction.type': interactionType,
      'ds.interaction.props': JSON.stringify(props || {}),
      'ds.interaction.metadata': JSON.stringify(metadata || {}),
      'ds.interaction.timestamp': Date.now(),
    },
  });

  span.setStatus({ code: SpanStatusCode.OK });
  span.end();
}