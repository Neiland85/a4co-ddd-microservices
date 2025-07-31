"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, Eye, Ban, CheckCircle, XCircle } from "lucide-react"

interface SecurityEvent {
  id: string
  type: "unauthorized_access" | "vulnerability" | "suspicious_activity"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  timestamp: Date
  ip?: string
  resolved: boolean
}

export function SecurityMonitoring() {
  const [events, setEvents] = useState<SecurityEvent[]>([
    {
      id: "1",
      type: "unauthorized_access",
      severity: "high",
      description: "Intento de acceso fallido desde IP sospechosa",
      timestamp: new Date(Date.now() - 300000),
      ip: "192.168.1.100",
      resolved: false,
    },
    {
      id: "2",
      type: "vulnerability",
      severity: "medium",
      description: "Dependencia con vulnerabilidad detectada",
      timestamp: new Date(Date.now() - 600000),
      resolved: true,
    },
    {
      id: "3",
      type: "suspicious_activity",
      severity: "low",
      description: "Patrón de tráfico inusual detectado",
      timestamp: new Date(Date.now() - 900000),
      resolved: false,
    },
  ])

  const [stats, setStats] = useState({
    totalThreats: 12,
    blockedAttacks: 8,
    activeMonitoring: true,
    lastScan: new Date(),
  })

  useEffect(() => {
    const interval = setInterval(() => {
      // Simular nuevos eventos de seguridad ocasionalmente
      if (Math.random() < 0.1) {
        const newEvent: SecurityEvent = {
          id: Date.now().toString(),
          type: ["unauthorized_access", "vulnerability", "suspicious_activity"][Math.floor(Math.random() * 3)] as any,
          severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
          description: "Nuevo evento de seguridad detectado",
          timestamp: new Date(),
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          resolved: false,
        }
        setEvents((prev) => [newEvent, ...prev.slice(0, 4)])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "unauthorized_access":
        return <Ban className="h-4 w-4" />
      case "vulnerability":
        return <AlertTriangle className="h-4 w-4" />
      case "suspicious_activity":
        return <Eye className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const resolveEvent = (id: string) => {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, resolved: true } : event)))
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Monitoreo de Seguridad</span>
          </div>
          <Badge variant={stats.activeMonitoring ? "default" : "destructive"} className="bg-green-500">
            {stats.activeMonitoring ? "Activo" : "Inactivo"}
          </Badge>
        </CardTitle>
        <CardDescription>Detección y prevención de amenazas en tiempo real</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estadísticas de seguridad */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-500">{stats.totalThreats}</div>
            <div className="text-xs text-muted-foreground">Amenazas Detectadas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{stats.blockedAttacks}</div>
            <div className="text-xs text-muted-foreground">Ataques Bloqueados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-500">99.8%</div>
            <div className="text-xs text-muted-foreground">Disponibilidad</div>
          </div>
        </div>

        {/* Eventos recientes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Eventos Recientes</h4>
          {events.slice(0, 3).map((event) => (
            <Alert key={event.id} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  {getTypeIcon(event.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(event.severity)} className="text-xs">
                        {event.severity.toUpperCase()}
                      </Badge>
                      {event.resolved ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                    <AlertDescription className="text-xs">
                      {event.description}
                      {event.ip && <span className="block text-muted-foreground">IP: {event.ip}</span>}
                      <span className="block text-muted-foreground">{event.timestamp.toLocaleString("es-ES")}</span>
                    </AlertDescription>
                  </div>
                </div>
                {!event.resolved && (
                  <Button size="sm" variant="outline" onClick={() => resolveEvent(event.id)} className="text-xs">
                    Resolver
                  </Button>
                )}
              </div>
            </Alert>
          ))}
        </div>

        {/* Acciones rápidas */}
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Shield className="h-3 w-3 mr-1" />
            Escanear
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Eye className="h-3 w-3 mr-1" />
            Ver Todo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
