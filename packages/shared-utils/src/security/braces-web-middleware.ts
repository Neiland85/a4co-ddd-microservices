/**
 * Middleware y utilidades para protección contra ataques de braces en aplicaciones web
 *
 * Este módulo proporciona middleware y utilidades para validar
 * y sanitizar expresiones que puedan contener expansión de braces.
 *
 * NOTA: Este archivo es un ejemplo de implementación. Para usar en producción,
 * instala las dependencias necesarias y ajusta las importaciones.
 */

// Types para Express (en producción, importa de 'express')
interface Request {
  body: any;
  query: any;
  params: any;
}

interface Response {
  status(code: number): Response;
  json(data: any): Response;
}

interface NextFunction {
  (): void;
}

// Importar utilidades de seguridad de braces
import { BracesSecurityMonitorFactory } from './braces-monitor';
import { BracesSecurityFactory, BracesSecurityValidator } from './braces-security';

/**
 * Middleware para validar expresiones con braces en requests HTTP
 */
export class BracesSecurityMiddleware {
  private validator: BracesSecurityValidator;
  private monitor: any;

  constructor(config?: any, serviceName: string = 'unknown-service') {
    this.validator = BracesSecurityFactory.createValidator({
      maxExpansionSize: 50, // Estricto para APIs web
      maxRangeSize: 10, // Rangos muy pequeños
      timeoutMs: 1000, // Timeout rápido
      monitoringEnabled: true,
      ...config,
    });

    // Inicializar monitor
    this.monitor = BracesSecurityMonitorFactory.getMonitor(serviceName);
  }

  /**
   * Middleware para validar body de requests
   */
  validateRequestBody(fieldsToCheck: string[] = ['query', 'command', 'expression']) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const startTime = Date.now();
      let blocked = false;

      try {
        for (const field of fieldsToCheck) {
          const value = this.extractFieldValue(req.body, field);
          if (value && typeof value === 'string') {
            const validation = await this.validator.validateExpression(value);

            if (!validation.isSafe) {
              blocked = true;

              // Registrar alerta de seguridad
              this.monitor.recordAttack(
                'EXPANSION_ATTACK',
                validation.issues.some(
                  (issue) => issue.includes('CRITICAL') || issue.includes('CRITICAL'),
                )
                  ? 'CRITICAL'
                  : 'HIGH',
                {
                  expression: value.substring(0, 200),
                  expansionSize: validation.stats?.expandedLength,
                  processingTime: Date.now() - startTime,
                  clientIP: (req as any).ip || (req as any).connection?.remoteAddress,
                  userAgent: (req as any).get?.('User-Agent'),
                  endpoint: (req as any).originalUrl || (req as any).url,
                },
                {
                  field,
                  validationIssues: validation.issues,
                  requestId: (req as any).id || 'unknown',
                },
              );

              res.status(400).json({
                error: 'Request blocked due to potentially dangerous expression',
                details: validation.issues,
                field: field,
              });
              return;
            }

            // Agregar metadata de validación
            if (!req.body._security) req.body._security = {};
            req.body._security[field] = {
              safe: validation.isSafe,
              stats: validation.stats,
            };
          }
        }

        next();
      } catch (error) {
        // Registrar error de procesamiento
        this.monitor.recordAttack(
          'PATTERN_VIOLATION',
          'MEDIUM',
          {
            processingTime: Date.now() - startTime,
            clientIP: (req as any).ip || (req as any).connection?.remoteAddress,
            endpoint: (req as any).originalUrl || (req as any).url,
          },
          {
            error: error instanceof Error ? error.message : String(error),
            requestId: (req as any).id || 'unknown',
          },
        );

        throw error;
      } finally {
        // Registrar métricas de la solicitud
        const processingTime = Date.now() - startTime;
        const memoryUsage = process.memoryUsage().heapUsed;

        this.monitor.recordRequest(processingTime, memoryUsage, blocked);
      }
    };
  }

  /**
   * Middleware para validar query parameters
   */
  validateQueryParams(paramsToCheck: string[] = ['q', 'query', 'cmd']) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const startTime = Date.now();
      let blocked = false;

      try {
        for (const param of paramsToCheck) {
          const value = req.query[param];
          if (value && typeof value === 'string') {
            const validation = await this.validator.validateExpression(value);

            if (!validation.isSafe) {
              blocked = true;

              // Registrar alerta de seguridad
              this.monitor.recordAttack(
                'EXPANSION_ATTACK',
                'HIGH',
                {
                  expression: value.substring(0, 200),
                  expansionSize: validation.stats?.expandedLength,
                  processingTime: Date.now() - startTime,
                  clientIP: (req as any).ip || (req as any).connection?.remoteAddress,
                  userAgent: (req as any).get?.('User-Agent'),
                  endpoint: (req as any).originalUrl || (req as any).url,
                },
                {
                  param,
                  validationIssues: validation.issues,
                  requestId: (req as any).id || 'unknown',
                },
              );

              res.status(400).json({
                error: 'Request blocked due to potentially dangerous query parameter',
                details: validation.issues,
                param: param,
              });
              return;
            }
          }
        }

        next();
      } catch (error) {
        // Registrar error de procesamiento
        this.monitor.recordAttack(
          'PATTERN_VIOLATION',
          'MEDIUM',
          {
            processingTime: Date.now() - startTime,
            clientIP: (req as any).ip || (req as any).connection?.remoteAddress,
            endpoint: (req as any).originalUrl || (req as any).url,
          },
          {
            error: error instanceof Error ? error.message : String(error),
            requestId: (req as any).id || 'unknown',
          },
        );

        throw error;
      } finally {
        // Registrar métricas de la solicitud
        const processingTime = Date.now() - startTime;
        const memoryUsage = process.memoryUsage().heapUsed;

        this.monitor.recordRequest(processingTime, memoryUsage, blocked);
      }
    };
  }

  /**
   * Extraer valor de campo anidado (ej: 'user.command' -> req.body.user.command)
   */
  private extractFieldValue(obj: any, fieldPath: string): any {
    return fieldPath.split('.').reduce((current, key) => current?.[key], obj);
  }
}

/**
 * Utilidad para sanitizar expresiones con braces
 */
export class BracesSanitizer {
  private validator: BracesSecurityValidator;

  constructor() {
    this.validator = BracesSecurityFactory.createValidator({
      maxExpansionSize: 100,
      maxRangeSize: 20,
    });
  }

  /**
   * Sanitizar expresión reemplazando expansiones peligrosas
   */
  async sanitizeExpression(expression: string): Promise<{
    sanitized: string;
    wasModified: boolean;
    issues: string[];
  }> {
    const validation = await this.validator.validateExpression(expression);

    if (validation.isSafe) {
      return {
        sanitized: expression,
        wasModified: false,
        issues: [],
      };
    }

    // Reemplazar patrones peligrosos
    let sanitized = expression;

    // Reemplazar rangos grandes con placeholders seguros
    sanitized = sanitized.replace(/\{(\d+)\.\.(\d+)\}/g, (match, start, end) => {
      const rangeSize = Math.abs(parseInt(end) - parseInt(start)) + 1;
      if (rangeSize > 10) {
        return `{${start}..${parseInt(start) + 9}}`; // Limitar a 10 elementos
      }
      return match;
    });

    // Reemplazar listas muy grandes
    sanitized = sanitized.replace(/\{([^}]+)\}/g, (match, content) => {
      const items = content.split(',');
      if (items.length > 10) {
        return `{${items.slice(0, 10).join(',')}}`; // Limitar a 10 elementos
      }
      return match;
    });

    return {
      sanitized,
      wasModified: sanitized !== expression,
      issues: validation.issues,
    };
  }

  /**
   * Verificar si una expresión es segura para logging
   */
  async isSafeForLogging(expression: string): Promise<boolean> {
    const validation = await this.validator.validateExpression(expression);
    return validation.isSafe && validation.stats.expansionRatio < 5;
  }
}

/**
 * Servicio para monitoreo de expresiones peligrosas
 */
export class BracesMonitoringService {
  private validator: BracesSecurityValidator;
  private alerts: any[] = [];
  private stats = {
    totalValidations: 0,
    blockedExpressions: 0,
    alertsTriggered: 0,
  };

  constructor() {
    this.validator = BracesSecurityFactory.createValidator();

    // Configurar alertas
    this.validator.on('securityAlert', (alert) => {
      this.alerts.push({
        ...alert,
        timestamp: new Date().toISOString(),
      });
      this.stats.alertsTriggered++;
    });
  }

  /**
   * Registrar validación para estadísticas
   */
  async recordValidation(expression: string, source: string): Promise<void> {
    this.stats.totalValidations++;

    const validation = await this.validator.validateExpression(expression);

    if (!validation.isSafe) {
      this.stats.blockedExpressions++;
    }

    // Log para análisis posterior
    console.log(
      `🔍 Braces validation [${source}]: safe=${validation.isSafe}, ratio=${validation.stats.expansionRatio}`,
    );
  }

  /**
   * Obtener estadísticas de seguridad
   */
  getSecurityStats() {
    return {
      ...this.stats,
      recentAlerts: this.alerts.slice(-10), // Últimas 10 alertas
      alertRate: this.stats.alertsTriggered / Math.max(this.stats.totalValidations, 1),
    };
  }

  /**
   * Limpiar alertas antiguas
   */
  clearOldAlerts(maxAgeMs: number = 3600000) {
    // 1 hora por defecto
    const cutoff = Date.now() - maxAgeMs;
    this.alerts = this.alerts.filter((alert) => new Date(alert.timestamp).getTime() > cutoff);
  }
}

/**
 * Función helper para crear middleware con configuración por defecto
 */
export function createBracesSecurityMiddleware(config?: any) {
  return new BracesSecurityMiddleware(config);
}

/**
 * Función helper para crear sanitizador
 */
export function createBracesSanitizer() {
  return new BracesSanitizer();
}

/**
 * Función helper para crear servicio de monitoreo
 */
export function createBracesMonitoringService() {
  return new BracesMonitoringService();
}

/**
 * Middleware pre-configurado para APIs comunes
 */
export const commonBracesMiddlewares = {
  // Para APIs de búsqueda
  searchApi: createBracesSecurityMiddleware().validateQueryParams(['q', 'query', 'search']),

  // Para APIs de comandos
  commandApi: createBracesSecurityMiddleware().validateRequestBody([
    'command',
    'script',
    'expression',
  ]),

  // Para APIs de configuración
  configApi: createBracesSecurityMiddleware({
    maxExpansionSize: 20, // Más restrictivo para config
    maxRangeSize: 5,
  }).validateRequestBody(['value', 'config', 'settings']),
};
