"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intrusionDetection = exports.IntrusionDetectionSystem = void 0;
class IntrusionDetectionSystem {
    events = [];
    blockedIPs = new Set();
    suspiciousIPs = new Map();
    threatPatterns = [
        {
            name: 'Brute Force Attack',
            pattern: event => {
                if (event.type === 'login_attempt') {
                    const recentAttempts = this.getRecentEvents(event.source, 'login_attempt', 15 * 60 * 1000);
                    return recentAttempts.length > 10;
                }
                return false;
            },
            severity: 'high',
            action: 'block',
        },
        {
            name: 'SQL Injection Attempt',
            pattern: /(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b)/i,
            severity: 'critical',
            action: 'block',
        },
        {
            name: 'XSS Attempt',
            pattern: /(<script|javascript:|on\w+\s*=)/i,
            severity: 'high',
            action: 'block',
        },
        {
            name: 'Path Traversal',
            pattern: /(\.\.\/|\.\.\\)/,
            severity: 'medium',
            action: 'alert',
        },
        {
            name: 'Suspicious User Agent',
            pattern: event => {
                const suspiciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zap'];
                return suspiciousAgents.some(agent => event.userAgent?.toLowerCase().includes(agent) || false);
            },
            severity: 'medium',
            action: 'alert',
        },
    ];
    // Registrar evento de seguridad
    logSecurityEvent(event) {
        const securityEvent = {
            ...event,
            id: this.generateId(),
            timestamp: new Date(),
            blocked: false,
        };
        // Analizar amenazas
        this.analyzeThreats(securityEvent);
        // Agregar a la lista de eventos
        this.events.push(securityEvent);
        // Mantener solo los últimos 10000 eventos
        if (this.events.length > 10000) {
            this.events = this.events.slice(-10000);
        }
        return securityEvent;
    }
    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    // Analizar amenazas en un evento
    analyzeThreats(event) {
        for (const pattern of this.threatPatterns) {
            let isMatch = false;
            if (pattern.pattern instanceof RegExp) {
                const textToCheck = JSON.stringify(event.details);
                isMatch = pattern.pattern.test(textToCheck);
            }
            else if (typeof pattern.pattern === 'function') {
                isMatch = pattern.pattern(event);
            }
            if (isMatch) {
                console.warn(`Amenaza detectada: ${pattern.name}`, event);
                // Actualizar severidad si es mayor
                if (this.getSeverityLevel(pattern.severity) > this.getSeverityLevel(event.severity)) {
                    event.severity = pattern.severity;
                }
                // Ejecutar acción
                this.executeAction(pattern.action, event);
            }
        }
    }
    // Ejecutar acción de seguridad
    executeAction(action, event) {
        switch (action) {
            case 'block':
                this.blockIP(event.source);
                event.blocked = true;
                break;
            case 'alert':
                this.sendSecurityAlert(event);
                break;
            case 'log':
                // Ya se registra automáticamente
                break;
        }
    }
    // Bloquear IP
    blockIP(ip, duration = 24 * 60 * 60 * 1000) {
        this.blockedIPs.add(ip);
        // Desbloquear después del tiempo especificado
        setTimeout(() => {
            this.blockedIPs.delete(ip);
        }, duration);
        console.log(`IP bloqueada: ${ip}`);
    }
    // Verificar si una IP está bloqueada
    isIPBlocked(ip) {
        return this.blockedIPs.has(ip);
    }
    // Obtener eventos recientes de una IP
    getRecentEvents(ip, type, timeWindow = 60 * 60 * 1000) {
        const cutoff = new Date(Date.now() - timeWindow);
        return this.events.filter(event => event.source === ip && event.timestamp > cutoff && (!type || event.type === type));
    }
    // Obtener nivel numérico de severidad
    getSeverityLevel(severity) {
        const levels = { low: 1, medium: 2, high: 3, critical: 4 };
        return levels[severity];
    }
    // Enviar alerta de seguridad
    sendSecurityAlert(event) {
        // Aquí implementarías la lógica para enviar alertas
        console.log('🚨 ALERTA DE SEGURIDAD:', event);
    }
    // Obtener estadísticas de seguridad
    getSecurityStats(timeWindow = 24 * 60 * 60 * 1000) {
        const cutoff = new Date(Date.now() - timeWindow);
        const recentEvents = this.events.filter(event => event.timestamp > cutoff);
        const eventsByType = {};
        const eventsBySeverity = {};
        const ipCounts = {};
        for (const event of recentEvents) {
            eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
            eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
            ipCounts[event.source] = (ipCounts[event.source] || 0) + 1;
        }
        const topThreats = Object.entries(ipCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([ip, events]) => ({ ip, events }));
        return {
            totalEvents: recentEvents.length,
            eventsByType,
            eventsBySeverity,
            blockedIPs: this.blockedIPs.size,
            topThreats,
        };
    }
}
exports.IntrusionDetectionSystem = IntrusionDetectionSystem;
exports.intrusionDetection = new IntrusionDetectionSystem();
//# sourceMappingURL=intrusion-detection.js.map