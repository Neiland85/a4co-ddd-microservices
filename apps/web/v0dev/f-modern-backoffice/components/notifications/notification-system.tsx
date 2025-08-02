"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, AlertTriangle, Info, CheckCircle, Wifi, WifiOff } from "lucide-react"

interface Notification {
  id: string
  type: "error" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: Date
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline">("online")

  useEffect(() => {
    // Simular notificaciones en tiempo real
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% de probabilidad cada 5 segundos
        const notificationTypes = [
          {
            type: "warning" as const,
            title: "Alto uso de CPU",
            message: "El servidor está experimentando un alto uso de CPU (85%)",
          },
          {
            type: "error" as const,
            title: "Error de conexión",
            message: "Falló la conexión con el servicio de autenticación",
          },
          {
            type: "info" as const,
            title: "Actualización disponible",
            message: "Nueva versión del sistema disponible (v2.1.3)",
          },
          {
            type: "success" as const,
            title: "Backup completado",
            message: "El backup automático se completó exitosamente",
          },
        ]

        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]

        addNotification({
          ...randomNotification,
          id: Date.now().toString(),
          timestamp: new Date(),
        })
      }
    }, 5000)

    // Simular cambios de conectividad
    const connectivityInterval = setInterval(() => {
      if (Math.random() < 0.05) {
        // 5% de probabilidad
        const newStatus = connectionStatus === "online" ? "offline" : "online"
        setConnectionStatus(newStatus)

        addNotification({
          id: Date.now().toString(),
          type: newStatus === "online" ? "success" : "error",
          title: newStatus === "online" ? "Conexión restaurada" : "Conexión perdida",
          message:
            newStatus === "online"
              ? "La conexión con los servicios se ha restaurado"
              : "Se perdió la conexión con los servicios principales",
          timestamp: new Date(),
          persistent: newStatus === "offline",
        })
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      clearInterval(connectivityInterval)
    }
  }, [connectionStatus])

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 4)]) // Mantener máximo 5 notificaciones

    // Auto-remover notificaciones no persistentes después de 5 segundos
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, 5000)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-red-500 bg-red-50 dark:bg-red-950"
      case "warning":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
      case "info":
        return "border-blue-500 bg-blue-50 dark:bg-blue-950"
      case "success":
        return "border-green-500 bg-green-50 dark:bg-green-950"
      default:
        return "border-gray-500 bg-gray-50 dark:bg-gray-950"
    }
  }

  return (
    <>
      {/* Indicador de estado de conexión */}
      <div className="fixed top-16 right-4 z-40">
        <Badge
          variant={connectionStatus === "online" ? "default" : "destructive"}
          className="flex items-center space-x-1"
        >
          {connectionStatus === "online" ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          <span>{connectionStatus === "online" ? "En línea" : "Sin conexión"}</span>
        </Badge>
      </div>

      {/* Notificaciones */}
      <div className="fixed top-20 right-4 z-50 space-y-2 w-80">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            className={`${getNotificationColor(notification.type)} animate-in slide-in-from-right duration-300`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{notification.title}</div>
                  <AlertDescription className="text-xs mt-1">{notification.message}</AlertDescription>
                  <div className="text-xs text-muted-foreground mt-1">
                    {notification.timestamp.toLocaleTimeString("es-ES")}
                  </div>
                  {notification.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 text-xs bg-transparent"
                      onClick={notification.action.onClick}
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => removeNotification(notification.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </Alert>
        ))}
      </div>
    </>
  )
}
