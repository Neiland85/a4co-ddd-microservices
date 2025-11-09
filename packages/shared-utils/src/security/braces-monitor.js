"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BracesSecurityMonitorFactory = exports.globalBracesMonitor = exports.BracesSecurityMonitor = void 0;
const events_1 = require("events");
let getGlobalLogger;
try {
    const observability = require('@a4co/observability');
    getGlobalLogger = observability.getGlobalLogger;
}
catch {
    getGlobalLogger = () => ({
        info: console.info,
        warn: console.warn,
        error: console.error,
    });
}
class BracesSecurityMonitor extends events_1.EventEmitter {
    constructor(serviceName) {
        super();
        this.serviceName = serviceName;
        this.logger = getGlobalLogger();
        this.metrics = {
            totalRequests: 0,
            blockedRequests: 0,
            averageProcessingTime: 0,
            peakMemoryUsage: 0,
            alertsTriggered: 0,
            topBlockedPatterns: [],
        };
        this.alerts = [];
        this.patternStats = new Map();
        this.setupEventHandlers();
    }
    recordRequest(processingTime, memoryUsage, blocked = false) {
        this.metrics.totalRequests++;
        if (blocked) {
            this.metrics.blockedRequests++;
        }
        this.metrics.averageProcessingTime =
            (this.metrics.averageProcessingTime * (this.metrics.totalRequests - 1) + processingTime) /
                this.metrics.totalRequests;
        if (memoryUsage > this.metrics.peakMemoryUsage) {
            this.metrics.peakMemoryUsage = memoryUsage;
        }
    }
    recordAttack(type, severity, details, metadata = {}) {
        const alert = {
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
        if (details.expression) {
            this.updatePatternStats(details.expression);
        }
        this.emit('alert', alert);
        this.logger.warn('[!] Braces Security Alert', {
            alertId: alert.id,
            service: alert.service,
            severity: alert.severity,
            type: alert.type,
            expression: details.expression?.substring(0, 100),
            clientIP: details.clientIP,
            endpoint: details.endpoint,
        });
        if (severity === 'CRITICAL') {
            this.emit('critical-alert', alert);
            this.logger.error('[!] CRITICAL Braces Security Alert - Immediate Action Required', alert);
        }
    }
    getMetrics() {
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
    getRecentAlerts(limit = 50) {
        return this.alerts.slice(-limit);
    }
    getAlertStats() {
        return this.alerts.reduce((stats, alert) => {
            stats[alert.severity] = (stats[alert.severity] || 0) + 1;
            return stats;
        }, {});
    }
    resetMetrics() {
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
    setupEventHandlers() {
        this.on('alert', (alert) => {
            this.handleExternalAlert(alert);
        });
        this.on('critical-alert', (alert) => {
            this.handleCriticalAlert(alert);
        });
    }
    handleExternalAlert(alert) {
        console.log(`📤 External alert notification for ${alert.id}`);
    }
    handleCriticalAlert(alert) {
        console.log(`[!] CRITICAL ALERT: ${alert.id} - ${alert.type}`);
    }
    updatePatternStats(pattern) {
        const key = pattern.substring(0, 100);
        const existing = this.patternStats.get(key);
        if (existing) {
            existing.count++;
            existing.lastSeen = new Date();
        }
        else {
            this.patternStats.set(key, { count: 1, lastSeen: new Date() });
        }
    }
    generateAlertId() {
        return `braces-alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.BracesSecurityMonitor = BracesSecurityMonitor;
exports.globalBracesMonitor = new BracesSecurityMonitor('global');
class BracesSecurityMonitorFactory {
    static { this.monitors = new Map(); }
    static getMonitor(serviceName) {
        if (!this.monitors.has(serviceName)) {
            this.monitors.set(serviceName, new BracesSecurityMonitor(serviceName));
        }
        return this.monitors.get(serviceName);
    }
    static getAllMonitors() {
        return this.monitors;
    }
    static getGlobalMetrics() {
        const allMetrics = Array.from(this.monitors.values()).map(m => m.getMetrics());
        return {
            totalRequests: allMetrics.reduce((sum, m) => sum + m.totalRequests, 0),
            blockedRequests: allMetrics.reduce((sum, m) => sum + m.blockedRequests, 0),
            averageProcessingTime: allMetrics.length > 0
                ? allMetrics.reduce((sum, m) => sum + m.averageProcessingTime, 0) / allMetrics.length
                : 0,
            peakMemoryUsage: Math.max(...allMetrics.map(m => m.peakMemoryUsage), 0),
            alertsTriggered: allMetrics.reduce((sum, m) => sum + m.alertsTriggered, 0),
            lastAlertTime: allMetrics
                .map(m => m.lastAlertTime)
                .filter(t => t !== undefined)
                .sort((a, b) => b.getTime() - a.getTime())[0],
            topBlockedPatterns: [],
        };
    }
}
exports.BracesSecurityMonitorFactory = BracesSecurityMonitorFactory;
//# sourceMappingURL=braces-monitor.js.map