import { context, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { Resource } from '@opentelemetry/resources';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { useCallback, useEffect, useRef } from 'react';

// Configuración del logger para frontend
interface FrontendLoggerConfig {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  endpoint?: string;
  level?: 'debug' | 'info' | 'warn' | 'error';
}

// Configuración del tracer para frontend
interface FrontendTracingConfig {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  endpoint?: string;
  enableConsoleExporter?: boolean;
}

// Interfaz para eventos de UI
interface UIEvent {
  component: string;
  action: string;
  variant?: string;
  size?: string;
  props?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

// Clase para logging estructurado en frontend
class FrontendLogger {
  private config: FrontendLoggerConfig;
  private sessionId: string;

  constructor(config: FrontendLoggerConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  private createLogEntry(level: string, message: string, data?: any): any {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.config.serviceName,
      version: this.config.serviceVersion,
      environment: this.config.environment,
      sessionId: this.sessionId,
      userId: this.getUserId(),
      ...data,
    };
  }

  private getUserId(): string | undefined {
    // Implementar lógica para obtener el ID del usuario desde localStorage, cookies, etc.
    return localStorage.getItem('userId') || undefined;
  }

  private async sendLog(logEntry: any): Promise<void> {
    if (this.config.endpoint) {
      try {
        await fetch(this.config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEntry),
        });
      } catch (error) {
        console.error('Error sending log:', error);
      }
    }

    // También loggear en consola en desarrollo
    if (this.config.environment === 'development') {
      console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.message}`, logEntry);
    }
  }

  debug(message: string, data?: any): void {
    if (this.config.level === 'debug') {
      this.sendLog(this.createLogEntry('debug', message, data));
    }
  }

  info(message: string, data?: any): void {
    if (['debug', 'info'].includes(this.config.level || 'info')) {
      this.sendLog(this.createLogEntry('info', message, data));
    }
  }

  warn(message: string, data?: any): void {
    if (['debug', 'info', 'warn'].includes(this.config.level || 'info')) {
      this.sendLog(this.createLogEntry('warn', message, data));
    }
  }

  error(message: string, error?: Error, data?: any): void {
    this.sendLog(
      this.createLogEntry('error', message, {
        error: error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : undefined,
        ...data,
      })
    );
  }

  logUIEvent(event: Omit<UIEvent, 'timestamp' | 'sessionId'>): void {
    const uiEvent: UIEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    this.info(`UI Event: ${event.component}.${event.action}`, uiEvent);
  }
}

// Clase para tracing en frontend
class FrontendTracer {
  private provider!: WebTracerProvider;
  private config: FrontendTracingConfig;

  constructor(config: FrontendTracingConfig) {
    this.config = config;
    this.initializeTracer();
  }

  private initializeTracer(): void {
    this.provider = new WebTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: this.config.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: this.config.serviceVersion,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: this.config.environment,
      }),
    });

    // Configurar exportador
    if (this.config.endpoint) {
      this.provider.addSpanProcessor(
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: this.config.endpoint,
          })
        )
      );
    }

    // Registrar instrumentaciones automáticas
    registerInstrumentations({
      instrumentations: [
        new DocumentLoadInstrumentation(),
        new UserInteractionInstrumentation(),
        new XMLHttpRequestInstrumentation(),
        new FetchInstrumentation(),
      ],
    });

    // Registrar el provider
    this.provider.register({
      contextManager: new ZoneContextManager(),
    });
  }

  createSpan(name: string, kind: SpanKind = SpanKind.INTERNAL): any {
    const tracer = trace.getTracer(this.config.serviceName);
    return tracer.startSpan(name, { kind });
  }

  createChildSpan(parentSpan: any, name: string, kind: SpanKind = SpanKind.INTERNAL): any {
    const tracer = trace.getTracer(this.config.serviceName);
    return tracer.startSpan(name, { kind }, context.active());
  }

  addEvent(span: any, name: string, attributes?: Record<string, any>): void {
    span.addEvent(name, attributes);
  }

  setAttributes(span: any, attributes: Record<string, any>): void {
    span.setAttributes(attributes);
  }

  endSpan(span: any, status: SpanStatusCode = SpanStatusCode.OK): void {
    span.setStatus(status);
    span.end();
  }
}

// Instancia global
let frontendLogger: FrontendLogger | null = null;
let frontendTracer: FrontendTracer | null = null;

// Función de inicialización
export function initializeFrontendObservability(
  loggerConfig: FrontendLoggerConfig,
  tracingConfig: FrontendTracingConfig
) {
  frontendLogger = new FrontendLogger(loggerConfig);
  frontendTracer = new FrontendTracer(tracingConfig);

  return {
    logger: frontendLogger,
    tracer: frontendTracer,
  };
}

// Hook para logging de errores
export function useErrorLogger() {
  const logError = useCallback((error: Error, context?: string) => {
    if (frontendLogger) {
      frontendLogger.error(`Error in ${context || 'component'}`, error);
    }
  }, []);

  return { logError };
}

// Hook para logging de eventos de UI
export function useUILogger() {
  const logUIEvent = useCallback((event: Omit<UIEvent, 'timestamp' | 'sessionId'>) => {
    if (frontendLogger) {
      frontendLogger.logUIEvent(event);
    }
  }, []);

  return { logUIEvent };
}

// Hook para tracing de componentes
export function useComponentTracing(componentName: string) {
  const spanRef = useRef<any>(null);

  useEffect(() => {
    if (frontendTracer) {
      spanRef.current = frontendTracer.createSpan(`${componentName}.mount`);
      frontendTracer.setAttributes(spanRef.current, {
        'component.name': componentName,
        'component.type': 'react',
      });
    }

    return () => {
      if (spanRef.current && frontendTracer) {
        frontendTracer.endSpan(spanRef.current);
      }
    };
  }, [componentName]);

  const createChildSpan = useCallback(
    (action: string) => {
      if (frontendTracer && spanRef.current) {
        return frontendTracer.createChildSpan(spanRef.current, `${componentName}.${action}`);
      }
      return null;
    },
    [componentName]
  );

  return { createChildSpan };
}

// HOC para instrumentar componentes
export function withObservability<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function ObservabilityWrapper(props: P) {
    const { logUIEvent } = useUILogger();
    const { createChildSpan } = useComponentTracing(componentName);

    const handleInteraction = useCallback(
      (action: string, data?: any) => {
        const span = createChildSpan(action);
        if (span && frontendTracer) {
          frontendTracer.setAttributes(span, data || {});
          frontendTracer.endSpan(span);
        }

        logUIEvent({
          component: componentName,
          action,
          props: data,
        });
      },
      [componentName, createChildSpan, logUIEvent]
    );

    return <WrappedComponent {...props} onInteraction={handleInteraction} />;
  };
}

// Wrapper para fetch con observabilidad
export function createObservableFetch(baseURL?: string) {
  return async (url: string, options?: RequestInit) => {
    const fullUrl = baseURL ? `${baseURL}${url}` : url;
    const span = frontendTracer?.createSpan('http.request', SpanKind.CLIENT);

    if (span) {
      frontendTracer?.setAttributes(span, {
        'http.url': fullUrl,
        'http.method': options?.method || 'GET',
      });
    }

    try {
      const startTime = performance.now();
      const response = await fetch(fullUrl, options);
      const duration = performance.now() - startTime;

      if (span) {
        frontendTracer?.setAttributes(span, {
          'http.status_code': response.status,
          'http.response_time': duration,
        });
        frontendTracer?.endSpan(span, response.ok ? SpanStatusCode.OK : SpanStatusCode.ERROR);
      }

      if (!response.ok) {
        frontendLogger?.error(
          `HTTP Error: ${response.status}`,
          new Error(`HTTP ${response.status}`),
          {
            url: fullUrl,
            status: response.status,
          }
        );
      }

      return response;
    } catch (error) {
      if (span) {
        frontendTracer?.setAttributes(span, {
          error: true,
          'error.message': error instanceof Error ? error.message : String(error),
        });
        frontendTracer?.endSpan(span, SpanStatusCode.ERROR);
      }

      frontendLogger?.error(
        `Network Error`,
        error instanceof Error ? error : new Error(String(error)),
        {
          url: fullUrl,
        }
      );

      throw error;
    }
  };
}

// Exportar instancias globales
export function getFrontendLogger(): FrontendLogger | null {
  return frontendLogger;
}

export function getFrontendTracer(): FrontendTracer | null {
  return frontendTracer;
}

// Tipos
export type { FrontendLoggerConfig, FrontendTracingConfig, UIEvent };
