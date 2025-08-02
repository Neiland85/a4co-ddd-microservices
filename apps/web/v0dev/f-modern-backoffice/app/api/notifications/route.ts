import { NextResponse } from "next/server"

// Simulación de notificaciones en tiempo real
export async function GET() {
  const notifications = [
    {
      id: "1",
      type: "warning",
      title: "Actualización disponible",
      message: "Nueva versión del sistema disponible (v2.1.4)",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "2",
      type: "error",
      title: "Error de conectividad",
      message: "Problemas de conexión con el servicio externo",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      read: false,
    },
  ]

  return NextResponse.json(notifications)
}
