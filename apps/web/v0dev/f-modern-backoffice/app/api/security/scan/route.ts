import { intrusionDetection } from '@/lib/security/intrusion-detection';
import { notificationClient } from '@a4co/shared-utils/api-clients';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const clientIP =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Registrar evento de escaneo
    const securityEvent = intrusionDetection.logSecurityEvent({
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
    const stats = intrusionDetection.getSecurityStats();

    // Si hay amenazas críticas, enviar notificación
    if (stats.eventsBySeverity.critical > 0) {
      await notificationClient.sendNotification({
        type: 'security_alert',
        priority: 'critical',
        title: 'Amenazas Críticas Detectadas',
        message: `Se han detectado ${stats.eventsBySeverity.critical} amenazas críticas`,
        data: { stats, event: securityEvent },
        recipients: ['admin@backoffice.com'],
        channels: ['email', 'slack'],
      });
    }

    return NextResponse.json({
      success: true,
      event: securityEvent,
      stats,
      recommendations: generateSecurityRecommendations(stats),
    });
  } catch (error) {
    console.error('Error en escaneo de seguridad:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

function generateSecurityRecommendations(stats: any): string[] {
  const recommendations: string[] = [];

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
