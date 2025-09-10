"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const intrusion_detection_1 = require("@/lib/security/intrusion-detection");
const api_clients_1 = require("@a4co/shared-utils/api-clients");
const server_1 = require("next/server");
async function POST(request) {
    try {
        const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        // Registrar evento de escaneo
        const securityEvent = intrusion_detection_1.intrusionDetection.logSecurityEvent({
            type: 'suspicious_activity',
            severity: 'low',
            source: clientIP,
            userAgent,
            details: {
                endpoint: '/api/security/scan',
                method: 'POST',
                timestamp: new Date().toISOString(),
            },
        });
        // Obtener estadísticas de seguridad
        const stats = intrusion_detection_1.intrusionDetection.getSecurityStats();
        // Si hay amenazas críticas, enviar notificación
        if (stats.eventsBySeverity.critical > 0) {
            await api_clients_1.notificationClient.sendNotification({
                type: 'security_alert',
                priority: 'critical',
                title: 'Amenazas Críticas Detectadas',
                message: `Se han detectado ${stats.eventsBySeverity.critical} amenazas críticas`,
                data: { stats, event: securityEvent },
                recipients: ['admin@backoffice.com'],
                channels: ['email', 'slack'],
            });
        }
        return server_1.NextResponse.json({
            success: true,
            event: securityEvent,
            stats,
            recommendations: generateSecurityRecommendations(stats),
        });
    }
    catch (error) {
        console.error('Error en escaneo de seguridad:', error);
        return server_1.NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
function generateSecurityRecommendations(stats) {
    const recommendations = [];
    if (stats.eventsBySeverity.critical > 0) {
        recommendations.push('Revisar inmediatamente las amenazas críticas detectadas');
    }
    if (stats.eventsBySeverity.high > 5) {
        recommendations.push('Considerar implementar medidas de seguridad adicionales');
    }
    if (stats.blockedIPs > 50) {
        recommendations.push('Revisar la configuración del firewall');
    }
    if (stats.topThreats.length > 0) {
        recommendations.push(`Monitorear de cerca la IP ${stats.topThreats[0].ip}`);
    }
    return recommendations;
}
//# sourceMappingURL=route.js.map