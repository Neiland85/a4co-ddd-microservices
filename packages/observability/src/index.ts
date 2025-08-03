// Re-exportar todo desde los módulos
export * from './logger';
export * from './tracing';
export * from './middleware';

// Importaciones para configuración rápida
import { createLogger, createHttpLogger, StructuredLogger } from './logger';
import { initializeTracing, TracingUtils, Trace } from './tracing';
import { 
  observabilityMiddleware, 
  logCorrelationMiddleware, 
  errorHandlingMiddleware,
  TracedHttpClient 
} from './middleware';

// Configuración completa de observabilidad
export interface ObservabilityConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  logging?: {
    level?: string;
    prettyPrint?: boolean;
  };
  tracing?: {
    enabled?: boolean;
    exporterType?: 'jaeger' | 'otlp' | 'console';
    jaegerEndpoint?: string;
    otlpEndpoint?: string;
    sampleRate?: number;
  };
}

// Clase principal para gestionar observabilidad
export class Observability {
  private logger: any;
  private structuredLogger: StructuredLogger;
  private tracingSDK: any;
  private httpClient: TracedHttpClient;
  
  constructor(private config: ObservabilityConfig) {
    // Inicializar logging
    this.logger = createLogger({
      serviceName: config.serviceName,
      environment: config.environment,
      level: config.logging?.level,
      prettyPrint: config.logging?.prettyPrint,
    });
    
    this.structuredLogger = new StructuredLogger(this.logger);
    
    // Inicializar tracing si está habilitado
    if (config.tracing?.enabled !== false) {
      this.tracingSDK = initializeTracing({
        serviceName: config.serviceName,
        serviceVersion: config.serviceVersion,
        environment: config.environment,
        exporterType: config.tracing?.exporterType,
        jaegerEndpoint: config.tracing?.jaegerEndpoint,
        otlpEndpoint: config.tracing?.otlpEndpoint,
        sampleRate: config.tracing?.sampleRate,
      });
    }
    
    // Inicializar cliente HTTP con tracing
    this.httpClient = new TracedHttpClient();
  }
  
  // Obtener logger
  getLogger() {
    return this.logger;
  }
  
  // Obtener structured logger
  getStructuredLogger() {
    return this.structuredLogger;
  }
  
  // Obtener cliente HTTP con tracing
  getHttpClient() {
    return this.httpClient;
  }
  
  // Crear middleware para Express
  getMiddleware() {
    return {
      // Middleware principal de observabilidad
      observability: observabilityMiddleware(),
      
      // Middleware de logging HTTP
      httpLogging: createHttpLogger(this.logger),
      
      // Middleware de correlación de logs
      logCorrelation: logCorrelationMiddleware(this.logger),
      
      // Middleware de manejo de errores
      errorHandling: errorHandlingMiddleware(this.logger),
    };
  }
  
  // Shutdown graceful
  async shutdown() {
    if (this.tracingSDK) {
      await this.tracingSDK.shutdown();
    }
  }
}

// Función helper para inicialización rápida
export function setupObservability(config: ObservabilityConfig) {
  return new Observability(config);
}

// Exportar utilidades
export { TracingUtils, Trace };

// Tipos útiles
export type { LoggerConfig } from './logger';
export type { TracingConfig } from './tracing';
export type { TracedRequest } from './middleware';