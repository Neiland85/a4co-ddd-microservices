/**
 * Sistema de monitoreo y alertas para seguridad de braces
 *
 * Este módulo proporciona monitoreo en tiempo real y alertas
 * para ataques de expansión de braces.
 */

import { EventEmitter } from 'events';

// Import opcional para observabilidad (fallback a console si no está disponible)
let getGlobalLogger: () => any;
try {
  const observability = require('@a4co/observability');
  getGlobalLogger = observability.getGlobalLogger;
} catch {
  getGlobalLogger = () => ({
    info: console.info,
    warn: console.warn,
    error: console.error,
  });
}

export interface BracesSecurityAlert {
  id: string;
  timestamp: Date;
  service: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'EXPANSION_ATTACK' | 'RESOURCE_EXHAUSTION' | 'PATTERN_VIOLATION';
  details: {
    expression?: string;
    expansionSize?: number;
    processingTime?: number;
    memoryUsage?: number;
    clientIP?: string;
    userAgent?: string;
    endpoint?: string;
  };
  metadata: Record<string, any>;
}

export interface BracesSecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  averageProcessingTime: number;
  peakMemoryUsage: number;
  alertsTriggered: number;
  lastAlertTime?: Date;
  topBlockedPatterns: Array<{
    pattern: string;
    count: number;
    lastSeen: Date;
  }>;
}

export class BracesSecurityMonitor extends EventEmitter {
  private logger = getGlobalLogger();
  private metrics: BracesSecurityMetrics = {
    totalRequests: 0,
    blockedRequests: 0,
    averageProcessingTime: 0,
    peakMemoryUsage: 0,
    alertsTriggered: 0,
    topBlockedPatterns: [],
  };

  private alerts: BracesSecurityAlert[] = [];
  private patternStats = new Map<string, { count: number; lastSeen: Date }>();

  constructor(private serviceName: string) {
    super();
    this.setupEventHandlers();
  }

  /**
   * Registra una solicitud procesada
   */
  recordRequest(processingTime: number, memoryUsage: number, blocked: boolean = false): void {
    this.metrics.totalRequests++;
    if (blocked) {
      this.metrics.blockedRequests++;
    }

    // Actualizar promedio de tiempo de procesamiento
    this.metrics.averageProcessingTime =
      (this.metrics.averageProcessingTime * (this.metrics.totalRequests - 1) + processingTime) /
      this.metrics.totalRequests;

    // Actualizar uso máximo de memoria
    if (memoryUsage > this.metrics.peakMemoryUsage) {
      this.metrics.peakMemoryUsage = memoryUsage;
    }
  }

  /**
   * Registra un ataque detectado
   */
  recordAttack(
    type: BracesSecurityAlert['type'],
    severity: BracesSecurityAlert['severity'],
    details: BracesSecurityAlert['details'],
    metadata: Record<string, any> = {}
  ): void {
    const alert: BracesSecurityAlert = {
      id: this.generateAlertId(),
      timestamp: new Date(),
      service: this.serviceName,
      severity,
      type,
      details,
      metadata,
    };

    this.alerts.push(alert);
    this.metrics.alertsTriggered++;
    this.metrics.lastAlertTime = alert.timestamp;

    // Actualizar estadísticas de patrones
    if (details.expression) {
      this.updatePatternStats(details.expression);
    }

    // Emitir evento de alerta
    this.emit('alert', alert);

    // Log de alerta
    this.logger.warn('[!] Braces Security Alert', {
      alertId: alert.id,
      service: alert.service,
      severity: alert.severity,
      type: alert.type,
      expression: details.expression?.substring(0, 100),
      clientIP: details.clientIP,
      endpoint: details.endpoint,
    });

    // Alertas críticas requieren acción inmediata
    if (severity === 'CRITICAL') {
      this.emit('critical-alert', alert);
      this.logger.error('[!] CRITICAL Braces Security Alert - Immediate Action Required', alert);
    }
  }

  /**
   * Obtiene métricas actuales
   */
  getMetrics(): BracesSecurityMetrics {
    return {
      ...this.metrics,
      topBlockedPatterns: Array.from(this.patternStats.entries())
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 10)
        .map(([pattern, stats]) => ({
          pattern: pattern.substring(0, 50),
          count: stats.count,
          lastSeen: stats.lastSeen,
        })),
    };
  }

  /**
   * Obtiene alertas recientes
   */
  getRecentAlerts(limit: number = 50): BracesSecurityAlert[] {
    return this.alerts.slice(-limit);
  }

  /**
   * Obtiene estadísticas de alertas por severidad
   */
  getAlertStats(): Record<string, number> {
    return this.alerts.reduce(
      (stats, alert) => {
        stats[alert.severity] = (stats[alert.severity] || 0) + 1;
        return stats;
      },
      {} as Record<string, number>
    );
  }

  /**
   * Limpia métricas antiguas (útil para reinicio periódico)
   */
  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      averageProcessingTime: 0,
      peakMemoryUsage: 0,
      alertsTriggered: 0,
      topBlockedPatterns: [],
    };
    this.patternStats.clear();
    this.logger.info('🔄 Braces security metrics reset');
  }

  /**
   * Configura manejadores de eventos
   */
  private setupEventHandlers(): void {
    this.on('alert', (alert: BracesSecurityAlert) => {
      // Aquí se pueden agregar integraciones con sistemas externos
      // como Slack, PagerDuty, DataDog, etc.
      this.handleExternalAlert(alert);
    });

    this.on('critical-alert', (alert: BracesSecurityAlert) => {
      // Alertas críticas requieren notificación inmediata
      this.handleCriticalAlert(alert);
    });
  }

  /**
   * Maneja alertas para sistemas externos
   */
  private handleExternalAlert(alert: BracesSecurityAlert): void {
    // TODO: Integrar con sistemas de monitoreo externos
    // Ejemplos:
    // - Slack webhooks
    // - PagerDuty
    // - DataDog events
    // - New Relic alerts

    console.log(`📤 External alert notification for ${alert.id}`);
  }

  /**
   * Maneja alertas críticas
   */
  private handleCriticalAlert(alert: BracesSecurityAlert): void {
    // TODO: Implementar notificaciones críticas
    // - Email a equipo de seguridad
    // - SMS a on-call engineer
    // - PagerDuty escalation

    console.log(`[!] CRITICAL ALERT: ${alert.id} - ${alert.type}`);
  }

  /**
   * Actualiza estadísticas de patrones bloqueados
   */
  private updatePatternStats(pattern: string): void {
    const key = pattern.substring(0, 100); // Limitar longitud
    const existing = this.patternStats.get(key);

    if (existing) {
      existing.count++;
      existing.lastSeen = new Date();
    } else {
      this.patternStats.set(key, { count: 1, lastSeen: new Date() });
    }
  }

  /**
   * Genera ID único para alertas
   */
  private generateAlertId(): string {
    return `braces-alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton global para monitoreo
export const globalBracesMonitor = new BracesSecurityMonitor('global');

// Factory para crear monitores por servicio
export class BracesSecurityMonitorFactory {
  private static monitors = new Map<string, BracesSecurityMonitor>();

  static getMonitor(serviceName: string): BracesSecurityMonitor {
    if (!this.monitors.has(serviceName)) {
      this.monitors.set(serviceName, new BracesSecurityMonitor(serviceName));
    }
    return this.monitors.get(serviceName)!;
  }

  static getAllMonitors(): Map<string, BracesSecurityMonitor> {
    return this.monitors;
  }

  static getGlobalMetrics(): BracesSecurityMetrics {
    const allMetrics = Array.from(this.monitors.values()).map(m => m.getMetrics());

    const lastAlert = allMetrics
      .map(m => m.lastAlertTime)
      .filter((t): t is Date => t !== undefined)
      .sort((a, b) => b.getTime() - a.getTime())[0];

    const metrics: BracesSecurityMetrics = {
      totalRequests: allMetrics.reduce((sum, m) => sum + m.totalRequests, 0),
      blockedRequests: allMetrics.reduce((sum, m) => sum + m.blockedRequests, 0),
      averageProcessingTime:
        allMetrics.length > 0
          ? allMetrics.reduce((sum, m) => sum + m.averageProcessingTime, 0) / allMetrics.length
          : 0,
      peakMemoryUsage: Math.max(...allMetrics.map(m => m.peakMemoryUsage), 0),
      alertsTriggered: allMetrics.reduce((sum, m) => sum + m.alertsTriggered, 0),
      topBlockedPatterns: [], // TODO: Agregar agregación global
    };
    
    if (lastAlert !== undefined) {
      metrics.lastAlertTime = lastAlert;
    }
    
    return metrics;
  }
}
