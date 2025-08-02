"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  History,
  Search,
  Download,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Settings,
  User,
  Shield,
} from "lucide-react"

interface EventLog {
  id: string
  type: "error" | "warning" | "info" | "success" | "config" | "security" | "user"
  title: string
  description: string
  timestamp: Date
  user?: string
  ip?: string
  details?: Record<string, any>
}

export function EventHistory() {
  const [events, setEvents] = useState<EventLog[]>([
    {
      id: "1",
      type: "error",
      title: "Error de conexión a base de datos",
      description: "Timeout al conectar con PostgreSQL",
      timestamp: new Date(Date.now() - 300000),
      details: { database: "main", timeout: "30s" },
    },
    {
      id: "2",
      type: "security",
      title: "Intento de acceso no autorizado",
      description: "Múltiples intentos fallidos de login",
      timestamp: new Date(Date.now() - 600000),
      user: "usuario_sospechoso",
      ip: "192.168.1.100",
    },
    {
      id: "3",
      type: "config",
      title: "Configuración actualizada",
      description: "Límites de rate limiting modificados",
      timestamp: new Date(Date.now() - 900000),
      user: "admin@example.com",
    },
    {
      id: "4",
      type: "success",
      title: "Backup completado",
      description: "Backup automático ejecutado correctamente",
      timestamp: new Date(Date.now() - 1200000),
      details: { size: "2.3GB", duration: "45s" },
    },
    {
      id: "5",
      type: "warning",
      title: "Alto uso de CPU",
      description: "CPU al 85% durante 10 minutos",
      timestamp: new Date(Date.now() - 1500000),
      details: { cpu: "85%", duration: "10min" },
    },
    {
      id: "6",
      type: "user",
      title: "Usuario bloqueado",
      description: "Usuario bloqueado por actividad sospechosa",
      timestamp: new Date(Date.now() - 1800000),
      user: "moderador1",
      details: { blocked_user: "spam_user_123" },
    },
  ])

  const [filteredEvents, setFilteredEvents] = useState(events)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((event) => event.type === typeFilter)
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, typeFilter])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "config":
        return <Settings className="h-4 w-4 text-purple-500" />
      case "security":
        return <Shield className="h-4 w-4 text-red-500" />
      case "user":
        return <User className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      case "success":
        return "default"
      case "security":
        return "destructive"
      default:
        return "outline"
    }
  }

  const exportEvents = () => {
    const dataStr = JSON.stringify(filteredEvents, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `events_${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Historial de Eventos</span>
          </div>
          <Button size="sm" variant="outline" onClick={exportEvents}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </CardTitle>
        <CardDescription>Registro detallado de eventos del sistema y actividad de usuarios</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="error">Errores</SelectItem>
              <SelectItem value="warning">Advertencias</SelectItem>
              <SelectItem value="info">Información</SelectItem>
              <SelectItem value="success">Éxito</SelectItem>
              <SelectItem value="config">Configuración</SelectItem>
              <SelectItem value="security">Seguridad</SelectItem>
              <SelectItem value="user">Usuario</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de eventos */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="mt-0.5">{getEventIcon(event.type)}</div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{event.title}</span>
                    <Badge variant={getEventBadgeColor(event.type)} className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{event.timestamp.toLocaleString("es-ES")}</span>
                </div>

                <p className="text-sm text-muted-foreground">{event.description}</p>

                {(event.user || event.ip || event.details) && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {event.user && (
                      <div>
                        <strong>Usuario:</strong> {event.user}
                      </div>
                    )}
                    {event.ip && (
                      <div>
                        <strong>IP:</strong> {event.ip}
                      </div>
                    )}
                    {event.details && (
                      <div>
                        <strong>Detalles:</strong> {JSON.stringify(event.details)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron eventos que coincidan con los filtros
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-red-500">{events.filter((e) => e.type === "error").length}</div>
            <div className="text-xs text-muted-foreground">Errores</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-500">
              {events.filter((e) => e.type === "warning").length}
            </div>
            <div className="text-xs text-muted-foreground">Advertencias</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-500">
              {events.filter((e) => e.type === "success").length}
            </div>
            <div className="text-xs text-muted-foreground">Éxitos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-500">
              {events.filter((e) => e.type === "security").length}
            </div>
            <div className="text-xs text-muted-foreground">Seguridad</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
