import { type NextRequest, NextResponse } from "next/server"
import { intrusionDetection } from "@/lib/security/intrusion-detection"
// ❌ ANTES: Importación directa del servicio (VIOLACIÓN DDD)
// import { notificationService } from "@/lib/notifications/notification-service"

// ✅ DESPUÉS: Usar el cliente API del paquete compartido
import { NotificationApiClient } from "@a4co/shared-utils/api-clients"

// Crear instancia del cliente con configuración específica si es necesario
const notificationClient = new NotificationApiClient({
  baseURL: process.env.NOTIFICATION_SERVICE_URL,
  timeout: 10000, // Timeout más largo para operaciones críticas
})

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
    const userAgent = request.headers.get("user-agent") || "Unknown"

    // Registrar evento de escaneo
    const securityEvent = intrusionDetection.logSecurityEvent({
      type: "suspicious_activity",
      severity: "low",
      source: clientIP,
      userAgent,
      details: {
        endpoint: "/api/security/scan",
        method: "POST",
        timestamp: new Date().toISOString(),
      },
    })

    // Obtener estadísticas de seguridad
    const stats = intrusionDetection.getSecurityStats()

    // Si hay amenazas críticas, enviar notificación usando el cliente API
    if (stats.eventsBySeverity.critical > 0) {
      try {
        // ✅ Comunicación a través de API REST en lugar de llamada directa
        await notificationClient.sendSecurityAlert({
          title: "Amenazas Críticas Detectadas",
          message: `Se han detectado ${stats.eventsBySeverity.critical} amenazas críticas`,
          severity: "critical",
          data: { 
            stats, 
            event: securityEvent,
            source: "security-scan-api"
          },
        })
      } catch (notificationError) {
        // Manejar el error de notificación sin interrumpir el flujo principal
        console.error("Error al enviar notificación de seguridad:", notificationError)
        // Podríamos agregar una cola de reintentos o un sistema de fallback aquí
      }
    }

    return NextResponse.json({
      success: true,
      event: securityEvent,
      stats,
      recommendations: generateSecurityRecommendations(stats),
    })
  } catch (error) {
    console.error("Error en escaneo de seguridad:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

function generateSecurityRecommendations(stats: any): string[] {
  const recommendations: string[] = []

  if (stats.eventsBySeverity.critical > 0) {
    recommendations.push("Revisar inmediatamente las amenazas críticas detectadas")
  }

  if (stats.eventsBySeverity.high > 5) {
    recommendations.push("Considerar implementar medidas de seguridad adicionales")
  }

  if (stats.blockedIPs > 50) {
    recommendations.push("Revisar la configuración del firewall")
  }

  if (stats.topThreats.length > 0) {
    recommendations.push(`Monitorear de cerca la IP ${stats.topThreats[0].ip}`)
  }

  return recommendations
}

/**
 * BENEFICIOS DE ESTA REFACTORIZACIÓN:
 * 
 * 1. ✅ Separación de bounded contexts: La app web no conoce los detalles internos
 *    del servicio de notificaciones
 * 
 * 2. ✅ Comunicación a través de contratos: Se usan interfaces bien definidas
 * 
 * 3. ✅ Resiliencia mejorada: El cliente API puede implementar retry, circuit breaker, etc.
 * 
 * 4. ✅ Facilita testing: Es más fácil mockear un cliente HTTP que un servicio completo
 * 
 * 5. ✅ Evolución independiente: El servicio de notificaciones puede cambiar su
 *    implementación interna sin afectar a los consumidores
 */