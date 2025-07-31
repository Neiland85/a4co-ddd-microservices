"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, Eye, Ban, CheckCircle, XCircle, Lock, Activity, Zap } from "lucide-react"

interface SecurityMetrics {
  threatLevel: "low" | "medium" | "high" | "critical"
  blockedIPs: number
  failedLogins: number
  suspiciousActivities: number
  activeThreats: number
  systemHealth: number
  lastScan: Date
}

interface SecurityAlert {
  id: string
  type: "brute_force" | "sql_injection" | "xss_attempt" | "suspicious_activity"
  severity: "low" | "medium" | "high" | "critical"
  source: string
  description: string
  timestamp: Date
  blocked: boolean
  resolved: boolean
}

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatLevel: "low",
    blockedIPs: 12,
    failedLogins: 45,
    suspiciousActivities: 8,
    activeThreats: 3,
    systemHealth: 98,
    lastScan: new Date(),
  })

  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: "1",
      type: "brute_force",
      severity: "high",
      source: "192.168.1.100",
      description: "Múltiples intentos de login fallidos detectados",
      timestamp: new Date(Date.now() - 300000),
      blocked: true,
      resolved: false,
    },
    {
      id: "2",
      type: "sql_injection",
      severity: "critical",
      source: "10.0.0.50",
      description: "Intento de inyección SQL en endpoint /api/users",
      timestamp: new Date(Date.now() - 600000),
      blocked: true,
      resolved: false,
    },
    {
      id: "3",
      type: "suspicious_activity",
      severity: "medium",
      source: "172.16.0.25",
      description: "Patrón de navegación anómalo detectado",
      timestamp: new Date(Date.now() - 900000),
      blocked: false,
      resolved: true,
    },
  ])

  useEffect(() => {
    // Simular actualizaciones en tiempo real
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        failedLogins: prev.failedLogins + Math.floor(Math.random() * 3),
        suspiciousActivities: Math.max(0, prev.suspiciousActivities + Math.floor(Math.random() * 2) - 1),
        systemHealth: Math.max(90, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
        lastScan: new Date(),
      }))

      // Simular nuevas alertas ocasionalmente
      if (Math.random() < 0.1) {
        const newAlert: SecurityAlert = {
          id: Date.now().toString(),
          type: ["brute_force", "sql_injection", "xss_attempt", "suspicious_activity"][
            Math.floor(Math.random() * 4)
          ] as any,
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
          source: `192.168.1.${Math.floor(Math.random() * 255)}`,
          description: "Nueva amenaza detectada por el sistema",
          timestamp: new Date(),
          blocked: Math.random() > 0.3,
          resolved: false,
        }
        setAlerts((prev) => [newAlert, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "outline"
    }
  }

  const getThreatLevelIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "medium":
        return <Eye className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "brute_force":
        return <Ban className="h-4 w-4" />
      case "sql_injection":
        return <AlertTriangle className="h-4 w-4" />
      case "xss_attempt":
        return <XCircle className="h-4 w-4" />
      case "suspicious_activity":
        return <Eye className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const resolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, resolved: true } : alert)))
  }

  const blockIP = (ip: string) => {
    console.log(`Bloqueando IP: ${ip}`)
    setMetrics((prev) => ({ ...prev, blockedIPs: prev.blockedIPs + 1 }))
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel de Amenaza</CardTitle>
            {getThreatLevelIcon(metrics.threatLevel)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{metrics.threatLevel}</div>
            <Badge variant={getThreatLevelColor(metrics.threatLevel)} className="mt-2">
              {metrics.activeThreats} amenazas activas
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPs Bloqueadas</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.blockedIPs}</div>
            <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logins Fallidos</CardTitle>
            <Lock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.failedLogins}</div>
            <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salud del Sistema</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.systemHealth}%</div>
            <Progress value={metrics.systemHealth} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Panel de Alertas de Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Alertas de Seguridad</span>
            </div>
            <Badge variant="outline">{alerts.filter((a) => !a.resolved).length} activas</Badge>
          </CardTitle>
          <CardDescription>Amenazas detectadas y acciones de seguridad en tiempo real</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.slice(0, 5).map((alert) => (
              <Alert key={alert.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getThreatLevelColor(alert.severity)} className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.blocked ? (
                          <Badge variant="destructive" className="text-xs">
                            <Ban className="h-3 w-3 mr-1" />
                            BLOQUEADO
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            MONITOREANDO
                          </Badge>
                        )}
                        {alert.resolved && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>

                      <AlertDescription className="text-sm">
                        <div className="font-medium">{alert.description}</div>
                        <div className="text-muted-foreground mt-1">
                          IP: {alert.source} • {alert.timestamp.toLocaleString("es-ES")}
                        </div>
                      </AlertDescription>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {!alert.blocked && (
                      <Button size="sm" variant="destructive" onClick={() => blockIP(alert.source)} className="text-xs">
                        Bloquear IP
                      </Button>
                    )}
                    {!alert.resolved && (
                      <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)} className="text-xs">
                        Resolver
                      </Button>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>

          {/* Acciones Rápidas */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Shield className="h-4 w-4 mr-2" />
              Escaneo Completo
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Activity className="h-4 w-4 mr-2" />
              Ver Logs
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Zap className="h-4 w-4 mr-2" />
              Configurar Alertas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado de Servicios de Seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Firewall</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Activo
              </Badge>
              <span className="text-sm text-muted-foreground">{metrics.blockedIPs} IPs bloqueadas</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Detección de Intrusiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant="default" className="bg-green-500">
                <Eye className="h-3 w-3 mr-1" />
                Monitoreando
              </Badge>
              <span className="text-sm text-muted-foreground">
                {metrics.suspiciousActivities} actividades sospechosas
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Análisis de Vulnerabilidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                <Activity className="h-3 w-3 mr-1" />
                Último escaneo
              </Badge>
              <span className="text-sm text-muted-foreground">{metrics.lastScan.toLocaleTimeString("es-ES")}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
